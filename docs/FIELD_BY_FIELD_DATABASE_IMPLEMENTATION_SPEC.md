# WEI IN SIGHT — Field-by-Field Database Implementation Spec

## Purpose
This document translates the higher-level schema planning into an implementation-ready specification for a Vercel + Supabase stack.

Primary goals:
- keep content structured, not generic
- separate creative content types clearly
- support a premium editorial frontend and a clean admin dashboard
- preserve long-term scalability without overengineering v1

## Recommended stack assumption
- Database: Supabase Postgres
- ORM: Prisma
- Auth: Supabase Auth
- Storage: Supabase Storage
- Frontend: Next.js on Vercel
- Admin: Next.js app or route group backed by Supabase + Prisma

## Naming conventions
- Table names: snake_case plural nouns
- Primary keys: `id uuid primary key`
- Public slugs: `slug text unique not null`
- Foreign keys: `<table>_id`
- Timestamps: `created_at`, `updated_at`
- Soft archival: `archived_at nullable`
- Publish scheduling: `published_at nullable`
- Draft visibility controlled by `status`

## Global enums
Use PostgreSQL enums or Prisma enums for these values.

### `section_key`
- `sight`
- `sound`
- `touch`
- `voice`
- `dream`
- `heart`
- `pulse`

### `content_status`
- `draft`
- `in_review`
- `scheduled`
- `published`
- `archived`

### `writing_type`
- `poem`
- `lyric`
- `spoken_word`
- `journal_fragment`
- `novel_excerpt`
- `essay`

### `work_type`
- `painting`
- `photography`
- `sculpture`
- `mixed_media`
- `fabric_work`
- `object_design`
- `experimental`

### `music_type`
- `single`
- `ep`
- `album`
- `soundtrack`
- `audio_visual`
- `demo`

### `novel_content_type`
- `book`
- `chapter_excerpt`
- `character_note`
- `world_note`
- `behind_the_story`
- `timeline_entry`

### `offering_type`
- `available_work`
- `commission`
- `collector_note`
- `contact_channel`

### `media_kind`
- `image`
- `video`
- `audio`
- `document`
- `cover`
- `thumbnail`
- `model_3d`

### `inquiry_type`
- `general`
- `commission`
- `collector`
- `press`
- `collaboration`
- `exhibition`

### `user_role`
- `owner`
- `editor`
- `contributor`
- `viewer`

## Core tables

---

## 1) `site_settings`
Single-row table for global site configuration.

### Fields
- `id uuid primary key`
- `site_title text not null default 'WEI IN SIGHT'`
- `site_subtitle text`
- `meta_title text`
- `meta_description text`
- `default_og_image_url text`
- `primary_color text`  
  Example: `#ff4fd8`
- `secondary_color text`  
  Example: `#ffffff`
- `background_color text`  
  Example: `#07070b`
- `contact_email text`
- `instagram_url text`
- `spotify_url text`
- `youtube_url text`
- `shop_url text`
- `landing_intro_heading text`
- `landing_intro_body text`
- `landing_microcopy text`
- `footer_identity_line text`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- one active row only
- edits should be logged in the admin activity stream if implemented later

---

## 2) `sections`
Controls the seven canonical site sections.

### Fields
- `id uuid primary key`
- `section_key section_key unique not null`
- `name text not null`  
  Example: `Sight`
- `functional_label text not null`  
  Example: `Visual Arts`
- `body_anchor text not null`  
  Example: `eyes`
- `route_path text unique not null`  
  Example: `/sight`
- `sort_order integer not null`
- `short_description text`
- `hero_heading text`
- `hero_body text`
- `is_visible boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- these seven rows are seeded and treated as canonical
- no custom eighth section in v1

---

## 3) `works`
For visual, tactile, and object-based creative works.

### Fields
- `id uuid primary key`
- `section_key section_key not null`  
  Usually `sight` or `touch`
- `work_type work_type not null`
- `title text not null`
- `slug text unique not null`
- `short_excerpt text`
- `description text`
- `year integer`
- `medium text`
- `dimensions text`
- `edition text`
- `status content_status not null default 'draft'`
- `is_featured boolean not null default false`
- `is_available boolean not null default false`
- `price_label text`
- `currency_code text default 'CAD'`
- `seo_title text`
- `seo_description text`
- `canonical_url text`
- `published_at timestamptz`
- `archived_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Indexes
- index on `section_key`
- index on `work_type`
- index on `status`
- index on `is_featured`
- index on `published_at desc`

### Rules
- `slug` generated from title, editable before publish
- `published_at` required when status becomes `published`
- `is_available` true only when intended for Pulse surfaces

---

## 4) `work_media`
Ordered media attachments for each work.

### Fields
- `id uuid primary key`
- `work_id uuid not null references works(id) on delete cascade`
- `media_asset_id uuid not null references media_assets(id) on delete cascade`
- `role text not null`  
  Example: `cover`, `gallery`, `detail`, `process`
- `sort_order integer not null default 0`
- `caption text`
- `alt_text text`
- `created_at timestamptz not null default now()`

### Rules
- exactly one preferred cover per work at the application layer
- gallery order must be deterministic

---

## 5) `writing_entries`
For poems, lyrics, journal fragments, spoken word, and literary excerpts.

### Fields
- `id uuid primary key`
- `section_key section_key not null`  
  Usually `voice` or `dream`
- `writing_type writing_type not null`
- `title text not null`
- `slug text unique not null`
- `short_excerpt text`
- `body_markdown text`
- `body_html text`
- `reading_time_minutes integer`
- `language_code text default 'en'`
- `status content_status not null default 'draft'`
- `is_featured boolean not null default false`
- `seo_title text`
- `seo_description text`
- `published_at timestamptz`
- `archived_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- `body_markdown` is source of truth
- `body_html` can be cached/generated for performance
- use `short_excerpt` for cards, never auto-truncate raw content on frontend if avoidable

---

## 6) `music_projects`
For songs, releases, music pages, and embedded platform content.

### Fields
- `id uuid primary key`
- `section_key section_key not null default 'sound'`
- `music_type music_type not null`
- `title text not null`
- `slug text unique not null`
- `short_excerpt text`
- `description text`
- `release_date date`
- `duration_seconds integer`
- `lyrics_excerpt text`
- `status content_status not null default 'draft'`
- `is_featured boolean not null default false`
- `spotify_url text`
- `apple_music_url text`
- `youtube_url text`
- `soundcloud_url text`
- `embed_html text`
- `seo_title text`
- `seo_description text`
- `published_at timestamptz`
- `archived_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- at least one platform URL or embed required before publish
- avoid storing platform-specific IDs without URL unless needed later

---

## 7) `novel_projects`
For books and the Dream section’s long-form narrative universe.

### Fields
- `id uuid primary key`
- `title text not null`
- `slug text unique not null`
- `series_title text`
- `novel_content_type novel_content_type not null`
- `short_excerpt text`
- `description text`
- `body_markdown text`
- `body_html text`
- `release_date date`
- `purchase_url text`
- `status content_status not null default 'draft'`
- `is_featured boolean not null default false`
- `seo_title text`
- `seo_description text`
- `published_at timestamptz`
- `archived_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- this table is for dream-world content only
- use `novel_content_type='book'` for main book entries
- excerpts and behind-the-story content also live here when tightly tied to a specific novel

---

## 8) `exhibitions`
For shows, features, venues, press, and public appearances.

### Fields
- `id uuid primary key`
- `title text not null`
- `slug text unique not null`
- `venue_name text`
- `city text`
- `country text`
- `start_date date`
- `end_date date`
- `external_url text`
- `short_excerpt text`
- `description text`
- `status content_status not null default 'draft'`
- `is_featured boolean not null default false`
- `seo_title text`
- `seo_description text`
- `published_at timestamptz`
- `archived_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- current and past exhibitions can live together
- frontend should infer upcoming/current/past by dates

---

## 9) `pulse_offerings`
For available works, commissions, collector notes, and contact surfaces shown in Pulse.

### Fields
- `id uuid primary key`
- `offering_type offering_type not null`
- `title text not null`
- `slug text unique not null`
- `short_excerpt text`
- `description text`
- `cta_label text`
- `cta_url text`
- `price_label text`
- `is_featured boolean not null default false`
- `status content_status not null default 'draft'`
- `seo_title text`
- `seo_description text`
- `published_at timestamptz`
- `archived_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- `cta_label` and `cta_url` required for contact or purchase-driven entries
- not all entries require a price

---

## 10) `media_assets`
Unified media library.

### Fields
- `id uuid primary key`
- `kind media_kind not null`
- `storage_bucket text not null`
- `storage_path text not null`
- `public_url text`
- `title text`
- `alt_text text`
- `caption text`
- `mime_type text`
- `file_size_bytes bigint`
- `width integer`
- `height integer`
- `duration_seconds integer`
- `dominant_color text`
- `blur_data_url text`
- `uploaded_by_user_id uuid references admin_users(id) on delete set null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Unique constraints
- unique (`storage_bucket`, `storage_path`)

### Rules
- media rows should be created after successful storage upload
- deleting a row should not silently delete storage object unless intentionally handled

---

## 11) `featured_slots`
Editorial homepage and section feature mapping.

### Fields
- `id uuid primary key`
- `slot_key text unique not null`  
  Example: `home_featured_sight`, `home_featured_voice`
- `section_key section_key`
- `entity_type text not null`  
  Example: `work`, `writing_entry`, `music_project`, `novel_project`, `exhibition`, `pulse_offering`
- `entity_id uuid not null`
- `sort_order integer not null default 0`
- `is_active boolean not null default true`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- polymorphic relation validated at application layer
- use sparingly; do not replace explicit querying everywhere

---

## 12) `tags`
Reusable tags.

### Fields
- `id uuid primary key`
- `name text unique not null`
- `slug text unique not null`
- `created_at timestamptz not null default now()`

## 13) Join tables for tags
### `work_tags`
- `work_id uuid not null references works(id) on delete cascade`
- `tag_id uuid not null references tags(id) on delete cascade`
- primary key (`work_id`, `tag_id`)

### `writing_tags`
- `writing_entry_id uuid not null references writing_entries(id) on delete cascade`
- `tag_id uuid not null references tags(id) on delete cascade`
- primary key (`writing_entry_id`, `tag_id`)

### `music_tags`
- `music_project_id uuid not null references music_projects(id) on delete cascade`
- `tag_id uuid not null references tags(id) on delete cascade`
- primary key (`music_project_id`, `tag_id`)

### `novel_tags`
- `novel_project_id uuid not null references novel_projects(id) on delete cascade`
- `tag_id uuid not null references tags(id) on delete cascade`
- primary key (`novel_project_id`, `tag_id`)

---

## 14) `admin_users`
Profile layer for dashboard users.

### Fields
- `id uuid primary key`  
  Should match Supabase Auth user id when possible
- `email text unique not null`
- `display_name text`
- `role user_role not null default 'owner'`
- `avatar_url text`
- `is_active boolean not null default true`
- `last_login_at timestamptz`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- auth identity is managed by Supabase Auth
- this table stores application profile and role

---

## 15) `contact_inquiries`
For contact form submissions and lead routing.

### Fields
- `id uuid primary key`
- `inquiry_type inquiry_type not null default 'general'`
- `full_name text not null`
- `email text not null`
- `subject text`
- `message text not null`
- `related_entity_type text`
- `related_entity_id uuid`
- `status text not null default 'new'`  
  Example: `new`, `reviewed`, `replied`, `archived`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- store minimal personal data only
- if spam filtering is added later, create separate fields rather than overloading `status`

---

## 16) `seo_overrides`
Optional route-level SEO control.

### Fields
- `id uuid primary key`
- `route_path text unique not null`
- `meta_title text`
- `meta_description text`
- `og_image_asset_id uuid references media_assets(id) on delete set null`
- `no_index boolean not null default false`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

### Rules
- use only where section or entity defaults are not enough

---

## Recommended Prisma modeling notes

### Common model mixin pattern
Every content model should include:
- `id`
- `slug`
- `status`
- `isFeatured`
- `seoTitle`
- `seoDescription`
- `publishedAt`
- `archivedAt`
- `createdAt`
- `updatedAt`

### Timestamps
- use database default `now()` for create
- update `updated_at` in app layer or with trigger

### Slugs
- validate uniqueness before publish
- use route-aware uniqueness globally for simplicity in v1

### Markdown handling
- store markdown in database
- render to HTML at build/runtime with sanitization

## Supabase storage bucket recommendation
Create separate buckets:
- `site-images`
- `site-video`
- `site-audio`
- `site-documents`
- `site-3d`

Path format:
- `works/<slug>/cover.jpg`
- `works/<slug>/detail-01.jpg`
- `writing/<slug>/cover.jpg`
- `music/<slug>/cover.jpg`
- `novel/<slug>/cover.jpg`
- `exhibitions/<slug>/hero.jpg`

## RLS recommendation
For v1:
- public read access should come through the web app, not direct public table access
- admin write access should require authenticated users with matching admin profile role
- storage write access should be restricted to authenticated admin users
- contact inquiries should be insert-only from public frontend, never public readable

## Seed data recommendation
Seed these immediately:
- the seven canonical sections
- one site settings row
- one owner admin user profile after first auth signup
- a few placeholder feature slots

## Non-negotiable guardrails
- do not collapse all creative content into one generic `posts` table
- do not collapse all media relationships into a single vague JSON field
- do not make section labels editable beyond copy and display configuration
- do not make the seven section keys unstable
- do not treat the Dream section as a blog bucket

## Suggested implementation order
1. create enums
2. create core tables: site_settings, sections, admin_users, media_assets
3. create content tables: works, writing_entries, music_projects, novel_projects, exhibitions, pulse_offerings
4. create join tables and media mapping tables
5. create contact_inquiries and seo_overrides
6. seed canonical sections and defaults
7. implement RLS and storage policies
8. build admin forms against these models
