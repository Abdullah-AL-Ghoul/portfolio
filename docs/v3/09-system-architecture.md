# V3 System Architecture (as-built)

Describes what exists on branch `develop` after the V3 wave. No rewrites of existing docs.

```
┌────────────────────────┐        ┌─────────────────────────────┐
│ Public site (static)   │        │ Admin dashboard (React 18)  │
│ abdullah-portfolio26   │        │ abdullah-dashboard-mauve    │
│ .vercel.app            │        │ .vercel.app                 │
│ index.html, styles.css,│        │ Vite build → admin/dist     │
│ script.js, cms.js,     │        │ supabase-js (anon key)      │
│ analytics.js, sw.js v10│        │ RLS is the authorization    │
└──────────┬─────────────┘        └──────────┬──────────────────┘
           │ fetch /api/content (anon)       │ supabase-js reads/writes
           │ POST /api/track                 │ (is_admin() policies)
           │ POST /api/contact               ▼
           │ GET  /api/cv-download   ┌─────────────────────────────┐
           │ POST /api/chat          │ Supabase (Postgres + RLS)   │
           ▼                         │ content tables (anon read)  │
┌────────────────────────┐           │ analytics tables (anon: ✗)  │
│ Vercel serverless fns  │──service──│ admin_users / audit_logs    │
│ api/*.js  (Node)       │   role    │ storage: media, cv buckets  │
│ _lib: sb(), rateLimit, │           └─────────────────────────────┘
│ coarseGeo, clampStr    │
└────────────────────────┘
```

## Public site (root, no build step)

- `index.html` (88,479 B decoded locally) — single page, 12 sections + footer; theme pre-paint inline script (index.html:4-28); Vercel insights tag **removed** this wave (audit P1-01).
- `script.js` (~182 KB) — i18n (en/ar dictionaries, 212 keys each), 5 themes, typed effect, reveal observers, V3 tracking emitters (`window.PFServiceTracking` hook), theme-switch suppression via `data-theme-switching`.
- `cms.js` (~21 KB) — fetches `/api/content`, applies projects/services/certs/recommendations/profiles/about to the DOM; graceful no-op when the API is absent (local static server 404 handled silently).
- `analytics.js` (~5 KB) — batches events, client-generated visitor/session UUIDs, POSTs to `/api/track`.
- `sw.js` — cache version bumped v6→v10 (diff); cache-first assets, network-first navigations.
- sitemap.xml, robots.txt, manifest.webmanifest at root.

## API (Vercel serverless, `api/`)

- `_lib.js` (98 lines): plain-REST Supabase client (`sb()` with role service|anon), in-memory sliding-window `rateLimit`, `coarseGeo` (Vercel geo headers only, never raw IP), `clampStr`, `json()` helper that sets `no-store` + `X-Robots-Tag: noindex` on every response.
- `content.js` — GET; parallel `Promise.all` of 11 fetches; the two new tables (services, professional_profiles) are each wrapped in `safeFetch` returning `[]` when migration 0003 hasn't run (content.js:22-28, 41-46); `s-maxage=60, stale-while-revalidate=300`; degrades to `{enabled:false}`.
- `track.js` — POST; 19-event whitelist (track.js:14-20); rate limit 120/min/IP; batches ≤20 events; upserts anonymous_visitors + visitor_sessions, inserts analytics_events; every failure returns `{ok:true}` so analytics can never break the page.
- `contact.js` (72 lines), `chat.js` (110 lines), `cv-download.js` (64 lines) — unchanged this wave; cv-download issues a 60s signed URL from the private `cv` bucket.

## Supabase

- 13 content/system tables (0001) + storage (0002) + **2 new tables (0003: services, professional_profiles)**. RLS on everything; `is_admin()` (security definer check against `admin_users`) gates writes; analytics/contact/audit closed to anon. Full model in 10-database-model.md.

## Admin dashboard (React 18 + Vite)

- Auth: Supabase email/password (persistSession, autoRefreshToken — admin/src/lib/supabase.js); session-gated routes via `RequireAuth`; every write authorized by RLS, never by the UI (supabase.js comment).
- 15 pages behind Shell (App.jsx routes): Overview, Projects, **Services (new)**, **Freelance Profiles (new)**, Assistant, Skills, Certifications, Experience, Recommendations, About, Messages, Analytics, Media, CV, Settings, AuditLog.
- Generic `CrudPage` (admin/src/components/CrudPage.jsx) driven by declarative schemas in `admin/src/lib/schemas.jsx`; new `serviceSchema`/`profileSchema` follow it. Details in 11-admin-architecture.md.

## V3 wave changes at the boundaries

1. `/api/content` response gained `services` and `professional_profiles` keys (content.js diff).
2. `/api/track` whitelist grew 14→19 events (track.js:19).
3. Public DOM gained two CMS-driven sections (hidden-until-populated, 07-IA.md).
4. Dashboard gained two CRUD pages + two analytics breakdowns + one stat tile.
5. Service worker cache bumped v6→v10 (sw.js diff).
6. Nothing was deployed in this wave; migration 0003 must be applied by hand (20-remaining-issues.md).
