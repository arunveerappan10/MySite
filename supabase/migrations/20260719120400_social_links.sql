create table public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null,
  label text not null,
  url text not null,
  icon text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.social_links enable row level security;

create trigger set_updated_at
  before update on public.social_links
  for each row execute function public.set_updated_at();

create policy "social_links_public_select" on public.social_links
  for select to anon, authenticated
  using (is_published = true);

create policy "social_links_admin_select_all" on public.social_links
  for select to authenticated
  using (public.is_admin());

create policy "social_links_admin_insert" on public.social_links
  for insert to authenticated
  with check (public.is_admin());

create policy "social_links_admin_update" on public.social_links
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "social_links_admin_delete" on public.social_links
  for delete to authenticated
  using (public.is_admin());
