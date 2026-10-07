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
| `SUPABASE_ANON_KEY` | anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
| `LLM_API_KEY` *(optional)* | same as before |
| `LLM_API_URL`, `LLM_MODEL` *(optional)* | same as before |

Never add the service-role key to the public HTML/JS bundle.

### Admin dashboard (new project, Settings → Environment Variables + Root Directory `admin`)
| Variable | Value |
|----------|-------|
| `VITE_SUPABASE_URL` | same Project URL |
| `VITE_SUPABASE_ANON_KEY` | anon key |

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
