# V3 Analytics Architecture

## Event model — 19 whitelisted types

Read from `api/track.js:14-20` (the authoritative gate; anything not in the `EVENTS` set is dropped at ingest):

```
page_view, session_start, session_end,
project_view, project_click, github_click, live_demo_click,
cv_download, contact_open, contact_submit,
social_link_click, language_change, outbound_click, theme_change,
service_view, service_cta_click, hire_me_click, freelance_profile_view, freelance_profile_click
```

The last five are V3 additions (diff +3 lines). Every event row stores: visitor_id, session_id, event_type, event_target (≤300 chars), page_path (≤300), ts, empty meta (track.js:127-137).

## V3 emitters (script.js diff, "V3 CTA + section tracking" block)

| Event | Trigger | event_target | Guarantee |
|---|---|---|---|
| `hire_me_click` | `#hire-me` direct listener | `contact` | |
| `hire_me_click` | delegated `.hero-cta a[href="#contact"]` | `hero` | hero secondary CTA is hire-style because it targets contact |
| `service_cta_click` + `hire_me_click` | delegated `[data-service-cta]` | slug / `service-cta` | service CTAs link to `#contact`, so they fire BOTH (behavioral note in the wave handoff) |
| `freelance_profile_click` | delegated `[data-profile]` | platform | |
| `freelance_profile_view` | section IntersectionObserver (threshold 0.25), disconnects after first fire | `freelance` | fires only when ≥1 `.profile-card[data-profile]` rendered at fire time; section starts `[hidden]` so empty data never logs a view |
| `service_view` | per-card IntersectionObserver (threshold 0.25), unobserve after fire | slug | once per slug per page load (in-memory `serviceViewed` Set survives rebuilds); re-observes fresh cards via the `window.PFServiceTracking.observe()` hook that cms.js calls at the end of every `applyServices` |

All emitters are guarded (`if (window.PFTrack)`) and the cms.js hook call is wrapped in try/catch — tracking must never break rendering. A profile-card click additionally produces the pre-existing automatic `outbound_click` from analytics.js:101-111 (external Upwork/etc. URL); that is untouched baseline behavior, not new.

## Privacy model

From api/track.js header comments and code, read this session:

- Visitor/session IDs are **client-generated UUIDs** (validated with `isUuid`, track.js:78-79); no IP ever stored — `coarseGeo()` uses only Vercel's `x-vercel-ip-country`/`-region` headers (api/_lib.js:32-37).
- device/browser/os parsed locally from UA (track.js:22-38); UTM sanitized to strings ≤200 chars, ≤8 keys (track.js:48-55); referrer reduced to hostname ≤100.
- Ingest requires valid UUIDs + ≤20 events; rate limit **120 POSTs/min per IP** (track.js:67); every failure path returns `{ok:true}` (track.js:83, 152-155).
- event_target values are structural only (slug, platform, 'hero', 'service-cta', 'contact', 'freelance') — no personal data.
- Analytics tables are closed to anon via RLS; the ingest function uses the service role (track.js:8-9); retention `public.analytics_retention()` deletes events older than 90 days (DEPLOYMENT.md:77).

## Client batching (analytics.js, ~144 lines, unchanged this wave)

Batches events client-side and POSTs to `/api/track` with visitor_id/session_id/page_count/exit_page; `window.PFTrack(name, target)` is the public emit function consumed by script.js and cms.js. Pre-existing emitters (page_view, language_change, theme_change, contact, outbound) untouched by V3.

## Dashboard views (admin/src/pages/Analytics.jsx)

- Time series: views + unique visitors (recharts area charts).
- Top pages, top projects (project_view by target), and the two V3 breakdowns (service CTA clicks by slug; freelance profile clicks by platform) — all empty-state-guarded.
- Conversion counters incl. the new hire_me_click; device/browser/country pies; visitors/sessions/returning-rate stat tiles + the new "Hire-me clicks" tile.
- Data only appears once the events fire in production; with migration 0003 unapplied and nothing deployed, the new charts show their empty states (expected, by design).
