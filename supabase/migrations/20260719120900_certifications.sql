create table public.certifications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null,
  credential_id text not null,
  validity_label text not null,
  verify_url text,
  image_url text,
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.certifications enable row level security;

create trigger set_updated_at
  before update on public.certifications
  for each row execute function public.set_updated_at();

create policy "certifications_public_select" on public.certifications
  for select to anon, authenticated
  using (is_published = true);

create policy "certifications_admin_select_all" on public.certifications
  for select to authenticated
  using (public.is_admin());

create policy "certifications_admin_insert" on public.certifications
  for insert to authenticated
  with check (public.is_admin());

create policy "certifications_admin_update" on public.certifications
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "certifications_admin_delete" on public.certifications
  for delete to authenticated
  using (public.is_admin());
