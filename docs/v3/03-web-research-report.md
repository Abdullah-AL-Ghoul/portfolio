# V3 Web Research Report

Consolidates the three research matrices in `docs/v3/research/` (refs-product.md, refs-tools.md, refs-portfolios.md). Method for all three: real headless Chromium via Playwright 1.63 at the repo root, desktop 1440×900 + mobile 390×844, DOM/computed-style extraction, screenshots saved as evidence-only files (never re-read). All 15 references rendered (HTTP 200, none bot-walled); no WebFetch fallback was needed.

## What was studied

15 live references in three groups:

- **Product/tech sites** (refs-product.md): vercel.com, stripe.com, linear.app, notion.com, github.com — all P0–P2 rows extracted from live DOM probes (`gui-test-screenshots/v3-research/capture-log.json`).
- **Design/dev platforms** (refs-tools.md): figma.com, framer.com, webflow.com, raycast.com, supabase.com — raw JSON per site in `gui-test-screenshots/v3-research/<name>-analysis.json`.
- **Portfolios & studios** (refs-portfolios.md): brittanychiang.com, leerob.io, rauno.me, basement.studio, darkroom.engineering — facts per site in `<name>.facts.json`.

## What was observed (strongest measured patterns)

1. **One-line hero positioning beats a name.** basement's 87px statement hero and darkroom's dictionary-definition hero assert a stance in one breath (refs-portfolios.md §1, P0 rows).
2. **Huge tight-tracked display headlines** — 64–96px, negative letter-spacing, weight 400–510 (Vercel -3.84px @64px; Linear 64px/510/-1.408px; GitHub 64px/-2.24px) (refs-product.md matrix).
3. **Dark canvas + white primary CTA + translucent secondary** — Framer (pure black, white CTA) and Raycast (#07080a) prove the "engineering" hero look (refs-tools.md).
4. **Muted secondary text on dark** — brittanychiang's slate-blue rgb(148,163,184) body on navy keeps hierarchy calm (refs-portfolios.md, P0).
5. **Scoped hover transitions** — Stripe restricts to `color/background-color/border-color`; Linear to `color/background`; GitHub/Vercel use blanket `all` (refs-product.md cross-cutting #3).
6. **Tokens everywhere** — Raycast's 8px spacing/rounding scale, Figma's named type/spacing props, Webflow's `clamp()` rhythm (refs-tools.md).
7. **Work as a scannable single-column list** (brittanychiang) and **capability/services grids** (basement, Supabase 6-card grid) set hiring expectations without fabricated proof.
8. **Mono/terminal accents for labels** (darkroom) and **one-line section overlines** (brittanychiang `// About` comments).

## What was adopted

- **One-line positioning hero** and mono `//` overlines: shipped — eyebrows changed from `01 · About` to `// About` (`//` in EN, `#` in AR) across all sections (script.js i18n diff: about/skills/proj/certs/exp/test/contact eyebrows; index.html eyebrow spans).
- **Dark near-black canvas + single cyan accent**: dark `--bg` → `#08090a`, `--text` → `#f7f8f8`, `--text-dim` → `#8b93a7`, `--accent` → `#35c4e8` (08-design-system.md §2, citing Linear P0 + brittanychiang P0).
- **Tight-tracked display face**: Instrument Sans variable face added to the font URL for display lines (index.html diff), Inter kept for body — breaks "Inter-only flatness" without a second font payload request.
- **Scoped hovers + flat surfaces**: contact form, contact list, footer flattened (no glass, no sheen); hover transitions scoped to border+shadow at 150ms; hover effects gated inside `(hover:hover) and (pointer:fine)` (stage 3b).
- **Related-project links on service cards** and a real services list (basement/darkroom "capabilities" pattern) → the seeded services in migration 0003.
- **Footer/stack disclosure, honest trust**: rejected every logo wall and stat strip that would require fabrication.

## What was rejected, and why

| Pattern | Source | Why rejected |
|---|---|---|
| Client/logo marquees ("Trusted by…") | Notion, GitHub, basement (~40-logo bar) | HARD RULE: never fabricate client names. Basement's trust bar would require invented clients (refs-portfolios.md "Deliberately excluded"). |
| Quantified metric cards ("$200M pipeline", "95% of Fortune 500") | Webflow, Figma | The numbers are the *references'* real data, not ours; adopting the pattern without real numbers = fabrication (refs-product.md explicit non-transfers; refs-tools.md method note). |
| Live GitHub-star trust chip | Supabase | Requires a genuine, self-updating counter tied to a real repo stat; not implemented in this wave. |
| Customer-strip / newsletter capture | GitHub | Contact form retained as the single conversion point; newsletter is extra scope and invites a 0-subscriber surface. |
| Music toggle, video-only project cards | basement, darkroom | Off-brand/heavy without real video assets (refs-portfolios.md excluded list). |
| Light-weight editorial hero type (Stripe 48px w300) | Stripe | Not the brand voice; weight 500–600 dark display chosen instead (refs-product.md Stripe row). |

## Provenance

- `docs/v3/research/refs-product.md` — vercel/stripe/linear/notion/github, captured via `node .zcode/tmp-v3/research-capture.mjs` family scripts + `hover-probe.mjs`.
- `docs/v3/research/refs-tools.md` — figma/framer/webflow/raycast/supabase, via `.agents/research-inspect.mjs` (Supabase CTA colors via a second targeted pass, `.agents/cts.mjs`).
- `docs/v3/research/refs-portfolios.md` — brittanychiang/leerob/rauno/basement/darkroom, same Playwright method, facts JSON per site.
- All screenshots are evidence-only files in `gui-test-screenshots/v3-research/` (never re-read per constraint; analysis is from DOM probes).
