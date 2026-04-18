# WEI IN SIGHT — Deployment and Hosting Decision

## Recommendation
For this rebuild, the strongest default choice is:

- **Frontend + admin:** Vercel
- **Database + Auth + Storage:** Supabase

Keep DigitalOcean as an optional later add-on only if the project grows into heavier custom infrastructure needs.

## Why this is the better fit
This rebuild is a design-heavy, interaction-rich Next.js site with a custom admin dashboard.
The fastest path with the least operational drag is a managed frontend plus managed backend.

That means:
- faster shipping
- cleaner previews
- easier deployment flow
- less server maintenance
- simpler auth and storage setup

## When Vercel + Supabase wins
Choose this when the priority is:
- moving fast
- keeping infrastructure simple
- building in Next.js
- needing auth, storage, and Postgres without server maintenance
- wanting preview deployments during active design/build cycles

## When DigitalOcean wins
Choose DigitalOcean instead when the priority is:
- full server control
- custom long-running services
- self-managed background workers
- private networking between many custom services
- avoiding platform-specific limits by taking on more ops work

## Practical decision for this project
For **WEI IN SIGHT v2**, use:
- Vercel for the web app and admin app
- Supabase for Postgres, Auth, Storage, and optional Edge Functions

Do **not** start this project on a single self-managed DigitalOcean droplet unless you specifically want extra DevOps responsibility from day one.

## Suggested architecture
- Vercel project 1: public site
- Vercel project 2: admin dashboard
- Supabase project: database, auth, storage
- optional custom domain split:
  - `weiinsight.com`
  - `admin.weiinsight.com`

## When to reconsider later
Revisit DigitalOcean later only if you add:
- heavy video processing
- image pipelines requiring workers
- private APIs with long-running jobs
- custom AI or media services
- multiple apps needing one tightly controlled network layer
