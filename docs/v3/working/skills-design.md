# Skills digest — design & UI group

Project lens applied to every rule below: vanilla-JS static portfolio (no new npm deps) + React 18/Vite admin, bilingual EN/AR (dir=rtl), dark-first with 5 themes, brand = "Dark Precision Engineering" (strong type, deliberate spacing, restrained motion; no AI gradients, no glassmorphism, no neon).

## 1. frontend-design — `C:/Users/abdal/.zcode/skills/frontend-design/SKILL.md`
- Commit to ONE bold, intentional aesthetic direction before coding; "intentionality, not intensity" (SKILL.md:15-23) — for this repo the direction is already fixed: Dark Precision Engineering, so every change must serve it.
- Distinctive typography only: pair a characterful display font with a refined body font; never Inter/Roboto/Arial/system defaults (SKILL.md:35, 41).
- Use CSS variables for color/theme; a dominant color with sharp accents beats a timid evenly-distributed palette (SKILL.md:36) — maps directly onto the existing 5-theme variable system.
- Concentrate motion into one orchestrated high-impact moment (staggered page-load reveals via `animation-delay`) rather than scattered micro-interactions; CSS-only for the vanilla pages (SKILL.md:37).
- Never ship generic AI aesthetics: purple-on-white gradients, predictable layouts, converging on cliché fonts like Space Grotesk (SKILL.md:41-43).

## 2. ui-ux-pro-max — `C:/Users/abdal/.agents/skills/ui-ux-pro-max/SKILL.md`
- Review/repair UI in its priority order: Accessibility (4.5:1 contrast, keyboard nav, aria-labels) → touch targets ≥44×44 with 8px spacing → performance (reserve space, CLS < 0.1) → style consistency (SVG icons, never emoji) → responsive (no horizontal scroll) → typography ≥16px / line-height 1.5 → animation → forms → navigation (SKILL.md:20-31).
- Animation anti-patterns named explicitly: one duration for every transition, animating width/height, shipping without reduced-motion support (SKILL.md:28) — matches the project's prefers-reduced-motion hard rule.
- Dark-mode contrast must be checked explicitly per theme (`color-dark-mode` guidance, SKILL.md:205) — 5 themes × EN/AR each need to hold 4.5:1.
- Forms need visible labels, errors placed near the field, helper text — never placeholder-only labels or top-of-page-only errors (SKILL.md:29).
- Never present a 0-result search (or a fallback default) as verified data — label it as a default (SKILL.md:169-172).

## 3. ui-ux-pro-max-brand — `C:/Users/abdal/.agents/skills/ui-ux-pro-max-brand/SKILL.md`
- One brand source of truth, derived top-down: guidelines → tokens JSON → tokens CSS (SKILL.md:46-54). Here: the theme variables in styles.css are that source; admin should mirror them, not fork them.
- Brand consistency is auditable: voice, visual identity, and asset naming are reviewed against the same source (SKILL.md:14-21).
- Palettes and typography specs come from the brand layer, not per-page improvisation (SKILL.md:69-80 reference set).

## 4. ui-ux-pro-max-design (umbrella) — `C:/Users/abdal/.agents/skills/ui-ux-pro-max-design/SKILL.md`
- Its "New Design System" ordering is the right build order: define brand → token layers → implement styling (SKILL.md:259-264).
- Typography discipline from its banner rules transfers to web: max 2 fonts, ≥16px body, ≥32px headline (SKILL.md:181-186).
- Icons: outlined style is the pick for web UI (SKILL.md:217) — inline SVG, never emoji (echoes ui-ux-pro-max priority 4).

## 5. ui-ux-pro-max-design-system — `C:/Users/abdal/.agents/skills/ui-ux-pro-max-design-system/SKILL.md`
- Three-layer token architecture: primitive (raw values) → semantic (purpose aliases) → component-specific (SKILL.md:31-49) — the cleanest way to keep 5 themes coherent.
- The semantic layer is what enables theme switching; components must consume only semantic/component tokens (SKILL.md:244).
- Never use raw hex in components — always `var()` references; prefer HSL where opacity variants are needed (SKILL.md:243-246).
- Define full state matrices per component — default/hover/active/disabled for background, text, border, shadow (SKILL.md:79-87) — and document each token's purpose (SKILL.md:247).

## 6. ui-ux-pro-max-ui-styling — `C:/Users/abdal/.agents/skills/ui-ux-pro-max-ui-styling/SKILL.md`
- shadcn/Tailwind install guidance is out of scope for the public site (no new npm deps); its transferable best practices are what matter (SKILL.md:232-242).
- Dark-mode consistency: apply theme variants to ALL themed elements — no half-themed components (SKILL.md:238). Critical at 5 themes.
- Mobile-first: start with mobile styles, layer responsive variants upward (SKILL.md:235).
- Accessibility-first: semantic HTML plus visible focus states everywhere (SKILL.md:236).
- Build hierarchy with spacing and color composition, not decorative add-ons (SKILL.md:241).

## 7. jb-frontend-design — `C:/Users/abdal/.agents/skills/jb-frontend-design/SKILL.md`
- Same DNA as skill 1: committed bold direction, distinctive display+body font pairing, CSS variables for cohesion, high-impact staggered load motion, explicit ban on AI-slop aesthetics (SKILL.md:17-44).
- Its only addition — the Motion library for React (SKILL.md:36) — stays relevant to admin/ at most; the public site remains CSS-only.

## 8. ui-ux-pro-max-slides — `C:/Users/abdal/.agents/skills/ui-ux-pro-max-slides/SKILL.md`
- Pure pitch-deck/slide routing with no rules applicable to a bilingual web portfolio; nothing to adopt beyond its generic "use design tokens" stance already covered by skill 5.

---

Skipped as irrelevant to this stack: ui-ux-pro-max-design's logo/CIP/banner/social-photo AI-generation workflows, platform size tables and Gemini/MuAPI API setup (generates marketing assets, needs API keys — not site UI); ui-ux-pro-max's GSAP preset and chart domains (no GSAP or charting in this codebase); ui-ux-pro-max-slides entirely (HTML presentations); ui-ux-pro-max-ui-styling's shadcn/Tailwind CLI setup and code samples (public site is dependency-free vanilla CSS, and adding npm packages to it is a hard no); the brand/design-system sync *scripts* (they write `assets/design-tokens.*` build artifacts this repo doesn't use — the principles are retained, the tooling is not).
