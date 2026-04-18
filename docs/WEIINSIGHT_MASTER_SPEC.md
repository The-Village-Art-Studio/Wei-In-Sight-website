# WEI IN SIGHT — Master Product Spec

## 1. Project summary
Build a premium personal website for multidisciplinary artist **Jacky Ho** under the brand **WEI IN SIGHT**.

This site should function as:
- a personal flagship website
- an immersive digital self-portrait
- a portfolio and story world
- a collector-facing presentation layer
- a future-proof platform for art, music, writing, and personal philosophy

The website must feel distinct from a normal artist portfolio.

## 2. Core concept
The homepage is a cinematic gateway where the **human body becomes the navigation system**.

Desktop layout:
- left side = identity and navigation
- right side = interactive 3D wireframe body

Each main creative area maps to a body anchor:
- **Eyes** → Sight
- **Ears** → Sound
- **Hand / Fingertips** → Touch
- **Throat** → Voice
- **Forehead / Temple** → Dream
- **Chest / Heart** → Heart
- **Wrist** → Pulse

## 3. Product goal
When a visitor lands on the homepage, they should feel they are entering a world, not browsing a template.

The site should communicate:
- artistic sensitivity
- strong personal identity
- emotional depth
- cross-disciplinary range
- craft and precision
- a futuristic but human visual language

## 4. Audience
Primary audiences:
- art collectors
- curators
- collaborators
- exhibition organizers
- readers
- music listeners
- creative partners
- press / media
- people discovering the artist for the first time

Secondary audiences:
- friends / personal network
- potential clients for commissions
- podcast and interview audiences
- readers discovering the novel

## 5. High-level product structure
The product has two layers:

### Layer A — Immersive gateway
A highly memorable landing page with body-based navigation and poetic labels.

### Layer B — Dedicated destination pages
Every section routes to its own dedicated page for deep content, SEO, scalability, and editorial clarity.

This project uses **Option B** for section destination behavior.

## 6. Main navigation model
Main labels should appear as poetic-first navigation, with practical labels visible as sublabels.

### Main menu
- **Sight** — Visual Arts
- **Sound** — Music & Audio
- **Touch** — Mixed Media & Process
- **Voice** — Poems & Lyrics
- **Dream** — Novel & Story World
- **Heart** — About / Philosophy / Journey
- **Pulse** — Buy Art / Commissions / Contact

## 7. Section definitions

### Sight
Purpose:
Present visual artwork in a curated editorial way.

Includes:
- paintings
- photography
- sculpture
- collections / series

### Sound
Purpose:
Present music and audio-based identity.

Includes:
- streaming platforms
- original songs
- music archive
- audio-visual work

### Touch
Purpose:
Present tactile practice, materials, studio experimentation, and physical process.

Includes:
- mixed media
- fabric / texture work
- material experiments
- studio process

### Voice
Purpose:
Present poems, lyrics, spoken language, and reflective writing.

Includes:
- poems
- lyrics
- spoken word
- journal fragments

### Dream
Purpose:
Present long-form fiction and narrative worldbuilding.

Includes:
- the novel
- story world
- excerpts
- behind the story

### Heart
Purpose:
Present the artist as a person.

Includes:
- about
- philosophy
- journey
- exhibitions / features

### Pulse
Purpose:
Present the exchange layer of the brand.

Includes:
- available works
- buy art
- commissions
- contact

## 8. Interaction principle
The homepage must feel ceremonial and elegant.

The 3D body is not a toy.  
The interaction is symbolic, cinematic, and controlled.

Rules:
- motion must be slow and intentional
- the body must never feel like a game character
- navigation must remain functional even without interacting directly with the body
- text menu must always remain usable
- animation should amplify meaning, not compete with it

## 9. Design direction
Visual identity:
- near-black or midnight background
- neon pink as primary accent
- white typography
- subtle magenta / violet haze allowed for depth

Mood:
- cinematic
- poetic
- elegant
- premium
- futuristic
- emotionally warm beneath the technology

Avoid:
- loud cyberpunk clutter
- gamer UI styling
- overly literal anatomy
- sterile medical rendering
- bright flat backgrounds
- too many UI ornaments

## 10. Technical principle
Keep the existing content/admin foundation if it is usable.  
Rebuild the frontend experience.

Preferred stack:
- Next.js
- React
- React Three Fiber
- drei
- Framer Motion
- optional GSAP only where truly useful
- current admin dashboard / content structure retained or extended

## 11. Mobile principle
Do not force the full desktop interaction onto mobile.

Mobile must preserve the metaphor with a simplified experience:
- smaller body figure or static animated body state
- tapable category cards or accordion
- anchor highlights still correspond to selected category
- content pages remain fully usable and editorially clean

## 12. Accessibility principle
The product must remain usable even when:
- motion is reduced
- 3D is disabled or fails to load
- a keyboard is used for navigation
- screen size is limited

Always provide:
- textual navigation
- page titles
- clear route structure
- semantic content hierarchy
- reduced-motion fallback

## 13. Success criteria
The project succeeds if:
- the homepage feels memorable and unmistakably personal
- the site still works as a practical portfolio and content platform
- the body-navigation metaphor remains coherent from homepage to deeper pages
- future content can be added without breaking the concept
- the final output feels premium rather than experimental-for-experiment’s-sake
