# Setup

## 1. Create the Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and create a new project.
2. Once it's provisioned, go to **Project Settings → API** and copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY` (keep this one secret — it bypasses Row Level Security entirely)
3. Copy `.env.example` to `.env.local` and paste those three values in.

## 2. Run the database migrations

The schema, Row Level Security policies, storage buckets, and seed content all live in
[`supabase/migrations/`](supabase/migrations), as 15 numbered `.sql` files. Run them
**in order** — each one depends on tables or functions created by the ones before it.

In the Supabase dashboard, open **SQL Editor → New query**, then for each file in
`supabase/migrations/` (already in the right order alphabetically):

1. Open the file, copy its full contents.
2. Paste into a new SQL Editor query.
3. Click **Run**.
4. Confirm it succeeds before moving to the next file.

After all 15 run successfully, verify in **Table Editor** that you have: `admin_users`,
`profile`, `settings`, `sections`, `social_links`, `projects`, `experience_entries`,
`skill_groups`, `recognitions`, `certifications`, `education_entries`, `interests`,
`testimonials`, `enquiries`, `rate_limit_hits` — and that `profile`, `settings`,
`sections`, `social_links`, `projects`, `experience_entries`, `skill_groups`,
`recognitions`, `certifications`, and `education_entries` already have rows in them (the
last migration, `..._content_seed.sql`, seeds them with the reference site's real
content). `testimonials` and `enquiries` are expected to start empty.

Also confirm in **Storage** that two buckets exist: `media` and `documents`, both public.

## 3. Create the admin user

There is no sign-up page anywhere in this app, by design — the one admin account is
created directly in Supabase:

1. In the dashboard, go to **Authentication → Users → Add user → Create new user**.
2. Enter an email and a strong password. Leave "Auto Confirm User" checked.
3. Copy the new user's **UID** (shown in the users table, or click into the user).
4. Back in **SQL Editor**, run:
   ```sql
   insert into public.admin_users (id) values ('paste-the-uid-here');
   ```
5. That email/password is now the only credential that can sign in to `/admin` and the
   only one Row Level Security will treat as an admin. Store it in a password manager —
   there is no recovery flow beyond Supabase's own dashboard.

## 4. Generate remaining local secrets

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Paste the output into `IP_HASH_SALT` in `.env.local`. This salts visitor IP addresses
before they're hashed for rate limiting and the enquiries table — raw IPs are never
stored. Use a different random value per environment (dev vs. production).

## 5. Regenerate TypeScript types after any schema change

Once you have the [Supabase CLI](https://supabase.com/docs/guides/cli) installed and are
logged in (`supabase login`), you can regenerate `types/supabase.ts` directly from the
live project without ever running `supabase db push` or linking a local dev stack:

```sh
supabase gen types typescript --project-id <your-project-ref> > types/supabase.ts
```

Your project ref is the subdomain in your Supabase project URL
(`https://<project-ref>.supabase.co`).

## 6. Set up Resend (contact form email)

1. Create a free account at [resend.com](https://resend.com) and go to **API Keys → Create API Key**.
2. Paste it into `RESEND_API_KEY` in `.env.local`.
3. Leave `RESEND_FROM_EMAIL=onboarding@resend.dev` for now — Resend's shared sandbox
   sender works immediately with no domain setup, and is fine for development and even
   initial production use.
4. Once you own a domain and want mail to come from it instead: **Domains → Add Domain**
   in Resend, add the DNS records it gives you, wait for verification, then change
   `RESEND_FROM_EMAIL` to e.g. `Arun Veerappan T <hello@yourdomain.com>`. Nothing else in
   the code needs to change.
5. `ADMIN_NOTIFICATION_EMAIL` is where "new enquiry" alerts are sent — defaults to your
   own address in `.env.example`, change it freely, it's an operational setting rather
   than public site content.

## 7. Set up Cloudflare Turnstile (contact form spam protection)

`.env.example` ships with Cloudflare's published **always-pass test keys**
(`1x00000000000000000000AA` / matching secret) so the contact form works out of the box
in development without registering anything. Switch to real keys before going live:

1. Go to the [Cloudflare Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile)
   and add a site.
2. **Domain**: add both your production domain and, if you test the built app locally,
   `localhost`.
3. Copy the **Site Key** → `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and **Secret Key** →
   `TURNSTILE_SECRET_KEY`.
4. When you deploy to a new domain (e.g., a Vercel preview URL) later, add it to the same
   Turnstile site's domain allow-list — otherwise the widget will fail to verify there.

## 8. Deploy to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket), then [import it into Vercel](https://vercel.com/new).
2. In the project's **Settings → Environment Variables**, add every variable from
   `.env.local` (all of them — `NEXT_PUBLIC_*` ones are exposed to the browser by design,
   the rest stay server-only). Set `NEXT_PUBLIC_SITE_URL` to the real deployed URL (e.g.
   `https://yourdomain.com`), not `localhost`.
3. **Region**: under **Settings → Functions**, pin the deployment region to whichever AWS
   region your Supabase project lives in (shown in the Supabase dashboard under
   **Project Settings → General**). Every page load makes several round trips to
   Supabase; colocating the two cuts response time dramatically compared to leaving
   Vercel on its default region.
4. Add the production domain to the Turnstile site's allow-list (step 7 above) — the
   contact form will silently fail verification on any domain that isn't listed.
5. Deploy. Confirm: the homepage loads with real content, `/admin/login` works with the
   admin credential from step 3, and a test contact form submission arrives in both your
   inbox and the Resend dashboard's **Logs**.
6. `/sitemap.xml` and `/robots.txt` are generated automatically — no further setup needed.
