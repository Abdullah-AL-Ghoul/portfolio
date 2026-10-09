# V3 Accessibility Report

## Inherited baseline (from the recon audit, all checks run live in phase 1)

The audit's a11y spot checks all passed on the live site: 5/5 images with alt; 77/77 controls with accessible names; 32 headings with 0 skipped levels; lang/dir flip en/ltr → ar/rtl on the real toggle; RTL overflow clean at 1440; 20/20 Tab stops visible with outline or box-shadow, stop 1 = skip link; no horizontal overflow at 768/390. Source: `docs/v3/01-recon-audit.md` findings table.

## What the V3 wave changed (and what I verified this session)

### Labels & semantics
- No new unnamed controls: the two new sections render semantic markup — `<article>`/`<h3>` for services, `<a>` cards for profiles, `<i data-lucide aria-hidden>` for decorative icons (cms.js buildServiceCard/buildProfileCard read this session). e2e suites confirm 0 uncaught errors and the public contract intact (10/10).
- The `#hire-me` button is a real `<a class="btn btn-primary" id="hire-me">` with an i18n label ("Hire me" / "وظّفني") — a visible labeled control, not an icon-only one.
- i18n: 185/185 HTML `data-i18n` keys exist in both dictionaries (node check this session); all 17 V3-new keys present in en and ar.

### Focus
- Focus ring remains tokenized through `--accent-glow` (stage3b check: "focus ring via --accent-glow" passed in the wave run).
- The skip link, theme/lang toggles and all pinned controls still pass e2e-public (10/10 locally this session, including "no uncaught JS errors").
- Per the wave evidence: the 3 sub-44px button readings seen during probing were unrevealed `.reveal-scale` cards at scale(0.97); at rest every button is ≥44px (44px floor added to `.btn` in stage 3b — footer socials 38→44px, submit 43→44).

### Reduced motion (hard rule)
- The site already collapsed animations under `prefers-reduced-motion`; stage 3b verified `pulseRing` collapses to 1e-05s and the form stays visible in reduced-motion context (wave evidence; the pulse checks in the verifier pass in my rerun too).
- Theme switching suppresses transitions via `[data-theme-switching]` (script.js applyTheme diff; rule at styles.css:4963) — prevents all 5 themes animating at once, which is also a motion-sensitivity win.

### Contrast
- Light `--accent` was corrected from the spec's original `#0a84c4` (white label = 4.11:1, fail) to `#0675b0` (5.02:1 white label, 4.61:1 as text) — documented in 08-design-system.md §2 with the run-owner decision.
- `--danger` token: #ef4444 failed 4.5:1 on light at 3.45:1 → light value #b91c1c at 5.94:1 (stage 3b, verified in the 60-check run: "light --danger token resolves (#b91c1c)").
- Availability pill and focus ring tokenized (color-mix from `--success`; `--accent-glow` only) — stage3b checks passed.

### RTL
- New sections built with the CMS render using document-flow markup; the verifier covered dir=rtl and 390px overflow (scrollWidth ≤ clientWidth at 1440/768/390 × EN/AR — 60-check run, wave evidence). Legacy RTL-mirroring transforms (`translateX(5px)` on `.contact-list li`, footer socials `translateY`) were removed in stage 3b so hover states no longer fight RTL.
- Known leftover (prior-stage deferred, not from this wave's sections): raw-cyan hovers on `.hero-socials a:hover` (~styles.css:920) and `.project-card` internals (~1817-1868) + ~90 legacy ungated `:hover` rules — see 20-remaining-issues.md.

### What was NOT run
- No axe-core or Lighthouse accessibility scan this session (not requested; the audit's runtime a11y checks were the phase-1 equivalent).
- Screen-reader testing — not performed in this wave or the audit.

## Regression status

The a11y invariants the audit called "must not regress" (0 unnamed controls, 0 alt failures, clean heading order, RTL overflow, visible focus) are protected by the passing e2e-public contract (hero, RTL, modal, honeypot, theme, mobile menu, 0 uncaught errors — 10/10 this session) and the stage3b verifier's focus/contrast/RTL checks (59/60, the single FAIL being the stale service_view check documented in 15-test-report.md).
