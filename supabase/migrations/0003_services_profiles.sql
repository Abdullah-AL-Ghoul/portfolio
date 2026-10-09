-- ============================================================
-- 0003 — Services & Freelance Profiles (Supabase / PostgreSQL)
-- Run once in the Supabase SQL Editor; do not re-run after success.
-- Conventions follow 0001_schema.sql exactly: create if not exists,
-- per-table public-read policy (status/deleted_at/active columns only
-- where they exist), admin full access via is_admin(), partial indexes.
-- The /api/content public SELECT shapes (contract) are served through
-- the anon read policies below — column lists match the API response.
-- ============================================================

-- ---------- services ----------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title_en text not null,
  title_ar text not null,
  summary_en text not null default '',
  summary_ar text not null default '',
  features jsonb not null default '[]'::jsonb,        -- [{en,ar}]
  technologies text[] not null default '{}',
  related_project_keys text[] not null default '{}',  -- project legacy_keys ('p1'..'p7')
  icon text not null default 'layers',
  cta_label_en text not null default 'Discuss a project',
  cta_label_ar text not null default 'اطلب مشروعاً',
  status text not null default 'draft' check (status in ('draft','published','archived')),
  sort_order integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists services_public_idx on public.services (status, sort_order) where deleted_at is null;

-- ---------- professional profiles ----------
create table if not exists public.professional_profiles (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('upwork','khamsat','mostaql','freelancer','contra','linkedin','custom')),
  display_name text not null,
  username text not null default '',
  profile_url text not null default '',
  title_en text not null default '',
  title_ar text not null default '',
  description_en text not null default '',
  description_ar text not null default '',
  icon text not null default 'briefcase',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  display_order integer not null default 0,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists profiles_list_idx on public.professional_profiles (is_active, display_order) where deleted_at is null;

-- ---------- RLS ----------
alter table public.services           enable row level security;
alter table public.professional_profiles enable row level security;

-- Public read matches the /api/content contract WHERE shapes exactly:
--   services:            status='published' AND deleted_at IS NULL
--   professional_profiles: is_active AND deleted_at IS NULL AND profile_url <> ''
-- Admin (authenticated via is_admin()) gets full access, same as 0001.
-- Note: PostgreSQL has no `create policy if not exists`, so idempotent
-- policy creation is done via a pg_policies guard (matching 0001's
-- run-once convention while staying safe if partially applied).
do $$
begin
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'services'
                   and policyname = 'services_public_read') then
    create policy services_public_read on public.services
      for select to anon using (status = 'published' and deleted_at is null);
  end if;
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'services'
                   and policyname = 'services_admin_read') then
    create policy services_admin_read on public.services
      for select to authenticated using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'services'
                   and policyname = 'services_admin_write') then
    create policy services_admin_write on public.services
      for all to authenticated using (public.is_admin()) with check (public.is_admin());
  end if;

  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'professional_profiles'
                   and policyname = 'professional_profiles_public_read') then
    create policy professional_profiles_public_read on public.professional_profiles
      for select to anon using (is_active and deleted_at is null and profile_url <> '');
  end if;
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'professional_profiles'
                   and policyname = 'professional_profiles_admin_read') then
    create policy professional_profiles_admin_read on public.professional_profiles
      for select to authenticated using (public.is_admin());
  end if;
  if not exists (select 1 from pg_policies
                 where schemaname = 'public' and tablename = 'professional_profiles'
                   and policyname = 'professional_profiles_admin_write') then
    create policy professional_profiles_admin_write on public.professional_profiles
      for all to authenticated using (public.is_admin()) with check (public.is_admin());
  end if;
end $$;

-- ---------- seed: services (copy grounded in the seeded projects p1..p7) ----------
-- related_project_keys are actual legacy_keys from supabase/seed.sql:
--   p1 personal-portfolio-website, p3 smart-university-virtual-lab,
--   p4 al-azher-it-hub, p5 task-manager, p6 library-management-system,
--   p7 smarttimecoach.
insert into public.services (
  slug, title_en, title_ar, summary_en, summary_ar, features, technologies,
  related_project_keys, icon, cta_label_en, cta_label_ar, status, sort_order
) values
('full-stack-web-applications', 'Full-Stack Web Applications', 'تطبيقات ويب متكاملة',
 'End-to-end web products: responsive bilingual interfaces with full RTL support, managed data storage, and serverless APIs — dependency-light and deployable to Vercel. Grounded in the AL-Azher IT Hub and the portfolio site itself.',
 'منتجات ويب متكاملة الأطراف: واجهات متجاوبة ثنائية اللغة بدعم كامل للعربية، وتخزين بيانات مُدار، وواجهات برمجية بدون خادم — خفيفة التبعيات وقابلة للنشر على Vercel. مستندة إلى منصة AL-Azher IT Hub وهذا الموقع نفسه.',
 '[
   {"en": "Responsive, dependency-light frontends", "ar": "واجهات متجاوبة وخفيفة التبعيات"},
   {"en": "Bilingual UI with full RTL support", "ar": "واجهة ثنائية اللغة بدعم RTL كامل"},
   {"en": "Managed database plus serverless APIs", "ar": "قاعدة بيانات مُدارة وواجهات برمجية بدون خادم"},
   {"en": "PWA-ready and works offline", "ar": "جاهزية PWA ويعمل دون اتصال"}
 ]'::jsonb,
 array['React','Tailwind CSS','Firebase','Supabase','JavaScript'],
 array['p1','p4'],
 'layers', 'Discuss a project', 'اطلب مشروعاً',
 'published', 1),

('business-dashboards-admin-panels', 'Business Dashboards & Admin Panels', 'لوحات التحكم والواجهات الإدارية',
 'Management systems that keep real operations organized — tasks, deadlines, teams, books, borrowers, and lending flows — built on clear object-oriented models with dependable persistence.',
 'أنظمة إدارة تُبقي العمليات الفعلية منظّمة — المهام والمواعيد النهائية والفرق والكتب والمستعيرين وعمليات الإعارة — مبنية على نماذج كائنية واضحة مع حفظ موثوق للبيانات.',
 '[
   {"en": "Task creation, assignment and status tracking", "ar": "إنشاء المهام وتعيينها وتتبع حالتها"},
   {"en": "Catalog and lending workflows for books and borrowers", "ar": "سير فهرسة وإعارة للكتب والمستعيرين"},
   {"en": "Search, add, borrow and return flows with data persistence", "ar": "عمليات بحث وإضافة واستعارة وإرجاع مع حفظ البيانات"},
   {"en": "Clean object-oriented domain design", "ar": "تصميم كائني واضح للمجال"}
 ]'::jsonb,
 array['Java','OOP','Data Structures','File I/O'],
 array['p5','p6'],
 'layout-dashboard', 'Discuss a project', 'اطلب مشروعاً',
 'published', 2),

('ai-powered-web-applications', 'AI-Powered Web Applications', 'تطبيقات ويب مدعومة بالذكاء الاصطناعي',
 'Practical AI applied to web workflows — automation, smart scheduling, and prompt-engineering-driven development — with cloud infrastructure modelled to widen access.',
 'تطبيقات عملية للذكاء الاصطناعي في سير العمل الويب — أتمتة وجدولة ذكية وتطوير موجّه بالهندسة الفورية — مع نمذجة بنية سحابية لتوسيع نطاق الوصول.',
 '[
   {"en": "Automation and smart-scheduling assistants in Python", "ar": "مساعدات أتمتة وجدولة ذكية بلغة بايثون"},
   {"en": "AI tooling and prompt engineering applied to development", "ar": "أدوات الذكاء الاصطناعي والهندسة الفورية في التطوير"},
   {"en": "Cloud infrastructure modelling — VDI, VPN, Azure", "ar": "نمذجة البنية السحابية — VDI وVPN وAzure"}
 ]'::jsonb,
 array['Python','Automation','Scheduling','Azure','Cloud Infra'],
 array['p3','p7'],
 'brain', 'Discuss a project', 'اطلب مشروعاً',
 'published', 3)
on conflict (slug) do nothing;

-- ZERO professional_profiles rows: a platform is only shown once a
-- real, verified profile exists (protocol forbids inventing profiles).
