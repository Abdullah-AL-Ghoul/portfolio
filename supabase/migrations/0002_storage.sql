-- ============================================================
-- 0002 — Storage buckets for media & CV.
-- Run in Supabase SQL editor (storage schema not available via
-- plain SQL migrations on hosted Supabase — use these statements
-- in the SQL editor, or create buckets in the dashboard UI).
-- ============================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('cv', 'cv', false)   -- private; downloads proxied through /api/cv-download for counting
on conflict (id) do nothing;

-- Public read for media; admin-only writes.
create policy "media_public_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

create policy "media_admin_write" on storage.objects
  for all to authenticated
  using (bucket_id = 'media' and public.is_admin())
  with check (bucket_id = 'media' and public.is_admin());

-- CV bucket: no client policies at all.
-- Reads happen exclusively through the serverless function (service role).
