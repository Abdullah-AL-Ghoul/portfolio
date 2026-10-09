# V3 Information Architecture — Public Site

## Final section order (index.html, top to bottom)

| # | id | Content source | Visibility rule |
|---|---|---|---|
| 1 | `home` | static + i18n | always |
| 2 | `stats` | static strip (11+/3+/7/2) | always |
| 3 | **`services`** (NEW) | `/api/content` → `data.services` → cms.js `applyServices` | **hidden until populated** (`<section id="services" hidden>`, index.html diff; cms.js sets `section.hidden = rows.length === 0`) |
| 4 | `about` | static + CMS about_profile override | always |
| 5 | `skills` | static | always |
| 6 | `projects` | static cards p1–p7 + Supabase projects via cms.js | always |
| 7 | `certs` | static + CMS certifications (title string match) | always |
| 8 | `experience` | static | always |
| 9 | `feedback` | static + CMS recommendations (DOM position index) | always |
| 10 | **`freelance`** (NEW) | `/api/content` → `data.professional_profiles` → cms.js `applyProfiles` | **hidden until populated** (`<section id="freelance" hidden>`; `section.hidden = usable.length === 0`, with a `profile_url` guard client-side too) |
| 11 | `contact` | static form (mailto fallback) | always |
| 12 | `ai-panel` | api/chat.js | always |
| — | footer | static | always |

Placement rationale: Services sits directly after the stats strip — the visitor sees *what I build* before *who I am*; Freelance sits after Recommendations (trust) and immediately before Contact (conversion), so the path is: work → proof → hire options → contact.

## The hidden-until-populated rule (freelance, and services)

- Both sections ship with the `hidden` attribute in static markup (index.html diff), so a visitor never sees an empty "hire me" grid — and if migration 0003 is not applied (or a service is unpublished), the page is exactly the pre-V3 page plus nothing.
- cms.js unhides a section only when it has ≥1 renderable row, and re-hides it when a re-apply brings an empty array (tests/e2e-services-profiles.mjs checks: "services section starts hidden", "freelance section hidden when empty", "no leftover service cards").
- `freelance_profile_view` analytics fire only when the section intersects **and** at least one `.profile-card[data-profile]` rendered (script.js diff, section observer with a query-at-fire-time check) — so view counts can never be logged for an empty section.
- Profile rows with empty `profile_url` are excluded server-side (content.js WHERE `profile_url=neq.`) and guarded again client-side (cms.js `usable` filter). The DB RLS policy uses the same predicate (0003:70), so the three layers agree.

## Navigation

The primary nav keeps its six pre-existing anchors: About, Skills, Projects, Certifications, Experience, Contact (index.html:242-248). Services and Freelance are **deliberately not nav items**: they are CMS-populated and may legitimately be empty, and a nav link to a hidden section would dead-end. They are discovered by scroll (services immediately after hero), plus the service CTAs and Hire-me button funnel to Contact.

## CMS render/rebuild loop

`cms.js apply()` (bottom of the diff: `applyServices` added after `applyProjects`, `applyProfiles` after `applyRecommendations`) runs on boot, on `/api/content` refresh, and on `pf:langchange`; both new appliers do an **idempotent rebuild** (`grid.textContent = ''` then re-create cards) so removals, unpublish and language switches leave no duplicates — verified by the e2e suite ("no duplicate service cards", "no leftover profile cards"). After every services render cms.js calls the guarded hook `window.PFServiceTracking.observe()` so freshly rendered cards get view-tracking (cms.js diff, end of applyServices).

## Selector contracts preserved / extended

- Preserved (per audit P1-03/04 and 08 §3.2): `.project-card[data-project]` + internals untouched; e2e-pinned ids (`#contact-form`, `#form-status`, `#company`, `#theme-toggle`, `#lang-toggle`, `#case-modal`, `#nav-toggle`) all still pass — e2e-public.mjs 10/10 this session.
- New contracts: `#services`/`#services-grid`, `.service-card[data-service="slug"]`, `.service-cta[data-service-cta]`, `#freelance`/`#profiles-grid`, `.profile-card[data-profile="platform"]`, and the hook name `window.PFServiceTracking` (cms.js:249 area) — all pinned by tests/e2e-services-profiles.mjs (36 checks).
