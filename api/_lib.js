/*
 * Shared serverless helpers (api/_lib).
 * Plain-REST Supabase access — no SDK dependency on the edge.
 * Every function degrades gracefully when Supabase is not configured:
 * the public site keeps working with its static content.
 */

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SERVICE_KEY = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const ANON_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';

const configured = () => Boolean(SUPABASE_URL && (SERVICE_KEY || ANON_KEY));

/**
 * Minimal JSON response helper with security headers.
 */
function json(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  return res.status(status).json(body);
}

function readClientIp(req) {
  const xf = req.headers['x-forwarded-for'] || '';
  return String(Array.isArray(xf) ? xf[0] : xf).split(',')[0].trim();
}

/**
 * Coarse geography from Vercel geo headers only — never the raw IP.
 */
function coarseGeo(req) {
  return {
    country: String(req.headers['x-vercel-ip-country'] || '').slice(0, 2),
    region: String(req.headers['x-vercel-ip-country-region'] || '').slice(0, 8)
  };
}

/**
 * In-memory sliding-window rate limiter.
 * NOTE: per-serverless-instance only; adequate for a single-owner portfolio.
 * A persistent limiter (Upstash etc.) can replace it without changing callers.
 */
const buckets = new Map();

function rateLimit(key, limit, windowMs) {
  const now = Date.now();
  const entry = buckets.get(key) || { hits: [] };
  entry.hits = entry.hits.filter((t) => now - t < windowMs);
  if (entry.hits.length >= limit) {
    buckets.set(key, entry);
    return false;
  }
  entry.hits.push(now);
  buckets.set(key, entry);
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (!v.hits.length || now - v.hits[v.hits.length - 1] > windowMs) buckets.delete(k);
    }
  }
  return true;
}

/**
 * Supabase REST call as the given role.
 * role: 'service' (bypasses RLS) or 'anon' (RLS applies).
 */
async function sb(path, { method = 'GET', body, role = 'service', prefer = '' } = {}) {
  const key = role === 'service' ? SERVICE_KEY : ANON_KEY;
  if (!SUPABASE_URL || !key) throw new Error('supabase-not-configured');

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json'
  };
  if (prefer) headers.Prefer = prefer;

  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`supabase-${res.status}: ${text.slice(0, 200)}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (res.status === 204 || !contentType.includes('application/json')) return null;
  return res.json();
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isUuid = (v) => typeof v === 'string' && UUID_RE.test(v);

const clampStr = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

module.exports = { SUPABASE_URL, SERVICE_KEY, ANON_KEY, configured, json, readClientIp, coarseGeo, rateLimit, sb, isUuid, clampStr };
