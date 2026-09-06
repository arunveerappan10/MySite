-- Clickable proof on award and certification cards. One nullable column per table holding
-- either an uploaded file's public URL (documents bucket for PDFs, media for images) or an
-- external link the admin pasted — the public card renders whichever is there.
--
-- The not-blank checks mirror certifications_verify_url_not_blank: the app writes NULL for
-- an empty field, and '' would be an indistinguishable second "empty" value.

alter table public.recognitions add column proof_url text;
alter table public.certifications add column proof_url text;

alter table public.recognitions
  add constraint recognitions_proof_url_not_blank
  check (proof_url is null or btrim(proof_url) <> '');

alter table public.certifications
  add constraint certifications_proof_url_not_blank
  check (proof_url is null or btrim(proof_url) <> '');
