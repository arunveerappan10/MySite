-- Interests become openable: a card with a link or detail rows opens a dialog holding
-- them. Chess links out to a chess.com profile; volunteering lists the events attended.
--
-- details mirrors the other jsonb {label,value}[] columns (hero stats, project metrics,
-- experience highlights) so the existing admin array editor drives it unchanged.

alter table public.interests add column link_url text;
alter table public.interests add column link_label text;
alter table public.interests add column details jsonb not null default '[]'::jsonb;

alter table public.interests
  add constraint interests_link_url_not_blank
  check (link_url is null or btrim(link_url) <> '');

alter table public.interests
  add constraint interests_link_label_not_blank
  check (link_label is null or btrim(link_label) <> '');

-- A label with no link is a dead CTA; the card would render a button going nowhere.
alter table public.interests
  add constraint interests_link_label_needs_url
  check (link_label is null or link_url is not null);

alter table public.interests
  add constraint interests_details_is_array
  check (jsonb_typeof(details) = 'array');
