/*
 * Vercel serverless — POST /api/contact
 * Receives a contact submission, validates it server-side,
 * applies rate limiting + honeypot, stores it in Supabase.
 * No raw IP is stored. Coarse country only (Vercel geo header).
 * If Supabase is not configured the endpoint degrades gracefully
 * and the frontend falls back to mailto.
 */

const { json, readClientIp, coarseGeo, rateLimit, sb, isUuid, clampStr } = require('./_lib');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

module.exports = async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Max-Age', '86400');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return json(res, 405, { ok: false, error: 'method' });

  const ip = readClientIp(req);
  if (!rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000)) {
    return json(res, 429, { ok: false, error: 'rate_limited' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return json(res, 400, { ok: false, error: 'bad_request' });
  }

  // Honeypot: silently accept bots so they do not retry, but store nothing.
  if (clampStr(body.company, 200)) return json(res, 200, { ok: true });

  const name = clampStr(body.name, 100);
  const email = clampStr(body.email, 254);
  const subject = clampStr(body.subject, 150);
  const message = clampStr(body.message, 5000);
  const visitorId = isUuid(body.visitor_id) ? body.visitor_id : null;

  const errors = {};
  if (name.length < 2) errors.name = true;
  if (!EMAIL_RE.test(email)) errors.email = true;
  if (subject.length < 3) errors.subject = true;
  if (message.length < 10) errors.message = true;
  if (Object.keys(errors).length) {
    return json(res, 422, { ok: false, error: 'validation', errors });
  }

  if (!require('./_lib').configured()) {
    return json(res, 200, { ok: false, fallback: 'mailto' });
  }

  try {
    const geo = coarseGeo(req);
    await sb('contact_messages', {
      method: 'POST',
      body: {
        name, email, subject, message,
        visitor_id: visitorId,
        source_country: geo.country,
        status: 'new'
      }
    });
    return json(res, 200, { ok: true });
  } catch (e) {
    return json(res, 200, { ok: false, fallback: 'mailto' });
  }
};
