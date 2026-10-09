# Design Research — Premium Portfolios & Studios

**Method.** Each reference was inspected in a real headless Chromium browser via Playwright (repo-root Playwright 1.63): desktop viewport 1440x900 + mobile 390x844, realistic user-agent with `navigator.webdriver` masked, ~3s wait after load, full-page screenshots written to `gui-test-screenshots/v3-research/<name>.png` and `-mobile.png`. All analysis was done through DOM queries (`page.evaluate`: computed styles, selector counts, innerText) — screenshots are evidence-only files and were never re-read. **5 of 5 references inspected in-browser** (all returned HTTP 200, none bot-walled; no WebFetch fallback needed). Facts are stored alongside as `gui-test-screenshots/v3-research/<name>.facts.json`.

All metrics below are measured values from the live pages, not editorial claims.

---

## 1. brittanychiang.com — Brittany Chiang (personal developer portfolio)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| brittanychiang | Personal dev portfolio | Fixed header: left logo "Brittany Chiang", center section links (About/Experience/Projects), right GitHub/LinkedIn/CodePen/Instagram/Goodreads icon row (no burger at desktop) | Classic studio-worthy chrome; navigation cost ~0; every key section visible without JS | Yes — Abdullah has nav + bilingual switch already | Keep left/center/right split; keep socials right | P1 |
| brittanychiang | Personal dev portfolio | Hero is one short line: "Hi there! I'm Brittany, and I like building things" + 2-line positioning ("frontend engineer, accessible + pixel-perfect UI"); h1 48px/48px 700 Inter; body text slate-blue rgb(148,163,184) on dark navy rgb(15,23,42) | Announces person + exact niche in <60 words; hierarchy via weight/size, not color; low-contrast muted body keeps calm | Yes — maps to "Dark Precision Engineering" | Write a 1-line "what I do / why" lockup; muted secondary text color over dark bg | P0 |
| brittanychiang | Personal dev portfolio | Experience rendered as **1-column bordered rows** (role · org — dates: "Senior Frontend Engineer, Accessibility · Klaviyo"), not cards | Scannable timeline; credit reads as substance | Yes — Abdullah's work section | Show projects/roles as a single detail column with dotted/border separators | P1 |
| brittanychiang | Personal dev portfolio | Projects shown as a **1-column list of named projects**, each with 1-line scope + stack tags (Spotify Connected App, Halcyon Theme …) | Lets the work name carry weight; tags convey skill breadth | Yes — Abdullah has Supabase-driven projects from admin | Project = name + one-line scope + tag row, list layout (bulk-friendly) | P1 |
| brittanychiang | Personal dev portfolio | Small-caps / dimmed section labels stated like code comments ("// About") | Quietly signals "engineer made this" | Yes — on brand | Prefix section labels with a dimmed comment/overline style | P3 |
| brittanychiang | Personal dev portfolio | Footer is itself a trust line: "Loosely designed in Figma and coded in VS Code by yours truly. Built with Next.js and Tailwind… deployed with Vercel"; 0 imgs in page body beyond icons, 0 forms, 9 imgs total (icons/OG) | Stack + tooling disclosure is authentic proof of craft | Yes — honest, no fabricated clients | Footer line listing what it's built on (no invented metrics) | P2 |

## 2. leerob.io — Lee Robinson (developer / writer)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| leerob | Developer portfolio/blog | **Headerless** page: top is a bio card "@leerob — I'm an engineer and writer… I've been coding 15 years…"; h1 42.4px/48.76px 600 in an old-style serif (Iowan Old Style / Palatino), white bg rgb(255,255,255), body text rgb(40,40,40); 0 images, 0 nav links, 0 forms | Pure content-first personality; zero chrome leaves nothing to distract from the person | Somewhat — Abdullah needs a nav + bilingual switch, so full headerless doesn't fit | Borrow the "personal statement + one paragraph bio" as hero copy; keep nav for utility | P2 |
| leerob | Developer portfolio/blog | Whole page is short (docHeight ≈1220–1639px): bio + two link lists "Notes" and "Blogs" | Content depth chosen deliberately; short page = low friction | Partially — Abdullah is project-heavy, needs more length | Not a full-page fit; user, don't shrink the site | P3 |
| leerob | Developer portfolio/blog | Bio **length toggle** (Default / Long buttons — "BioDefaultLong") | Reader self-selects context / TL;DR | Interesting micro-pattern | Could offer AR/EN or a "short/long bio" toggle in About | P3 |
| leerob | Developer portfolio/blog | Transitions kept tiny: 0.16s color, 0.3s opacity | Motion is a whisper, never attention-grabbing | Yes — matches "restrained purposeful motion" | Keep link/fade transitions ≤0.3s | P2 |

## 3. rauno.me — Rauno Freiberg (interaction designer)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| rauno | Experimental creative portfolio | Massive display typography as the whole interface; no images anywhere (0 img, 0 video) — the site is a long **list of link rows** ("DD", "Craft", "History of Software Design", "Projects", "Field Notes", "2022/2023") | Type *is* the artifact; extreme restraint reads as confident craft | Yes conceptually — pure-type on brand | A "field notes / writing" list of understated text links | P2 |
| rauno | Experimental creative portfolio | Custom headline font "X" h1 32px/normal 500; body font X/-apple-system/system-ui; bg soft all-grey rgb(237,237,237), black text | Near-monochrome palette = zero noise | Partially — Abdullah has 5 themes + AR | Pull "monochrome + one display face" into one theme, not globally | P3 |
| rauno | Experimental creative portfolio | Desktop `docHeight` ≈6108px scroll of a flat link list; **mobile compresses to a single 844px screen** (docH 844) | Desktop invites scrolling exploration; mobile is instant-access index | Interesting responsive swap | On mobile, collapse work/writing to a compact list; desktop keeps full | P3 |
| rauno | Experimental creative portfolio | Short manifesto line in hero: "Make it fast. Make it beautiful. Make it consistent." | A 3-beat slogan = memorable stance | Yes — fits "Dark Precision Engineering" | Add a short 3-item principle line as a section tagline | P2 |

## 4. basement.studio — Basement (digital studio / branding powerhouse)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| basement | Creative studio | Massive bold headline h1 87px/78px 600 Geist on black rgb(0,0,0), white text: "A digital studio & branding powerhouse making cool shit that performs" | Full-viewport statement of *what it is* before anything else | Yes — big bold single-purpose hero | Make Abdullah's h1 a proud one-line positioning statement, not just a name | P0 |
| basement | Creative studio | "Trusted by Visionaries" **client-logo trust bar** (~40 images, 12-col grid) | Social proof via logo wall | **No** — HARD RULE: never fabricate client names/logos | Only if real clients exist; otherwise omit | n/a |
| basement | Creative studio | "Featured Projects" showcase grid + a "Capabilities" 36-row capability grid (Websites & Features / Visual Branding / IRL Experience / Marketing Execution) | Explicit services list sets expectation for who to hire | Yes — Abdullah can list service capabilities | Add a capabilities/offerings grid (services, not invented clients) | P1 |
| basement | Creative studio | Nav (Home/Services/Showcase/People/Blog/Lab/Machine) + mobile "Open menu" burger + a **music on/off toggle** button | Playful, memorable, on-brand gestures | No — music off-brand and heavy | Skip music toggle | n/a |
| basement | Creative studio | 2 newsletter forms (footer "Ready to tap into the basement vibe? Sign up…") | CTA = capture, not just contact | Partially | Keep Abdullah's single contact form; a newsletter is extra scope | P3 |
| basement | Creative studio | `grid:12x4` hero + 6-col tails; transition 0.3s all on interactive | Grid discipline produces ordered chaos | Yes | Use a constrained 12-col grid for section rhythm | P2 |

## 5. darkroom.engineering — Darkroom (creative technology / dev studio)

| Reference | Category | Observed pattern | Why it works | Applicable to Abdullah? | Adaptation | Priority |
|---|---|---|---|---|---|---|
| darkroom | Creative tech studio | **Definition-style hero**: "Where Things Get Developed / [ Darkroom ], noun / A lightproof room for developing photographs. / A studio engineering creativity into reality." h1 200px/160px 400 display face "therma", body set in ui-monospace "mono", bg black, orange accent lab(49.9 73.4 56.98) | Editorial device-positioning — explains the studio through its name as a dictionary entry | Yes — strongest creative frame for "Dark Precision Engineering" | Adapt hero to "noun/definition + one engineering value line" | P0 |
| darkroom | Creative tech studio | Project cards driven by **`<video>` loop previews** (4 videos, 0 images): Oreo & BTS, Looped, Ibicash | Motion previews sell interactive work better than stills | Yes — Abdullah has project work | Optionally let project cards use muted looping video/CSS motion instead of static img | P1 |
| darkroom | Creative tech studio | Products-as-side-nav on mobile (Satus / Lenis / Hamo / Tempus buttons); nav includes Work/About/Contact | Sells their own OSS tools alongside services | Partially | Reject if it means adding invented products; keep only genuine tools | P3 |
| darkroom | Creative tech studio | "Tools We Build and Use. Now Yours Too." + "Become an Open Source Sponsor" | OSS credibility = trust signal | Yes if genuine | Only if Abdullah has real open-source work; otherwise drop | P2 |
| darkroom | Creative tech studio | `grid:8x3` service/tech rows; mono labels throughout; `docHeight` 8609px deep editorial page | Mono type + grid = engineered precision (matches our brand) | Yes | Use mono/terminal accents for labels & metadata | P2 |

---

## Strongest transferable patterns (across all five)

1. **One-line hero positioning rather than a name** — basement (87px, "…making cool shit that performs") and darkroom ("noun / definition") show the best heroes say *what/who you are* in one breath; Abdullah's h1 should assert a stance, not just a name (P0).
2. **Dark + muted secondary text instead of flat contrast** — brittanychiang's slate-blue rgb(148,163,184) body on navy rgb(15,23,42) keeps hierarchy calm; direct fit for the dark "Dark Precision Engineering" themes (P0).
3. **Work as a scannable single-column list of named items + one-line scope + tags** (brittanychiang), not a bloated card wall — cheap to drive from the Supabase projects API and credible to read (P1).
4. **Restrained, whisper-level motion** — measured transition durs of 0.15s–0.3s across brittanychiang/leerob/rauno; matches the "restrained purposeful motion + prefers-reduced-motion" hard rule (P1).
5. **Editorial/definition device for framing** — darkroom's dictionary-noun hero and rauno's "Make it fast. Make it beautiful. Make it consistent." 3-beat principle line are memorable stances that transfer directly into the brand voice without fake data (P1).
6. **Mono/terminal accent for labels and metadata** (darkroom sets its whole body in ui-monospace) gives an "engineered" precision cue on-brand with the brand voice (P2).
7. **Capabilities/services grid** (basement's Capabilities section, darkroom's "Studio capabilities") sets clear hiring expectation — applicable as a real services list, unlike fabricated client logos which are excluded by HARD RULE (P1).
8. **Trust via stack/process disclosure** — brittanychiang's footer ("designed in Figma, coded in VS Code, built with Next.js/Tailwind, deployed on Vercel") is provable honesty; a stack line fits Abdullah without inventing anything (P2).

## Deliberately excluded
- **Client logo walls** (basement "Trusted by Visionaries") and fabricated testimonials/awards/counts — banned by HARD RULE (never fabricate clients/metrics/ratings); **music-toggle** gimmick and **video-only projects** are heavy and off-brand without real assets.
