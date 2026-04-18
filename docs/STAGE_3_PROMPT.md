# Stage 3 Prompt — React Three Fiber Body Scene and Anchor Interactions

Use this prompt in Antigravity for Stage 3.

```md
Continue from the existing WEI IN SIGHT project state.
This is Stage 3 only.

Important rules:
- Do not restart the project.
- Do not replace the homepage layout from Stage 2.
- Preserve the left-panel navigation exactly in concept.
- Integrate the 3D body scene into the existing right-panel structure.
- Keep the body symbolic, elegant, and cinematic.
- Do not make the result feel like a tech demo, game scene, or medical viewer.

Goal:
Implement the real interactive body scene using React Three Fiber.

Scene direction:
- standing full-body stylized human figure
- wireframe or line-based aesthetic
- dark immersive scene
- neon pink glow emphasis
- restrained white highlight support
- subtle atmospheric depth only

Required interaction logic:
1. Idle state:
   - body visible and calm
   - subtle breathing or micro-idle movement allowed
2. Hover state:
   - hovering a left nav item softly highlights the corresponding body anchor
3. Selected state:
   - clicking a main nav item moves the camera toward the anchor
   - selected anchor brightens
   - submenu emergence is visually linked to the body point
4. Fallback state:
   - if WebGL is unavailable, the homepage still works cleanly

Anchor mapping:
- Eyes = Sight
- Ears = Sound
- Hand/Fingertips = Touch
- Throat = Voice
- Forehead/Temple = Dream
- Chest/Heart = Heart
- Wrist = Pulse

Technical requirements:
- use React Three Fiber
- use drei where useful
- keep the mesh optimized
- use controlled postprocessing only
- implement camera presets or transitions for each anchor
- keep animation smooth and restrained
- support reduced motion
- lazy-load the 3D scene
- provide mobile simplification

Do not:
- overuse bloom
- create dense noisy linework
- add unnecessary particles
- make transitions too fast
- let the 3D overwhelm navigation clarity

Design goals:
- the body should feel like a living atlas
- the selected anchor should feel meaningful
- the scene should support the text menu, not compete with it

Google Stitch MCP may help with:
- visual refinement around the scene container
- surrounding UI balance
- spacing and relation between panels

Acceptance criteria:
- 3D body integrates cleanly with the homepage
- hover and selected states work with left nav
- camera transitions are smooth
- submenu emergence feels anchored to the body
- fallbacks exist
- performance remains acceptable

At the end, summarize:
- body scene architecture
- anchor implementation approach
- fallback behavior
- mobile simplification strategy
- what is ready for Stage 4
```
