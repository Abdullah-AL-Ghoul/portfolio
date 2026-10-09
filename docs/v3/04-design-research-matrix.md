# V3 Design Research Matrix — Consolidated References

**Consolidates:** `docs/v3/research/refs-product.md`, `docs/v3/research/refs-tools.md`, `docs/v3/research/refs-portfolios.md` (15 references).
**Data provenance:** every "Observed pattern" cell below is what the researcher measured in a real headless Chromium session against the live site (DOM probes, computed styles, `innerText`), saved as evidence screenshots/JSON in `gui-test-screenshots/v3-research/`. No row was invented here; rows were grouped by the direction groups in the source files. Observed measurements (e.g. type sizes, colors, timings) come from the researcher's probes, not from this matrix.
**Notation:** `[P0/P1]` = priority assigned by the researcher in the source file. `[X]` rows are the researcher's explicit rejects and non-transfers — preserved, never "fixed".

---

## Section 1 — Product & tech landing pages (`refs-product.md`)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| vercel.com | SaaS / agent infra | Light page, H1 "Agentic Infrastructure" at 64px/64, weight 400, letter-space −3.84px; strict 12-col grid; nav Enterprise/Pricing/Get a Demo/Log In/Sign Up; paired hero CTAs + "Ask AI" search; hovers `transition: all` | Oversized tight-tracked headline + rigid grid reads as engineered precision; ghost/primary CTA pair gives a clear next action | High — "precision engineering" voice is the brand goal | Hero H1 to 64–72px with −0.02/−0.03em tracking; 12-col grid for work sections; two hero CTAs ("View selected work" / "Say hi"); ghost nav | P0 |
| linear.app | Devtools startup | Nearly black bg #08090A, text #F7F8F8; H1 "The product development system…" 64px/64 weight 510 −1.4px tracking; scoped hover `color, background` only; 12-col benefit grid; Inter Variable body; nav Product/Resources/…/Contact + Log in/Sign up | Dark bg + one-line bold H1 + scoped hover = focused, calm, premium; single dark treatment across the page proves the theme | High — near 1:1 with our dark default theme; Inter stack matches | H1 in 60–72px / weight ~500 with slight negative tracking; restrict link hovers to color/background only; mirror per-feature 3-col layout for projects (bilingual-safe) | P0 |
| stripe.com | Payments marketing | H1 at 48px weight 300 light, −0.96px tracking over a **live product mock** (simulated checkout terminal animated, multi-currency labels); nav 4 links + Get started/Sign in; hovers restricted to `color, background-color, border-color` | Proof-by-artifact: a labeled UI does the job in front of the user; scoped hover per property stays crisp | Medium-High — the "prove it" hero is transferable; light-weight editorial type is not the voice | Hero artifact = live labeled console/terminal demo (no fabricated metrics); per-property hover, not blanket `all` | P1 |
| notion.com | Productivity SaaS | White bg, 96px/100 weight 600 H1 (−4.6px tracking); dual CTAs; logo marquee ~23 logos; use-case IO cards ("Resolve support tickets in Slack→"); footer quote | Oversized editorial H1 + real logo wall = instant legitimacy; → cards tell concrete stories; dual CTAs cover both intent types | Medium — scale is extreme, style generic; logo wall is a **fabrication risk** → skip; → outcome cards are portable | Dual CTAs (one action, one contact); outcome-named concrete cards ("Ship in a day→"); do NOT replicate the logo marquee | P2 |
| github.com | Developer platform | Dark bg #0D1117; H1 64px/69.12 weight 425 −2.24px; nav with always-visible "Search /" + "Sign up"; feature row; bottom = email capture strip + videos; hovers `all` | Single-idea headline + persistent primary CTA + search affordance; long bottom capture = retention hook | Medium — dark + tight headline match; client strip and newsletter not directly portable | Always-persistent primary CTA; tag-filter as the "search" affordance; bottom "Get in touch" block in a muted footer zone | P2 |

### Cross-cutting patterns (product file) — strength of signal, priority
1. Huge tight-tracked headline as the whole first viewport — 64–96px, negative tracking.
2. Rigid 12-column grid for all content below the hero.
3. Scoped hover transitions (Stripe: `color, background-color, border-color`; Linear: `color, background`) vs blanket `all` (GitHub/Vercel a step worse).
4. Proof-by-artifact hero (Stripe's simulated checkout).
5. Dual-CTA pattern — one action + one self-serve/contact, always visible.
6. One dark theme carried the whole page (Linear) — consistency > novelty per section.
7. Bottom retention hook (GitHub newsletter, Notion quote+footer).
8. Use-case outcome cards with "→" (Notion).

### Explicit non-transfers (product file, per HARD RULES)
- Customer/logo marquees (Notion, GitHub) — would require inventing clients.
- Fabricated metrics in any hero artifact — demo artifacts must be labeled as demonstrations.

---

## Section 2 — Developer & design platforms (`refs-tools.md`)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| Figma | Hero + positioning | H1 56px/56 weight 400 with one paragraph; one black main CTA + nav "Get started"; content column ~1360px / 40px gutters; hero padding 7.5rem; sections 5rem | One message + one dominant CTA; huge airy type scale = confidence; banner hijacks first scroll | Yes | Single role-based H1 (the exact phrase "Dark Precision Engineering"); one primary + one secondary CTA; generous ~5rem section padding; optional thin top strip; test 600–700 weights | P0 |
| Figma | Trust | "95% of the Fortune 500 uses Figma" — big 95%/45% numerals, named quote next to logo | Quantified + named = hierarchy does the convincing | Partially — no fabricated metrics | Only if we have a real attributable number or a genuine client quote; otherwise skip the stat | P2 |
| Figma | Type + tokens | figmaSans + figmaMono; props like `--fig-typography-size-title1:3.5rem`, `--fig-space-8:0.5rem`, `--fig-grid-max-content-width:95rem` | Named display face + mono accents every measure tokenized | Yes (partially) | Formalize tokens (spacing, type, max-content ~80rem) as CSS custom props per theme; keep one mono accent for the "engineering" voice | P0 |
| Figma | Catalog grid | "Explore all products" responsive `repeat(4,1fr)`/`repeat(2,1fr)` icon+title+one-line cards; footer grouped columns | Dense but scannable taxonomy; one card unit teaches the full range | Yes (pattern) | Reuse card-grid unit for projects/services: icon/label/desc in 2–4 col, collapses to 1 col mobile; full RTL via logical properties | P1 |
| Framer | Dark-theme hero | Pure black bg; H1 54px GT Walsheim Medium (500); white "Get started" + translucent `rgba(255,255,255,0.1)` secondary; blue #0066FF as sparse accent for Input Mono code accents | Dark canvas makes product + white CTA pop; weight-500 display feels engineered; translucent secondary reads real without competing | Yes — strong fit for "Dark Precision Engineering" | Default dark theme already matches; white primary CTA (not black-on-dark), translucent secondary; a single accent reserved for mono code snippets only | P0 |
| Framer | Show, don't describe | H2s are brand statements ("Agents that work alongside you…", "Not just vibes, a full platform"); ~90 product-UI images rendered in situ next to each claim | Confidence; H2 as POV not feature label | Yes | Render own real work/interface as large in-page surfaces beside each benefit; H2s as voice statements not "My Projects"; community stats only if real | P1 |
| Framer | Nav | Slim top nav: logo / 6 items / Log in + Sign up | Extremely minimal; one gesture; no feature-noise | Yes | Keep nav lean (max ~5 items), only the highest-value action in the bar — existing nav already leans this way; verify no additions | P2 |
| Webflow | Quantified-result cards | White bg, H1 80px weight 600; benefit rows each pair a benefit with a big metric card ("$4M+ pipeline") + "Read story →"; 8-col press/logo grid | Real numbers beside every benefit convert abstraction to outcome; metric card is hero of section | Partially — metric numbers are real client data | Adopt structure (benefit + evidence card) only with real, attributable results; can never use "$4M"-style invented metrics; skills/frameworks logo row is fine and real | P1 |
| Webflow | Fluid type & spacing | `clamp()` everywhere: `--_typography---h0--font-size:clamp(3rem … 7rem)`, margin/type clamps; 12-col primitives | One continuous scale avoids jarring breakpoint jumps; rhythm consistent | Yes | H1/section spacing `clamp()`-based so the rhythm holds across all 5 themes and both layouts; keep existing breakpoints, smooth with clamps; RTL-safe via logical props | P1 |
| Raycast | Product-window showcase | Dark bg `rgb(7,8,10)`, Inter, H1 64px weight 600; horizontal showcase reel: full-size replica product windows (grid `280px 470px`) as carousel; subhead "Fast, ergonomic and reliable." | Product *is* the hero; faithful window render beats screenshot collage; three trait words not filler | Yes | If we have a real app/dashboard UI (we do: the admin dashboard), render it as a stylized product-window mock in the hero; prefer three short product traits | P1 |
| Raycast | Design-token discipline | Scale tokens `--spacing-1:8px…--spacing-12:168px`, `--rounding-normal:8px/16px/20px`, `--color-bg:#07080a`; fixed nav, column ~1204px | Strict 8px spacing + rounding scale makes layout feel deliberate; system + mono stack | Yes | Adopt 8px spacing/rounding scale as CSS tokens for all 5 themes; Inter-style body + one mono; supports "deliberate spacing" | P2 |
| Supabase | Capability cards | Light bg, Manrope display + Inter body + Source Code Pro mono; H1 46px weight 500; two CTAs (green fill + outline); 6-card capability grid (icon+title+1-line desc+micro-bullets); live GitHub star count in nav | Cards teach scope at a glance; live counter is honest trust; two-line H1 packs the promise | Yes | Reuse icon+title+desc+micro-bullet card as skills/tools grid; show a real live counter (e.g. GitHub stars) not a made-up stat; keep two-line H1 | P1 |

### Cross-reference patterns (tools file)
1. One H1, one primary message, one dominant CTA every top site.
2. Dark canvas + white primary CTA + translucent secondary (Framer/Raycast) = the "engineering" look → maps to our dark default.
3. Design tokens not per-page values (Figma/Raycast/Webflow) — centralizes type/spacing/color/radius for 5 themes + RTL.
4. Real product surface in situ beats description (Framer ~90 window images, Raycast full-size replicas).
5. Benefit + evidence cards — only with *real* numbers (cannot fabricate).
6. Capability cards as a grid unit (Figma/Supabase) icon+title+desc, 2–4 col → 1 col.
7. H2s as brand statements ("Not just vibes, a full platform").
8. Fluid `clamp()` rhythm, logical-property-safe.

### Explicit non-transfers (tools file)
- Figma/Webflow's real claims ("95% Fortune 500", "$200M pipeline") are theirs, not ours — pattern (quantified trust) transferable only with genuine data.

---

## Section 3 — Premium portfolios & studios (`refs-portfolios.md`)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| brittanychiang | Personal dev portfolio | Fixed header: left logo, center section links (About/Experience/Projects), right icon row — no burger on desktop | Studio-worthy chrome; nav cost ~0; every key section visible without JS | Yes — nav + bilingual switch already exist | Keep left/center/right split; keep socials right | P1 |
| brittanychiang | Personal dev portfolio | Hero is one short line: "Hi there! I'm Brittany…" + 2-line positioning; h1 48px/48 700 Inter; body slate-blue rgb(148,163,184) on dark navy rgb(15,23,42) | Announces person + exact niche in <60 words; hierarchy via weight/size not color; muted body stays calm | Yes — maps to "Dark Precision Engineering" | 1-line "what I do / why" lockup; muted secondary text over dark bg | P0 |
| brittanychiang | Personal dev portfolio | Experience as 1-column bordered rows (role · org — dates), not cards | Scannable timeline; credit reads as substance | Yes — work section | Show projects/roles as a single detail column with dotted/border separators | P1 |
| brittanychiang | Personal dev portfolio | Projects as 1-column list of named projects, each with 1-line scope + stack tags | Work name carries weight; tags convey skill breadth | Yes — Supabase-driven projects from admin | Project = name + one-line scope + tag row, list layout (bulk-friendly) | P1 |
| brittanychiang | Personal dev portfolio | Small-caps / dimmed section labels like code comments ("// About") | Quietly signals "engineer made this" | Yes — on brand | Prefix section labels with dimmed comment/overline style | P3 |
| brittanychiang | Personal dev portfolio | Footer is a trust line: "Loosely designed in Figma and coded in VS Code by yours truly. Built with Next.js/Tailwind… deployed with Vercel"; 0 body imgs, 0 forms, 9 imgs total (icons/OG) | Stack + tooling disclosure is authentic proof of craft | Yes — honest, no fabricated clients | Footer line listing build stack (no invented metrics) | P2 |
| leerob | Dev portfolio/blog | Headerless page: bio card "@leerob — I'm an engineer and writer…"; h1 42.4px/48.76 600 serif (Iowan/Palatino); white bg; 0 imgs/nav/forms | Pure content-first personality; zero chrome leaves nothing to distract | Somewhat — needs nav + bilingual switch, so full headerless doesn't fit | Personal statement + one-paragraph bio as hero copy; keep nav for utility | P2 |
| leerob | Dev portfolio/blog | Whole page short (docHeight ≈1220–1639px): bio + two link lists | Content depth deliberately chosen; short page = low friction | Partially — project-heavy, needs more length | Not a full-page fit; don't shrink the site | P3 |
| leerob | Dev portfolio/blog | Bio length toggle (Default / Long buttons) | Reader self-selects context / TL;DR | Interesting micro-pattern | Could offer AR/EN or a "short/long bio" toggle in About | P3 |
| leerob | Dev portfolio/blog | Transitions tiny: 0.16s color, 0.3s opacity | Motion is a whisper, never attention-grabbing | Yes — matches "restrained purposeful motion" | Keep link/fade transitions ≤0.3s | P2 |
| rauno | Experimental portfolio | Massive display type as whole interface; 0 imgs/0 video; a long list of link rows | Type *is* the artifact; extreme restraint = confident craft | Yes conceptually — pure-type on brand | A "field notes / writing" list of understated text links | P2 |
| rauno | Experimental portfolio | Custom headline font "X" h1 32px/normal 500; body X/system-ui; bg soft all-grey rgb(237,237,237), black text | Near-monochrome = zero noise | Partially — 5 themes + AR constrain | Monochrome + one display face into one theme, not globally | P3 |
| rauno | Experimental portfolio | Desktop docHeight ≈6108px flat link list; mobile compresses to single 844px screen | Desktop invites scrolling exploration; mobile an instant-access index | Interesting responsive swap | On mobile, collapse work/writing to compact list; desktop keeps full | P3 |
| rauno | Experimental portfolio | Hero manifesto: "Make it fast. Make it beautiful. Make it consistent." | 3-beat slogan = memorable stance | Yes — fits "Dark Precision Engineering" | Add a short 3-item principle line as section tagline | P2 |
| basement.studio | Creative studio | Massive 87px/78 weight 600 Geist on black: "A digital studio & branding powerhouse making cool shit that performs" | Full-viewport statement of *what it is* before anything else | Yes — big bold single-purpose hero | Make Abdullah's H1 a proud one-line positioning statement, not just a name | P0 |
| basement.studio | Creative studio | "Trusted by Visionaries" ~40-image logo wall (12-col) | Logo wall = social proof | **No — HARD RULE, never fabricate client names/logos** | Only if real clients exist; otherwise omit | n/a |
| basement.studio | Creative studio | "Featured Projects" showcase grid + "Capabilities" 36-row capability grid (Websites & Features / Visual Branding / IRL Experience)/Marketing Execution) | Explicit services list sets expectation for who to hire | Yes — list real service capabilities | Add a capabilities/offerings grid (services, not invented clients) | P1 |
| basement.studio | Creative studio | Nav Home/Services/Showcase/People/Blog/Lab/Machine + burger + music on/off toggle | Playful, memorable, on-brand gestures | No — music off-brand and heavy | Skip music toggle | n/a |
| basement.studio | Creative studio | 2 newsletter forms at bottom ("Ready to tap into the basement vibe? Sign up…") | CTA = capture, not just contact | Partially | Keep single contact form; a newsletter is extra scope | P3 |
| basement.studio | Creative studio | `grid:12x4` hero + 6-col tails; transition 0.3s `all` on interactive | Grid discipline produces ordered chaos | Yes | Use a constrained 12-col grid for section rhythm | P2 |
| darkroom | Creative tech studio | **Definition-style hero**: "Where Things Get Developed / [ Darkroom ], noun / A lightproof room for developing photographs. / A studio engineering creativity into reality." h1 200px/160 400 display "therma", body ui-monospace, black bg, orange accent | Editorial device-positioning — explains the studio through its name as a dictionary entry | Yes — strongest creative frame for "Dark Precision Engineering" | Adapt hero to "noun/definition + one engineering value line" | P0 |
| darkroom | Creative tech studio | Project cards driven by `<video>` loop previews (4 videos, 0 images) | Motion previews sell interactive work better than stills | Yes — has project work | Optionally muted looping video/CSS motion on project cards instead of static img | P1 |
| darkroom | Creative tech studio | Mobile products-as-side-nav + Work/About/Contact | Sells own OSS alongside services | Partially | Reject if it means adding invented products; keep only genuine tools | P3 |
| darkroom | Creative tech studio | "Tools We Build and Use. Now Yours Too." + "Become an Open Source Sponsor" | OSS credibility = trust signal | Yes if genuine | Only if Abdullah has real open-source work; otherwise drop | P2 |
| darkroom | Creative tech studio | `grid:8x3` service/tech rows; mono labels throughout; deep editorial page | Mono type + grid = engineered precision (matches brand) | Yes | Use mono/terminal accents for labels & metadata | P2 |

### Strongest transferable patterns (portfolios file)
1. One-line hero positioning rather than a name (basement 87px, darkroom noun/definition) — P0.
2. Dark + muted secondary text instead of flat contrast (brittanychiang) — P0.
3. Work as a scannable single-column list of named items + one-line scope + tags, not a card wall — cheap from Supabase API — P1.
4. Restrained, whisper-level motion 0.15–0.3s measured (brittanychiang/leerob/rauno) — P1.
5. Editorial/definition device for framing — darkroom's noun hero, rauno's "Make it fast…it consistent." 3-beat line — P1.
6. Mono/terminal accent for labels and metadata (darkroom sets whole body in ui-monospace) — P2.
7. Capabilities/services grid (basement Capabilities, darkroom "Studio capabilities") — services, not invented clients — P1.
8. Trust via stack/process disclosure (brittanychiang footer) — provable honesty — P2.

### Deliberately excluded (portfolios file)
- Client logo walls, fabricated testimonials/awards/counts — banned. Music-toggle gimmick and video-only projects are heavy/off-brand without real assets.

---

## What the whole evidence set says (cross-source synthesis for the directions doc)

| Synthesis | Sources | Rows |
|---|---|---|
| **Huge, tight-tracked H1 as the entire hero** | vercel, linear, notion, github, basement | 5 |
| **Hero = one-line positioning, not a name** | basement, brittanychiang, darkroom | 3 |
| **Dark + muted secondary text** | brittanychiang, linear, framer | 3 |
| **Scoped hover (color/background/border), not `all`, ≤0.3s** | stripe, linear, leerob, brittanychiang, rauno | 5 |
| **Capability/services grid** (real services — no invented clients) | baseline, basement, supabase, figma | 4 |
| **Work as named 1-column list + tags** (from Supabase API) | brittanychiang | 2 |
| **Dual CTA (action + contact), always visible** | vercel, notion, figma, basement | 4 |
| **Mono accent / overlines for metadata** | brittanychiang, darkroom | 3 |
| **Design tokens, not per-page raw values** | figma, raycast, webflow, supabase, all skills | 4+ |
| **Fluid clamp() rhythm** | webflow | 2 |
| **Restrained motion (whisper)** | leerob, brittanychiang, rauno | 3 |
| **Trust via stack disclosure** | brittanychiang, darkroom | 2 |
| **Don't fabricate anything** | all 3 source files | — |

Frequency + priority-stated applicability → the strong signal is: **one-line positioning headline, dark+ muted body, scoped ≤0.3s motion, token-driven clamps, real capability list, work as a named list** — a restrained, precise, personal-technical voice. That is what the winner must embody (see 05-design-directions.md scoring).
