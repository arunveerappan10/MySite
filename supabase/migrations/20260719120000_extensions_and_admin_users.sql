-- Extensions, shared helper functions, and the single-admin allow-list table.

create extension if not exists pgcrypto;

-- Maintains `updated_at` on every table that has one, via a `before update` trigger
-- added per table in each subsequent migration.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Allow-list of the one admin user. Referenced by every write policy in this schema via
-- public.is_admin() below, rather than a `profiles.is_admin` boolean — simpler to audit
-- for a site with exactly one admin, ever.
create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- No insert/update/delete policy at all, on purpose: there is no path through the API
-- (anon or authenticated) that can ever add or remove an admin. Only a migration or a
-- service-role script can do that. See scripts/create-admin.ts / SETUP.md.
create policy "admin_users_self_select" on public.admin_users
  for select to authenticated
  using (id = auth.uid());

-- security definer + fixed search_path: must resolve correctly regardless of the calling
-- policy's context, and must not be hijackable via a crafted search_path. Used as
-- `public.is_admin()` in every write policy from here on.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admin_users a where a.id = auth.uid());
$$;
