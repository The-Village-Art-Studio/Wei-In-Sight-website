# Admin Content Entry Guide

## 1. Purpose
This guide defines how content must be entered into the new **WEI IN SIGHT** admin dashboard so the public site remains emotionally coherent, visually clean, and structurally consistent.

This is not a generic portfolio CMS.
The admin exists to support a cinematic, poetic, editorial website.

## 2. Core publishing principle
Every entry should answer three questions clearly:
1. **What is it?**
2. **Why does it matter?**
3. **Where does it belong in the body-navigation world?**

If an entry cannot answer those three questions, it is not ready to publish.

## 3. Primary section map
Every piece of content must map to one primary section.

| Canonical Key | Public Label | Meaning | Typical Content |
|---|---|---|---|
| `sight` | Sight | visual perception | paintings, photography, sculpture, collections |
| `sound` | Sound | listening and rhythm | songs, music releases, streaming links, audio-visual projects |
| `touch` | Touch | materiality and process | mixed media, fabric work, texture studies, experiments, studio process |
| `voice` | Voice | language and breath | poems, lyrics, spoken word, journal fragments |
| `dream` | Dream | fiction and inner narrative | novel, story world, excerpts, behind-the-story material |
| `heart` | Heart | identity and meaning | about content, philosophy, journey, exhibitions, features |
| `pulse` | Pulse | exchange and inquiry | available works, commissions, contact, collector-facing content |

### Mapping rule
- Each entry must have **one primary section**.
- An entry may have **secondary tags**, but only one primary section controls placement.
- Do not assign one item to multiple primary sections just because it overlaps disciplines.

## 4. Required quality standard before publish
Before any item goes live, it should meet all of the following:
- correct section mapping
- clear title
- meaningful excerpt
- strong cover image or cover asset
- clean slug
- intentional description
- correct visibility status
- sensible SEO title and description when applicable

If a field is optional in the CMS but important to presentation, fill it anyway.

## 5. Voice and editorial tone
All frontend-facing copy entered into the CMS should feel:
- elegant
- emotionally intelligent
- clear
- poetic without becoming vague
- refined, not corporate
- personal, but not overexposed

Avoid:
- generic marketing language
- filler adjectives
- hype language
- robotic descriptions
- overly academic art jargon unless necessary

### Good example
> A mixed-media work built through paint, fabric, and layered texture, exploring memory as something both worn and luminous.

### Weak example
> This is a very unique and amazing artwork that demonstrates creativity and passion through different materials.

## 6. Slug rules
Slugs must be:
- lowercase
- hyphen-separated
- short and readable
- stable once published

### Good examples
- `midnight-bloom`
- `sunshine-face`
- `the-dinner`
- `fragments-after-rain`

### Avoid
- `my-new-artwork-final-version`
- `Poem_3_EDIT`
- `untitled-work-2026-v2`

## 7. Visibility and publishing workflow
Use clear status states in the dashboard.

Recommended statuses:
- `draft`
- `review`
- `scheduled`
- `published`
- `archived`

### Rules
- **draft** = incomplete, never visible publicly
- **review** = internally ready, but needs final check
- **scheduled** = approved with publish date
- **published** = live on site
- **archived** = no longer shown in normal public feeds

Do not publish directly from a rough entry.

## 8. Sort order and featured logic
Every content type should support:
- `featured` boolean
- `sort_order` integer
- `publish_date`

### Rules
- Use `featured` for homepage and section heroes only.
- Use `sort_order` when manual curation matters.
- Use `publish_date` for chronology, especially in writing, music, exhibitions, and journal content.

If both `featured` and `sort_order` exist, featured items appear first, then sort order, then publish date.

## 9. Asset rules
### Images
Every image uploaded should have:
- descriptive filename
- alt text
- credit if needed
- crop awareness

### File naming pattern
`section-title-year-01.jpg`

Examples:
- `sight-midnight-bloom-2026-01.jpg`
- `dream-the-dinner-cover-2026.jpg`
- `heart-exhibition-poster-2026-01.jpg`

### Alt text rule
Describe the image simply and usefully.
Do not keyword-stuff.

### Video / audio embeds
Always include:
- title
- platform type
- external link backup
- thumbnail or cover image if available

## 10. Homepage content rules
The homepage is a gateway, not a dumping ground.
Only selected content should be surfaced there.

Recommended homepage content sources:
- one featured intro line
- one featured item per major section when appropriate
- section hero images or posters
- selected calls to action for Pulse

Do not surface too many items at once.
Keep the homepage curated.

## 11. Section-specific entry guidance

---

## 12. Content Type: Sections
Use this for the main top-level section pages.

### Required fields
- canonical key
- poetic label
- practical label
- hero title
- hero subtitle
- intro text
- anchor mapping
- SEO title
- SEO description

### Writing rule
- `poetic label` should stay fixed
- `practical label` should stay human-readable
- `hero title` may be more expressive than the menu label
- `intro text` should frame the entire section in one emotional paragraph

### Example
- Canonical key: `voice`
- Poetic label: `Voice`
- Practical label: `Poems & Lyrics`
- Hero title: `Language as breath, rhythm, and residue`
- Intro text: `This section gathers poems, lyrical fragments, and written pieces that live close to the throat—work shaped by breath, memory, and emotional cadence.`

---

## 13. Content Type: Works
Use for visual works and physical works.

### Applies to
- paintings
- photography
- sculpture
- mixed media
- tactile works
- selected object-based work

### Required fields
- title
- slug
- primary section
- subcategory
- year
- medium
- cover image
- excerpt
- description
- visibility status

### Optional but strongly recommended
- dimensions
- gallery images
- series / collection name
- featured flag
- availability status
- inquiry CTA

### Writing guidance
#### Title
Keep titles clean and intentional.
Do not add dates or materials into the title field unless they are part of the actual title.

#### Excerpt
1–2 sentences max.
This is used in cards and previews.
It should hint at meaning, not explain everything.

#### Description
Use 1–3 short paragraphs.
Focus on:
- material
- atmosphere
- concept
- process if relevant

### Example structure
- Title: `Midnight Bloom`
- Excerpt: `A painting shaped by neon light and silence, where tenderness and tension meet in the same field of color.`
- Description: `Built through layered acrylic and textured interference, this piece explores bloom as both emergence and ache. The surface is intentionally uneven, allowing the light to catch in different ways depending on distance and angle.`

### Availability guidance
Use one of:
- `available`
- `sold`
- `not_for_sale`
- `inquire`

Do not expose pricing by default unless the public sales strategy requires it.

---

## 14. Content Type: Writing
Use for poems, lyrics, journal fragments, novel excerpts, and story notes.

### Required fields
- title
- slug
- writing type
- primary section
- excerpt
- body text or preview text
- visibility status

### Writing types
- `poem`
- `lyric`
- `spoken_word`
- `journal_fragment`
- `novel_excerpt`
- `behind_the_story`

### Mapping rules
- poems, lyrics, spoken word, journal fragments → usually `voice`
- novel excerpts, story notes, story-world content → usually `dream`

### Excerpt rule
Keep excerpts short and emotionally alive.
Do not paste the first paragraph lazily unless it truly works as a preview.

### Body text options
Support:
- full text
- preview text
- excerpt-only with external destination

### Sensitive formatting rule
Preserve intentional line breaks for poems and lyrics.
Do not auto-collapse line formatting.

### Example
- Title: `After the Rain Signals`
- Writing type: `poem`
- Primary section: `voice`
- Excerpt: `A short poem about delayed closeness, city light, and the feeling of hearing someone after they are already gone.`

---

## 15. Content Type: Music
Use for songs, releases, music videos, and audio-led projects.

### Required fields
- title
- slug
- release type
- primary section
- cover image
- description
- at least one stream or embed link
- visibility status

### Release type examples
- `single`
- `ep`
- `album`
- `demo`
- `audio_visual`
- `soundtrack`

### Recommended fields
- lyrics excerpt
- release date
- collaborators
- BPM and key if artistically relevant
- featured flag

### Writing rule
Descriptions should frame the mood, story, and sonic identity.
Avoid generic “listen now” style copy inside editorial descriptions.

---

## 16. Content Type: Exhibitions and Features
Use for public-facing credibility, context, and milestones.

### Required fields
- title
- slug
- item type
- date
- venue or publication
- short description
- visibility status

### Item types
- `exhibition`
- `feature`
- `interview`
- `collaboration`
- `press`

### Writing rule
The short description should explain why the item matters.
Do not just repeat the title and venue.

### Example
> Group exhibition featuring multidisciplinary artists working across painting, installation, and narrative image-making, presented in Toronto as part of a curated public showcase.

---

## 17. Content Type: Dream / Novel-specific entries
Use for the novel, story-world materials, behind-the-scenes writing, and book presentation.

### Recommended entity split
Support these as separate but related entries:
- `book`
- `book_excerpt`
- `story_world`
- `behind_the_story`
- `campaign_asset`

### Required fields for the main book entry
- title
- slug
- cover image
- book status
- synopsis
- short pitch
- buy / learn more CTA
- release date if applicable
- visibility status

### Book status examples
- `in_progress`
- `announced`
- `preorder`
- `released`
- `archived`

### Writing rule
The novel page must feel cinematic and intentional.
Do not treat it like a product SKU.

---

## 18. Content Type: Pulse / Collector and Commission entries
Use for inquiries, available works, commission offerings, and collector-facing CTAs.

### Required fields
- title
- slug
- pulse type
- short description
- CTA label
- CTA destination
- visibility status

### Pulse type examples
- `available_work`
- `commission_offer`
- `contact_entry`
- `collector_note`
- `external_store_link`

### Rule
Pulse content should stay clear and polished.
This section may be more direct, but it should still belong to the same world.

---

## 19. SEO and metadata rules
Every public page or entry should support:
- SEO title
- SEO description
- social share image

### SEO title rule
Readable first, optimized second.
Avoid keyword stuffing.

### SEO description rule
Write a natural 1–2 sentence summary that helps search and sharing.

---

## 20. Relationship rules
The CMS should support relationships between entries.

Examples:
- a poem can relate to a song
- a novel excerpt can relate to the main book entry
- an artwork can belong to a collection
- an exhibition can link to featured works

### Rule
Relationships should create editorial depth, not clutter.
Only link items when the relationship is genuinely useful.

## 21. Content review checklist
Before publishing, confirm:
- title is clean
- slug is final
- primary section is correct
- excerpt is strong
- description is intentional
- image assets are ready
- alt text exists
- status is correct
- SEO fields are filled if the entry has its own page
- related items are not excessive

## 22. Dashboard UX recommendations
The admin should feel calm and structured.

Recommended interface behaviors:
- section-based filtering
- entry previews
- draft vs published badges
- image preview before save
- character count for excerpt and SEO fields
- warnings when required fields are missing
- preview mode before publish

## 23. Final rule
The CMS should help preserve the world of the site.
If a field, title, image, or description feels generic, it weakens the whole experience.

Every entry should feel like it belongs to the same constellation.
