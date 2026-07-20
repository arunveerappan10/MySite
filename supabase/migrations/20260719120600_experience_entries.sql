create table public.experience_entries (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  domain text not null,
  role_title text not null,
  -- Free-text period/duration, not structured dates — matches the source exactly (no
  -- date math occurs anywhere in this design) and avoids partial-date/timezone edge cases.
  period_label text not null,
  duration_label text not null,
  impact_bullets jsonb not null default '[]'::jsonb,
  highlights jsonb not null default '[]'::jsonb,
  tech_stack jsonb not null default '[]'::jsonb,
  image_url text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.experience_entries enable row level security;

create trigger set_updated_at
  before update on public.experience_entries
  for each row execute function public.set_updated_at();

create policy "experience_entries_public_select" on public.experience_entries
  for select to anon, authenticated
  using (is_published = true);

create policy "experience_entries_admin_select_all" on public.experience_entries
  for select to authenticated
  using (public.is_admin());

create policy "experience_entries_admin_insert" on public.experience_entries
  for insert to authenticated
  with check (public.is_admin());

create policy "experience_entries_admin_update" on public.experience_entries
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "experience_entries_admin_delete" on public.experience_entries
  for delete to authenticated
  using (public.is_admin());
