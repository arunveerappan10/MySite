create table public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  group_name text not null,
  -- Validated against the curated enum in lib/icon-map.ts at the application layer.
  icon text not null default 'sparkles',
  items jsonb not null default '[]'::jsonb,
  image_url text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.skill_groups enable row level security;

create trigger set_updated_at
  before update on public.skill_groups
  for each row execute function public.set_updated_at();

create policy "skill_groups_public_select" on public.skill_groups
  for select to anon, authenticated
  using (is_published = true);

create policy "skill_groups_admin_select_all" on public.skill_groups
  for select to authenticated
  using (public.is_admin());

create policy "skill_groups_admin_insert" on public.skill_groups
  for insert to authenticated
  with check (public.is_admin());

create policy "skill_groups_admin_update" on public.skill_groups
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "skill_groups_admin_delete" on public.skill_groups
  for delete to authenticated
  using (public.is_admin());
