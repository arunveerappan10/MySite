create table public.education_entries (
  id uuid primary key default gen_random_uuid(),
  school text not null,
  degree text not null,
  period_label text not null,
  score_label text not null,
  image_url text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.education_entries enable row level security;

create trigger set_updated_at
  before update on public.education_entries
  for each row execute function public.set_updated_at();

create policy "education_entries_public_select" on public.education_entries
  for select to anon, authenticated
  using (is_published = true);

create policy "education_entries_admin_select_all" on public.education_entries
  for select to authenticated
  using (public.is_admin());

create policy "education_entries_admin_insert" on public.education_entries
  for insert to authenticated
  with check (public.is_admin());

create policy "education_entries_admin_update" on public.education_entries
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "education_entries_admin_delete" on public.education_entries
  for delete to authenticated
  using (public.is_admin());
