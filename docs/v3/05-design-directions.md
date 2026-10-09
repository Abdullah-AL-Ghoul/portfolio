# V3 Design Directions — Three candidates, one evidence-based winner

**Scope of evidence:** the consolidated matrix in `docs/v3/04-design-research-matrix.md` (which itself only repeats measured facts from `refs-product/tools/portfolios`), the audit in `docs/v3/01-recon-audit.md`, the three skills digests, and source probes I ran this session (`styles.css` theme roots at :101/:143/:171/:198/:4192, hero markup `index.html:265-344`, admin `styles.css:1-18`).

Three fully-specified directions. For each: layout concept, hero treatment, typography strategy, color/surface strategy, motion rules, project presentation, services presentation, mobile behavior, performance cost, implementation complexity on the ~4,800-line vanilla CSS codebase. Then a scored comparison and a declared winner.

---

## Direction A — "Minimal Precision"

**Reading:** personal developer portfolio for a full-stack + AI developer, "Dark Precision Engineering" voice, leaning on the Vercel/Linear/brittanychiang lineage. **The hypothesis to defend:** the least re-worked, most token-disciplined, quietest direction is also the most credible one. Weight discipline over decoration.

### Layout concept
Single-column narrative with a rigid 12-col scaffold at section level (Vercel/Linear 12-col evidence, matrix). Container stays `--container: 1180px` (styles.css:137). Sections breathe at `padding: clamp(4rem, 10vw, 6.5rem) 0` instead of a flat `6rem 0` (current `styles.css:355`) — one clamp-driven rhythm (Webflow P1 pattern). Work renders as a single column of named rows, not a card wall (brittanychiang P1). No more than one discrete "column-flip" per viewport.

### Hero treatment
One-line positioning statement: **first line = role/scope ("Software Engineer · AI")**, then a short line that asserts the niche ("Building practical things, end to end."). The existing `hero-desc` (index.html:288) becomes the positioning paragraph. Keep the status pill (index.html:270-273) as the "// status" mono overline — it already exists and already reads like an engineer-made artifact; elevate `.eyebrow`/`.status-pill` into the brand's mono-overline language. CTAs collapse to **two**: primary "View selected work" + ghost "Say hi" (vercel dual-CTA P0): current three CTAs (index.html:298-311) drop the outline "Download CV" into the nav/contact/footer zone. The avatar stays but quiet: no floating cards or glow orbit around it; the avatar becomes a muted monogram surface with no decorative ring. The typed effect (`.typed`) is cut — motion concentrated into one load reveal, per frontend-craft "one dominant effect per viewport".

### Typography strategy
Display face + refined body, never Inter-only flatness (frontend-design rule; jb-frontend-design; web-artifacts-builder). H1 display: `clamp(2.4rem, 6vw, 4rem)`, weight 600, `letter-spacing: -0.03em`, `line-height: 1.05` — the tight-tracked precision headline (vercel/linear P0). Body stays 1rem/1.6. Mute secondary text to `--text-dim` over dark surface (brittanychiang P0). Mono is **structural**, not decorative: every section label is a mono overline (`// about`, `// projects`) at 0.75rem, 0.08em tracking (brittanychiang P3, darkroom P2). Arabic keeps Cairo with line-height bumped (RTL hard rule).

### Color / surface strategy
Dark default is the hero of the brand (linear P0, framer P0). Remove the multi-color hero glow: one dominant accent + a sharp accent for mono highlights only (frontend-design "dominant color, sharp accents"). `--accent-purple/-pink/-blue` are **retired from surfaces** under this direction (they survive as theme vars only for the 5-theme system) — the default dark resolves to near-monochrome surface + single cyan accent, exactly what framer/linear prove. Surfaces stop being glass-everywhere: cards get `--bg-elev` + `1px solid var(--border)`, not `backdrop-filter` glass (glassmorphism is an explicit cliché ban across the skill digests). Light/cyberpunk/forest/sunset must survive (hard rule) — they keep re-resolving the same semantic tokens (see 08-design-system); cyberpunk keeps neon by theme contract, not by default.

### Motion rules
Whisper level (leerob P2 measured 0.16s/0.3s; matrix synthesis). Hovers only `color/background/border-color` transitions (stripe/linear scoped-hover P0) — never `all`. One load orchestration: a single staggered reveal of the hero block (≤300ms, 30-50ms staggers), then all other sections reveal once via `transform+opacity` under 600ms (existing `.stagger-item`, styles.css:4241-4251, kept but reduced to opacity+translateY only). No blob pulse. `transition: none` during theme switch (ui-animation L69) + `prefers-reduced-motion` → ~0.01ms/auto in the hard rule. Exact values in 08-design-system.

### Project presentation
Single-column list of named projects: name (display h3) + one-line scope + stack tag row (brittanychiang P1). Entries open the existing case-study modal (`#case-modal`, pinned by tests/e2e-public.mjs:38,43). Rows separated by 1px rules (brittanychiang experience-row pattern P1). This is the cheapest structure to drive from the Supabase API + CMS (cms.js:45-68 writes `.project-tag/.project-body p/.project-links`) — and it forces us to keep those class names, which is exactly the low-risk path.

### Services presentation
A compact "Capabilities" list (icon + title + 1-line + micro-bullet cards — figma/supabase P1, sets hiring expectation per basement/darkroom P1) directly under the hero. NOT a 36-row basement grid. Skills section (index.html:487-617) collapses into this capability list; the stats strip with hardcoded `11+/3+/7/2` (index.html:384-403) is either replaced by live counts (supabase GitHub-stars P1 — only if real) or de-emphasized — the audit flags the hardcoded values as a fact-accuracy hazard.

### Mobile behavior
Same single column, narrower — clamps do the scaling (webflow P1). Work list stays a list, no multi-column collapse. Nav keeps `#nav-toggle` (e2e pins `#nav-toggle` + `.nav-links` visibility at 390px). If `--nav-h` drops below 72px on mobile, recompute `scroll-padding-top` (styles.css:97) and re-run the anchor gap check (audit-06 measured 196px gap) — but the philosophy is "change nothing unless it helps", so nav-h stays by default. Full RTL via logical properties.

### Performance cost
Low. No new network deps, no `fetchpriority` changes, no iframes. We *reduce* UI surface (blobs removed). Document is 17KB over the wire (audit line 46). Estimated delta: strictly smaller than the current page in JS and background compositing. Measurable target: no regression against the audit baseline (FCP 5.6s / DCL 3.68s — network-dominated, our job is not to add to it). Cost ≈ 0 net, potentially negative once font subsetting per web-performance skill happens separately.

### Implementation complexity (on the existing monolith)
**Low — lowest of the three.** The changes are edits to existing `styles.css` root tokens + scoped-hover replacements (~10 `transition: all` sites to find and fix) + `.hero-blobs` removal + a single-column restyle of `.project-card`/`.project-tags` **keeping the class names per the cms.js contract** + a type-scale token layer. E2e pins `.hero-title` (tests/e2e-public.mjs:27), `[data-theme-choice]`, `#lang-toggle`, `#nav-toggle` — all preserved. "Minimal" is self-fulfilling.

---

## Direction B — "Technical Editorial"

**Reading:** the site as a technical journal — darkroom's definition hero (P0, "strongest creative frame"), rauno's type-as-artifact, leerob's content-first (partially). The hypothesis: a document-shaped portfolio written in strong type, mono metadata, long scroll is the most differentiated from templates.

### Layout concept
Editorial spread, generous whitespace, asymmetric-but-gridded columns (8x3 grid rows like darkroom P2). Container can widen to ~1320px max with 12-col rhythm and offset columns (start-aligned in LTR, end-aligned in RTL via logical properties). Scrolling is the reading experience — desktop docHeight target 5000-8000px (darkroom 8609px / rauno 6108px evidence range).

### Hero treatment
**Definition-style hero** (darkroom P0): `[ Name ], noun / A full-stack engineer who ships end to end.` — the brand's dictionary entry, then an engineering value line. Subhead = 3 trait words ("Fast. Rigorous. Reliable." — raycast P1) or a 3-beat principle line (rauno P2). Two CTAs (primary + ghost). No avatar in the hero — the "face" becomes a mono block-of-type term. Existing status pill (index.html:270-273) becomes the "noun" label. `.typed` cut.

### Typography strategy
Display face in weight 400-500 (figma weight-400 light P0; darkroom 400/160px). H1 fluid `clamp(3rem, 8vw, 5.5rem)` weight 500 line-height 1.1, `letter-spacing: -0.02em`. Body stays 1rem/1.7 (editorial, more line-height). Mono does more: section labels, metadata, dates, inline code. H2s are brand statements ("Not just vibes, an engine" — framer P1) rather than "My Projects". The page ends with a footer trust line (brittanychiang P2) + a quote, not collapsing link columns.

### Color / surface strategy
Near-monochrome at rest in all themes (rauno P3). Surfaces flat: `--bg` (pure) + `--bg-elev`, 1px borders, no glass `backdrop-filter`. One accent reserved for terminal/code highlight and interactive states. Cyberpunk/forest/sunset keep their accent via the same single-accent-to-theme mapping. Light theme maps to a warm paper-white.

### Motion rules
Slower, more authored: entrance staggers up to 500ms, reveals only `transform: translateY` + `opacity`, never re-run (ui-animation L41: reveal once). Hovers scoped. The guard is web-animation L36 (transform+opacity only) + nothing above fold animates. Reduced-motion collapses everything per the hard rule.

### Project presentation
Editorial index: each project is a numbered folio entry — number in display type, name, one-line scope, tags — separated by rules. Case modal opens as a sheet, not a card. Fits a one-person editorial voice; reads premium.

### Services presentation
Elide prominent services; frame capabilities through the same editorial lens as a "Services / Capabilities" index block with mono labels (darkroom P2 list form). Real services only.

### Mobile behavior
Soft collapse: editorial spreads compress to a single flow (clamps). Long scroll remains. Nav → burger like current. This needs the biggest RTL verification pass because two-sided editorial grids in Arabic are the riskiest layout; audit only verified current single-column RTL (audit-04).

### Performance cost
Low-medium: more type than image, one real risk — very wide `letter-spacing`/scale on long Arabic strings introduces horizontal overflow if the clamp is not tested (audit-04 pattern), and longer pages stress the reveal system (46 nodes now; more scroll). No new weight. FCP ~ unchanged.

### Implementation complexity (on ~4,800-line monolith)
**Medium-high.** Touches every section's padding (de-contain), rewrites hero markup, adds multi-col editorial grids that must flip in RTL, adds new type sizes → new interlocking clamps. cms.js project-card selectors survive only if the list keeps `.project-card` DOM; editorial may restructure (cms.js:45-68). The e2e gate pins hero/modal but not editorial chrome.

---

## Direction C — "Premium Software Studio"

**Reading:** basement.studio + darkroom + framer. The hypothesis: Abdullah's site should perform like a studio, with a massive headline, a showcase grid and an explicit "what you hire me for" surface, to read premium and drive freelance conversion.

### Layout concept
12-col grid, section rhythm 4-5rem, centered constrained container (1180px kept), a **showcase grid** for projects (2 columns, image-led) rather than a list. Big structure, paced by H2 statements. Reality check: one person, not a 36-capability studio — the offering must be framed honestly (matrix refs basement/darkroom as capabilities/services).

### Hero treatment
**Massive full-viewport statement** (basement P0: 87px/78 weight 600). H1 = one positioning line, ~`clamp(3rem, 9vw, 6rem)`, weight 600, tracking -0.02em with a real artifact framed (raycast P1): the admin dashboard UI rendered as a labeled demo window, honest "demonstration" label per fabrication rule. Two CTAs — primary white "View work"/"Start a project" + translucent `rgba(255,255,255,0.1)` secondary (framer P0). Status pill kept as mono overline. No typed effect.

### Typography strategy
Display weight 600-700, tight tracking, `clamp` (webflow fluid P1). Body 1rem/1.6. Mono accents for metadata and code labels. Display face must be distinctive (not Space Grotesk, per frontend-craft anti-AI-tell). Arabic Cairo with matching weight.

### Color / surface strategy
Black canvas, white primary CTA, translucent secondary (framer P0). Accent sparse + reserved for mono only (framer "#0066FF reserved for code accents"). 5 themes survive: each theme re-resolves one accent. Glass removed from cards; surfaces flat + elevation shadows. Strongest "studio premium" visual language but closest to crossing the restraint brand law — heaviest guardrails on motion and accent, and riskiest to keep all 5 themes + RTL coherent.

### Motion rules
One dramatic hero entrance (studio style): H1 scale/translate-up once at 400-500ms with 50ms staggers — the single high-impact moment allowed by frontend-craft. Afterwards whisper: 0.2s scoped hovers. Project previews may use muted `loop` video (darkroom P1) but optional and not the default due to payload + RTL-safe fallbacks. Reduced-motion hard rule applies.

### Project presentation
Showcase grid 2-col: each project is a large surface (real site UI screenshot or styled mock), title, one-line scope, tags, a hover edge-trim motion. Opens case modal. More image-led → more asset burden; project art must be real screenshots of actual builds, never invented mockups (HARD RULE), so this direction's ceilings depend on asset availability.

### Services presentation
A capabilities/offering section in card form (basement Capabilities P1, supabase capability grid P1): icon + title + one-line + micro-bullets; a real services list ("Web apps, Automations, Integration, Chat/AI assistants") — real, auditable, not invented.

### Mobile behavior
Showcase grid collapses to 1-col; hero clamps down; nav → burger. Same clamps as A/B, slightly heavier DOM (image surfaces).

### Performance cost
**Medium.** Image/video-led surfaces add payload; the hero product-window mock adds layout cost; looping video previews add network bytes unless `preload="none"`/lazy. Above-fold image budget (web-performance: above-fold < 500KB) must hold. Highest chance of pushing LCP regression given the network-dominated baseline.

### Implementation complexity
**High.** New hero structure (product-window mock), showcase grid components, capability grid section, possible video component — plus the same RTL and 5-theme retrofit. Most new components on the 4,800-line monolith. cms.js card contract must be renegotiated (bigger DOM restructure than A).

---

## Scored comparison (1–5; higher better; performance-cost and implementation-risk scored as cost/risk 1=lowest → 5=highest)

| Criterion | A Minimal Precision | B Technical Editorial | C Premium Software Studio |
|---|---|---|---|
| Credibility for full-stack + AI dev | **5** — dark+precision+mono = dev trust (linear/brittanychiang/framer P0) | 4 — type-as-artifact reads 2nd-hand dev | 3 — studio scale overclaims for one developer; honest scope mismatch |
| Readability / scanability | **5** — named list, muted hierarchy, low scan cost | 4 — editorial long-scroll hurts scanability | 3 — grid/image-led, denser |
| Freelance conversion potential | **4** — dual CTA + clear capability list | 3 — weaker direct action | 4 — explicit services |
| Performance cost | **1** — least new work, removes blobs | 2 — more type, more scroll | 3 — images/video, heaviest |
| Implementation risk | **1** — token edits, keep class names | 3 — RTL editorial spreads | 4 — new hero/grid/video components |
| Differentiation from template portfolios | 3 — minimal genre risk; saved by precision markers | **5** — strongest editorial POV | 4 — studio look, but template-adjacent |

**Weighted total** (weights from this site's evidenced priorities: credibility .25, readability .20, conversion .20, performance .10, implementation risk .15, differentiation .10; the cost/risk ratings inverted to higher-is-better):

| Direction | Weighted total |
|---|---|
| **A — Minimal Precision** | **4.60** (5·.25 + 5·.20 + 4·.20 + 5·.10 + 5·.15 + 3·.10) |
| B — Technical Editorial | 3.75 |
| C — Premium Software Studio | 3.15 |

The weights are the argument, not the arithmetic: this project's evidence says the most-leveraged axes are credibility and implementation risk, and the lowest-risk, most-brand-true option wins.

---

## DECLARED WINNER: **A — Minimal Precision**

**Why (evidence, not taste):**
1. **Strongest P0 rows map onto A.** The research's highest-priority, "applies directly to our brand" rows — linear (P0: dark + scoped hover), brittanychiang (P0: one-line positioning + muted secondary), framer (P0: dark canvas + white CTA + translucent secondary), vercel (P0: tight-tracked 64px H1 + ghost CTA) — all describe what A is. B's and C's P0s (basement 87px, darkroom definition) land a single creative blow at the cost of scope each.
2. **The audit's constraints are low-risk-shaped.** A monolith with 5 themes and cms.js writing through exact selectors (audit P1 items 3, 7) rewards the minimal DOM delta. A keeps `.hero-title`, `.project-card`, `.project-tag` and card internals essentially per the cms.js contract (cms.js:45-68), so the CMS mapping survives untouched.
3. **Brand law is restraint (frontend-craft :100-101 "one dominant effect per viewport").** A is the only direction where restraint *is* the visible product; B and C require actively dialing back theatrics, working against the rule. Every skill digest names the same danger — "AI-slop" centered gradients, gratuitous motion — and A avoids it by construction.
4. **Perf risk ≈ zero and the work subtracts.** The baseline is network-dominated (audit 46-49), so the safe play is not adding to it. A removes blobs (styles.css:685-751), the button sheen, and cuts a CTA. B and C add layout and asset surface.
5. **Implementation risk is the cheapest to fix, so its score stands:** it is 1 because "minimal" means few new moving parts.

**The explicit trade-off** (no glossing): A is the least different from the current site and risks blending into the minimal-portfolio genre. Mitigated in the spec by the distinction markers the matrix earned — structural mono overlines, definition micro-framing on the hero, the discipline of 12-col rhythm and clamp-based spacing. B remains the strongest alternative if the owner decides differentiation outweighs safety; its costs are listed above.

**Riskiest single implementation action across A:** removing the blobs and `.hero-visual` while keeping `.hero-title` (e2e pin) and not breaking the avatar `onerror` fallback path — plan the CSS edit with the e2e re-run.

Next: `docs/v3/08-design-system.md` turns the winner into a binding token + component spec.
