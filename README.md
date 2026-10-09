# Abdullah Ayman AL-Ghoul — Portfolio

Bilingual (EN/AR) personal portfolio for a full-stack web developer.
Vanilla HTML/CSS/JS, no build step, PWA with offline support, 5 themes
(dark default), an AI assistant, and an optional Supabase-backed CMS.

**Live:** https://abdullah-portfolio26.vercel.app

## How it runs

The public site is fully static and works with or without a backend:

- **No Supabase configured** — the site ships its static content, the contact
  form falls back to `mailto:`, and nothing breaks.
- **With Supabase** — the same site becomes CMS-driven (projects, skills,
  certifications, services and freelance profiles come from Postgres) and the
  contact form stores submissions server-side.

## Local preview

No build, no `npm install`:

```bash
python -m http.server
# open http://localhost:8000
```

## Layout

| Path | Purpose |
|------|---------|
| `index.html`, `styles.css`, `script.js` | The public site |
| `cms.js` | Binds Supabase content into the DOM (graceful degradation) |
| `analytics.js` | Privacy-preserving, cookie-less analytics |
| `sw.js`, `manifest.webmanifest` | PWA offline shell |
| `api/` | Vercel serverless functions (`/api/content`, `/api/contact`, `/api/track`, `/api/chat`, `/api/cv-download`) |
| `supabase/migrations/` | Postgres schema, storage and RLS policies (`0001`–`0003`) |
| `assets/` | CV, certificates, icons and imagery |
| `vercel.json` | Headers, caching and clean-URL config |

## Deployment

Deployed on Vercel as a static site with serverless functions; content lives in
Supabase. Environment variables (`SUPABASE_URL`, `SUPABASE_SECRET_KEY`, etc.) are
configured in the Vercel project — see `.env.example` for the full list.