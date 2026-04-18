# Admin Roles and Permissions

## 1. Purpose
This document defines recommended roles and permission boundaries for the **WEI IN SIGHT** admin dashboard.

Even if the first version is primarily used by one person, the permission model should be structured cleanly from the start.

## 2. Principle
Default to simplicity.
Build enough role structure to scale later, but do not overcomplicate the first release.

## 3. Recommended roles
Use four roles:
- Owner
- Admin
- Editor
- Contributor

## 4. Role definitions
### Owner
Full system authority.
Use for the primary site owner.

Can:
- do everything
- manage settings
- manage users and roles
- publish and archive any content
- manage redirects
- delete entries
- control homepage and section configuration

### Admin
Operational publishing authority.

Can:
- create, edit, publish, schedule, archive content
- manage homepage content
- manage media
- manage inquiries
- manage most settings except ownership-level controls

Cannot:
- transfer ownership
- delete the owner

### Editor
Editorial authority, but not full system authority.

Can:
- create and edit content
- move items to review
- schedule content if allowed
- preview content
- manage media relevant to their entries

May optionally be allowed to publish.
For the safest first release, restrict direct publishing unless needed.

### Contributor
Entry creation role.

Can:
- create drafts
- edit own drafts
- upload media for own drafts
- submit for review

Cannot:
- publish
- archive published entries
- edit site settings
- alter homepage composition

## 5. Permission matrix summary

| Capability | Owner | Admin | Editor | Contributor |
|---|---:|---:|---:|---:|
| Create content | yes | yes | yes | yes |
| Edit any content | yes | yes | yes | no |
| Edit own drafts | yes | yes | yes | yes |
| Submit for review | yes | yes | yes | yes |
| Publish | yes | yes | optional | no |
| Schedule | yes | yes | optional | no |
| Archive | yes | yes | no | no |
| Delete drafts | yes | yes | limited | own only |
| Delete published content | yes | limited | no | no |
| Manage homepage | yes | yes | limited or no | no |
| Manage sections | yes | yes | no | no |
| Manage users | yes | limited | no | no |
| Manage settings | yes | limited | no | no |
| Manage redirects | yes | yes | no | no |
| Manage inquiries | yes | yes | limited | no |

## 6. Recommended first-release implementation
Since this project is personal but may expand later, the safest initial policy is:
- Owner: Jacky
- Admin: trusted future collaborator if needed
- Editor: optional future helper
- Contributor: optional future helper

If the first release is single-user only, still build the permission structure.
Just keep one active Owner account at launch.

## 7. Sensitive actions that should require elevated roles
These actions should be restricted to Owner or Admin:
- publishing immediately
- changing homepage featured content
- editing section page heroes
- modifying navigation labels
- changing site settings
- changing redirects
- hard deleting content
- changing canonical slugs on published entries

## 8. Draft ownership rules
For Contributor role:
- can edit only self-created drafts
- cannot take over another user's draft
- can duplicate own drafts only

For Editor and above:
- can open and edit any draft
- activity should be logged

## 9. Review permissions
Contributors should be able to send entries into `review`.
Editors and Admins should be able to return entries to `draft` with notes.

If review notes are added later, they should remain internal-only.

## 10. Media permissions
### Contributor
- upload media for own draft needs
- cannot delete globally used assets

### Editor
- upload and manage media
- cannot delete protected or widely used assets without confirmation

### Admin and Owner
- full media management

## 11. Inquiry permissions
If inquiries are part of the admin:
- Owner and Admin can manage all inquiries
- Editor can view and update inquiry status if enabled
- Contributor should not access inquiry data by default

## 12. Settings permissions
Only Owner should have full control over:
- site identity
- SEO defaults
- legal/footer content
- users and role changes
- analytics integrations
- environment-sensitive settings

Admins may get access to limited operational settings if useful.

## 13. Audit and accountability
All non-trivial actions should be logged.
At minimum log:
- publish
- archive
- delete
- slug change
- homepage edit
- settings change
- role change

## 14. Safety recommendations
- use confirmation dialogs for publish, archive, and delete
- use stronger warnings for slug changes on live content
- protect singleton editors like Homepage and Navigation Settings
- never let low-permission roles alter canonical section definitions

## 15. Non-negotiable permission rules
- keep ownership authority clear
- treat homepage and section configuration as high-trust actions
- prevent accidental live-site disruption from low-trust roles
