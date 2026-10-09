# V3 Database Model

## Tables (as of migration 0003)

Read this session from `supabase/migrations/0001_schema.sql` (grep of `create table` lines) and the full `0003_services_profiles.sql`:

**0001 (content):** `admin_users`, `site_settings`, `about_profile`, `projects`, `skills`, `skill_categories`, `certifications`, `experiences`, `recommendations`, `social_links`, `media_assets`, `cv_versions`, `contact_messages`.
**0001 (analytics/system):** `anonymous_visitors`, `visitor_sessions`, `analytics_events`, `audit_logs`.
**0003 (this wave):** `services`, `professional_profiles`.

## services (0003_services_profiles.sql:12-31)

| Column | Type | Notes |
|---|---|---|
| id | uuid PK default gen_random_uuid() | |
| slug | text unique NOT NULL | card key + analytics event_target |
| title_en / title_ar | text NOT NULL | bilingual, separate columns (pinned contract) |
| summary_en / summary_ar | text, default '' | |
| features | jsonb default '[]' | array of `{en, ar}` objects |
| technologies | text[] default '{}' | rendered as chips |
| related_project_keys | text[] default '{}' | **project legacy_keys ('p1'..'p7'), NOT slugs** — rendering joins against `.project-card[data-project]` (cms.js `present` map) |
| icon | text default 'layers' | lucide name; seeded: layers, layout-dashboard, brain |
| cta_label_en / cta_label_ar | text, defaults 'Discuss a project' / 'اطلب مشروعاً' | empty string on a row → i18n fallback (`services.cta`) |
| status | text check in ('draft','published','archived'), default 'draft' | |
| sort_order, deleted_at, created_at, updated_at | | soft delete per 0001 convention |

Index: `services_public_idx on (status, sort_order) where deleted_at is null` (0003:31).

## professional_profiles (0003:34-52)

| Column | Type | Notes |
|---|---|---|
| platform | text check in ('upwork','khamsat','mostaql','freelancer','contra','linkedin','custom') | also the card's `data-profile` key |
| display_name (NOT NULL), username, profile_url | text | profile_url default '' — empty-URL rows never reach the public site (API WHERE + RLS + cms.js guard) |
| title_en/ar, description_en/ar | text default '' | |
| icon | text default 'briefcase' | |
| is_active, is_featured | boolean | is_active + display_order drive the public list |
| display_order, deleted_at, timestamps | | soft delete per convention |

Index: `profiles_list_idx on (is_active, display_order) where deleted_at is null` (0003:52).

## RLS model (0003:54-74)

Both tables: RLS enabled; policies mirror the 0001 template (`%1$s_public_read/admin_read/admin_write`), and the anon-read WHERE shapes match `/api/content` exactly:

- `services_public_read` — `for select to anon using (status='published' and deleted_at is null)` (0003:62-63)
- `professional_profiles_public_read` — `is_active and deleted_at is null and profile_url <> ''` (0003:69-70)
- Admin: `{table}_admin_read` (select for authenticated via `is_admin()`) and `{table}_admin_write` (`for all ... with check (public.is_admin())`) — same shape as 0001:371-376.
- Policy names to expect: `services_public_read`, `services_admin_read`, `services_admin_write`, `professional_profiles_public_read/admin_read/admin_write`. All are `create policy if not exists`, so re-runs are safe even though the header still says "run once" (0003:3).

## Seed

- Exactly 3 published services (`status='published'`, sort_order 1–3), `on conflict (slug) do nothing` (0003:125). Original bilingual copy; `related_project_keys` are real legacy_keys from supabase/seed.sql: full-stack→{p1,p4}, dashboards→{p5,p6}, ai-web→{p3,p7} (0003:77-80 comment).
- **Zero `professional_profiles` rows** — a platform appears only once a real, verified profile exists (0003:127-128 comment). The freelance section stays hidden until the user adds real profiles via the dashboard.

## ⚠ Pending user action

**Migration 0003 has NOT been applied.** DDL cannot be executed from this session. Until it is run in the Supabase SQL Editor, `/api/content` returns `services: []` and `professional_profiles: []` (the `safeFetch` wrappers at api/content.js:41-46 catch the missing-table error), so the public sections stay hidden and the dashboard pages will show an empty/error state. Steps: Supabase → SQL Editor → paste `supabase/migrations/0003_services_profiles.sql` → run once. The 3 seeded services surface immediately after (status='published').

## Contract notes

- The pinned `/api/content` contract uses separate `_en`/`_ar` DB columns — NOT the CrudPage `localized` `{en,ar}` JSON type (that would break the contract; flagged as a judgment call in the wave handoff, and the schemas therefore use separate text fields).
- `features` is a jsonb array of `{en, ar}` objects; `related_project_keys` are legacy_keys ('p1'..'p7'), not slugs.
- Retention: `public.analytics_retention()` deletes `analytics_events` older than 90 days (DEPLOYMENT.md:77) — unchanged by V3.
