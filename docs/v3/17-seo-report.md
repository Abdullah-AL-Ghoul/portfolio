# V3 SEO Report

Verified by reading the files this session (index.html head, sitemap.xml, robots.txt); no live crawl was performed (nothing deployed).

## Title / meta description (index.html:30-31)

- Title: "Abdullah Ayman AL-Ghoul · Full-Stack Web Application Developer" — 62 chars, unique, repositioned from "Computer Science Student". Mirrored in the ar dictionary ('meta.title', script.js).
- Description: "Portfolio of Abdullah Ayman AL-Ghoul — full-stack web application developer at Al-Azhar University building web apps, APIs, and practical AI integrations." — also in the ar dict ('meta.desc').

## Canonical + hreflang (index.html:34-37) — verified present

```html
<link rel="alternate" hreflang="en" href="https://abdullah-portfolio26.vercel.app/" />
<link rel="alternate" hreflang="ar" href="https://abdullah-portfolio26.vercel.app/?lang=ar" />
<link rel="alternate" hreflang="x-default" href="https://abdullah-portfolio26.vercel.app/" />
<link rel="canonical" href="https://abdullah-portfolio26.vercel.app/" />
```

Matches the web-quality-seo skill's bilingual rule (en/ar/x-default alternates + self-canonical). `html lang`/`dir` flip correctly on the AR toggle (e2e T2 passes).

## Open Graph / Twitter (index.html:42-58)

- og:type website, og:url, og:locale en_US + ar_PS alternate; og:image 1200×630 jpeg with alt — alt text repositioned to "Full-Stack Web Application Developer" this wave.
- Twitter summary_large_image card; descriptions updated in the same repositioning.

## Structured data (index.html:60-117)

Person schema: name, `jobTitle: "Full-Stack Web Application Developer"` (updated), description (updated), url, email, image, PostalAddress (Gaza, PS), alumniOf Al-Azhar University, knowsAbout (6 real skills), sameAs (LinkedIn + GitHub — real URLs). **New this wave:** `makesOffer` with 3 `Offer`/`Service` items — Full-Stack Web Applications, Business Dashboards & Admin Panels, AI-Powered Web Applications — descriptions matching the seeded services in migration 0003 (no fabricated offers; each maps to real projects p1–p7 per 0003's related_project_keys).

Per the web-quality-seo rule ("structured data only for visible, accurate content"), the three offers mirror visible seeded services; they will match what renders once 0003 is applied.

## sitemap.xml (read this session)

Two URLs: `/` (priority 1.0, lastmod 2026-10-07) and `/?lang=ar` (priority 0.9). Correct per the skill: only canonical, indexable URLs; no admin/api URLs listed.

## robots.txt (read this session)

```
User-agent: *
Allow: /

Sitemap: https://abdullah-portfolio26.vercel.app/sitemap.xml
```

Allows all + points at the sitemap. Admin is a separate project with its own noindex (X-Robots-Tag + Disallow + meta robots — DEPLOYMENT.md:59). All `/api/*` responses carry `X-Robots-Tag: noindex` (api/_lib.js:20).

## V3 wave deltas and residual notes

- The hard-coded `/_vercel/insights/script.js` tag was **removed** (index.html diff, audit P1-01) — eliminates the per-load 404 that search/QA tools would see in the console.
- **Stale lastmod:** sitemap.xml still says 2026-10-07 (pre-V3). It was not bumped this wave — flag for the next deploy (listed in 20-remaining-issues.md).
- `meta keywords` (index.html:33) is ignored by modern engines; harmless, left as-is.
- Single-page site: no per-page unique titles possible; the one title/description pair is the canonical page's — correct for this architecture.
