# Working in this repo

A CMS-backed portfolio: every piece of public content lives in Supabase and is edited
through `/admin`, so content changes never require a code change. The public site is a
single page at `app/(site)/page.tsx` composed of section components.

Next.js 15.5 (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Supabase ·
React Hook Form + Zod · Resend · Cloudflare Turnstile.

## Verifying a change

```bash
npx tsc --noEmit    # types
npx eslint          # lint
```

**Do not run `npm run build` while a dev server is running.** `next build` and `next dev`
share the same `.next/` directory, so a build overwrites the dev server's compiled chunks.
The symptom is confusing: HTML still returns 200 while every `/_next/static/**` asset 404s,
so the page loads unstyled and non-interactive. Recovery is stop the server,
`rm -rf .next`, restart. The two commands above are enough for almost every change.

## Content collections

Nine collections are reorderable, publishable lists with full CRUD: `certifications`,
`education`, `experience`, `interests`, `projects`, `recognitions`, `skills`,
`social-links`, `testimonials`. Each has an identical folder shape — `page.tsx`,
`actions.ts`, `loading.tsx`, a singular-named form and list component, `new/`, and
`[id]/edit/`.

The other four admin areas are not collections: `profile` and `settings` are
edit-in-place singletons, `sections` edits section headings, and `enquiries` is a
read-only contact inbox.

Adding a field to a collection means touching each layer that names it:

| Layer | Path |
|---|---|
| Schema | `supabase/migrations/<timestamp>_<name>.sql` |
| Row type | `lib/types.ts` |
| Validation | `lib/validations/<name>.ts` |
| Reads | `lib/queries/<name>.ts` |
| Admin CRUD | `app/admin/(dashboard)/<name>/` |
| Public render | `components/site/sections/*-section.tsx` |

File names are not always derivable from the collection name — `skills/` holds
`skill-group-form.tsx`, and `projects` renders through `work-section.tsx`. Look, don't
guess.

## Server actions

Every mutation in `app/admin/(dashboard)/*/actions.ts` follows the same order:

1. `await requireAdmin()`
2. `schema.safeParse(input)`, returning `{ error }` on failure — never trust the client's
   own validation
3. the Supabase call
4. `revalidatePath("/")` **and** `revalidatePath("/admin/<name>")`
5. `return { success: true as const }`

## Storage

Two public-read, admin-write buckets: `media` for images (5MB) and `documents` for PDFs
(10MB). Each whitelists its own MIME types, so route uploads by file type. When a file is
replaced or its row deleted, remove the old object — `lib/storage-utils.ts` has helpers for
turning a public URL back into a bucket and path.

## Optional URL columns

Store `NULL` for an empty link, never `""`. `optionalUrlSchema` in
`lib/validations/common.ts` normalises blanks to null, prefixes a bare `https://` onto a
scheme-less paste, and rejects non-http(s) schemes — these values are rendered into `href`
attributes. Three columns also enforce it in the database with not-blank check
constraints — `certifications.verify_url`, `certifications.proof_url`,
`recognitions.proof_url` — so writing `""` to those fails the insert outright.

## Migrations

Write the code that satisfies a migration **before** applying the migration, so the
deployed app is never briefly incompatible with its own database. Adding a constraint that
existing code violates breaks production the moment it lands.
