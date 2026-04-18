# Information Architecture and Route Spec

## 1. Routing model
This project uses **Option B**:
the homepage is an immersive gateway, and each section routes to dedicated pages.

## 2. Core routes

### Homepage
- `/`

Purpose:
- immersive entry experience
- body-based navigation
- brand statement
- gateway to section pages

### Sight
- `/sight`
- `/sight/paintings`
- `/sight/photography`
- `/sight/sculpture`
- `/sight/collections`

### Sound
- `/sound`
- `/sound/streaming-platforms`
- `/sound/original-songs`
- `/sound/audio-visual-work`
- `/sound/music-archive`

### Touch
- `/touch`
- `/touch/mixed-media`
- `/touch/material-experiments`
- `/touch/fabric-texture-work`
- `/touch/studio-process`

### Voice
- `/voice`
- `/voice/poems`
- `/voice/lyrics`
- `/voice/spoken-word`
- `/voice/journal-fragments`

### Dream
- `/dream`
- `/dream/the-novel`
- `/dream/story-world`
- `/dream/excerpts`
- `/dream/behind-the-story`

### Heart
- `/heart`
- `/heart/about`
- `/heart/philosophy`
- `/heart/journey`
- `/heart/exhibitions-features`

### Pulse
- `/pulse`
- `/pulse/buy-art`
- `/pulse/available-works`
- `/pulse/commissions`
- `/pulse/contact`

## 3. Navigation hierarchy

### Global primary navigation
Use poetic label first, practical label second.

Examples:
- Sight — Visual Arts
- Sound — Music & Audio
- Touch — Mixed Media & Process
- Voice — Poems & Lyrics
- Dream — Novel & Story World
- Heart — About / Philosophy / Journey
- Pulse — Buy Art / Commissions / Contact

### Subnavigation
Each section page should include a visible local subnavigation for its subsection routes.

## 4. Page intent by level

### Homepage
Emotional, cinematic, directional

### Main section pages
Editorial, identity-rich, high-level overview

### Subsection pages
Specific, content-driven, SEO-friendly, easy to maintain

## 5. SEO principle
Dedicated pages should carry indexable content and metadata.

Recommended:
- unique page title
- meta description
- open graph image
- section-specific hero copy
- structured content blocks

## 6. Content architecture note
Where possible, allow CMS-driven route mapping or structured data by:
- section
- subsection
- slug
- title
- hero content
- media blocks
- call-to-action blocks

## 7. Breadcrumb behavior
Destination pages may use subtle breadcrumbs, but keep them visually refined.

Example:
`Home / Sight / Paintings`

Do not make breadcrumb styling dominate the layout.

## 8. 404 and fallback principle
Any unmatched route should preserve brand mood and guide users back into the world.

404 page should feel on-brand, not generic.
