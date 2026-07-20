-- Fixed set of 10 rows (populated by the seed migration) driving page order, anchor-nav
-- labels, and eyebrow/heading copy for every non-structural section. Hero and Footer are
-- structural and are not rows here. No insert/delete policy: the set of valid keys is
-- fixed by the check constraint below and mirrored in lib/constants.ts SECTION_KEYS.

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  key text not null unique check (key in (
    'about','work','experience','skills','recognition',
    'testimonials','certifications','education','interests','contact'
  )),
  eyebrow text not null default '',
  -- Supports `{{word}}` inline markup, parsed by lib/accent-heading.tsx into the
  -- italic-primary accent span used throughout the design.
  heading text not null default '',
  nav_label text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sections enable row level security;

create trigger set_updated_at
  before update on public.sections
  for each row execute function public.set_updated_at();

create policy "sections_public_select" on public.sections
  for select to anon, authenticated
  using (is_published = true);

create policy "sections_admin_select_all" on public.sections
  for select to authenticated
  using (public.is_admin());

create policy "sections_admin_update" on public.sections
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
