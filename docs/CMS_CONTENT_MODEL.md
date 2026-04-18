# CMS and Content Model Spec

## 1. Goal
The admin/content system should make it easy to update the website without breaking structure or visual consistency.

Use structured content wherever possible.

## 2. Global settings
Fields:
- site title
- site subtitle
- homepage intro line
- social links
- contact email
- default SEO data
- optional brand settings

## 3. Main sections
One entry per primary section.

Fields:
- canonical key
- poetic label
- practical label
- anchor mapping
- hero title
- hero subtitle
- intro text
- featured image / poster image
- SEO title
- SEO description

Canonical keys:
- sight
- sound
- touch
- voice
- dream
- heart
- pulse

## 4. Works content type
Use for visual and physical works.

Fields:
- title
- slug
- category
- subcategory
- year
- medium
- dimensions
- description
- excerpt
- cover image
- gallery images
- featured flag
- availability status
- price visibility setting
- inquiry link or action

## 5. Writing content type
Use for poems, lyrics, excerpts, journal, and novel-related material.

Fields:
- title
- slug
- writing type
- section mapping
- excerpt
- full text or partial text
- cover image
- featured flag
- publish date
- related work / related book if applicable

Writing types:
- poem
- lyric
- spoken-word text
- journal fragment
- novel excerpt
- behind-the-story note

## 6. Music content type
Fields:
- title
- slug
- release type
- cover image
- embed URL
- streaming URLs
- description
- lyrics excerpt
- featured flag

## 7. Exhibitions / Features content type
Fields:
- title
- slug
- item type
- date
- venue / publication
- location
- short description
- long description
- media assets
- external link

Item types:
- exhibition
- feature
- interview
- collaboration
- press

## 8. Section landing blocks
Allow section pages to be assembled from flexible content blocks.

Recommended block types:
- hero
- rich text
- image gallery
- featured cards
- media embed
- quote
- timeline
- CTA
- inquiry block

## 9. Pulse / inquiry model
For collector-facing and commission content, support:
- availability listing
- commission type
- pricing note
- inquiry CTA
- contact form settings
- external store link if added later

## 10. Editorial consistency rules
All content shown on the frontend must be able to support:
- title
- excerpt
- featured image
- section mapping
- route slug
- sort order
- visibility status

## 11. Future-proofing
The model should allow future additions such as:
- shop integration
- audio player enhancements
- collector portal
- newsletter
- event listings
- book launch campaigns
