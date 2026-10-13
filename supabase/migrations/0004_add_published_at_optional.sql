-- Optional Migration: Add published_at column to certifications and other tables
-- Note: The admin dashboard already safely guards this, but running this allows
-- tracking exact publication timestamps on all entities if desired.

alter table if exists public.certifications
  add column if not exists published_at timestamptz;

alter table if exists public.experiences
  add column if not exists published_at timestamptz;

alter table if exists public.recommendations
  add column if not exists published_at timestamptz;

alter table if exists public.services
  add column if not exists published_at timestamptz;
