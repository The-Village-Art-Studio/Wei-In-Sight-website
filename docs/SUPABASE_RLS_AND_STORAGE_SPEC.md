# WEI IN SIGHT — Supabase RLS and Storage Spec

## Purpose
This document defines the baseline security and storage behavior for the new WEI IN SIGHT rebuild using Supabase.

## Principles
- use Supabase Auth for dashboard access
- use Row Level Security on every application table
- keep public reads deliberate
- keep admin writes restricted
- keep contact inquiries private
- avoid exposing raw storage buckets broadly unless intentional

## Auth model
Supabase Auth is the identity layer.
Application roles are stored in `admin_users`.

### Supported admin roles
- owner
- editor
- contributor
- viewer

## Role interpretation
### owner
- full access to all dashboard areas
- manage users, settings, content, media, inquiries

### editor
- create and edit content
- publish content if allowed by UI policy
- manage media
- cannot manage owner accounts

### contributor
- create and edit own working content if ownership is later added
- cannot publish directly unless explicitly allowed

### viewer
- read-only dashboard access

## Table policy baseline
Apply RLS to all tables.

### Publicly readable content tables
Read access may be granted for published content only, either directly or via server-side access layer.
Relevant tables:
- sections
- works
- writing_entries
- music_projects
- novel_projects
- exhibitions
- pulse_offerings
- media_assets
- site_settings
- seo_overrides

### Private admin tables
No public read:
- admin_users
- contact_inquiries
- featured_slots unless intentionally exposed through app server only

## Recommended policy pattern
### Public read
Allow `select` only where:
- `status = 'published'`
- `archived_at is null`

### Authenticated admin read/write
Allow authenticated users with valid `admin_users` record and active role.

### Contact inquiries
Allow:
- public `insert`
- admin authenticated `select` and `update`
Disallow:
- public `select`
- public `update`
- public `delete`

## Storage buckets
Recommended buckets:
- `site-images`
- `site-video`
- `site-audio`
- `site-documents`
- `site-3d`

## Bucket access strategy
### site-images
- public read acceptable for published frontend assets
- write restricted to authenticated admin users

### site-video
- prefer signed URLs or controlled public access depending on asset type
- write restricted to authenticated admin users

### site-audio
- public read only for intentionally published audio
- write restricted to authenticated admin users

### site-documents
- private by default
- signed URLs only where needed

### site-3d
- public read acceptable if model is used in frontend runtime
- write restricted to authenticated admin users

## Upload flow
1. authenticated admin requests upload
2. app validates allowed mime type and max size
3. upload to correct bucket path
4. create `media_assets` record only after upload success
5. link media to content entity through mapping table

## File path rules
Use deterministic paths by content slug.
Examples:
- `works/my-piece/cover.jpg`
- `works/my-piece/detail-01.jpg`
- `writing/my-poem/cover.jpg`
- `music/my-song/cover.jpg`
- `novel/the-dinner/hero.jpg`
- `3d/body/wireframe-body-v1.glb`

## Asset validation rules
### Images
- accepted: jpg, jpeg, png, webp, avif
- require alt text before publish for public-facing content

### Video
- accepted: mp4, webm
- use optimized poster image where possible

### Audio
- accepted: mp3, wav, m4a

### 3D
- accepted: glb, gltf
- keep optimized for web delivery

## Dashboard security guardrails
- dashboard routes require authenticated session
- owner-only routes should be separated in UI and API checks
- never trust client-side role checks alone
- always validate role server-side before mutation

## Contact form guardrails
- add rate limiting at app layer
- use bot protection such as Turnstile or reCAPTCHA later if needed
- store minimal personal data
- do not expose inquiry content in client-rendered endpoints

## Publishing guardrails
Only allow public visibility when:
- `status = 'published'`
- required cover asset exists if applicable
- required SEO and excerpt fields pass minimum validation if desired by app logic

## Recommended implementation sequence
1. create tables
2. enable RLS on all tables
3. create helper SQL functions if needed for role checks
4. configure storage buckets
5. implement upload endpoint rules
6. test public read and admin mutation paths
