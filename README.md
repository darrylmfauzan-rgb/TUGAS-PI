# D'Villa Moda — Frontend

This repository contains the frontend for the D'Villa Moda site (React + TypeScript + Vite + Tailwind).

## Prerequisites
- Node.js >= 18
- npm or yarn
- (Optional) Supabase project for backend/auth

## Setup (local)
1. Install dependencies

```bash
npm ci
```

2. Create a `.env` file from the example and fill values:

```bash
cp .env.example .env
# edit .env and set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
```

3. Run dev server

```bash
npm run dev
```

## Environment variables
- `VITE_SUPABASE_URL` — your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — public anon key used by client
- `VITE_ADMIN_USER` / `VITE_ADMIN_PASS` — local admin test creds (optional)
- `SUPABASE_SERVICE_ROLE_KEY` — server-only secret, do NOT commit

## Supabase
- Keep `supabase/migrations/` in the repo so DB schema is tracked.
- Do not commit secrets into `supabase/config.toml` — only non-secret config is okay.
- Put `SUPABASE_SERVICE_ROLE_KEY` into your host/CI secret store if migrations or server tasks require it.

## Build for production

```bash
npm run build
```

## Deploy notes
- On Vercel / Netlify / Cloudflare Pages: set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as environment variables in the project settings.
- If you need to run migrations during CI, add `SUPABASE_SERVICE_ROLE_KEY` to CI secrets and use the Supabase CLI in workflow steps.

## Security
- Never commit `.env` or secrets. Use `.env.example` to document which variables to set.
