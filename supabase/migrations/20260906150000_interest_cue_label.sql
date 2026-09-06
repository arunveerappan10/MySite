-- The tile's own prompt, so each interest can invite a click in its own words —
-- "Play a game?" on chess, "Details" on volunteering. Null falls back to "View details"
-- in the component; the tile shows nothing at all unless the interest has a link or
-- detail rows to open.

alter table public.interests add column cue_label text;

alter table public.interests
  add constraint interests_cue_label_not_blank
  check (cue_label is null or btrim(cue_label) <> '');
