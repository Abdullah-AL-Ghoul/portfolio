# V3 Maintenance Guide

Day-to-day operations for the systems as they exist after the V3 wave.

## Running the tests

```bash
# 1. Start the local static server (terminal 1)
node tests/serve.mjs 8931

# 2. Run the suites (BASE_URL optional, defaults to localhost:8931)
BASE_URL=http://localhost:8931 node tests/e2e-public.mjs            # pinned public contract (10 checks)
BASE_URL=http://localhost:8931 node tests/e2e-dynamic-cards.mjs     # CMS project cards (17)
BASE_URL=http://localhost:8931 node tests/e2e-services-profiles.mjs # services + profiles sections (36)

# Admin build gate
npm --prefix admin run build
```

All suites print `RESULTS: n checks — x passed, y failed` and exit non-zero on any failure. Playwright 1.63 is installed at the repo root. Quick grep gates after CSS changes: `grep -c "transition: all" styles.css script.js` (expect 0) and confirm no `blur(>20px)` in styles.css. After any CSS/JS change, the sw.js `CACHE` version must be bumped or returning visitors see stale assets.

## Adding a service (dashboard)

1. Sign in → **Services** (sidebar, Manage group) → new row.
2. Fill slug (unique key, used as analytics event_target), title_en/title_ar, summary_en/ar, features (JSON array of `{en, ar}` objects), technologies (tags), icon (lucide name), cta_label_en/ar (leave empty to use the built-in i18n label), sort_order, then set status **published**.
3. `related_project_keys` takes project **legacy_keys** ('p1'..'p7') — a related-project link renders only if that key matches a project card actually on the page (cms.js checks the live DOM).
4. The public site picks it up within 60s (edge cache s-maxage=60, stale-while-revalidate=300) or immediately on the next `/api/content` fetch.

## Adding a freelance profile

Dashboard → **Freelance Profiles** → platform (upwork/khamsat/mostaql/freelancer/contra/linkedin/custom), display name, profile_url (required — empty-URL rows never go public, enforced at RLS, API, and cms.js), bilingual title/description, is_active ✓. The `#freelance` section un-hides automatically on the next content fetch. Protocol: never add a profile that isn't real and live.

## Keeping the systems healthy

- **Analytics retention:** schedule `select public.analytics_retention();` via pg_cron (deletes events >90 days) — DEPLOYMENT.md.
- **Content API health:** `/api/content` must return `enabled:true` with all keys; if Supabase is down it returns `{enabled:false}` and the site falls back to static content silently.
- **Analytics hygiene:** tracking must never break the page — emitters are guarded (`if (window.PFTrack)`), the cms.js→script.js hook call is try/caught. If a future change re-renders service cards **outside** cms.js `applyServices`, call `window.PFServiceTracking.observe()` after render or views won't be tracked. If you rename `window.PFServiceTracking`, `[data-service-cta]`, or `[data-profile]`, update tests/e2e-services-profiles.mjs (it's the tripwire).
- **CMS selector contracts:** don't rename `.project-card[data-project]` internals, cert `data-cert-title` strings, or recommendation card order — cms.js binds by exact selectors/string/DOM-position (audit P1-03). If you must, update cms.js and the e2e tests in the same change.
- **Bilingual rule:** every new user-facing string goes into BOTH en and ar dictionaries in script.js (and the HTML `data-i18n` key); check with the node sync snippet in 14-implementation-report.md.
- **i18n check one-liner:** grep `data-i18n="` in index.html vs the two dictionaries in script.js — all 185 keys must exist in both (212 keys each today).
- **Migration 0003 state check:** `select count(*) from services;` should return 3 after applying; `professional_profiles` 0 until you add real profiles.
- **Supabase cron:** keep `analytics_retention()` scheduled (90-day retention, DEPLOYMENT.md).
- **Themes/RTL after any styling change:** run the stage-3b regression verifier (`.zcode/tmp-v3/stage3b-verify.mjs` with BASE_URL set) — it checks overflow at 3 widths × 2 languages, 5 themes, 44px targets, hover gating, and reduced motion. Note its `service_view` check is stale (15-test-report.md).
- **Rollback:** `sw.js` cache version + deploy of the previous commit is the only rollback needed; migration 0003 is additive (dropping it is optional; the API tolerates both states).
