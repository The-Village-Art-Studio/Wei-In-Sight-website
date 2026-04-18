# Admin Workflows and State Rules

## 1. Purpose
This document defines how content should move through the **WEI IN SIGHT** admin dashboard.

The admin must support calm, controlled publishing.
It should prevent messy live updates and keep the public website coherent.

## 2. Recommended lifecycle states
Use these states across major content types:
- `draft`
- `review`
- `scheduled`
- `published`
- `archived`

## 3. State meanings
### Draft
The entry is incomplete or not ready for editorial review.
It is never public.

### Review
The entry is complete enough for final inspection.
It is still not public.

### Scheduled
The entry is approved and set to go live at a defined time.

### Published
The entry is live.

### Archived
The entry is no longer part of normal public output.
It remains in the system for reference and possible future reuse.

## 4. Default workflow
Recommended standard path:

`draft -> review -> scheduled or published -> archived`

Allow direct `draft -> published` only for trusted roles.

## 5. Basic editorial workflow by content type

### Works
1. Create work in draft
2. Upload cover image and gallery
3. Assign section and subtype
4. Add excerpt and description
5. Set availability if relevant
6. Move to review
7. Preview on public layout
8. Publish or schedule

### Writing
1. Draft text
2. Add excerpt and optional cover image
3. Confirm section mapping
4. Review typography preview
5. Publish or schedule

### Music
1. Create entry
2. Add cover art
3. add release links and credits
4. confirm release date
5. review public page rendering
6. publish or schedule

### Exhibitions & Features
1. Create item
2. assign type and venue / outlet
3. add date and descriptive note
4. attach poster or supporting media
5. review
6. publish

### Pulse
1. create call-to-action or offer
2. attach any linked work or inquiry destination
3. review CTA clarity
4. publish

## 6. Review checklist before publish
Every item in `review` should be checked for:
- correct title
- correct slug
- correct primary section
- complete excerpt
- strong public description
- working media
- correct featured state
- good preview
- SEO fields where needed

## 7. Publishing rules
### Publish immediately only when
- content is complete
- content has previewed correctly
- hero or homepage conflicts have been checked

### Schedule when
- tied to a release date
- tied to an exhibition date
- tied to a campaign sequence
- tied to homepage curation timing

## 8. Homepage curation workflow
Homepage content should not simply inherit every latest entry.
It must be curated.

Recommended process:
1. publish individual content first
2. open homepage editor separately
3. choose feature placements intentionally
4. preview homepage
5. publish homepage update

This keeps the homepage editorial rather than automatic.

## 9. Archive rules
Archive content when:
- it should no longer appear in feeds
- the content is outdated
- it is a temporary campaign item
- it is replaced by a more current version

Archiving should not silently break old links.
Use redirects where needed.

## 10. Delete rules
Hard delete should be restricted.

Safe to hard delete:
- empty drafts
- accidental duplicates
- test entries

Prefer archive over delete for anything that was ever public.

## 11. Bulk workflow rules
Bulk actions are useful, but must be limited.

Recommended bulk actions:
- move to review
- archive
- add tag
- remove tag
- publish only for trusted roles

Do not allow large uncontrolled bulk edits to homepage assignments.

## 12. Featured content rules
`featured` is a display signal, not a quality badge.

Use `featured` only when:
- the item should surface on the homepage
- the item should lead a section page
- the item is part of a current spotlight

Do not feature too many items in one section.

## 13. Scheduling rules
For entries with a scheduled state:
- publish date/time must be clear
- timezone must be consistent
- failed schedules must be logged

For the first build, use a single canonical timezone for the admin.
That can be expanded later if needed.

## 14. Slug change rules
If a published entry changes slug:
- warn the user
- create redirect record if supported
- preserve SEO integrity

Never silently change a live slug.

## 15. Media replacement rules
When replacing media on a published entry:
- keep alt text updated
- preserve focal point if still applicable
- refresh preview before republishing if the change is significant

## 16. Section reassignment rules
Changing the primary section of a published entry is a high-impact action.

Before allowing it:
- warn the user
- explain feed and route implications
- require re-preview

## 17. Inquiry workflow
If inquiries are stored inside the admin:

Statuses:
- new
- opened
- in progress
- resolved
- archived

Suggested actions:
- assign internal note
- mark responded
- archive after resolution

## 18. Future versioning
Version history is recommended later, but not required for the first build.

For now, the minimum standard should be:
- updated timestamp
- updated by user
- activity log entry

## 19. Non-negotiable workflow rules
- no rough drafts should go live by accident
- homepage updates should be intentional
- published content should preserve stable slugs where possible
- archive over delete for anything historically meaningful
