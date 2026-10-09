# V3 Recon Audit — Live Site Baseline ("before" state for redesign wave)

**Date:** 2026-10-08 · **Auditor environment:** Windows 10, Playwright 1.63.0 (repo root `node_modules`), Chromium bundled build
**Live target:** https://abdullah-portfolio26.vercel.app · **Local source:** repo root on branch `develop`

---

## Method

All runtime checks ran against the **live** production site with throwaway Playwright scripts under `.zcode/tmp-v3/`:

| Script | What it did |
|---|---|
| `.zcode/tmp-v3/audit-01-screens.js` | Desktop 1440x900: nav timing, console/page errors, full-page screenshot, then `scrollIntoView` through all 10 `section[id]` elements collecting further errors |
| `.zcode/tmp-v3/audit-02-viewports.js` | Tablet 768x1024 and mobile 390x844 full-page screenshots; captured every HTTP ≥400; checked horizontal overflow |
| `.zcode/tmp-v3/audit-03-a11y.js` | img alt audit, accessible names for all `button/a/[role=button]`, heading-order walk, 20-stop Tab focus trail |
| `.zcode/tmp-v3/audit-04-arabic.js` | Clicked the real AR toggle (`button.icon-btn`), verified `lang`/`dir`, RTL overflow, Arabic full-page screenshot |
| `.zcode/tmp-v3/audit-05-reshoot.js` | Re-shot all 3 viewport screenshots after scrolling the page to fire every reveal-on-scroll observer (first pass captured un-revealed sections) |
| `.zcode/tmp-v3/audit-06-anchor.js` | Clicked nav link `#certs`, measured gap between sticky header and section title |

Source-risk analysis was done by reading the **local** files: `index.html` (1301 lines), `styles.css` (4792), `script.js` (3952), `cms.js` (335), `sw.js`, `tests/e2e-public.mjs` (98).

### Evidence — screenshots (all LIVE, post-reveal)

- `gui-test-screenshots/v3-audit/desktop-1440-full.png` — desktop full page (re-shot 21:48 after reveal sweep; the 21:33 first capture is overwritten — its blank lower sections were the un-triggered reveal animation, not a rendering bug; post-scroll viewport shot `desktop-1440-after-scroll.png` confirmed content renders once revealed)
- `gui-test-screenshots/v3-audit/tablet-768-full.png`
- `gui-test-screenshots/v3-audit/mobile-390-full.png`
- `gui-test-screenshots/v3-audit/desktop-1440-arabic.png` — RTL Arabic state
- `gui-test-screenshots/v3-audit/desktop-1440-after-scroll.png` — contact section viewport (dark, post-reveal)

AI vision review of the re-shot captures (`analyze_image` on desktop full, mobile full, Arabic full): all expected sections rendered with content; no blank sections, no overlap, no horizontal overflow on mobile; RTL mirrors correctly with no tofu. One earlier claim of "header overlaps section title" was **disproven by measurement** (audit-06: gap = 196.4 px below the 72 px header after clicking `#certs`; `scroll-padding-top: 80px` at `styles.css:97` works).

---

## Performance baseline (LIVE, desktop 1440x900, single run, Chromium)

From `performance.getEntriesByType('navigation')[0]` (audit-01 output):

| Metric | Value |
|---|---|
| `domInteractive` | 3681.5 ms |
| `domContentLoadedEventEnd` | 4724.8 ms |
| `loadEventEnd` | 5093.7 ms |
| First Contentful Paint | 5588 ms |
| Main document `transferSize` | 17,276 B |
| `encodedBodySize` / `decodedBodySize` | 16,976 B / 85,410 B |
| Protocol | h2 |

Caveats: single sample, one geography, unloaded cache; the site shows a preloader overlay until load. The document is small (~17 KB over the wire), so the ~5 s timings are dominated by network RTT from this machine to Vercel, not payload — re-measure before setting perf budgets. FCP > load is consistent with the preloader gating first paint.

---

## Console & page errors (LIVE)

- On load AND after scrolling through all 10 sections (`home`, `stats`, `about`, `skills`, `projects`, `certs`, `experience`, `feedback`, `contact`, `ai-panel`): **0 uncaught page errors**.
- Exactly **2 console errors + 1 failed request**, identical on every run and both tablet/mobile passes:
  1. `Failed to load resource: the server responded with a status of 404 ()`
  2. `Refused to execute script from 'https://abdullah-portfolio26.vercel.app/_vercel/insights/script.js' because its MIME type ('text/html') is not executable…`
  3. `requestfailed: …/_vercel/insights/script.js :: net::ERR_ABORTED`

  The 404 was confirmed by response listener at both 768 and 390 viewports (audit-02 output). Root cause in source: `index.html:117` hardcodes `<script defer src="/_vercel/insights/script.js"></script>` — the reserved Web Analytics injection path that only exists when the Vercel addon is enabled for the project; it returns the SPA-fallback HTML here.

---

## Accessibility spot checks (LIVE) — all run, all pass

| Check | Result | Evidence |
|---|---|---|
| Images have `alt` | **Pass** — 5 `<img>`, 0 missing, 0 empty | audit-03 output |
| Buttons/links have accessible names | **Pass** — 77 controls checked, 0 unnamed | audit-03 output |
| Heading order h1→h2→h3 | **Pass** — 32 headings, 0 skipped levels | audit-03 output |
| `html lang`/`dir` after AR switch | **Pass** — `en/ltr` → click AR → `ar/rtl`, h1 renders Arabic | audit-04 output |
| RTL horizontal overflow | **Pass** — scrollWidth 1440 == clientWidth 1440 | audit-04 output |
| Keyboard focus, first 20 Tab stops | **Pass** — 20/20 visible, all with outline (1–3 px) or box-shadow; 0 invisible; stop 1 is the "Skip to main content" link | audit-03 `focusTrail` |
| Horizontal overflow EN (768 / 390) | **Pass** — no h-scroll at either width | audit-02 `dims` |

---

## Findings

### P1 — Important

1. **[LIVE] Every page load throws a 404 + MIME console error for `/_vercel/insights/script.js`** — hardcoded at `index.html:117`; the Vercel Web Analytics addon is not enabled at that path. Pollutes every visitor's console, trips any future "zero console errors" gate (current `tests/e2e-public.mjs:91` only checks uncaught pageerrors, so it passes today). Fix: remove the tag or enable the addon. Evidence: audit-01/audit-02 console output.

2. **[LOCAL] Projects content lives in THREE places** — static cards `index.html:626–777` (7 cards, `data-project="p1..p7"`), hardcoded bilingual case studies `PROJECT_CASES` in `script.js:2929` (en/ar blocks at 2930/3003, plus 1877/1946 and 2087/2214 for other content), and Supabase via `cms.js` (`PF_CASES_OVERRIDE`, cms.js:267–291). A redesign that rewrites cards must update or reconcile all three or the case-study modal, i18n and CMS dashboard content diverge.

3. **[LOCAL] CMS binding is structurally coupled to today's DOM** — `cms.js` writes through exact selectors: `.project-card[data-project]` + `.project-tag` / `.project-body p` / `.project-tags` / `.project-links` (cms.js:45–68); certifications matched by exact string `c.title_en === title` against `data-cert-title` (cms.js:222–224); recommendations matched by **DOM position index** `cards[i]` (cms.js:235–237). Renaming classes, restructuring card internals, reordering testimonials, or editing a cert title in HTML/dashboard silently breaks CMS mapping. Note also cms.js:142–145: dynamically added cards intentionally skip reveal classes — a new scroll-reveal system must handle late-added nodes.

4. **[LOCAL] The e2e gate pins a specific selector contract** — `tests/e2e-public.mjs` asserts: `.hero-title` (:27), `#lang-toggle` (:30), `html[dir=rtl]` (:32), `[data-case-open="p4"]` (:36), `#case-modal` (:38,43), `#contact-form` + `#form-status` (:47–58), `#company` honeypot positioned off-screen (:62–64), `#theme-toggle` + `[data-theme-choice="light"|"dark"]` + `html[data-theme]` (:67–75), `#nav-toggle` + `.nav-links` visibility at 390 px (:84–86), and 0 uncaught pageerrors (:91). Any redesign must keep these IDs/classes/behaviors or update the test in the same change.

5. **[LOCAL] Several sections have no CMS binding at all** — cms.js binds only projects, certifications, recommendations, about (+ case studies). Static-only: skills (`index.html:487–617`), experience/milestones (`:904–990`), the stats strip with hardcoded numbers `11+/3+/7/2` (`:384–403` — also a fact-accuracy hazard: "7 projects" drifts when the dashboard adds/edits projects), and the AI assistant's hardcoded knowledge base in `script.js`. Dashboard edits to these sections can never reach the live site.

### P2 — Enhancement

6. **[LIVE] Perceived load is slow (~5 s DCL/load, FCP 5.6 s)** — single-run, network-dominated (document is only 17.3 KB over the wire); the preloader overlay gates first paint. Label as baseline, not as a defect; re-measure from multiple geos before adopting budgets.

7. **[LOCAL] `styles.css` is a 4,792-line monolith with theme rules scattered** — theme roots at `[data-theme='light']` styles.css:143, cyberpunk :171, forest :198, but sunset at :4192; additional light-theme overrides at :1401 and :4700–4744. A restyle that touches component rules far from their theme overrides is a silent cross-theme regression risk across the 5 required themes.

8. **[LOCAL] Service worker will serve the OLD design to returning visitors unless bumped** — `sw.js:8` `CACHE = 'abdullah-portfolio-v6'`, core shell precached (sw.js:14–25), cache-first for assets (sw.js:65). Any redesign wave MUST bump the cache version or QA will see stale CSS/JS while iterating on the live/preview URL.

9. **[LOCAL+LIVE] Reveal-on-scroll makes un-scrolled captures blank** — 46 `reveal-*` elements in index.html stay at opacity 0 until their IntersectionObserver fires; the first live full-page capture showed empty sections until I scrolled first (audit-05). Any fullPage-screenshot tooling (tests, docs, design review) must scroll/trigger reveals before capturing; also affects print/save-as-PDF.

10. **[LOCAL] i18n architecture duplicates every string** — English defaults are inline in HTML (227 `data-i18n` occurrences) AND in `script.js` dictionaries in five en/ar pairs (script.js:105/334, 1877/1946, 2087/2214, 2930/3003, 3186/3239). Verified all 177 unique HTML keys exist in script.js (node check, this session) — but a redesign that adds strings must update BOTH dictionaries per the hard rules, and the HTML/dict duplication invites drift.

### P3 — Optional

11. **[LIVE] `#rec-modal-title` h3 is empty while hidden** (`index.html:1183`, filled on open) — the only heading with no text at rest; cosmetic, no level skip.
12. **[LIVE] Nav "AR" toggle button is keyboard-reachable and functional but is an icon-sized `icon-btn`** — visible focus ring confirmed (audit-03 stop 9); no action needed, keep parity in redesign.
13. **[LOCAL] Hardcoded contact email/links in HTML** (`index.html:1068–1076`) are not CMS-bound — fine for a personal site; noting so the redesign doesn't assume dashboard control it doesn't have.

### Not run / not possible in this ask

- Lighthouse/CWV lab scores (not requested; would need separate tooling) — **not run**.
- Admin dashboard and API endpoints — out of scope for this audit of the public site; **not run**.
- `tests/e2e-public.mjs` itself was **read** (assertions inventoried above) but not executed here; the workflow gate runs it separately. Runtime a11y checks above are my own equivalent-scale live checks, not that suite.

---

## Verdict

The live baseline is an accessible, bilingual, multi-theme static site with genuinely solid a11y hygiene (0 unnamed controls, 0 alt failures, clean heading order, working RTL and visible focus), but it is a monolith with content triple-sourced across HTML/JS/CMS, a per-load 404 console error, and a redesign-hostile set of implicit selector contracts (cms.js, e2e) that must be preserved or consciously renegotiated.
