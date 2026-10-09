# V3 Test Report

## Suites and what they assert

| Suite | Size | Asserts |
|---|---|---|
| `tests/e2e-public.mjs` | 10 checks | The audit-pinned selector/behavior contract: hero `.hero-title` visible; RTL toggle (`html[dir=rtl]`); case modal opens (p4) + closes on Escape; empty-submit validation error; submit → mailto fallback message; `#company` honeypot off-screen; light theme applies; mobile menu opens at 390px; 0 uncaught JS errors |
| `tests/e2e-dynamic-cards.mjs` | 17 checks | CMS-driven project cards: render, title/badge/summary/stack tags/live link, lucide SVG icons, case modal from a dynamic card, Arabic re-render, no duplicates on re-apply, static cards intact, card removal, 0 uncaught errors |
| `tests/e2e-services-profiles.mjs` | 36 checks | The two new CMS sections (read in full this session): both sections start `hidden`; injection via `PFCMS.apply` → 2 service cards with title/summary/features/tags/CTA label + href + `data-service-cta` slug + i18n CTA fallback; 1 profile card with name/title/href; `service_view` per slug + `freelance_profile_view` + all click events incl. `hire_me_click:service-cta`; Arabic rebuild with correct AR copy and no duplicates; `service_view` exactly once per slug; empty re-apply hides both sections with zero leftovers; 0 uncaught errors |
| `.zcode/tmp-v3/stage3b-verify.mjs` | 60 checks (throwaway regression verifier) | 1440/768/390 × EN/AR overflow (scrollWidth≤clientWidth), dir=rtl, 44px touch targets, tokenized input/form surfaces across all 5 themes, hover gating incl. touch context, honeypot off-screen, `data-theme-switching` toggled+removed, 5 trackable events, reduced motion (pulseRing → 1e-05s, form visible), focus ring via `--accent-glow` |
| Admin build | `npm --prefix admin run build` | Vite production build compiles with the new pages/schemas |

## Final verification result — quoted from the wave's verification phase

> "GREEN after 1 round(s) — tests/e2e-public.mjs, tests/e2e-dynamic-cards.mjs, tests/e2e-services-profiles.mjs all passed and the admin production build succeeded."

## What I ran myself in this closing session (local: Windows 10, Playwright 1.63, Chromium, `node tests/serve.mjs 8931`, BASE_URL=http://localhost:8931)

- `node tests/e2e-public.mjs` → **RESULTS: 10 checks — 10 passed, 0 failed**
- `node tests/e2e-dynamic-cards.mjs` → **RESULTS: 17 checks — 17 passed, 0 failed**
- `node tests/e2e-services-profiles.mjs` → **RESULTS: 36 checks — 36 passed, 0 failed**
- `npm --prefix admin run build` → **✓ built in 42.64s** (index JS 65.93 kB / 18.67 gzip; vendor 390.95; charts 411.54 kB)
- Grep gates: `transition: all` → **0 matches** in styles.css, script.js, cms.js, index.html, analytics.js; `blur(…px)` values in styles.css → max **20px** (10/12/20)
- i18n sync: 185 HTML `data-i18n` keys, all present in both en and ar dictionaries (212 keys each)

## One honest discrepancy

A rerun of the stage-3b regression verifier this session produced **59 PASS / 1 FAIL**: `service_view fires on visible section`. The failing check (stage3b-verify.mjs:182-190) unhides `#services` and injects a plain `<div style="height:600px">` — no `.service-card[data-service]` element. The shipped implementation observes **per-card** elements only (script.js `observeServiceCards` queries `.service-card[data-service]`), so a cardless section deterministically logs no `service_view`. This check asserts the *older section-level* behavior that the analytics phase deliberately replaced. The current behavior is covered by `e2e-services-profiles.mjs`, which passes `service_view fired for qa-service-one/two` with real cards. Verdict: stale check in a disposable verifier, not a product regression; the wave's recorded 60/0 predates the per-slug change to that one check's premise.

## Not run here

- The workflow gate's own rerun (expected to be the authoritative pass/fail).
- Real `/api/content` fetch path in the services suite — it injects via `PFCMS.apply` by design (the local static server 404s `/api/content`, which cms.js handles silently).
- Live/production E2E — nothing was deployed in this wave.
