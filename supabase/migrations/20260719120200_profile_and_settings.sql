-- Two singleton tables (id is always 1) holding Hero/About/Contact copy and site-wide
-- settings respectively. Public can always read; only the admin can update. Neither
-- exposes insert/delete via the API — omitting those policies denies them implicitly, so
-- the one row can only be created by the seed migration and never duplicated or removed
-- through the app.

create table public.profile (
  id smallint primary key default 1 check (id = 1),
  full_name text not null,
  hero_accent_word text not null,
  hero_eyebrow text not null,
  hero_subheading text not null,
  hero_stats jsonb not null default '[]'::jsonb,
  about_summary text not null,
  email text not null,
  phone text,
  location text,
  availability_note text,
  contact_intro text not null,
  image_url text,
  updated_at timestamptz not null default now()
);

alter table public.profile enable row level security;

create trigger set_updated_at
  before update on public.profile
  for each row execute function public.set_updated_at();

create policy "profile_public_select" on public.profile
  for select to anon, authenticated
  using (true);

create policy "profile_admin_update" on public.profile
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());


create table public.settings (
  id smallint primary key default 1 check (id = 1),
  site_title text not null,
  site_description text not null,
  og_image_url text,
  resume_file_url text,
  footer_bio text not null,
  footer_tagline text not null default 'Designed with restraint',
  nav_cta_label text not null default 'Get in touch',
  nav_cta_href text not null default '#contact',
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create trigger set_updated_at
  before update on public.settings
  for each row execute function public.set_updated_at();

create policy "settings_public_select" on public.settings
  for select to anon, authenticated
  using (true);

create policy "settings_admin_update" on public.settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());
