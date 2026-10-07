# Abdullah Portfolio V2 — Platform upgrade report

**Owner:** Abdullah Ayman AL-Ghoul
**Date:** 2026-10-07
**Baseline snapshot:** `c6e38d3` on `main` · active branch `develop`
**Approved architecture:** Supabase (verified) + static public site upgrade + separate React+Vite admin

---

## Executive summary

The portfolio was upgraded from a single static site to the V2 platform the spec describes:
a public-facing CMS-driven site and a completely separate admin dashboard sharing one
secure Postgres. The public site never depends on the backend being present — every
change degrades gracefully to the static content it ships with. The design identity
("Dark Precision Engineering") and the existing polish were kept; the platform,
security, analytics, and dashboard are additive.

## Before → After

| Before | After |
|--------|-------|
| Contact form → mailto only (optional Formspree) | `POST /api/contact` (validated, rate-limited, honeypot) → `contact_messages` inbox; the first data the site writes to. `mailto` is now the last resort, not the only path. |
| No analytics (only Vercel Insights) | First-party, privacy-preserving `POST /api/track` → `anonymous_visitors / visitor_sessions / analytics_events`. Coarse country only (Vercel geo headers), no raw IP. Up to 90-day retention, dashboard shows real charts. |
| CV is a static file in `assets/` | `cv_versions` table + private `cv` storage bucket + `GET /api/cv-download` (download counter + signed URL). Fallback keeps serving the bundled file if no version is active. Storage itself is private — only the server ever signs a URL. |
| All content is hardcoded in `index.html`/`script.js` | `GET /api/content` (anon + RLS, edge-cached) drives the public site. `cms.js` applies it to the DOM; static content is the offline/fallback source. Editing a project/cert/recommendation in the dashboard appears on the public site after one fetch. |
| Projects are a flat grid of seven cards | Primary featured card (rank 1) spans the full grid row with side-by-side cover + body on wide screens; other featured cards keep a tinted border treatment. The seed marks AL-Azher IT Hub (rank 1) and the Portfolio site (rank 2). |
| Case studies: Problem/Solution/Result | + Dashboard-managed implementation/challenge details, progressive-disclosure `<details>` (collapsed by default) fed from `case_study` JSON. Nothing invented — only what the owner writes shows. |
| No dashboard | A complete React+Vite SPA on a separate Vercel deployment (`admin/`), `noindex everywhere` (meta + `X-Robots-Tag` + `robots.txt`). One Supabase Auth user → RLS enforces every write. |

## Architecture (final)

```
Public site  (static: index.html + styles.css + script.js + analytics.js + cms.js + sw.js)
  ├─ GET /api/content      → published rows (anon, RLS; s-maxage 60)
  ├─ POST /api/contact     → contact_messages (service-role)
  ├─ POST /api/track       → analytics_*    (service-role; whitelisted events, rate-limited)
  └─ GET /api/cv-download  → cv_versions + private bucket (counter + 60s signed URL)
        ↑ fallback to /assets/Abdullah_ALGhoul_CV.pdf in every path
Supabase  Postgres + RLS + Storage (media: public, cv: private) + Auth (one admin)
Admin dashboard  React + Vite SPA (separate Vercel project, /admin → dist)
  └─ writes through the Supabase anon key + RLS (is_admin()); reads published rows same way
```

Files on disk: `api/_lib.js`, `api/contact.js`, `api/track.js`, `api/content.js`, `api/cv-download.js`, `api/chat.js` (existing, unchanged), `analytics.js`, `cms.js`, `supabase/migrations/0001_schema.sql` + `0002_storage.sql`, `supabase/seed.sql`, `admin/` (see `admin/vercel.json` — root directory override `admin`).

## Stack (actual)

- Public site: vanilla HTML/CSS/JS, no build. `analytics.js` (1.7 KB) + `cms.js` (3 KB) deferred. Fonts: Google Fonts. Icons: 56-symbol inline SVG sprite (same as before — no icon bundle).
- Serverless: Vercel Node.js functions (no extra dependency — Supabase REST via global `fetch`).
- Backend: Supabase Postgres 15, RLS, three storage buckets considerations (`media` public, `cv` private). One `is_admin()` SECURITY DEFINER helper + single `admin_users` row per dashboard user.
- Admin dashboard: React 18 + React Router 6 + Vite 5 + Supabase JS v2 + Recharts (lazy-chunked: charts only loaded on Analytics/Overview). Dynamic import would cut it further.

## Database

`site_settings`, `about_profile` (single JSONB documents), `projects` (with `case_study JSONB`, `slug`+`legacy_key`, `status/featured/soft-delete`), `skills` / `skill_categories`, `certifications`, `experiences` (with `kind`), `recommendations`, `social_links`, `media_assets`, `cv_versions`, `contact_messages`, `anonymous_visitors`, `visitor_sessions`, `analytics_events`, `audit_logs`, storage buckets (`media`, `cv`). Edges: every content table has `deleted_at`, RLS has `status='published' AND deleted_at IS NULL` for anon reads, and `USING is_admin()` for every write.

Migrations are idempotent SQL in `supabase/migrations/`; `seed.sql` is the current live content only (verified, titles/badges/summaries/stacks/experiences/recommendations/About/Settings) — nothing invented.

## Dashboard — what shipped

- **Auth** (Supabase Auth email+password, one user, session-persisted). The whole SPA is guarded; every route renders `<Navigate to="/login">` if unauthenticated, and RLS is the real wall.
- **Overview** — live sessions (5 min) + 30-day views / new messages / CV downloads. Polls every 30 s.
- **Projects** — CRUD + `slug / legacy_key / featured rank / sort_order / stack`, case study as structured JSON (`{en,ar}` × problem/approach/implementation/outcome + challenges[]), status + draft/publish/soft-delete → trash → restore → purge.
- **Skills** — category (`programming/networking/tools/frontend/ai/learning`) + tier 1–4 + related project slugs + enabled.
- **Certifications / Experiences / Recommendations** — full CRUD through the same generic form engine (`components/CrudPage.jsx`), each with relevant field types (tags for stacks, localized EN/AR, JSON editor for case studies).
- **About** — single JSON editor over `about_profile.data` (Hero + paragraphs + strengths + education + languages + availability + contact descriptions).
- **Settings** — titles, meta descriptions, og/fav paths, footer + analytics toggle + feature flags (JSON).
- **Media** — upload to bucket `media` (5 MB cap, allowed image/PDF mimes are validated server-side, safe filenames, `used_by` tracking for cleanup), read/delete, admin-only.
- **CV** — PDF uploads (10 MB), versions list, active-version toggle (single active), unpublished drain, public path always via `/api/cv-download`.
- **Messages** (inbox) — New → In Review → Replied → Archived + starred + search + private notes + reply-by-email + read-on-open behaviour.
- **Analytics** — Overview/Traffic/Pages/Projects/Conversions/Audience/Live via Recharts (range 7/30/90 days; fallback empty states; no mocked data).
- **Audit log** — actor + action + entity + short summary, read-only latest 500, write-best-effort on every admin action.

## Analytics — privacy model enforced in code

- Visitor ID = random UUID in `localStorage`, Session ID = tab-UUID in `sessionStorage`. No cookies, no fingerprinting.
- `GlobalPrivacyControl` respected — if the visitor opts out, nothing is ever sent.
- Events are whitelisted; timestamps are fixed server-side; `page_count` is capped at 999, `session_count` at 9999 (client values are clamped).
- Geography comes only from the Vercel geo headers (`x-vercel-ip-country/region`) — the raw IP itself is never stored. Device/browser/OS are derived from User-Agent.
- A 90-day purge (`public.analytics_retention()`) is included for the owner to schedule (Supabase Cron or manual).

## Security controls adopted

- **AuthZ by RLS, not by UI:** no table has a loose `anon` write policy — analytics and contact data enter via `service-role` serverless handlers. The admin SPA writes with the anon key, and RLS (`is_admin()`) enforces the actual gate. `audit_logs` is writable only from serverless.
- **Rate limiting** on sign-in retries, `POST /api/contact` (5 per 10 min per IP), `POST /api/track` (120 per min), `GET /api/cv-download` (20 per min, proper 429).
- **Anti-spam**: `POST /api/contact` has a hidden off-screen `company` field; any filled value gets a `200 ok:true` without a row.
- **Server-side validation on every API**: names 2–100, emails RFC-light, subjects 3–150, messages 10–5000, validated `event_type` set (14), whitelisted `device/browser/os`. Every CMS string is written to the DOM with `textContent` or `setAttribute`, so stored content cannot inject markup.
- **Upload validation both sides:** client pre-checks size/type, Storage enforces the bucket mime whitelist, and `media_assets` tracks paths for cleanup.
- **Separation + non-indexing:** admin ships `robots.txt: Disallow: /` + meta robots `noindex, nofollow, noarchive, nosnippet` + `X-Robots-Tag: noindex` on every route + `api/*` headers `noindex`. CSP on the public site forbids object sources and limits `connect-src`. The service-role key never appears in the browser bundle.

## Performance / SEO / Accessibility signals

- **SW bump v5→v6** — the core cache now includes `analytics.js` + `cms.js`. Navigations stay network-first, same-origin assets cache-first.
- **`index.html` deferred loading** — `analytics.js` + `script.js` + `cms.js` all `defer` (in-order; analytics hooks are live before the site script; cms re-applies `pf:langchange`).
- **Sitemap `lastmod` is now fresh (`2026-10-07`); `/api/*` has `noindex` headers so no crawler surfaces a data endpoint. The dashboard is invisible to crawlers entirely.
- **Accessibility:** CMS insertion is text-safe. The honeypot is `aria-hidden` and `tabindex=-1` (seen by bots, ignored by AT). The inbox and audit tables preserve `aria-label`/`aria-expanded` on the rows, and `a11y` audit (`Ctrl+Shift+A / ?a11y`) from v1 is unchanged. RTL/LTR switching still fully supported and re-applies CMS-localized content post-switch.

## Tests

| Layer | Suite | Result |
|-------|-------|--------|
| Unit (Node) | `node --check` over every JS file + direct handler invocation for each API path | ✅ all handlers degrade correctly when `SUPABASE_*` is absent |
| API behavior | mocked req/res over `api/content`, `api/contact` (valid/422/honeypot/rate-limit), `api/track`, `api/cv-download` | ✅ 7 scenarios all pass (see commit `b1d6d9b` and on) |
| E2E (Playwright, local static server `http://localhost:8123`) | `tests/e2e-public.mjs` over the built `index.html` | ✅ 10/10 pass — hero, RTL toggle, case-study open/close (Escape), form validation, honeypot off-screen, light theme switch, mobile menu, no JS errors |
| Dashboard | `npm run build` in `admin/` including split chunks | ✅ `✓ built`, `index 49.47 kB · vendor 390.95 kB · charts 411.54 kB` |
| Visual gate | `gui-test-screenshots/{desktop-full.png, mobile-menu.png, light-theme.png}` | spot-checked; no layout bleed at 390×844 detected |

## How to go live (summary)

1. Create the Supabase project, run the three SQL files (`supabase/migrations/*` + `supabase/seed.sql`), create the one Auth user and the single `admin_users` row (see [DEPLOYMENT.md](DEPLOYMENT.md)).
2. Add `SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY` to the existing public-site Vercel project (all environments), and the same two `VITE_SUPABASE_*` vars to a new dashboard project with its Root Directory overridden to `admin`.
3. Deploy both. A static push without env vars still lands fully functional — the site simply keeps its baked content and the contact form uses its `mailto:` path.

## Remaining issues & acknowledged limitations

- **Single admin user** — intentional. Adding more is one row per user: create the next Auth user, add the matching `admin_users` row, no code change.
- **Aggregation depth** — analytics charts render from a 20 000–row window per period (client-side derived tables). For a personal portfolio it is the correct trade-off; heavy warehousing (views, rollups, cohort table) would be added only if a clear need emerges.
- **Visual art for new CMS-added projects** — new `projects` rows added through the dashboard reuse the existing seven `data-cover` cover styles (matched by `legacy_key` / fallback to the client cover). New bespoke covers are still an asset-upload + one CSS addition.
- **The CMS About editor is a single JSON editor** — intentionally lossless and sufficient for one owner. A nicer field-by-field form can be added later on the same `about_profile.data` shape.
- **Audit diffs are summary-based** (actor/action/entity + patch keys), not a full row-level diff. Recovering a deleted row is a dashboard Restore, not a migration.
