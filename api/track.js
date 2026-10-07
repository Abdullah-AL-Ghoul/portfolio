/*
 * Vercel serverless — POST /api/track
 * Privacy-preserving analytics ingest.
 * - Anonymous visitor & session IDs are client-generated UUIDs.
 * - NO raw IP is ever stored. Coarse country/region from Vercel geo headers.
 * - device/browser/os parsed from UA locally, never sent to third parties.
 * - Whitelisted event types only; everything validated + rate limited.
 * - Uses the service role key (analytics tables are closed to anon via RLS).
 * - Analytics must never break the site: every failure returns ok.
 */

const { json, readClientIp, coarseGeo, rateLimit, sb, isUuid, clampStr, configured } = require('./_lib');

const EVENTS = new Set([
  'page_view', 'session_start', 'session_end',
  'project_view', 'project_click', 'github_click', 'live_demo_click',
  'cv_download', 'contact_open', 'contact_submit',
  'social_link_click', 'language_change', 'outbound_click', 'theme_change'
]);

function parseUA(ua) {
  const s = String(ua || '');
  const os = /Windows/i.test(s) ? 'Windows'
    : /Android/i.test(s) ? 'Android'
    : /iPhone|iPad|iPod/i.test(s) ? 'iOS'
    : /Mac OS X/i.test(s) ? 'macOS'
    : /Linux/i.test(s) ? 'Linux' : '';
  const browser = /Edg\//i.test(s) ? 'Edge'
    : /OPR\//i.test(s) ? 'Opera'
    : /Chrome\//i.test(s) ? 'Chrome'
    : /Safari\//i.test(s) && /Version\//i.test(s) ? 'Safari'
    : /Firefox\//i.test(s) ? 'Firefox' : '';
  const tablet = /iPad|Tablet/i.test(s);
  const mobile = /Mobi|Android|iPhone/i.test(s);
  const device = tablet ? 'tablet' : mobile ? 'mobile' : 'desktop';
  return { os, browser, device };
}

function referrerDomain(raw) {
  if (!raw || typeof raw !== 'string') return '';
  try {
    const u = new URL(raw);
    return u.hostname.slice(0, 100);
  } catch { return ''; }
}

function sanitizeUtm(v) {
  if (!v || typeof v !== 'object') return {};
  const out = {};
  for (const k of Object.keys(v).slice(0, 8)) {
    if (typeof v[k] === 'string') out[k.slice(0, 40)] = clampStr(v[k], 200);
  }
  return out;
}

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return json(res, 405, { ok: false });

  const ip = readClientIp(req);
  if (!rateLimit(`track:${ip}`, 120, 60 * 1000)) {
    return json(res, 429, { ok: false });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return json(res, 400, { ok: false });
  }

  const visitorId = isUuid(body.visitor_id) ? body.visitor_id : null;
  const sessionId = isUuid(body.session_id) ? body.session_id : null;
  const events = Array.isArray(body.events) ? body.events.slice(0, 20) : [];
  if (!visitorId || !sessionId || !events.length) return json(res, 422, { ok: false });

  if (!configured()) return json(res, 200, { ok: true, enabled: false });

  const ua = parseUA(req.headers['user-agent']);
  const geo = coarseGeo(req);
  const now = new Date().toISOString();

  try {
    // 1) Upsert anonymous visitor profile.
    await sb('anonymous_visitors', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates',
      body: {
        id: visitorId,
        device: ua.device, browser: ua.browser, os: ua.os,
        country: geo.country, region: geo.region,
        referrer_domain: referrerDomain(body.referrer),
        last_seen: new Date().toISOString()
      }
    });

    if (body.is_new_visitor === true) {
      await sb(`anonymous_visitors?id=eq.${visitorId}`, {
        method: 'PATCH',
        body: { session_count: Number(body.session_count) || 1 }
      }).catch(() => {});
    }

    // 2) Upsert session.
    await sb('visitor_sessions', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates',
      body: {
        id: sessionId,
        visitor_id: visitorId,
        last_seen: new Date().toISOString(),
        entry_page: clampStr(body.entry_page, 300),
        referrer: referrerDomain(body.referrer),
        utm: sanitizeUtm(body.utm),
        device: ua.device, browser: ua.browser, os: ua.os,
        country: geo.country, region: geo.region
      }
    });

    // 3) Insert validated events.
    const rows = events
      .filter((e) => e && EVENTS.has(e.type))
      .map((e) => ({
        visitor_id: visitorId,
        session_id: sessionId,
        event_type: e.type,
        event_target: clampStr(e.target, 300),
        page_path: clampStr(e.page_path, 300),
        ts: new Date().toISOString(),
        meta: {}
      }));
    if (rows.length) {
      await sb('analytics_events', { method: 'POST', body: rows, prefer: 'return=minimal' });
    }

    // 4) Refresh session counters.
    await sb(`visitor_sessions?id=eq.${sessionId}`, {
      method: 'PATCH',
      body: {
        last_seen: new Date().toISOString(),
        page_count: Math.min(999, Number(body.page_count) || 1),
        exit_page: clampStr(body.exit_page, 300)
      }
    }).catch(() => {});

    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, 200, { ok: true, stored: false });
  }
};

module.exports._internal = { parseUA, referrerDomain, sanitizeUtm };
