# Skills digest — animation & QA group

All 12 SKILL.md files read in full on 2026-10-08 (paths cited per heading; L = line in that file).
Stack: vanilla static public site (NO new npm deps there), React 18 + Vite `admin/`, bilingual EN/AR (`dir=rtl`), 5 themes (dark default), Playwright 1.63 + `tests/serve.mjs`. Brand: "Dark Precision Engineering" — restrained, purposeful motion.

## 1. web-animation — C:/Users/abdal/.zcode/skills/web-animation/SKILL.md
- Golden rule (L36): animate only `transform` and `opacity`; `width`/`height`/`top`/`left` trigger layout reflow every frame.
- Picker (L14-28): for a no-framework site the answers are "CSS keyframes" (hover/loading) and Motion One (lightweight, no framework) — reach for a library only for real needs like scroll-triggered scenes or SVG morphing.
- Ceiling (L32): all web animation shares the ~60fps main-thread budget via rAF; anything heavy (particles, 3D) must be CSS-composited or Canvas/WebGL, never more JS on the main thread.

## 2. framer-motion-animator — C:/Users/abdal/.agents/skills/framer-motion-animator/SKILL.md
- Public site: N/A as a dependency (hard rule: no new npm deps on the vanilla site). Relevant only inside `admin/` (React) — and prefer the `motion` package name (see skill 3, L149).
- Best practices (L553-563 + checklist L564-576): GPU-accelerated properties only, springs over tweens for UI, `AnimatePresence` for exits, staggered children for lists, test on low-end devices.
- Reduced motion (L534-551): gate via `useReducedMotion()` — collapse y-travel to 0 and duration to 0, don't just leave the animation running.
- Transition presets (L499-531): centralize one small set of spring/tween presets and reuse them; don't hand-tune per component.

## 3. ui-animation — C:/Users/abdal/.agents/skills/ui-animation/SKILL.md (richest in group)
- Purpose test (L41, L147): animate for feedback/orientation/continuity/deliberate delight; scroll-reveals belong to a few chosen marketing moments, run once, never re-animate on scroll-up, never on above-the-fold or product UI.
- Implementation priority (L43-44): CSS transitions > WAAPI > CSS keyframes > JS rAF — transitions retarget on interruption, keyframes restart from zero. Never `transition: all` (L65); list properties explicitly. Scrubbed scroll motion = `linear`, no duration (L148).
- Timing (L45, L73-96): routine UI ≤ 300ms; high-frequency ephemeral UI (hover, popovers) enters ~instantly, exits 100-150ms; staggers 30-50ms, total < 300ms; avoid `ease-in`. Enter curve `cubic-bezier(0.22, 1, 0.36, 1)`.
- Theme switching (L69): disable transitions during a theme switch (`[data-theme-switching] * { transition: none !important }`) or all 5 themes animate at once — critical here. Gate hover behind `@media (hover: hover) and (pointer: fine)` (L128).
- Perf & a11y (L42, L62-68, L133-137): keyboard focus must never wait for the animation; pause looping animations off-screen with IntersectionObserver; toggle `will-change` only during motion; keep `filter` blur ≤ 20px; SVG transforms need `transform-box: fill-box`.
- Validation (L174-179): grep the diff for layout-property transitions and `transition: all`; exercise the same task under `prefers-reduced-motion`; slow to 10% in DevTools Animations panel.

## 4. web-perf — C:/Users/abdal/.zcode/skills/web-perf/SKILL.md
- Prefer retrieval (web.dev / DevTools docs) over remembered numbers when citing thresholds (L9-11); here: LCP < 2.5s, TBT < 200ms, CLS < 0.1, INP < 200ms (L105-112).
- Be specific and quantify (L35-39): "compress hero.png (450KB) to WebP", not "optimize images"; skip recommendations with 0ms estimated impact; say so when a metric is already good.
- Audit checks (L121-129): render-blocking head resources without `async`/`defer`, missing preloads for LCP image/fonts, request chains, cache headers, oversized payloads.

## 5. web-performance — C:/Users/abdal/.agents/skills/web-performance/SKILL.md
- Starting budgets (L27-37): total < 1.5MB, JS < 300KB compressed, CSS < 100KB, above-fold images < 500KB, fonts < 100KB, third-party < 200KB — measure a baseline BEFORE editing and report before/after (L14-21).
- Images (L133-192): AVIF/WebP via `<picture>` + srcset; explicit `width`/`height` on every img (CLS); LCP image `loading="eager" fetchpriority="high"`, everything below the fold `loading="lazy" decoding="async"`.
- Fonts (L197-229): `font-display: swap`, preload the critical woff2 with `crossorigin`, subset via `unicode-range` — for this site that means a separate Arabic subset for the AR locale.
- Runtime (L269-310): batch DOM reads then writes (no layout thrashing); debounce scroll/resize handlers; drive JS animation with rAF, never setInterval. Third-party scripts async or facade-loaded (L347-381).
- Preload only what a trace proves is discovered late (L57); unnecessary high-priority preloads delay LCP.

## 6. webapp-testing — C:/Users/abdal/.agents/skills/webapp-testing/SKILL.md
- Wait for `page.wait_for_load_state('networkidle')` before inspecting the DOM or asserting on a JS-rendered page (L79-81) — vanilla `script.js` mutates content on load.
- Reconnaissance-then-action (L65-71): screenshot + read the rendered DOM first, derive selectors from observed state, never from memory.
- Headless chromium for scripts (L57); close the browser when done; add explicit waits for selectors (L85-89).
- Adaptation: this repo uses Node Playwright 1.63 + `tests/serve.mjs 8931` (`BASE_URL=http://localhost:8931`), not this skill's Python `with_server.py` — methodology carries over, tooling doesn't.

## 7. web-gui-tester — .../browser-use/0.5.1/skills/web-gui-tester/SKILL.md
- Pure black-box: no side-effect JS injection, no URL-constructed navigation, no force click, no refresh to escape a failed state; if a normal GUI op fails, re-observe, then record & skip — never fake success (L8-11, L79-87).
- Cross-validate every test point: read-only DOM/a11y-tree check AND a screenshot you actually viewed; code verification never replaces the screenshot (L11, L89-103).
- Transient states (toasts, tooltips, load spinners): before-screenshot → action → wait for the state → after-screenshot, all in the SAME tool call (L127-136).
- Register read-only console-error listening at the start; if unavailable, rely on visible error manifestations and say so (L140). Don't fix code mid-test (L10).
- Report pass/fail/blocked per test point with repro steps and referenced screenshots (L144-158).

## 8. agent-browser — C:/Users/abdal/.zcode/skills/agent-browser/SKILL.md
- This file is a stub: before any `agent-browser` command, load the real guide via `agent-browser skills get core` (L17-24) — content is version-matched from the CLI, never from the stub.
- Strengths if used: CDP-native, accessibility-tree snapshots with `@eN` element refs for reliable interaction (L46).
- For this project Playwright 1.63 is already installed and the E2E gate runs it — use Playwright first; agent-browser only as fallback for ad-hoc browser probing.

## 9. web-quality-seo — C:/Users/abdal/.agents/skills/web-quality-seo/SKILL.md
- robots.txt: allow crawl, `Disallow: /admin/` and `/api/`, never block render-critical resources; sitemap lists only canonical, indexable URLs (L40-53, L104-110).
- Per page: unique descriptive title (~50-60 chars as lint proxy, L160-170), unique meta description (L172-186), one logical heading hierarchy (L189-207), self-referencing canonical (L71-78).
- Bilingual (L341-356): `hreflang="en"` / `hreflang="ar"` (+ `x-default`) alternates and correct `lang` on `<html>` — must stay correct when AR flips `dir=rtl`.
- Images/links/touch (L209-251, L305-334): descriptive filenames + alt text, meaningful anchor text, tap targets ≥ 48px, body font ≥ 16px, proper viewport meta.
- Structured data only for visible, accurate content; most specific type (L256-261). `llms.txt` optional — never recommend ahead of the basics (L285-287).

## 10. web-quality-audit — C:/Users/abdal/.agents/skills/web-quality-audit/SKILL.md
- Evidence-led (L17-23): live baseline first, use runtime failures to localize source inspection, keep measured findings separate from code-reading hypotheses.
- Severity (L132-139): security = Critical; CWV failures and major a11y barriers = High (fix before launch); performance opportunities/SEO = Medium.
- Floor for every page (L42-116): CWV passing; alt text, 4.5:1/3:1 contrast, keyboard access, visible focus, skip link, `lang`; robots/sitemap/canonical; no console errors, valid doctype + charset first in `<head>`.
- Output format (L141-179): evidence table → issues by severity with file:line → priority order → what's verified vs pending. Re-run the same checks after fixing.

## 11. web-accessibility — C:/Users/abdal/.agents/skills/web-accessibility/SKILL.md
- Reduced motion (L288-300): under `prefers-reduced-motion: reduce` force animation/transition durations to ~0.01ms and `scroll-behavior: auto` — this is a project hard rule; test the task in that mode (L426).
- Focus (L199-235): never remove outlines; `:focus-visible { outline: 2px solid currentColor; outline-offset: 2px }`; WCAG 2.2 "focus not obscured" → `scroll-margin-top` sized to the sticky header.
- Targets & keyboard (L170-194, L242-263): native `<button>`/`<a>`/inputs over divs+ARIA (and never double-bind Enter/Space onto a native button); 24×24px minimum target (44×44 comfortable); dragging actions need a single-pointer alternative (L265-267).
- Language & forms (L306-316, L336-342): `lang` on `<html>` (and `lang` spans for mixed-language text); every input labeled; errors announced via `role="alert"`/`aria-live` with `aria-invalid` and focus moving to the first error.
- Contrast (L101-127): 4.5:1 normal text, 3:1 large text and UI components — must hold across all 5 themes, including focus indicators.
- Automated scores ≠ conformance; pair Lighthouse/axe with the manual checklist (L405-430).

## 12. ms-frontend-design-review — C:/Users/abdal/.agents/skills/ms-frontend-design-review/SKILL.md
- Commit to one aesthetic direction before coding; avoid generic "AI slop" (L31-48) — for this project that direction is fixed: Dark Precision Engineering, no neon/glassmorphism cliches.
- Motion stance (L42): CSS-only preferred; ONE well-orchestrated page-load sequence with staggered reveals beats scattered micro-interactions everywhere.
- Typography (L40): avoid overused fonts (Inter, Roboto, Arial, Space Grotesk); pair a display font with a refined body font (Arabic display font must be chosen with equal care).
- Quality pillars (L93-115): task completable in ≤ 3 interactions, 1-2 primary actions per view; design tokens not hardcoded values; WCAG 2.1 AA as the review bar; actionable error messages.
- Review output: score issues blocking/major/minor with recommendations (L72-87).

---

**Skipped as irrelevant to this stack:** framer-motion installation/React-API details on the public site (vanilla, no new deps allowed — only its reduced-motion/preset principles carry over, and `motion` is the current package name per ui-animation L149); ui-animation's reverse-engineer ffmpeg/curve-fitting pipeline (no recordings to measure); webapp-testing's Python Playwright and `with_server.py` (repo standard is Node Playwright + `tests/serve.mjs`); web-perf/web-quality-audit's chrome-devtools-MCP tool routing (`navigate_page`, `performance_start_trace`, `lighthouse_audit` — not available in this environment; thresholds and evidence standards still apply); agent-browser's Electron/Slack/cloud-browser specializations; web-performance's service workers, Early Hints, Speculation Rules and cross-document View Transitions (beyond scope for a single-page static portfolio on Vercel); web-quality-seo's Agentic Browsing/WebMCP/llms.txt deep-dives (optional, not requested); web-accessibility's AAA tier, accessible-authentication and redundant-entry patterns (no auth or multi-step forms on the public site).
