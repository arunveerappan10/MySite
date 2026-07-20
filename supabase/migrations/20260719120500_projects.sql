create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tag text not null,
  problem text not null,
  role text not null,
  approach text not null,
  outcome text not null,
  -- {label,value}[], Zod-validated to 1-4 entries — mirrors the reference's 3-metric cards.
  metrics jsonb not null default '[]'::jsonb,
  image_url text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.projects enable row level security;

create trigger set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

create policy "projects_public_select" on public.projects
  for select to anon, authenticated
  using (is_published = true);

create policy "projects_admin_select_all" on public.projects
  for select to authenticated
  using (public.is_admin());

create policy "projects_admin_insert" on public.projects
  for insert to authenticated
  with check (public.is_admin());

create policy "projects_admin_update" on public.projects
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "projects_admin_delete" on public.projects
  for delete to authenticated
  using (public.is_admin());
