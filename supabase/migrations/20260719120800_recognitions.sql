create table public.recognitions (
  id uuid primary key default gen_random_uuid(),
  icon text not null default 'award',
  title text not null,
  body text not null,
  image_url text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.recognitions enable row level security;

create trigger set_updated_at
  before update on public.recognitions
  for each row execute function public.set_updated_at();

create policy "recognitions_public_select" on public.recognitions
  for select to anon, authenticated
  using (is_published = true);

create policy "recognitions_admin_select_all" on public.recognitions
  for select to authenticated
  using (public.is_admin());

create policy "recognitions_admin_insert" on public.recognitions
  for insert to authenticated
  with check (public.is_admin());

create policy "recognitions_admin_update" on public.recognitions
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "recognitions_admin_delete" on public.recognitions
  for delete to authenticated
  using (public.is_admin());
