# Abdullah Portfolio V2 — Platform upgrade

Two apps, one Postgres — the way V2 was designed to run.

| App | URL | Source |
|-----|-----|--------|
| Public site | https://abdullah-portfolio26.vercel.app | `index.html` (static, no build) |
| Admin dashboard | new project — e.g. `abdullah-portfolio-admin.vercel.app` | `admin/` (React + Vite SPA, noindex) |

## Quick start

**Public site — no build, no `npm install`:**
```bash
python -m http.server
# open http://localhost:8000
```

**Admin dashboard:**
```bash
cd admin
npm install
npm run dev    # http://localhost:5173
```

The public site works identically with or without a backend (graceful degradation):
no Supabase configured → the site ships its static content, the contact form falls back to mailto, and the dashboard is unreachable — but nothing breaks.

With Supabase (see [DEPLOYMENT.md](DEPLOYMENT.md)), the same public site becomes CMS-driven,
the contact form writes to your inbox, and the dashboard controls everything.

## What's new in V2
- **Projects** now have a true hierarchy: a primary featured row (full-width hero treatment), secondary featured cards, then the rest — no longer a flat grid.
- **Case studies** deep-dive when you need them: the quick Problem → Solution → Result triptych is always visible, and dashboard-managed implementation/challenge details expand with a click.
- **Contact form** no longer depends on a third party: it validates server-side, rate-limits, honeypots bots, stores every submission in a lightweight inbox (New → In Review → Replied → Archived), and falls back to mailto if the backend is absent.
- **CV is now versioned:** every upload is kept; the active published version is the only one the public ever downloads. If no version is active, the bundled `assets/Abdullah_ALGhoul_CV.pdf` continues to be served. Every download is counted.
- **Privacy-preserving analytics:** anonymous visitor + session IDs (no cookies, no fingerprinting), only coarse country/region from the host's geo header, device/browser/host from the visited-once User-Agent. Nothing invasive, everything useful in the dashboard.
- **A complete dashboard** for the owner: Overview, Projects/Skills/Certifications/Experience/Recommendations (full CRUD with draft/publish/archived + trash → restore → hard-delete), About + Settings (single JSON documents), Media + CV, Messages inbox, Analytics, Audit Log.

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for the two-project setup and env steps.
