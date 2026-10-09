# V3 Security Model (as of the V3 wave)

## Authentication

- **Admin dashboard:** Supabase email/password auth (`signInWithPassword`, admin/src/lib/api.js:8); session persisted + auto-refreshed (admin/src/lib/supabase.js); routes behind `RequireAuth`. The publishable (anon) key ships in the dashboard bundle; **all writes are authorized by RLS, never by the UI** (supabase.js header comment).
- **Admin identity:** `public.is_admin()` (0001_schema.sql:19, security check against `admin_users` keyed by auth.users id). No admin row → no read of non-public data, no writes.
- **Public site:** no auth; anonymous visitors only.
- **Serverless functions:** hold `SUPABASE_SECRET_KEY` as Vercel env vars (api/_lib.js:8-10) — never in any bundle; the anon/publishable key is used for `/api/content` reads where RLS is the guarantee (content.js header comment).

## Row Level Security

All 15 tables enable RLS (0001). Model:

| Class | anon | authenticated (is_admin) |
|---|---|---|
| Content tables (projects, skills, skill_categories, certifications, experiences, recommendations, social_links, about_profile, site_settings) | `public_read` — published/non-deleted only (0001:371-376 template) | admin_read + admin_write (`for all … with check`) |
| **services** (0003:62-67) | `services_public_read`: status='published' and deleted_at is null | admin_read + admin_write |
| **professional_profiles** (0003:69-74) | `professional_profiles_public_read`: is_active and deleted_at is null and profile_url <> '' | admin_read + admin_write |
| contact_messages | none | admin_all (0001:390) |
| analytics (anonymous_visitors, visitor_sessions, analytics_events) | none | admin_read only (0001:392-397) |
| audit_logs | none | admin_read only (0001:388) |
| media_assets / cv_versions | cv_public_read limited; media admin-only (0001:382-399) | admin_all |

The 0003 anon-read WHERE shapes match the `/api/content` query WHEREs exactly (content.js:42,45), so the API never relies on filtering it can't prove.

## Input validation & abuse limits

- **`/api/track`**: method gate; 120 req/min/IP sliding window (`rateLimit`, api/_lib.js:44-62; in-memory per-instance, documented as adequate for a single-owner portfolio at _lib.js:40-42); body JSON-parsed defensively; UUID-checked visitor/session ids; events capped at 20; strings clamped (target/path ≤300, UTM ≤200×8, referrer hostname ≤100); unknown event types silently dropped (track.js:128).
- **`/api/contact`** (72 lines, unchanged): rate-limited + validated per V2 design; degrades gracefully when Supabase unconfigured.
- **`/api/cv-download`** (64 lines, unchanged): private `cv` bucket, 60s signed URL, download counting.
- **`/api/chat`** (110 lines, unchanged): LLM proxy; key server-side only.
- Every response from `json()` carries `Cache-Control: no-store` + `X-Robots-Tag: noindex` (api/_lib.js:17-22); `/api/content` is the one cached endpoint (s-maxage=60, SWR=300, content.js:15).
- Admin dashboard deploys with `X-Robots-Tag: noindex` + `robots.txt: Disallow: /` + meta robots noindex (DEPLOYMENT.md:59).

## Audit logs

`audit_logs` (0001:301+) records actor_id/actor_email/action/entity/entity_id/summary; the dashboard writes them via the `audit()` helper (admin/src/lib/api.js:19-29), which is fire-and-forget (audit must never block the action). Readable only by admin (0001:388). V3's CRUD pages inherit this through CrudPage — the schema additions add no new audit path, they reuse it.

## Client-side hardening on the public site

- Profile cards are `target="_blank" rel="noopener"` (cms.js buildProfileCard) — no tab-nabbing.
- All CMS-rendered content is inserted via `textContent`/`createElement` (never innerHTML) in the V3 appliers — no XSS injection path from dashboard rows.
- Honeypot (`#company`) remains off-screen absolute + opacity:0 (verified by e2e T7 and stage3b: x=-9275/-10077).
- Service worker caches only same-origin shell/asset routes (sw.js unchanged in behavior; version bumped v6→v10 to invalidate stale caches).

## Honest limits (as documented in code)

- Rate limiter is per-serverless-instance, not persistent (_lib.js:40-43) — sufficient for this site's traffic profile; a persistent limiter (Upstash etc.) is the upgrade path without changing callers.
- `/api/content` exposes only published/non-deleted rows through the anon policy; the service key never touches that route.
- Nothing was deployed in this wave; the security posture above describes the code on `develop`, not any live endpoint state change.
