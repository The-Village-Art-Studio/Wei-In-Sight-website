# WEI IN SIGHT — Environment Variables and Secrets Spec

## Purpose
This file defines the expected environment variables for the web app, admin app, and shared backend integration.

## Principles
- keep public and server-only variables clearly separated
- never expose service-role credentials to the browser
- keep one source of truth per environment
- use Vercel project environment management for deployment secrets

## Shared public variables
These may be exposed to the browser when needed.

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_NAME`

## Shared server-only variables
These must never be exposed client-side.

- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`  
  Optional for Prisma migrations if used separately
- `CRON_SECRET`  
  Optional if scheduled jobs are added
- `TURNSTILE_SECRET_KEY`  
  Optional for forms later
- `RESEND_API_KEY` or equivalent mail provider key

## Web app variables
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `CONTACT_NOTIFICATION_EMAIL`
- `DEFAULT_FROM_EMAIL`

## Admin app variables
- `NEXT_PUBLIC_ADMIN_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

## Optional media variables
Only add if needed later.
- `IMAGE_TRANSFORM_PROVIDER`
- `VIDEO_PROVIDER_KEY`
- `SIGNED_URL_TTL_SECONDS`

## Environment tiers
Maintain at least:
- local
- preview
- production

## Rules
- never reuse production secrets in local casually
- keep preview environment pointed at preview-safe services where possible
- if using one Supabase project early on, make sure preview writes are clearly isolated or tightly controlled
- rotate service-role keys if they were ever exposed
