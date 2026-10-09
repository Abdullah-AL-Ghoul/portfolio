# V3 Performance Report

## Baseline ("before") — LIVE, quoted from the recon audit

From `docs/v3/01-recon-audit.md` (LIVE https://abdullah-portfolio26.vercel.app, desktop 1440×900, Chromium, **single run**, 2026-10-08):

| Metric | Value |
|---|---|
| domInteractive | 3681.5 ms |
| domContentLoaded | 4724.8 ms |
| load | 5093.7 ms |
| First Contentful Paint | 5588 ms |
| Main document transfer | 17,276 B (85,410 B decoded) over h2 |

The audit's own caveat applies: single sample, one geography, cold cache; the document is ~17 KB over the wire, so the ~5 s timings are **network-RTT dominated, not payload** — "re-measure before setting budgets."

## "After" measurement — LOCAL ONLY, clearly labeled

**Environment:** this session, local static server (`node tests/serve.mjs 8931`), Chromium via Playwright 1.63, viewport 1440×900, 3 consecutive runs, `performance.getEntriesByType('navigation')` + paint entries:

| Run | domInteractive | domContentLoaded | load | FCP | doc transfer | doc decoded |
|---|---|---|---|---|---|---|
| 1 | 65.0 ms | 571.9 ms | 579.7 ms | 876 ms | 88,779 B | 88,479 B |
| 2 | 289.7 ms | 560.8 ms | 561.6 ms | (no paint entry on repeat nav) | 88,779 B | 88,479 B |
| 3 | 51.4 ms | 167.5 ms | 168.1 ms | (no paint entry on repeat nav) | 88,779 B | 88,479 B |

**This is NOT comparable to the live baseline.** It is localhost (no network RTT), no CDN, and the local server serves the document uncompressed (transfer ≈ decoded), whereas Vercel compressed the pre-V3 document to 17,276 B. The only defensible conclusions from it: (a) parse/execute time for the grown HTML+CSS+JS is sub-second; (b) nothing in the wave introduced a script-level stall.

## Payload delta (byte counts, measured this session with `wc -c` vs `git show HEAD`)

| File | HEAD (pre-wave) | Working tree | Δ |
|---|---|---|---|
| index.html | 85,410 B | 88,479 B | +3,069 B (+3.6%) |
| styles.css | 116,916 B | 135,857 B | +18,941 B (+16.2%) |
| script.js | 176,609 B | 182,441 B | +5,832 B (+3.3%) |
| cms.js | 13,654 B | 21,389 B | +7,735 B (+56.7%) |
| sw.js | 3,329 B | 3,330 B | ~0 |

styles.css grew mostly from new services/profiles components + theme-safety rules; cms.js from the two render modules. Fonts: the only request change is **Instrument Sans added as a variable face to the existing Google Fonts URL** (one stylesheet request, same preload/media=print pattern — index.html diff), within the §08 §1.4 ≤100 KB EN+AR budget intent. Motion cost went *down* by design: `.hero-blobs` was deleted (styles.css diff hunk @@-681) and hovers were flattened, per winner A's "subtracts blobs and sheen rather than adding surface."

## What was NOT measured — stated plainly

- **No live "after" numbers.** Nothing was deployed in this wave, and the live site still serves the pre-V3 build. Any live-vs-live comparison is impossible until the next deploy.
- No Lighthouse/CWV lab run (audit also did not run it; no lab tooling available in this environment).
- No multi-geography or cold/warm-cache live sampling; no LCP/CLS/INP field data.
- Single-run caveat from the baseline still applies to any timing above.
- Recommendation stands: re-measure live after deploy before adopting perf budgets (audit P2-06).
