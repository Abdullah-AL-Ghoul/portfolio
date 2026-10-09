# DEPLOYMENT — Abdullah Portfolio V2

## Two deployments
| App | Folder | Build | Vercel project |
|-----|--------|-------|----------------|
| Public site | `/` (root) | static, no build step | existing deployment (abdullah-portfolio26) |
| Admin dashboard | `/admin` | `npm run build` → `admin/dist` | a **separate** new Vercel project (e.g. abdullah-portfolio-admin) |

Both talk to the same Supabase project (one Postgres, two RLS roles).

## Supabase setup (once)

1. Create a new Supabase project (free tier is enough). Region closest to your audience.
2. In **SQL Editor**, run in order:
   1. `supabase/migrations/0001_schema.sql`
   2. `supabase/migrations/0002_storage.sql` (or create `media` (public) and `cv` (private) buckets in Storage UI if SQL complains)
   3. `supabase/seed.sql` — replaces every hardcoded site content with the verified current content
3. In **Authentication → Users**, create one user with your email + a strong password.
4. In **SQL Editor**, run:
   ```sql
   insert into public.admin_users (user_id, email)
   values ('<auth.users.id of the user you just created>', 'your@email');
   ```
5. In **Project Settings → API**, copy:
   - Project URL
   - `anon` key
   - `service_role` key (treat as a real secret)

## Environment variables

### Public site (root project, Settings → Environment Variables)
| Variable | Value |
|----------|-------|
| `SUPABASE_URL` | `https://<project>.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | publishable key (`sb_publishable_...`) |
| `SUPABASE_SECRET_KEY` | secret key (`sb_secret_...`) — treat as a real secret |
| `LLM_API_KEY` *(optional)* | same as before |
| `LLM_API_URL`, `LLM_MODEL` *(optional)* | same as before |

Never add the service-role key to the public HTML/JS bundle.

### Admin dashboard (new project, Settings → Environment Variables + Root Directory `admin`)
| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | same Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | publishable key (`sb_publishable_...`) |

## Deploy

### Public site
Already deployed. Next push is deployed automatically, or in the Vercel dashboard click Deploy.
Required: the three `SUPABASE_*` env vars above. Without them the site still works (static fallback), but contact/analytics/CMS stay on the static path.

### Admin dashboard (new project)
1. Vercel → New Project → Import the same repo.
2. Override **Root Directory** to `admin`.
3. Framework preset: Vite (auto). Build command: `npm run build`, output directory: `dist`.
4. Add the two `VITE_SUPABASE_*` env vars (all environments).
5. Deploy. The dashboard ships with `X-Robots-Tag: noindex` + `robots.txt: Disallow: /` + meta robots `noindex`.
6. Sign in with the user you created above.

## No extra build for the public site
`index.html + analytics.js + cms.js + sw.js + styles.css` are served statically.
`/api/*` runs as Vercel serverless functions (Node.js, `api/`).

## Storage / media / CV
- Bucket `media` — public, admin-only writes.
- Bucket `cv` — private, served only through `GET /api/cv-download` (counts downloads + issues a 60s signed URL).
- If the dashboard is unreachable, the bundled `assets/Abdullah_ALGhoul_CV.pdf` continues to be served.

## How to go live
1. Test locally with `python -m http.server` (public site) and `npm run dev` in `admin/` (dashboard: http://localhost:5173, against your live Supabase is fine).
2. Push `develop` → `main`, connect main to both Vercel projects. Deploy both.
3. Smoke-test: public landing, language toggle, case-study modals, contact form (submit once), CV download, language persist. Then dashboard: login, edit a project, publish, verify the public page refreshed with it, check audit log.

## Analytics retention
A helper is included: `public.analytics_retention()` deletes `analytics_events` older than 90 days. Schedule it in Supabase (Cron → `select public.analytics_retention();` daily or weekly via pg_cron) or call it manually.

---

# V3 wave (services + freelance profiles)

## New migration — run manually BEFORE relying on the new sections
`supabase/migrations/0003_services_profiles.sql` — adds `services` and `professional_profiles` tables (with RLS: anon read only published/active rows; admin full access via `is_admin()`), partial indexes, and seeds 3 published services (Full-Stack Web Applications, Business Dashboards & Admin Panels, AI-Powered Web Applications). **Run it in the Supabase SQL Editor** — DDL cannot be executed by tooling. Until it runs, `/api/content` returns `services: []` / `professional_profiles: []` and both new public sections stay hidden (by design). Re-runs are safe (`if not exists` / `on conflict (slug) do nothing`) though the header says run once. Zero freelance profiles are seeded on purpose — add real ones via the dashboard.

## Dashboard redeploy note
The admin project must be redeployed to get the new Services / Freelance Profiles CRUD pages and the analytics breakdowns (service CTA clicks, freelance profile clicks, hire-me tile). No new env vars; just redeploy the `admin` root-directory project. Deploy the public site the same way as before (static + api/ functions); the service-worker cache is already bumped to v10 in source.

## Nothing was deployed in the V3 wave
The live site and admin still serve the pre-V3 build. All V3 changes exist on the `develop` working tree (uncommitted). After deploying, verify: the two new sections appear once 0003 is applied and services/profiles rows exist, the dashboard's /services and /profiles pages work, and the new analytics breakdowns populate as events fire.
