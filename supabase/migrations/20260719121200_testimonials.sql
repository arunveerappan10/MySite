-- No equivalent section exists in the reference design — this is new, required content
-- per spec. The public site renders nothing for this section while the table is empty
-- (see components/site/sections/testimonials-section.tsx), so adding this table does not
-- change today's rendered output.
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  quote text not null,
  -- Falls back to an initials avatar in the UI when null.
  image_url text,
  rating smallint check (rating between 1 and 5),
  position integer not null default 0 check (position >= 0),
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.testimonials enable row level security;

create trigger set_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

create policy "testimonials_public_select" on public.testimonials
  for select to anon, authenticated
  using (is_published = true);

create policy "testimonials_admin_select_all" on public.testimonials
  for select to authenticated
  using (public.is_admin());

create policy "testimonials_admin_insert" on public.testimonials
  for insert to authenticated
  with check (public.is_admin());

create policy "testimonials_admin_update" on public.testimonials
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "testimonials_admin_delete" on public.testimonials
  for delete to authenticated
  using (public.is_admin());
