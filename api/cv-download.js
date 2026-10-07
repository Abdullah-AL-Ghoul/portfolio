/*
 * Vercel serverless — GET /api/cv-download
 * Serves the currently active CV version with download counting.
 * - Reads the active cv_versions row (service role).
 * - If the file lives in Supabase Storage (private bucket), issues a
 *   short-lived signed URL and redirects to it.
 * - If Supabase is not configured (or the row points at the bundled
 *   static asset), redirects to the bundled /assets CV — the site
 *   keeps working without a backend.
 * - Never exposes storage credentials; only the signed URL leaves.
 */

const { json, readClientIp, rateLimit, sb, configured, SUPABASE_URL, SERVICE_KEY } = require('./_lib');

const FALLBACK_CV = '/assets/Abdullah_ALGhoul_CV.pdf';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { ok: false });

  const ip = readClientIp(req);
  if (!rateLimit(`cv:${ip}`, 20, 60 * 1000)) {
    return res.redirect(429, FALLBACK_CV);
  }

  if (!configured()) return res.redirect(302, FALLBACK_CV);

  try {
    const rows = await sb('cv_versions?select=*&is_active=eq.true&is_published=eq.true&order=uploaded_at.desc&limit=1', { role: 'service' });
    const cv = rows && rows[0];
    if (!cv) return res.redirect(302, FALLBACK_CV);

    // Count the download first (best-effort; never block the user).
    sb(`cv_versions?id=eq.${cv.id}`, {
      method: 'PATCH',
      body: { download_count: (cv.download_count || 0) + 1 }
    }).catch(() => {});

    if (cv.storage_path && cv.storage_path.startsWith('cv/')) {
      const signed = await fetch(
        `${SUPABASE_URL}/storage/v1/object/sign/${cv.storage_path}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${SERVICE_KEY}`,
            apikey: SERVICE_KEY,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ expiresIn: 60 })
        }
      );
      if (signed.ok) {
        const data = await signed.json();
        if (data && data.signedURL) {
          return res.redirect(302, `${SUPABASE_URL}/storage/v1${data.signedURL}`);
        }
      }
      return res.redirect(302, FALLBACK_CV);
    }

    return res.redirect(302, cv.storage_path || FALLBACK_CV);
  } catch (e) {
    return res.redirect(302, FALLBACK_CV);
  }
};
