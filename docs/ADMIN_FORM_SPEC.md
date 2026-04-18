# Admin Form Specification

## 1. Purpose
This document defines the structure and behavior of create/edit forms in the **WEI IN SIGHT** admin dashboard.

The goal is consistency.
No matter which content type is being created, the editor should feel familiar.

## 2. Shared form architecture
Every create/edit screen should use the same high-level field groups where relevant.

Recommended order:
1. Core identity
2. Classification
3. Editorial content
4. Media
5. Display controls
6. SEO and metadata
7. Publish controls

## 3. Shared field groups

### 3.1 Core identity
Use these fields whenever applicable:
- Title
- Internal note (optional, admin-only)
- Slug
- Short excerpt

Rules:
- title should be public-facing unless marked internal
- slug should auto-generate, but remain editable
- excerpt should be concise and meaningful

### 3.2 Classification
Use these fields whenever applicable:
- Primary section
- Content type
- Subtype
- Tags
- Collection association

Rules:
- only one primary section
- subtype must come from controlled options
- tags remain optional and lightweight

### 3.3 Editorial content
Use as needed:
- Description
- Full body content
- Quote / highlighted line
- Credits
- Related links

### 3.4 Media
Use as needed:
- Cover image
- Gallery
- Audio cover
- Video thumbnail
- Embedded media URL
- Alt text
- Credit line
- Focal point

### 3.5 Display controls
Use as needed:
- Featured toggle
- Sort order
- Show on homepage
- Show in section hero
- Hide from feeds

### 3.6 SEO and metadata
Use as needed:
- SEO title
- SEO description
- Social image
- Canonical URL override

### 3.7 Publish controls
Use on all publishable entries:
- Status
- Publish date
- Scheduled date/time
- Archive toggle

## 4. Works form
Use for visual and tactile works.

### Required fields
- Title
- Slug
- Primary section
- Work subtype
- Year
- Excerpt
- Description
- Cover image
- Status

### Optional fields
- Medium
- Dimensions
- Series / collection
- Gallery images
- Availability
- Price display flag
- External purchase link
- Related works
- Process notes

### Allowed sections
- Sight
- Touch
- Pulse

### Work subtypes
Recommended controlled options:
- painting
- photography
- sculpture
- mixed-media
- textile
- installation
- experimental-object
- process-study

### Layout suggestion
#### Left column
- title
- excerpt
- description
- gallery
- process notes

#### Right column
- section
- subtype
- year
- medium
- dimensions
- availability
- featured
- SEO
- publish controls

## 5. Writing form
Use for poems, lyrics, journal fragments, and article-like writing.

### Required fields
- Title
- Slug
- Writing type
- Primary section
- Excerpt
- Body content
- Status

### Optional fields
- Reading time
- Audio reading link
- Cover image
- Pull quote
- Related writing
- associated project or novel reference

### Allowed sections
- Voice
- Dream
- Heart

### Writing types
- poem
- lyric
- journal-fragment
- spoken-word-text
- essay
- note
- excerpt

### Important rule
If the entry is a novel-support entry, it still uses one clear writing type.
Do not create vague catch-all types.

## 6. Music form
Use for songs and music releases.

### Required fields
- Title
- Slug
- Release type
- Excerpt
- Cover image
- Release date
- Status

### Optional fields
- streaming links
- lyrics preview
- credits
- BPM
- key
- mood tags
- music video link
- audio embed

### Release types
- single
- EP
- album-track
- demo
- soundtrack-piece
- audiovisual-piece

### Allowed sections
- Sound
- Voice

## 7. Exhibitions & Features form
Use for public appearances and external recognition.

### Required fields
- Title
- Slug
- Item type
- Date
- Venue or outlet
- Excerpt
- Status

### Optional fields
- city
- country
- partner
- poster image
- gallery images
- external link
- press quote
- participation note

### Item types
- exhibition
- showcase
- workshop
- interview
- feature
- collaboration
- press

### Allowed sections
- Heart
- Sight
- Pulse

## 8. Pulse form
Use for buyer-facing and inquiry-facing entries.

### Required fields
- Title
- Slug
- Pulse type
- Excerpt
- Status

### Optional fields
- CTA label
- CTA destination
- inquiry form selection
- availability badge
- price note
- featured artwork reference
- response expectation note

### Pulse types
- available-work
- commission-offer
- collector-note
- inquiry-page-module
- call-to-action

### Allowed sections
- Pulse

## 9. Section form
Use for one of the seven top-level sections only.

### Required fields
- Canonical key
- Public poetic label
- Practical label
- Hero title
- Hero subtitle
- Intro text
- SEO title
- SEO description

### Optional fields
- Hero media
- section quote
- section CTA
- body-anchor helper text
- section order

### Rule
Canonical key is fixed once created.
Do not allow arbitrary key editing after initial setup.

## 10. Homepage form
Prefer a structured singleton editor rather than repeatable items.

### Required fields
- Hero heading
- Hero subheading
- Intro line

### Optional fields
- Accessibility helper line
- selected section highlights
- temporary campaign item
- CTA labels and destinations
- SEO fields

## 11. Media input rules

### Images
- require alt text on public-facing uploads
- allow optional credit line
- support focal point selection
- support crop preview

### Audio/video links
- validate URL format
- detect platform when possible
- allow fallback external URL

## 12. Validation rules

### Strong validation
Use required-field validation for:
- title
- slug
- status
- primary section where applicable
- content-type-specific required fields

### Soft validation
Warn but do not block for:
- missing SEO description
- missing related items
- missing gallery assets
- no featured image on non-featured entries

## 13. Save actions
Every editor should offer:
- Save Draft
- Save and Continue
- Submit for Review
- Publish Now
- Schedule
- Archive
- Preview

Not every role should see every action.
Role control is defined in the permissions file.

## 14. Duplicate action
Support duplication for:
- works
- writing entries
- exhibitions
- pulse entries

When duplicating:
- append “copy” internally
- reset slug
- reset publish state to draft
- preserve media references unless intentionally detached

## 15. Preview behavior
Preview should open a clean public-like preview.

Preview must reflect:
- page layout
- hero content
- media
- copy
- CTA state

Preview should never expose hidden draft-only admin notes.

## 16. Form usability rules
- use helper text generously
- avoid massive undifferentiated forms
- group related fields into collapsible panels where needed
- keep publish controls sticky on desktop
- autosave can be added later, but manual save must be reliable first

## 17. Non-negotiable form rules
- one primary section only
- public-facing copy must remain editorially clean
- titles and excerpts cannot be treated like internal placeholders
- structured fields should beat freeform fields whenever consistency matters
