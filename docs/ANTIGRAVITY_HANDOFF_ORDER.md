# WEI IN SIGHT — Recommended Antigravity Handoff Order

## Purpose
This file defines the recommended order for handing documents and prompts to Antigravity so the rebuild stays consistent and does not drift.

---

## Answer to the common question
The **stage prompts are already included** in the current spec pack.

Included prompt files:
- `STAGE_1_PROMPT.md`
- `STAGE_2_PROMPT.md`
- `STAGE_3_PROMPT.md`
- `STAGE_4_PROMPT.md`
- `STAGE_5_PROMPT.md`

However, this handoff order itself was not previously isolated as a standalone file. This document now makes that order explicit.

---

## Best handoff order

### 1. Foundation documents first
Give Antigravity these files before running any stage prompt:

1. `WEIINSIGHT_MASTER_SPEC.md`
2. `AGENT_RULES.md`
3. `ADMIN_REBUILD_ADDENDUM.md`
4. `IA_AND_ROUTES.md`
5. `LANDING_PAGE_WIREFRAME.md`
6. `VISUAL_AND_MOTION_SYSTEM.md`
7. `TECH_ARCHITECTURE.md`
8. `CMS_CONTENT_MODEL.md`
9. `DATABASE_SCHEMA_PLANNING.md`

These files define the core world, rules, architecture, and data model.

---

### 2. Admin-specific documents next
Then provide the admin-specific docs:

10. `ADMIN_DASHBOARD_INFORMATION_ARCHITECTURE.md`
11. `ADMIN_FORM_SPEC.md`
12. `ADMIN_WORKFLOWS_AND_STATES.md`
13. `ADMIN_ROLES_AND_PERMISSIONS.md`
14. `ADMIN_CONTENT_ENTRY_GUIDE.md`
15. `CONTENT_ENTRY_TEMPLATES.md`

These files tell the agents how the new admin should behave and how content should be entered consistently.

---

### 3. Then run stage prompts in sequence
Only after the spec documents are understood should Antigravity receive the stage prompts.

Run in this order:

16. `STAGE_1_PROMPT.md`
17. `STAGE_2_PROMPT.md`
18. `STAGE_3_PROMPT.md`
19. `STAGE_4_PROMPT.md`
20. `STAGE_5_PROMPT.md`

Do not skip ahead unless the earlier stage is stable.

---

## Important sequencing rule
Do not let later prompts override the foundation documents.

The foundation files define:
- the body-anchor metaphor
- the poetic section system
- Option B dedicated-page behavior
- the fresh admin dashboard decision
- the new database structure
- the visual and motion tone

The stage prompts should execute those rules, not reinterpret them.

---

## Stage-specific note

### Stage 1
Should build:
- fresh root structure
- new web app
- new admin app
- shared content model
- database/schema implementation based on the planning document
- route skeletons and app shell

### Stage 2
Should build:
- landing page shell
- split-screen layout
- left-side poetic navigation
- placeholder right-side immersive panel
- menu logic and responsive behavior

### Stage 3
Should build:
- React Three Fiber body scene
- anchor interactions
- camera states
- glow and motion behavior
- performance fallbacks

### Stage 4
Should build:
- dedicated section pages
- content templates for Sight, Sound, Touch, Voice, Dream, Heart, Pulse
- admin-connected rendering

### Stage 5
Should build:
- polish
- accessibility
- performance tuning
- animation refinement
- reduced motion behavior
- final consistency passes

---

## Guardrails

1. Do not restart from scratch in later stages.
2. Do not replace the poetic navigation system with generic menu labels.
3. Do not downgrade Option B into in-page expansion.
4. Do not reuse the old admin dashboard.
5. Do not treat Google Stitch MCP as the source of concept decisions.
6. Do not hardcode content that belongs in the admin.

---

## Practical recommendation
Before starting Stage 1, give Antigravity the foundation docs and explicitly state:

- this is a fresh rebuild
- both frontend and admin are new
- the section destination behavior is Option B
- the database must follow the schema planning markdown
- later stages must build on prior work, not replace it

---

## Final note
The easiest way to keep the build clean is:
- spec first
- schema second
- admin logic third
- stage prompts after that

The prompts are the engine.
The spec files are the compass.
