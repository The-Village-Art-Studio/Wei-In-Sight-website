# WEI IN SIGHT — Database and Schema Planning

## Purpose
This document defines the recommended data architecture for the WEI IN SIGHT rebuild.

It is intended to help Antigravity, Google Stitch MCP, and any future engineers build the new web app and new admin dashboard on a stable, scalable, content-first foundation.

This schema is designed for:
- a fresh frontend
- a fresh admin dashboard
- Option B section destinations (dedicated pages)
- a portfolio + writing + music + collector/contact ecosystem
- a future-safe system that can grow without breaking the core concept

---

## Core principles

1. **Content-first, not page-hardcoded**
   The system must treat artworks, poems, music, novel content, exhibitions, and collector-facing entries as structured content records.

2. **One creative world, multiple section lenses**
   The site navigation uses poetic section labels, but the database must remain explicit and practical.

3. **Separate content model from presentation model**
   The frontend may show content in immersive or cinematic ways, but the database should stay clean and normalized.

4. **Editorial flexibility**
   The admin dashboard should allow featured items, ordering, status control, SEO fields, and future expansion.

5. **Avoid over-fragmentation**
   The schema should be rich enough to support the site, but not so abstract that editing becomes painful.

---

## Recommended stack assumption

This planning assumes a modern app stack such as:
- PostgreSQL as the database
- Prisma or Drizzle as the ORM
- Next.js for both web and admin surfaces
- a shared types package if using a monorepo

This document does not require a specific database vendor, but PostgreSQL is strongly recommended.

---

## High-level content model

Main conceptual buckets:
- Site settings and global configuration
- Sections
- Works
- Writing
- Music
- Exhibitions / features
- Shop / commissions / collector-facing inquiries
- Media assets
- SEO metadata
- Tags and relationships
- Admin users and audit information

---

## Canonical section system

Frontend poetic labels map to canonical section keys.

| section_key | frontend_label | practical_meaning |
|---|---|---|
| sight | Sight | Visual Arts |
| sound | Sound | Music & Audio |
| touch | Touch | Mixed Media & Process |
| voice | Voice | Poems & Lyrics |
| dream | Dream | Novel & Story World |
| heart | Heart | About / Philosophy / Journey |
| pulse | Pulse | Buy Art / Commissions / Contact |

These section keys should be stored as enums or constrained strings.

Recommended enum: `section_key`
- `sight`
- `sound`
- `touch`
- `voice`
- `dream`
- `heart`
- `pulse`

---

## Recommended database entities

### 1. admin_users
Represents dashboard users.

**Fields**
- `id` UUID primary key
- `email` unique
- `full_name`
- `role` enum
- `status` enum
- `avatar_url` nullable
- `last_login_at` nullable
- `created_at`
- `updated_at`

**Suggested role enum**
- `owner`
- `editor`
- `contributor`
- `viewer`

**Suggested status enum**
- `active`
- `invited`
- `disabled`

---

### 2. site_settings
Global site configuration. Usually one active record.

**Fields**
- `id` UUID primary key
- `site_title`
- `site_subtitle`
- `site_description`
- `default_og_image_asset_id` nullable FK to `media_assets`
- `primary_email`
- `instagram_url` nullable
- `spotify_url` nullable
- `youtube_url` nullable
- `tiktok_url` nullable
- `shop_url` nullable
- `location_label` nullable
- `copyright_line` nullable
- `hero_intro_heading`
- `hero_intro_body`
- `hero_microcopy` nullable
- `theme_mode` default `dark`
- `primary_color_hex`
- `secondary_color_hex`
- `accent_color_hex` nullable
- `is_live` boolean default true
- `created_at`
- `updated_at`

---

### 3. sections
One record per main destination section.

**Purpose**
Stores section-level copy and configuration for:
- Sight
- Sound
- Touch
- Voice
- Dream
- Heart
- Pulse

**Fields**
- `id` UUID primary key
- `section_key` unique enum
- `frontend_label`
- `practical_label`
- `slug` unique
- `short_description`
- `long_intro_markdown` nullable
- `hero_title`
- `hero_subtitle` nullable
- `hero_body` nullable
- `hero_image_asset_id` nullable FK
- `cover_image_asset_id` nullable FK
- `seo_title` nullable
- `seo_description` nullable
- `seo_image_asset_id` nullable FK
- `nav_order` integer
- `is_visible` boolean default true
- `created_at`
- `updated_at`

**Notes**
- `slug` should likely match the route, for example `/sight`, `/sound`, etc.
- Do not let editors create arbitrary new section keys unless the system is intentionally being expanded.

---

### 4. media_assets
Central asset library.

**Purpose**
Used by works, writing, music, sections, SEO, and future pages.

**Fields**
- `id` UUID primary key
- `storage_provider` enum or string
- `storage_path`
- `public_url`
- `mime_type`
- `file_size_bytes`
- `width` nullable
- `height` nullable
- `duration_seconds` nullable
- `alt_text` nullable
- `caption` nullable
- `dominant_color` nullable
- `blurhash` nullable
- `focal_point_x` nullable
- `focal_point_y` nullable
- `uploaded_by_user_id` nullable FK
- `created_at`
- `updated_at`

**Asset type behavior**
You may also derive asset type from mime type or store an explicit enum.

Suggested enum:
- `image`
- `video`
- `audio`
- `document`
- `other`

---

### 5. tags
Reusable taxonomy system.

**Fields**
- `id` UUID primary key
- `name` unique
- `slug` unique
- `tag_type` enum or constrained string
- `description` nullable
- `created_at`
- `updated_at`

**Suggested tag_type values**
- `theme`
- `medium`
- `mood`
- `material`
- `series`
- `topic`
- `platform`

This helps avoid overloading categories.

---

### 6. works
Primary table for visual and physical creative works.

**Use for**
- paintings
- photography
- sculpture
- mixed media pieces
- object-based work
- experimental materials
- selected process-led works if they should live as standalone entries

**Fields**
- `id` UUID primary key
- `title`
- `slug` unique
- `section_key` enum
- `work_type` enum
- `series_name` nullable
- `year_created` nullable integer
- `status` enum
- `availability_status` enum
- `is_featured` boolean default false
- `is_pinned` boolean default false
- `short_excerpt` nullable
- `description_markdown` nullable
- `medium` nullable
- `dimensions` nullable
- `price_text` nullable
- `currency_code` nullable
- `primary_image_asset_id` nullable FK
- `cover_image_asset_id` nullable FK
- `sort_order` integer default 0
- `published_at` nullable
- `created_by_user_id` nullable FK
- `updated_by_user_id` nullable FK
- `created_at`
- `updated_at`

**Suggested work_type enum**
- `painting`
- `photography`
- `sculpture`
- `mixed_media`
- `object_design`
- `installation`
- `process_piece`
- `other`

**Suggested status enum**
- `draft`
- `review`
- `scheduled`
- `published`
- `archived`

**Suggested availability_status enum**
- `not_for_sale`
- `available`
- `sold`
- `reserved`
- `commission_only`
- `inquiry_only`

---

### 7. work_assets
Join table for work galleries.

**Fields**
- `id` UUID primary key
- `work_id` FK
- `asset_id` FK
- `asset_role` enum
- `sort_order` integer
- `caption` nullable
- `created_at`

**Suggested asset_role enum**
- `cover`
- `gallery`
- `detail`
- `process`
- `video`

---

### 8. work_tags
Join table for many-to-many work tagging.

**Fields**
- `work_id` FK
- `tag_id` FK

Composite unique key recommended.

---

### 9. writing_entries
Primary writing table.

**Use for**
- poems
- lyrics
- journal fragments
- artist reflections
- novel-related excerpts if you want all writing unified

**Fields**
- `id` UUID primary key
- `title`
- `slug` unique
- `section_key` enum
- `writing_type` enum
- `series_name` nullable
- `short_excerpt` nullable
- `body_markdown` nullable
- `body_richtext_json` nullable
- `reading_time_minutes` nullable
- `is_featured` boolean default false
- `is_sensitive_preview` boolean default false
- `cover_image_asset_id` nullable FK
- `audio_asset_id` nullable FK
- `published_at` nullable
- `status` enum
- `seo_title` nullable
- `seo_description` nullable
- `created_by_user_id` nullable FK
- `updated_by_user_id` nullable FK
- `created_at`
- `updated_at`

**Suggested writing_type enum**
- `poem`
- `lyric`
- `spoken_word`
- `journal_fragment`
- `artist_statement`
- `excerpt`
- `essay`
- `other`

**Recommendation**
- `voice` is the default section for poems and lyrics
- `dream` may be used for novel excerpts if desired

---

### 10. writing_tags
Join table for writing tagging.

**Fields**
- `writing_entry_id` FK
- `tag_id` FK

Composite unique key recommended.

---

### 11. music_entries
Structured music records.

**Use for**
- songs
- releases
- audio projects
- soundtrack-like pieces
- future albums or EPs

**Fields**
- `id` UUID primary key
- `title`
- `slug` unique
- `release_type` enum
- `section_key` enum default `sound`
- `short_description` nullable
- `body_markdown` nullable
- `cover_image_asset_id` nullable FK
- `audio_asset_id` nullable FK
- `release_date` nullable
- `duration_seconds` nullable
- `lyrics_writing_entry_id` nullable FK to `writing_entries`
- `is_featured` boolean default false
- `status` enum
- `spotify_url` nullable
- `apple_music_url` nullable
- `youtube_url` nullable
- `soundcloud_url` nullable
- `bandcamp_url` nullable
- `external_embed_code` nullable if needed
- `seo_title` nullable
- `seo_description` nullable
- `created_by_user_id` nullable FK
- `updated_by_user_id` nullable FK
- `created_at`
- `updated_at`

**Suggested release_type enum**
- `single`
- `ep`
- `album`
- `sound_project`
- `music_video`
- `live_session`
- `other`

---

### 12. music_tags
Join table for music tagging.

**Fields**
- `music_entry_id` FK
- `tag_id` FK

---

### 13. novel_projects
Dedicated table for long-form story worlds.

**Why separate from writing_entries?**
Because the novel likely needs its own structure, metadata, and expandable story-world layer.

**Fields**
- `id` UUID primary key
- `title`
- `slug` unique
- `status` enum
- `project_type` enum default `novel`
- `one_line_pitch` nullable
- `short_synopsis` nullable
- `long_synopsis_markdown` nullable
- `cover_image_asset_id` nullable FK
- `hero_image_asset_id` nullable FK
- `release_date` nullable
- `purchase_url` nullable
- `sample_url` nullable
- `is_featured` boolean default false
- `seo_title` nullable
- `seo_description` nullable
- `seo_image_asset_id` nullable FK
- `created_by_user_id` nullable FK
- `updated_by_user_id` nullable FK
- `created_at`
- `updated_at`

**Suggested status enum**
- `draft`
- `in_progress`
- `announced`
- `published`
- `archived`

**Recommended use**
Use this table for the novel as a project-level record, then connect excerpts and story fragments through a child table.

---

### 14. novel_content_entries
Child records related to a novel or story-world project.

**Use for**
- excerpts
- behind-the-story notes
- character notes
- worldbuilding fragments
- timeline pieces

**Fields**
- `id` UUID primary key
- `novel_project_id` FK
- `entry_type` enum
- `title`
- `slug` unique
- `short_excerpt` nullable
- `body_markdown` nullable
- `cover_image_asset_id` nullable FK
- `sort_order` integer default 0
- `is_featured` boolean default false
- `status` enum
- `published_at` nullable
- `created_by_user_id` nullable FK
- `updated_by_user_id` nullable FK
- `created_at`
- `updated_at`

**Suggested entry_type enum**
- `excerpt`
- `behind_the_story`
- `character_note`
- `world_note`
- `timeline_note`
- `bonus_content`
- `other`

---

### 15. exhibitions
Public exhibitions, showcases, or featured appearances.

**Fields**
- `id` UUID primary key
- `title`
- `slug` unique
- `event_type` enum
- `venue_name` nullable
- `location_label` nullable
- `start_date` nullable
- `end_date` nullable
- `short_description` nullable
- `body_markdown` nullable
- `cover_image_asset_id` nullable FK
- `external_url` nullable
- `is_featured` boolean default false
- `status` enum
- `created_by_user_id` nullable FK
- `updated_by_user_id` nullable FK
- `created_at`
- `updated_at`

**Suggested event_type enum**
- `exhibition`
- `feature`
- `interview`
- `podcast`
- `publication`
- `event`
- `other`

---

### 16. pulse_offerings
Collector-facing and inquiry-facing records.

**Use for**
- commission offerings
- collector notes
- inquiry paths
- service cards if needed
- special purchase categories

**Fields**
- `id` UUID primary key
- `title`
- `slug` unique
- `offering_type` enum
- `short_description` nullable
- `body_markdown` nullable
- `cover_image_asset_id` nullable FK
- `cta_label` nullable
- `cta_url` nullable
- `is_featured` boolean default false
- `sort_order` integer default 0
- `status` enum
- `created_at`
- `updated_at`

**Suggested offering_type enum**
- `buy_art`
- `commission`
- `collector_info`
- `contact_path`
- `limited_release`
- `other`

---

### 17. inquiry_submissions
Captured form submissions from public-facing site.

**Fields**
- `id` UUID primary key
- `inquiry_type` enum
- `full_name`
- `email`
- `subject` nullable
- `message`
- `related_work_id` nullable FK
- `related_pulse_offering_id` nullable FK
- `status` enum
- `notes_internal` nullable
- `submitted_at`
- `updated_at`

**Suggested inquiry_type enum**
- `general`
- `collector`
- `commission`
- `press`
- `collaboration`

**Suggested status enum**
- `new`
- `in_progress`
- `responded`
- `closed`
- `spam`

---

### 18. seo_overrides
Optional table for page-level SEO overrides.

This can also be embedded directly in each content table. Use a separate table only if you want a unified SEO system.

**Fields**
- `id` UUID primary key
- `entity_type`
- `entity_id`
- `seo_title` nullable
- `seo_description` nullable
- `seo_image_asset_id` nullable FK
- `canonical_url` nullable
- `no_index` boolean default false
- `created_at`
- `updated_at`

If simplicity is preferred, skip this table and keep SEO fields on each entity.

---

### 19. audit_log
Recommended for admin accountability.

**Fields**
- `id` UUID primary key
- `user_id` nullable FK
- `action_type`
- `entity_type`
- `entity_id`
- `before_json` nullable
- `after_json` nullable
- `created_at`

This is optional at first, but good for a durable admin system.

---

## Recommended relationships

### Core relationships
- `sections` is mostly standalone and configuration-driven.
- `works.section_key` references the canonical section system, usually `sight` or `touch`.
- `writing_entries.section_key` usually references `voice` or `dream`.
- `music_entries.section_key` should default to `sound`.
- `novel_projects` maps conceptually to `dream`.
- `exhibitions` may surface inside `heart`.
- `pulse_offerings` maps to `pulse`.

### Asset relationships
- one `media_asset` can be referenced by many records
- `work_assets` handles ordered galleries

### Tag relationships
- many-to-many through join tables

---

## Route mapping recommendation

Suggested dedicated route structure:

- `/` — landing page
- `/sight`
- `/sight/[slug]`
- `/sound`
- `/sound/[slug]`
- `/touch`
- `/touch/[slug]`
- `/voice`
- `/voice/[slug]`
- `/dream`
- `/dream/[slug]`
- `/heart`
- `/heart/exhibitions/[slug]` if needed
- `/pulse`
- `/pulse/[slug]` if using dedicated offering pages
- `/contact`

Novel structure recommendation:
- `/dream` for the section landing page
- `/dream/the-dinner` or `/dream/[slug]` for the novel project page
- `/dream/[novel-slug]/[entry-slug]` if detailed child entries are public

---

## Editorial status model

Use a common publish lifecycle where possible.

Recommended shared status values for most editorial content:
- `draft`
- `review`
- `scheduled`
- `published`
- `archived`

For longer-form novel projects, `in_progress` and `announced` may also be useful.

---

## Suggested validation rules

### Slugs
- lowercase
- hyphen-separated
- unique within their table
- immutable after publish unless intentional redirect handling exists

### Excerpts
- keep short excerpts concise for cards and previews
- do not auto-truncate full body content in a destructive way

### SEO
- all publishable records should support SEO title and description fields
- enforce fallback rules when explicit SEO fields are empty

### Images
- require alt text for meaningful public-facing images where practical
- cover/hero images should be validated for minimum size

### Dates
- `published_at` required before status becomes `published`
- `release_date` optional for works, stronger for music or novels

---

## Minimal MVP schema vs future-ready schema

### MVP entities
If you want the leanest first ship, start with:
- `admin_users`
- `site_settings`
- `sections`
- `media_assets`
- `works`
- `work_assets`
- `writing_entries`
- `music_entries`
- `novel_projects`
- `novel_content_entries`
- `exhibitions`
- `pulse_offerings`
- `inquiry_submissions`

### Phase 2 entities
Add later if needed:
- `tags`
- join tables
- `seo_overrides`
- `audit_log`
- richer analytics/event tables

---

## Recommended admin module mapping

| admin_module | main_table | notes |
|---|---|---|
| Dashboard | multiple | summary metrics and recent activity |
| Site Settings | site_settings | usually one active record |
| Sections | sections | one record per main destination |
| Works | works | with work_assets and work_tags |
| Writing | writing_entries | poems, lyrics, excerpts, statements |
| Music | music_entries | songs, platforms, covers |
| Novel | novel_projects + novel_content_entries | project + child entries |
| Exhibitions / Features | exhibitions | events and appearances |
| Pulse | pulse_offerings | collector-facing content |
| Media Library | media_assets | upload and asset management |
| Inquiries | inquiry_submissions | contact and commission pipeline |
| Users | admin_users | permissions |

---

## Suggested table naming style

Use plural snake_case table names consistently.
Examples:
- `admin_users`
- `site_settings`
- `media_assets`
- `writing_entries`
- `novel_projects`

Do not mix singular and plural table naming.

---

## Recommended Prisma-style enum sketch

```ts
export enum SectionKey {
  sight
  sound
  touch
  voice
  dream
  heart
  pulse
}

export enum PublishStatus {
  draft
  review
  scheduled
  published
  archived
}
```

Additional enums should be created for:
- role
- work_type
- writing_type
- release_type
- offering_type
- inquiry_type
- availability_status

---

## Sample entity ownership / audit fields

Recommended reusable pattern:
- `created_at`
- `updated_at`
- `created_by_user_id`
- `updated_by_user_id`

This should be added to most admin-managed content tables.

---

## Search and filtering needs

The schema should support admin filters for:
- section
- content type
- status
- featured
- year
- availability
- release date
- tags
- updated date

This argues for explicit indexed columns, not overly nested JSON-only data.

---

## Indexing recommendations

At minimum, index:
- all `slug` fields uniquely
- all `section_key` fields
- all `status` fields
- `published_at`
- `is_featured`
- `sort_order`
- common foreign keys

Also consider indexes on:
- `year_created`
- `release_date`
- `availability_status`
- `submitted_at` for inquiries

---

## Migration strategy from the old site

Because this is a fresh rebuild, use migration in this order:

1. finalize canonical schema
2. build admin forms and validation
3. create seed section records
4. migrate core assets
5. migrate works
6. migrate writing
7. migrate music
8. migrate novel/project records
9. migrate exhibitions / feature history
10. QA all slugs, previews, and SEO fields

Do not migrate content before the schema is stabilized.

---

## Seed data recommendation

Seed the following immediately:

### sections
- sight
- sound
- touch
- voice
- dream
- heart
- pulse

### site settings
One starter record containing:
- site title
- subtitle
- default colors
- initial social links
- intro heading
- intro body

### admin user
Owner account for Jacky

---

## Frontend querying recommendation

For public pages, fetch only published records.

Examples:
- `/sight` → published `works` where `section_key = sight`
- `/touch` → published `works` where `section_key = touch`
- `/voice` → published `writing_entries` where `section_key = voice`
- `/dream` → featured `novel_projects`, featured `novel_content_entries`, optional dream-related writing
- `/sound` → published `music_entries`
- `/heart` → section content + exhibitions/features
- `/pulse` → published `pulse_offerings`

Do not hardcode content directly into pages when it should live in the admin.

---

## Non-negotiable schema rules

1. Keep the canonical section system fixed and explicit.
2. Keep public routes aligned with section keys.
3. Do not merge all creative content into a single generic `posts` table.
4. Do not hardcode homepage content when it belongs in structured records.
5. Do not build a schema that assumes the current old dashboard will be reused.
6. Preserve clean slugs and stable publishing states.
7. Preserve room for collector-facing and novel-specific growth.

---

## Antigravity implementation instruction

When building the new database and shared types:
- create explicit typed entities for each core content type
- use enums for canonical section keys and status values
- support future-safe media relationships
- support publish states and ordering
- optimize for a clean admin editing experience
- do not collapse the schema into one generic catch-all content model

---

## Final recommendation

Build the schema as a **creative content platform**, not a generic blog, not a one-off portfolio, and not a CMS improvised around old categories.

The frontend may feel like a dream in neon.
The database should feel calm, structured, and exact.
