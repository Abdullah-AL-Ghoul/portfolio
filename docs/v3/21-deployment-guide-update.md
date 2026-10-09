# V3 Deployment Guide Update

This doc captures what changes for **deployment** because of the V3 wave. The base guide remains the root `DEPLOYMENT.md` (updated below with a V3 wave section).

## What's new to deploy in V3

1. **New migration file — must be applied manually first.** `supabase/migrations/0003_services_profiles.sql` adds the `services` and `professional_profiles` tables, partial indexes, RLS policies, and seeds 3 published services. Run it in the **Supabase SQL Editor** (DDL cannot be run by the workflow). Policies are `if not exists` so an accidental re-run won't error, but the header still says run once. Until it runs, `/api/content` degrades gracefully: `services: []`, `professional_profiles: []` (api/content.js safeFetch wrappers), the public sections stay hidden, and the dashboard pages show empty states.
2. **Admin dashboard must be redeployed** to pick up the new Services / Freelance Profiles pages, the assistant schema, and the analytics breakdowns (admin/dist rebuild). The public site needs a normal deploy too (static files + api/ functions). **Order doesn't matter for safety:** before 0003 runs, the public site renders exactly as before (sections hidden); after 0003 runs, content appears automatically.
3. **Service worker**: cache is already bumped v6→v10 in the source, so returning visitors get the new design once deployed — no extra step.
4. **Nothing was deployed in this wave.** Both live URLs still serve the pre-V3 build; all verification was local.

## What didn't change

- No new environment variables. No new npm dependencies on the public site. No Vercel project changes. The `/_vercel/insights` tag was removed (it 404'd); re-add only if the Web Analytics addon is actually enabled (index.html comment).
- Storage, CV handling, auth setup, env vars — all identical to the existing DEPLOYMENT.md instructions.
