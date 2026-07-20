# Portfolio — CMS-backed Next.js app

A production-grade personal portfolio: a single-page public site backed entirely by
Supabase (Postgres + Auth + Storage), editable through a secure `/admin` dashboard
instead of requiring a code change and redeploy for every content update.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · shadcn/ui · Framer
Motion · Supabase · React Hook Form + Zod · TanStack Query · dnd-kit · Resend + React
Email · Cloudflare Turnstile.

## Getting started

See **[SETUP.md](SETUP.md)** for the full walkthrough — creating the Supabase project,
running migrations, creating the admin account, and configuring Resend/Turnstile. Once
`.env.local` is filled in:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, or
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) to sign in to the
admin dashboard.

## What's in the admin dashboard

Every piece of public content is editable without touching code: Hero/About/Contact
copy, site-wide settings, section order and labels, and full create/edit/publish/delete/
reorder CRUD for Projects, Experience, Skills, Testimonials, Recognitions,
Certifications, Education, Interests, and Social Links — each with image upload. A
contact-form inbox (`/admin/enquiries`) tracks submissions with read/archived status.

## Scripts

```bash
npm run dev      # start the dev server
npm run build    # production build
npm run start    # run the production build locally
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

## Deploying

See the [Vercel deployment section](SETUP.md#8-deploy-to-vercel) in SETUP.md.
