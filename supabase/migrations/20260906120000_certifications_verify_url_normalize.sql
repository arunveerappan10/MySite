-- Blank Verify URLs were being persisted as '' rather than NULL, so a
-- certification added through the admin page stored an empty string in a column
-- the row type declares as `string | null`. Normalise what is already stored and
-- stop blanks from coming back.

update public.certifications
set verify_url = null
where verify_url is not null
  and btrim(verify_url) = '';

alter table public.certifications
  add constraint certifications_verify_url_not_blank
  check (verify_url is null or btrim(verify_url) <> '');
