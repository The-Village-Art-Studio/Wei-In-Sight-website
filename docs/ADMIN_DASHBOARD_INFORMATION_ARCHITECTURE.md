# Admin Dashboard Information Architecture

## 1. Purpose
This document defines the structure of the new **WEI IN SIGHT** admin dashboard.

The dashboard must feel editorial, calm, and highly usable.
It should support the public website's poetic world without becoming abstract or confusing.

The admin is not a generic CMS.
It is a creative control room for:
- publishing artworks
- managing writing and music
- curating section pages
- handling inquiries and collector-facing content
- controlling homepage emphasis
- keeping the entire site consistent

## 2. Product principle
The public site is symbolic.
The admin must be practical.

That means:
- frontend labels can be poetic
- backend labels must be explicit
- all content should still map cleanly to the body-navigation system

Example:
- frontend label: `Dream`
- backend helper label: `Dream — Novel & Story World`

## 3. Primary admin goals
The dashboard should make it easy to:
1. create and edit content quickly
2. assign each entry to the correct section
3. manage media and metadata cleanly
4. control featured placement and publish state
5. preview content before publishing
6. scale later without rebuilding the admin structure

## 4. Recommended top-level sidebar
Use a left sidebar with clear grouping.

### Group A — Overview
- Dashboard
- Quick Drafts
- Search

### Group B — Content
- Works
- Writing
- Music
- Exhibitions & Features
- Pulse
- Sections
- Homepage

### Group C — Media & taxonomy
- Media Library
- Collections
- Tags

### Group D — Operations
- Inquiries
- Schedule Queue
- Redirects

### Group E — System
- SEO
- Site Settings
- Navigation Settings
- Users & Roles
- Activity Log

## 5. Sidebar behavior rules
- Keep the sidebar always visible on desktop.
- Allow collapse to icon-only mode.
- Preserve the user's last sidebar state.
- Show item counts where useful.
- Highlight active section clearly.
- Never hide critical routes behind ambiguous naming.

## 6. Dashboard home layout
The first screen should feel like a calm control panel, not analytics overload.

### Recommended dashboard widgets
#### A. Publishing snapshot
- drafts count
- in review count
- scheduled count
- published this month

#### B. Quick actions
- New Work
- New Poem / Writing Entry
- New Music Entry
- New Exhibition / Feature
- New Pulse Entry
- Upload Media

#### C. Recently edited
List the most recently updated entries across content types.

#### D. Upcoming scheduled items
Show title, type, status, publish date.

#### E. Homepage spotlight status
Display which items are currently featured on:
- homepage hero
- homepage section highlights
- section heroes

#### F. Inquiry summary
If inquiries are tracked in-dashboard, show unread and recent inquiry count.

## 7. Core content modules

### 7.1 Works
For visual and material-based work.

Use for:
- paintings
- photography
- sculpture
- mixed media
- textile / fabric work
- experimental material pieces

Default list columns:
- title
- primary section
- subtype
- year
- status
- featured
- updated at

Default filters:
- section
- subtype
- year
- status
- featured

### 7.2 Writing
For language-driven content.

Use for:
- poems
- lyrics
- journal fragments
- spoken word text
- long-form writing support content
- novel-related entries if they are article-like rather than product-like

Default list columns:
- title
- writing type
- section
- status
- featured
- publish date

Default filters:
- type
- section
- status
- featured
- publish date

### 7.3 Music
For audio releases and related content.

Use for:
- songs
- music pages
- streaming links
- audio-visual releases
- archived releases

Default list columns:
- title
- release type
- status
- featured
- release date

Default filters:
- type
- platform availability
- status
- featured

### 7.4 Exhibitions & Features
For public-facing appearances and credibility content.

Use for:
- exhibitions
- showcases
- interviews
- press mentions
- collaborations
- features

Default list columns:
- title
- item type
- venue or outlet
- date
- status
- featured

Default filters:
- item type
- year
- status
- featured

### 7.5 Pulse
For collector-facing and exchange-facing content.

Use for:
- available works
- commission offerings
- inquiry landing content
- collector notes
- shop support content
- call-to-action modules

Default list columns:
- title
- pulse type
- availability
- status
- featured

Default filters:
- pulse type
- availability
- status
- featured

### 7.6 Sections
For top-level section pages.

Use for:
- Sight
- Sound
- Touch
- Voice
- Dream
- Heart
- Pulse

This module should be tightly controlled.
It is not a high-volume content area.

Default list columns:
- canonical key
- public label
- hero title
- published status
- updated at

### 7.7 Homepage
For homepage-specific composition.

Use for:
- hero statement
- intro line
- section highlight selections
- featured content ordering
- landing page call-to-action content

This should be one highly controlled editor screen, not a cluttered list.

## 8. Supporting modules

### 8.1 Media Library
Should support:
- image upload
- video cover assets
- audio cover assets
- alt text
- credits
- focal point
- usage reference

Recommended columns:
- filename
- media type
- dimensions
- usage count
- uploaded at

Recommended filters:
- type
- orientation
- used / unused
- year

### 8.2 Collections
Use for grouping works editorially.

Examples:
- neon memory studies
- romantic watercolor series
- featured installations

Collections allow one work to live inside a larger curatorial frame without changing its primary type.

### 8.3 Tags
Use tags lightly.
Do not let tags replace section mapping.

Good tag examples:
- neon
- memory
- migration
- sci-fi
- romance
- fabric
- urban-night

### 8.4 Inquiries
Use if the site collects:
- commission inquiries
- collector inquiries
- collaboration requests
- general contact submissions

Columns:
- subject
- type
- sender name
- sender email
- status
- received at

Statuses:
- new
- opened
- in progress
- resolved
- archived

### 8.5 Schedule Queue
A calendar-like or list-like view of scheduled publication.

Use for:
- upcoming poems
- future song releases
- exhibition announcements
- homepage timed content

### 8.6 Redirects
Useful during rebuild migration.

Use for:
- old slug to new slug mappings
- retired pages
- legacy content migration safety

## 9. Global search design
Global search should search across:
- titles
- slugs
- short descriptions
- content type
- section mapping
- tags

Search results should display:
- title
- content type
- section
- status
- quick actions

Quick actions:
- open edit
- open preview
- duplicate

## 10. Create flow
The create flow should be explicit.
Do not force users into one giant undifferentiated “New Entry” screen.

Recommended create menu:
- New Work
- New Writing Entry
- New Music Entry
- New Exhibition / Feature
- New Pulse Entry
- New Collection
- New Media Upload

## 11. List view design rules
All list views should support:
- keyword search
- filter chips
- sort by updated date or publish date
- bulk actions
- row click to edit
- status badges
- featured indicator
- duplicate action

Bulk actions should allow:
- move to review
- publish
- archive
- delete draft
- add/remove tags

## 12. Entry page layout pattern
Every entry editor should follow a consistent layout.

### Left main column
- core content fields
- descriptions
- editorial content
- media gallery

### Right utility column
- status and visibility
- section mapping
- featured toggle
- publish date
- SEO
- slug
- preview button
- save actions

This layout keeps content writing central and publishing controls secondary but always visible.

## 13. Recommended section mapping helpers
Every relevant create/edit screen should show a helper note.

Example helper:
- `Sight` = paintings, photography, sculpture, collections
- `Touch` = mixed media, process, tactile experiments
- `Voice` = poems, lyrics, spoken language
- `Dream` = novel, long-form story world, excerpts

This reduces accidental misclassification.

## 14. Homepage editor structure
The homepage editor should have structured panels.

### Panel A — Hero copy
- eyebrow text
- heading
- subheading
- optional call-to-action text

### Panel B — Landing page body-navigation helper copy
- microcopy line
- fallback explanatory line for accessibility or mobile

### Panel C — Highlight selections
Choose featured items for:
- Sight
- Sound
- Touch
- Voice
- Dream
- Heart
- Pulse

### Panel D — Display rules
- enable or disable selected homepage modules
- set ordering
- set temporary highlights

### Panel E — SEO
- homepage title
- homepage description
- social sharing image

## 15. Navigation settings screen
The admin should allow controlled editing of:
- poetic labels
- practical subtitles
- menu order
- section availability
- submenu labels

Important rule:
Do not allow uncontrolled renaming of canonical keys.
Canonical keys must remain stable.

## 16. Activity log
Track:
- create
- edit
- publish
- schedule
- archive
- delete
- login activity

Useful fields:
- user
- action
- content type
- item title
- timestamp

## 17. Future-friendly notes
The architecture should support later expansion without rethinking the dashboard.

Potential future additions:
- shop inventory sync
- order management
- newsletter publishing
- multilingual fields
- version history
- rich analytics

Do not force these into the first build unless needed.
Build clean foundations first.

## 18. Non-negotiable consistency rules
- use clear backend labels
- preserve the public section system
- keep editorial controls simple
- never let the admin become more theatrical than the public site
- prioritize clarity over novelty
- structure the admin for speed, not spectacle
