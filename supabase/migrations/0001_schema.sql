-- ============================================================
-- Abdullah Portfolio V2 — Schema 0001 (Supabase / PostgreSQL)
-- Principle: public read only for published rows; ALL writes
-- require an authenticated admin (RLS-enforced, not UI-enforced).
-- Analytics ingest happens only via service-role (serverless),
-- so anon has zero direct access to analytics tables.
-- ============================================================

create extension if not exists pgcrypto;

-- ---------- identity ----------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- ---------- helpers (defined after admin_users exists — SQL function bodies are validated at creation) ----------
create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.admin_users a where a.user_id = auth.uid()
  );
$$;

-- ---------- settings & about (singleton documents) ----------
create table if not exists public.site_settings (
  id            int primary key default 1 check (id = 1),
  site_title_en text not null default 'Abdullah Ayman AL-Ghoul · Portfolio',
  site_title_ar text not null default 'عبد الله أيمن الغول · معرض الأعمال',
  meta_description_en text not null default '',
  meta_description_ar text not null default '',
  og_image_path text,
  favicon_path  text,
  nav_labels    jsonb not null default '{}'::jsonb,
  footer_en     text not null default '',
  footer_ar     text not null default '',
  analytics_enabled boolean not null default true,
  feature_flags jsonb not null default '{}'::jsonb,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id)
);

create table if not exists public.about_profile (
  id         int primary key default 1 check (id = 1),
  data       jsonb not null default '{}'::jsonb, -- {headline, intro, paragraphs[], strengths[], education, location, languages[], focus} each {en,ar}
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- ---------- content ----------
create table if not exists public.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  legacy_key    text not null default '',        -- 'p1'..'p7' — matches existing static DOM keys
  title_en      text not null,
  title_ar      text not null,
  badge_en      text not null default '',        -- e.g. "Live", "Completed", "Concept Proposal"
  badge_ar      text not null default '',
  summary_en    text not null default '',
  summary_ar    text not null default '',
  stack         text[] not null default '{}',    -- technologies
  tags          text[] not null default '{}',
  cover_path    text,
  live_url      text,
  repo_url      text,
  extra_url     text,
  extra_url_label_en text not null default '',
  extra_url_label_ar text not null default '',
  case_study    jsonb not null default '{}'::jsonb,
  -- case_study: {problem:{en,ar}, approach:{en,ar}, implementation:{en,ar},
  --              outcome:{en,ar}, role:{en,ar}, architecture:{en,ar},
  --              features:[{en,ar}], challenges:[{en,ar}]}
  status        text not null default 'draft' check (status in ('draft','published','archived')),
  is_featured   boolean not null default false,
  featured_rank int  not null default 0,        -- 1 = primary featured
  sort_order    int  not null default 0,
  published_at  timestamptz,
  deleted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id)
);
create index if not exists projects_public_idx on public.projects (status, is_featured desc, sort_order) where deleted_at is null;

create table if not exists public.skills (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  name_ar       text,
  category      text not null,                   -- key into skill_categories.key
  tier          int check (tier between 1 and 4),-- optional, only if supportable
  note_en       text not null default '',
  note_ar       text not null default '',
  related_projects text[] not null default '{}', -- project slugs
  enabled       boolean not null default true,
  sort_order    int not null default 0,
  deleted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id)
);
create index if not exists skills_list_idx on public.skills (category, sort_order) where deleted_at is null;

create table if not exists public.skill_categories (
  key       text primary key,
  label_en  text not null,
  label_ar  text not null,
  icon      text not null default 'code-2',
  sort_order int not null default 0
);

create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title_en       text not null,
  title_ar       text not null,
  issuer_en      text not null default '',
  issuer_ar      text not null default '',
  issued_on      text not null default '',       -- "Mar 2026" / "2025" — as verified
  credential_url text,
  credential_id  text,
  image_path     text,                            -- storage path
  icon           text not null default 'badge-check',
  relevance_en   text not null default '',
  relevance_ar   text not null default '',
  sort_order     int not null default 0,
  status         text not null default 'published' check (status in ('draft','published','archived')),
  deleted_at     timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users(id)
);
create index if not exists certs_list_idx on public.certifications (sort_order) where deleted_at is null;

create table if not exists public.experiences (
  id          uuid primary key default gen_random_uuid(),
  kind        text not null check (kind in ('employment','internship','independent','academic','volunteer')),
  title_en    text not null,
  title_ar    text not null,
  org_en      text not null default '',
  org_ar      text not null default '',
  period_en   text not null default '',
  period_ar   text not null default '',
  summary_en  text not null default '',
  summary_ar  text not null default '',
  details_en  text[] not null default '{}',
  details_ar  text[] not null default '{}',
  links       jsonb not null default '[]'::jsonb, -- [{label_en,label_ar,url}]
  sort_order  int not null default 0,
  status      text not null default 'draft' check (status in ('draft','published','archived')),
  deleted_at  timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  updated_by  uuid references auth.users(id)
);

create table if not exists public.recommendations (
  id            uuid primary key default gen_random_uuid(),
  person_name   text not null,
  role_en       text not null default '',
  role_ar       text not null default '',
  org_en        text not null default '',
  org_ar        text not null default '',
  relationship  text not null default '',        -- e.g. "Lecturer", "Teammate"
  quote_en      text not null,
  quote_ar      text not null,
  avatar_path   text,
  profile_url   text,
  recommended_on date,
  is_featured   boolean not null default false,  -- strongest one shown prominently
  sort_order    int not null default 0,
  status        text not null default 'draft' check (status in ('draft','published','archived')),
  deleted_at    timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users(id)
);

create table if not exists public.social_links (
  id         uuid primary key default gen_random_uuid(),
  platform   text not null,          -- email | linkedin | github | custom
  url        text not null,
  label_en   text not null default '',
  label_ar   text not null default '',
  icon       text not null default 'globe',
  sort_order int not null default 0,
  enabled    boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

-- ---------- media & cv ----------
create table if not exists public.media_assets (
  id         uuid primary key default gen_random_uuid(),
  bucket     text not null,
  path       text not null unique,
  mime       text not null,
  size_bytes bigint not null,
  width      int,
  height     int,
  alt_en     text not null default '',
  alt_ar     text not null default '',
  used_by    text not null default '',   -- e.g. "projects:<slug>" for cleanup
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id)
);
create index if not exists media_used_by_idx on public.media_assets (used_by);

create table if not exists public.cv_versions (
  id             uuid primary key default gen_random_uuid(),
  storage_path   text not null,
  version_label  text not null,
  is_active      boolean not null default false,
  is_published   boolean not null default true,
  file_size      bigint not null default 0,
  download_count int not null default 0,
  notes          text not null default '',
  uploaded_at    timestamptz not null default now(),
  uploaded_by    uuid references auth.users(id)
);
create index if not exists cv_active_idx on public.cv_versions (is_active) where is_active;

-- ---------- contact inbox ----------
create table if not exists public.contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  visitor_id  uuid,                        -- linked only when the visitor id exists; identity comes from the form itself
  status      text not null default 'new' check (status in ('new','in_review','replied','archived')),
  starred     boolean not null default false,
  notes       text not null default '',
  source_country text not null default '', -- coarse, from Vercel geo header
  created_at  timestamptz not null default now(),
  read_at     timestamptz,
  archived_at timestamptz
);
create index if not exists contact_status_idx on public.contact_messages (status, created_at desc);

-- ---------- analytics (privacy-preserving) ----------
create table if not exists public.anonymous_visitors (
  id             uuid primary key,          -- client-generated UUID (localStorage)
  first_seen     timestamptz not null default now(),
  last_seen      timestamptz not null default now(),
  session_count  int not null default 0,
  device         text not null default 'unknown',
  browser        text not null default '',
  os             text not null default '',
  country        text not null default '',  -- coarse (Vercel geo country code)
  region         text not null default '',
  referrer_domain text not null default '',
  is_returning   boolean not null default false,
  identified_name  text,                    -- ONLY from a voluntary contact submission
  identified_email text,                    -- ONLY from a voluntary contact submission
  identified_at  timestamptz
);
create index if not exists visitors_last_seen_idx on public.anonymous_visitors (last_seen desc);

create table if not exists public.visitor_sessions (
  id          uuid primary key,             -- client-generated session UUID
  visitor_id  uuid not null references public.anonymous_visitors(id) on delete cascade,
  started_at  timestamptz not null default now(),
  last_seen   timestamptz not null default now(),
  page_count  int not null default 0,
  entry_page  text not null default '',
  exit_page   text not null default '',
  referrer    text not null default '',
  utm         jsonb not null default '{}'::jsonb,
  device      text not null default 'unknown',
  browser     text not null default '',
  os          text not null default '',
  country     text not null default '',
  region      text not null default ''
);
create index if not exists sessions_last_seen_idx on public.visitor_sessions (last_seen desc);
create index if not exists sessions_visitor_idx on public.visitor_sessions (visitor_id);

create table if not exists public.analytics_events (
  id          bigint generated always as identity primary key,
  visitor_id  uuid,
  session_id  uuid,
  event_type  text not null,
  event_target text not null default '',    -- slug / url / label
  page_path   text not null default '',
  ts          timestamptz not null default now(),
  meta        jsonb not null default '{}'::jsonb
);
create index if not exists events_type_ts_idx on public.analytics_events (event_type, ts desc);
create index if not exists events_session_idx on public.analytics_events (session_id);
create index if not exists events_visitor_idx on public.analytics_events (visitor_id, ts);

-- Retention: anonymize event-level rows older than 90 days (run via scheduled SQL).
create or replace function public.analytics_retention()
returns void language sql security definer set search_path = public as $$
  delete from public.analytics_events where ts < now() - interval '90 days';
$$;

-- ---------- audit log ----------
create table if not exists public.audit_logs (
  id          bigint generated always as identity primary key,
  actor_id    uuid,
  actor_email text not null default '',
  action      text not null,                -- login/logout/create/update/publish/unpublish/archive/delete/restore/settings/media/cv
  entity      text not null,
  entity_id   text not null default '',
  summary     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists audit_ts_idx on public.audit_logs (created_at desc);

-- ============================================================
-- RLS
-- ============================================================
alter table public.admin_users        enable row level security;
alter table public.site_settings      enable row level security;
alter table public.about_profile      enable row level security;
alter table public.projects           enable row level security;
alter table public.skills             enable row level security;
alter table public.skill_categories   enable row level security;
alter table public.certifications     enable row level security;
alter table public.experiences        enable row level security;
alter table public.recommendations    enable row level security;
alter table public.social_links       enable row level security;
alter table public.media_assets       enable row level security;
alter table public.cv_versions        enable row level security;
alter table public.contact_messages   enable row level security;
alter table public.anonymous_visitors enable row level security;
alter table public.visitor_sessions   enable row level security;
alter table public.analytics_events   enable row level security;
alter table public.audit_logs         enable row level security;

-- No anon policies on: admin_users, contact_messages, anonymous_visitors,
-- visitor_sessions, analytics_events, audit_logs, media_assets, cv_versions.
-- Serverless functions use the service-role key (bypasses RLS); the dashboard
-- reads admin-only data through authenticated policies below.

-- Content tables: public read of published, admin full access.
-- Policy expressions are parse-checked at CREATE POLICY time, so the
-- public-read USING clause is built per table from the columns it actually
-- has (some tables have status/deleted_at, others only enabled, some neither).
do $$
declare
  t           text;
  has_status  boolean;
  has_deleted boolean;
  has_enabled boolean;
  pub_using   text;
begin
  foreach t in array array[
    'projects','skills','skill_categories','certifications',
    'experiences','recommendations','social_links','about_profile','site_settings'
  ] loop
    select
      exists(select 1 from information_schema.columns
             where table_schema = 'public' and table_name = t and column_name = 'status'),
      exists(select 1 from information_schema.columns
             where table_schema = 'public' and table_name = t and column_name = 'deleted_at'),
      exists(select 1 from information_schema.columns
             where table_schema = 'public' and table_name = t and column_name = 'enabled')
    into has_status, has_deleted, has_enabled;

    pub_using := concat_ws(' and ',
      case when has_status  then $q$status = 'published'$q$ end,
      case when has_deleted then $q$deleted_at is null$q$ end,
      case when has_enabled then $q$enabled = true$q$ end);
    if pub_using = '' then pub_using := 'true'; end if;

    execute format($f$
      create policy %1$s_public_read on public.%1$s
        for select to anon using (%2$s);
      create policy %1$s_admin_read on public.%1$s
        for select to authenticated using (public.is_admin());
      create policy %1$s_admin_write on public.%1$s
        for all to authenticated using (public.is_admin()) with check (public.is_admin());
    $f$, t, pub_using);
  end loop;
end $$;

-- cv_versions: anon may read only the active published row.
create policy cv_public_read on public.cv_versions
  for select to anon using (is_active and is_published);
create policy cv_admin_all on public.cv_versions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Authenticated admin-only data.
create policy audit_admin_read on public.audit_logs
  for select to authenticated using (public.is_admin());
create policy contact_admin_all on public.contact_messages
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy visitors_admin_read on public.anonymous_visitors
  for select to authenticated using (public.is_admin());
create policy sessions_admin_read on public.visitor_sessions
  for select to authenticated using (public.is_admin());
create policy events_admin_read on public.analytics_events
  for select to authenticated using (public.is_admin());
create policy media_admin_all on public.media_assets
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
