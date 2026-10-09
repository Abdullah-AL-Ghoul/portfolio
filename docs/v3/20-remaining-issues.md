# V3 Remaining Issues

Everything still open after the V3 wave, including pending user actions. Ordered by blocking impact.

## Pending user actions

1. **Run migration 0003 in the Supabase SQL Editor** (blocking the entire new feature surface). `supabase/migrations/0003_services_profiles.sql` cannot be executed from the workflow (DDL). Until run: `/api/content` returns `services: []` and `professional_profiles: []` (safeFetch guards, api/content.js:41-46), both public sections stay hidden, dashboard Services/Profiles pages show empty/error state, and the three seeded services don't exist. Policy names to expect: `services_public_read/admin_read/admin_write`, `professional_profiles_public_read/admin_read/admin_write`.
2. **Deploy both projects** (public + admin) — nothing was deployed in this wave; the live site still serves the pre-V3 build. After deploy: re-measure live performance (16-performance-report.md), and verify the new analytics events start appearing.
3. **Provide real freelance profile URLs** (Upwork / Khamsat / Mostaql) and add them via the dashboard (→ /profiles). Zero rows are seeded by protocol; the freelance section stays hidden until the user adds verified profiles.

## Audit P1/P2 findings not yet addressed (from docs/v3/01-recon-audit.md:81-103)

| Audit # | Finding | Disposition after V3 |
|---|---|---|
| P1-01 | `/_vercel/insights` 404 every load | **Fixed** — tag removed (index.html) |
| P1-02 | Projects content triple-sourced (index.html / PROJECT_CASES / Supabase) | **Still open** — preserved, not reconciled (item 11 below) |
| P1-03 | cms.js structurally coupled to today's DOM (exact selectors, cert-title match, DOM-position testimonials) | **Consciously preserved** — the wave kept every pinned selector/behavior; coupling risk remains for future redesigns |
| P1-04 | e2e gate pins a selector contract | **Preserved** — all pinned IDs/classes/behaviors kept; suites pass unchanged |
| P1-05 | Skills / experience / stats sections have no CMS binding; stats strip numbers hardcoded | **Still open** — dashboard edits can never reach these sections |
| P2-06 | Slow perceived load (~5s DCL, FCP 5.6s, network-dominated, single-run LIVE baseline) | **Deferred** — re-measure post-deploy before adopting budgets (16-performance-report.md) |
| P2-07 | styles.css 4,792-line monolith with scattered theme roots | **Still open, worse** — the wave grew it to ~5,3xx lines; sunset/light overrides still scattered |
| P2-08 | SW cache must be bumped for redesign | **Fixed during wave** — cache bumped each stage, ending at v10 |
| P2-09 | Reveal-on-scroll leaves un-scrolled captures blank (also affects print/PDF) | **Still open** — unchanged; stage-3b probing hit it too (cards at scale(0.97) until revealed) |
| P2-10 | i18n duplicates every string in HTML + script.js dictionaries | **Inherent, kept** — no drift introduced (every new string exists in both en and ar dictionaries) |

## Unresolved design contradictions

4. **Typed hero effect**: the design spec (08 §4.3 / winner-A direction) implied removing it; the stage-2/3a asks explicitly kept it. It ships still typing. The spec-vs-ask contradiction remains open for the owner to settle.
5. **sitemap.xml lastmod is stale** (2026-10-07, pre-V3) — bump when the V3 build deploys (17-seo-report.md).

## Known code debt (documented, deferred, harmless today)

6. **Raw-cyan hover leftovers** (prior-stage deferred CSS surgery, untouched by stage 3b): `.hero-socials a:hover` (~styles.css:920) and `.project-card` internals (~1817-1868) still use raw cyan instead of tokens; ~90 legacy `:hover` rules remain ungated by `(hover:hover) and (pointer:fine)`.
7. **Dead entries in the mobile backdrop-filter list** (~styles.css:2986): `.contact-form`, `.footer`, `.contact-list li`, `.footer-socials a` are now flat — harmless dead CSS.
8. **Stage3b verifier check #`service_view` is stale** — asserts the old section-level behavior; the current per-slug behavior is covered by e2e-services-profiles.mjs. Fix or delete the check (15-test-report.md).
9. **Admin assistant navigation caveat:** `Assistant.jsx saveDraft` navigates to `/${schema.table}`; for `professional_profiles` that hits the catch-all `/` redirect. Profiles is intentionally not in the assistant dropdown for this reason; add a route alias or nav tweak before enabling profile drafts.
10. **`related_project_keys` admin field label says "slugs"** (schemas.jsx: "Related project slugs") but the values are project **legacy_keys** ('p1'..'p7'). Join works, label misleads slightly.
11. **Content triple-sourcing survives** (audit P1-02): projects still live in index.html static cards, PROJECT_CASES in script.js, and Supabase — V3 preserved rather than reconciled this; skills/experience/stats sections still have no CMS binding (audit P1-05), and the stats strip numbers remain hardcoded.
12. **`nul` file** at repo root (untracked Windows artifact) — delete at will; not referenced by anything.

## Environment-limited (cannot verify from here)

13. **No deploy, therefore no live verification**: the wave never deployed, so live "after" performance numbers, live E2E, the real `/api/content` fetch path in production, analytics events firing in production, and search-console indexing behavior all remain unverified — they require the next deploy. **No Lighthouse lab run was performed in this wave either** (explicitly out of scope in the recon audit, 01-recon-audit.md:113); performance evidence is the single-run LIVE baseline plus local re-measures only.
14. **Rate limiter is per-serverless-instance** (api/_lib.js:40-43) — documented trade-off, upgrade path noted.
15. **Session 0003-file header** says "run once" while policies are `if not exists` (re-runs safe) — cosmetic inconsistency in the migration header (0003:3).
