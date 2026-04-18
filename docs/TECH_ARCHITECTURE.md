# Technical Architecture and Build Notes

## 1. Recommended stack
- Next.js
- React
- React Three Fiber
- drei
- Framer Motion
- current admin/backend retained where practical

Optional:
- GSAP only where truly needed for cinematic camera or sequencing control

## 2. Build strategy
Preserve the existing content/admin foundation if it is already working.
Rebuild the frontend experience and route structure on top of it.

## 3. App layers

### Layer A — App shell
- global layout
- SEO handling
- route transitions
- navigation system
- theming and tokens

### Layer B — Homepage experience
- split-screen layout
- left menu
- 3D body scene
- anchor interactions
- submenu behavior

### Layer C — Section pages
- route-based templates
- CMS-driven content rendering
- reusable editorial components

## 4. Component architecture
Recommended components:
- `SiteShell`
- `MainNav`
- `BodyScene`
- `AnchorHotspot`
- `SubmenuCluster`
- `SectionHero`
- `EditorialGrid`
- `WritingLayout`
- `MusicEmbedBlock`
- `AvailabilityCard`
- `PageTransitionLayer`

## 5. 3D scene requirements
The body scene should support:
- idle state
- anchor hover state
- anchor selected state
- camera presets per anchor
- fallback rendering when 3D is unavailable

Use:
- optimized mesh
- custom wireframe/stylized material
- light postprocessing only
- no overbuilt particle systems

## 6. Performance requirements
Mandatory:
- lazy-load 3D scene
- code-split where appropriate
- mobile simplification
- reduced motion mode
- graceful fallback
- optimized images
- controlled bundle size

## 7. Accessibility requirements
Mandatory:
- keyboard-accessible navigation
- semantic headings
- sensible tab order
- reduced-motion support
- text-based alternatives for core navigation
- fallback if WebGL is unavailable

## 8. Routing requirements
Use dedicated routes for main sections and subsection pages.

Do not rely on homepage overlays as the only content surface.

## 9. State management
Keep state simple and predictable.

Homepage likely needs:
- active main section
- hovered section
- submenu open/closed
- selected anchor
- 3D ready/fallback state

## 10. Animation architecture
Use Framer Motion for:
- UI transitions
- text transitions
- panel transitions
- route-level continuity

Use React Three Fiber camera and scene logic for:
- body focus transitions
- anchor emphasis
- subtle idle movement

## 11. Google Stitch MCP role
Use Stitch for:
- layout refinement
- spacing refinement
- component polish
- responsive tuning
- visual consistency audit

Do not use Stitch to rewrite the product concept.

## 12. Deployment / maintainability principle
The codebase should remain understandable and modular.
This is a flagship site and should not become a one-off experimental tangle.
