# Stage 1 Prompt — Architecture, Routing, and Shared Foundations

Use this prompt in Antigravity for Stage 1.

```md
We are building the WEI IN SIGHT website for multidisciplinary artist Jacky Ho.

This is Stage 1 only.

Important rules:
- Build on the existing project state.
- Do not restart or scaffold a different concept.
- Do not flatten this into a generic artist portfolio.
- Do not implement final visual polish yet.
- Do not replace future 3D behavior with permanent shortcuts.
- Preserve all naming and structure exactly as defined below.

Core concept:
The homepage is an immersive gateway with body-based navigation.
Section destination behavior uses Option B:
the homepage is the gateway, and each submenu routes to a dedicated page.

Primary sections:
- Sight
- Sound
- Touch
- Voice
- Dream
- Heart
- Pulse

Canonical route structure:
- /
- /sight
- /sight/paintings
- /sight/photography
- /sight/sculpture
- /sight/collections
- /sound
- /sound/streaming-platforms
- /sound/original-songs
- /sound/audio-visual-work
- /sound/music-archive
- /touch
- /touch/mixed-media
- /touch/material-experiments
- /touch/fabric-texture-work
- /touch/studio-process
- /voice
- /voice/poems
- /voice/lyrics
- /voice/spoken-word
- /voice/journal-fragments
- /dream
- /dream/the-novel
- /dream/story-world
- /dream/excerpts
- /dream/behind-the-story
- /heart
- /heart/about
- /heart/philosophy
- /heart/journey
- /heart/exhibitions-features
- /pulse
- /pulse/buy-art
- /pulse/available-works
- /pulse/commissions
- /pulse/contact

Goals for Stage 1:
1. Set up the app shell and route structure.
2. Create shared layout and navigation architecture.
3. Create reusable page templates and content-driven scaffolding.
4. Wire the existing backend/admin content source where possible.
5. Create placeholder section pages with consistent structure.
6. Create a placeholder homepage shell with left-panel and right-panel structure only.
7. Prepare the code structure for future React Three Fiber integration, but do not build full 3D interactions yet.

Required outputs:
- shared global layout
- route structure for all main and subsection pages
- reusable navigation data model
- reusable section page template
- CMS/content adapter layer if needed
- homepage shell with split-screen layout placeholders
- placeholder component for future 3D body scene
- clear file/component organization

Design constraints for now:
- keep the interface minimal and structured
- use temporary styling that already respects the intended dark / neon-pink / white system
- do not over-polish
- do not add excessive motion yet

Acceptance criteria:
- all routes exist
- homepage shell exists
- navigation structure is consistent
- section page templates are reusable
- the codebase is ready for Stage 2 without rework
- nothing in this stage feels like a separate unrelated website

Use Google Stitch MCP only for:
- layout structure refinement
- spacing rhythm
- typography hierarchy suggestions
- responsive structural planning

At the end, summarize:
- routes created
- shared components created
- CMS/data assumptions
- what is ready for Stage 2
```
