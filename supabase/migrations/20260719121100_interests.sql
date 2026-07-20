create table public.interests (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  icon text not null default 'sparkles',
  image_url text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.interests enable row level security;

create trigger set_updated_at
  before update on public.interests
  for each row execute function public.set_updated_at();

create policy "interests_public_select" on public.interests
  for select to anon, authenticated
  using (is_published = true);

create policy "interests_admin_select_all" on public.interests
  for select to authenticated
  using (public.is_admin());

create policy "interests_admin_insert" on public.interests
  for insert to authenticated
  with check (public.is_admin());

create policy "interests_admin_update" on public.interests
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "interests_admin_delete" on public.interests
  for delete to authenticated
  using (public.is_admin());
