# Skills digest — frontend engineering group (V3 redesign)

All 6 skill files read in full this session. Rules below bind any developer implementing
the V3 redesign of this repo: vanilla-JS static site + React 18/Vite admin, EN/AR
bilingual with RTL, 5 themes (dark default), no new npm deps on the public site,
"Dark Precision Engineering" brand language.

## frontend-craft — C:/Users/abdal/.agents/skills/frontend-craft/SKILL.md
- Intent analysis and mode classification happen BEFORE any code (:31-59); this portfolio
  is Mode A — showcase, "the site IS the product" (:41-45, :90-102) — and every hero,
  section, type, and motion decision is recorded with a one-line "why" (:47).
- Restraint rule is brand law: one dominant effect per viewport, never animate everything
  at once (:100-101); every animation ships with a documented trigger, easing, and
  prefers-reduced-motion handling per the output contract (:161-164).
- The Anti-AI-Tell checklist is a ship gate (:114-129): no centered-everything layouts,
  no purple→blue gradient hero, no placeholder copy, no Inter-only flatness, no uniform
  3-column card grid as the only pattern, no missing hover/focus/loading/empty/error states.
- Library-first is bounded by this repo (:77-88): new npm deps are banned on the public
  site, so hand-write vanilla only where the interaction is genuinely unique and say why;
  in the React admin, reuse existing dependencies rather than adding the skill's stack.
- Vary the Top-6 layout levers deliberately — hero composition, section rhythm, color
  voice, motion direction, type pairing, content structure — and record why they fit
  THIS project (:131-143); never drift onto a recycled template.

## frontend-engineering — C:/Users/abdal/.agents/skills/frontend-engineering/SKILL.md
- Anti-pattern blacklist (:83-88): no raw color/spacing/shadow/radius values where tokens
  exist — with 5 live themes, CSS custom properties are the only safe styling path — no
  clickable div/span for primary actions, no interactive element without keyboard + ARIA
  behavior, no inline-style sprawl.
- Non-negotiable quality checklist (:60-68): every component covers default, hover,
  focus-visible, active, disabled, loading, and error states; semantic HTML, keyboard
  operability, visible focus, WCAG contrast; loading/empty/error handling is production
  readiness, not polish.
- Consistency-first over novelty (:59): one tokenized system for typography, spacing,
  radius, color, shadow, and motion across the public site and the admin.
- i18n is architecture, not afterthought (Phase 13, :161-165): locale detection/switching,
  RTL support, and Intl.* formatting — maps directly onto the EN/AR dictionary rule and
  logical-property mirrored layouts.
- Testing baseline includes Playwright + axe-core (:50-56); the repo already ships
  Playwright 1.63, so E2E plus an axe pass on key pages is the expected bar. The skill's
  React+Vite+Tailwind default profile (:47-56) applies only to admin/ — the public site
  stays vanilla by project rule; follow its checklist, not its stack.

## frontend-ui-engineering — C:/Users/abdal/.agents/skills/frontend-ui-engineering/SKILL.md
- Semantics and keyboard first: real `<button>`/`<a>` over div-with-handlers (:170-185),
  aria-label on every icon-only control (:191), every input labeled (:194-195), focus
  moved and trapped deliberately when content changes (:201-219).
- Semantic tokens and scales only: token names, never raw hex (:161); 4.5:1 body-text
  contrast (:162); color is never the sole state indicator (:163); spacing comes from
  the scale — an off-scale 13px padding is a defect (:133-143).
- Heading hierarchy is structural: one h1 per page, no skipped levels, heading styles
  never applied to non-headings (:145-157).
- Mobile-first, verified at 320/768/1024/1440 (:242-256); "responsive later" is a listed
  rationalization that costs 3x to retrofit (:299-307).
- Skeletons with aria-busy instead of spinners (:258-268); designed, announced
  (role="status") empty and error states — never blank screens (:221-240). Red flags to
  refuse (:309-316): >200-line components, inline styles/arbitrary pixels, missing
  states, untested keyboard nav — on the vanilla site this means modular script.js
  features, not one giant function.

## web-artifacts-builder — C:/Users/abdal/.agents/skills/web-artifacts-builder/SKILL.md
- Its one transferable rule (:18-20): avoid excessive centered layouts, purple gradients,
  uniform rounded corners, and the Inter font — direct reinforcement of the brand language.
- Everything else (init/bundle scripts, React+Tailwind+shadcn stack, Parcel single-file
  bundling, :24-56) does not apply: this is not a claude.ai artifact and new
  dependencies are forbidden on the public site.

## Skipped as irrelevant
- agent-development (Claude Code plugin/agent markdown authoring — no frontend
  implementation relevance) and building-native-ui, C:/Users/abdal/.zcode/skills/building-native-ui/SKILL.md
  (Expo/React Native; its inline-styles-only, no-CSS rules contradict web practice here;
  its transferable fragments — flex gap over margin, tabular-nums for counters — are
  already covered above).
