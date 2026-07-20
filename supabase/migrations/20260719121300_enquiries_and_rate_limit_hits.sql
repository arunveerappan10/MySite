-- Contact-form submissions inbox. Public can insert only (no select/update/delete) — Zod
-- validation, Turnstile verification, and rate-limiting all happen in the Server Action
-- before this insert runs; RLS here is a floor, not the primary defense.
create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'archived')),
  ip_hash text,
  user_agent text,
  turnstile_verified boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

create policy "enquiries_public_insert" on public.enquiries
  for insert to anon
  with check (true);

create policy "enquiries_admin_select" on public.enquiries
  for select to authenticated
  using (public.is_admin());

create policy "enquiries_admin_update" on public.enquiries
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "enquiries_admin_delete" on public.enquiries
  for delete to authenticated
  using (public.is_admin());


-- DB-backed sliding-window rate limiter for the contact form (3 requests / 10 minutes per
-- salted IP hash — see lib/rate-limit.ts). RLS is enabled with *zero* policies for
-- anon/authenticated: rate limiting inherently requires reading other visitors'
-- submission metadata by IP, which no legitimate anon policy should ever expose. Only the
-- service-role client (lib/supabase/admin.ts) touches this table.
create table public.rate_limit_hits (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  route text not null default 'contact',
  created_at timestamptz not null default now()
);

create index rate_limit_hits_lookup_idx on public.rate_limit_hits (ip_hash, route, created_at);

alter table public.rate_limit_hits enable row level security;
-- Intentionally no policies for anon/authenticated: both roles are denied every command.
