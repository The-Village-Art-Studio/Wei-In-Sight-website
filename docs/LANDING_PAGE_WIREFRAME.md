# Landing Page Wireframe and Behavioral Blueprint

## 1. Desktop structure
Use a full-screen split layout.

### Left panel
Width target:
34% to 40%

Purpose:
identity, navigation, and emotional orientation

Contains:
- wordmark
- subtitle
- short intro line
- vertical primary navigation
- subtle footer links / social / contact

### Right panel
Width target:
60% to 66%

Purpose:
immersive 3D stage

Contains:
- full-height 3D human wireframe body
- ambient background depth
- anchor points
- body glow logic
- camera movement system

## 2. Left panel wireframe

### Top block
- `WEI IN SIGHT`
- `The creative atlas of Jacky Ho`

Optional short line:
`A multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.`

### Middle block
Vertical main navigation:
- Sight
- Sound
- Touch
- Voice
- Dream
- Heart
- Pulse

Each item includes:
- main poetic title
- smaller functional subtitle
- hover and active state

### Bottom block
Subtle utility links:
- Instagram
- Email
- Collect / Inquire

Optional one-line identity note:
`Artist. Maker. Storyteller.`

## 3. Right panel wireframe
Display a standing full-body stylized human wireframe.

Visual qualities:
- elegant
- slightly otherworldly
- calm
- luminous
- dark-space presentation

The body should be centered slightly to the right, not dead-center.

## 4. First-load sequence
Sequence must feel ceremonial.

Recommended:
1. page loads near-dark
2. faint scan or atmospheric reveal begins
3. body wireframe resolves slowly into view
4. left navigation fades in with stagger
5. intro line appears last

Avoid loud intros or long blocked loaders.

## 5. Hover behavior
Hovering a left-side navigation item should:
- softly highlight the corresponding body anchor
- subtly dim non-selected body zones
- visually suggest where interaction is about to focus

No submenu explosion on hover.

Hover is for orientation, not for content loading.

## 6. Click behavior
Clicking a main nav item should:
1. move or reframe camera toward the corresponding body anchor
2. brighten that anchor
3. reveal submenu nodes or labels emerging from the body point
4. allow click-through into dedicated destination pages

Important:
Even though content lives on dedicated pages, the submenu reveal on the homepage remains part of the immersive ritual.

## 7. Body anchor mapping

### Eyes → Sight
Submenu:
- Paintings
- Photography
- Sculpture
- Collections

### Ears → Sound
Submenu:
- Streaming Platforms
- Original Songs
- Audio-Visual Work
- Music Archive

### Hand/Fingertips → Touch
Submenu:
- Mixed Media
- Material Experiments
- Fabric/Texture Work
- Studio Process

### Throat → Voice
Submenu:
- Poems
- Lyrics
- Spoken Word
- Journal Fragments

### Forehead/Temple → Dream
Submenu:
- The Novel
- Story World
- Excerpts
- Behind the Story

### Chest/Heart → Heart
Submenu:
- About Me
- Philosophy
- Journey
- Exhibitions/Features

### Wrist → Pulse
Submenu:
- Buy Art
- Available Works
- Commissions
- Contact

## 8. State logic
Required interface states:
- idle
- hover-preview
- selected-main-section
- submenu-visible
- route-transition-out

Keep state transitions graceful and short.

## 9. Route transition behavior
When a submenu item is selected:
- preserve a sense of continuity from homepage to destination page
- use a subtle transition
- do not hard cut abruptly unless performance requires it

Use shared motion language, not excessive full-page transitions.

## 10. Mobile behavior
Do not replicate desktop split-screen literally.

Suggested mobile layout:
- top wordmark and intro
- smaller body figure or static animated hero
- stacked category cards / accordion
- tapping a category briefly highlights the relevant body zone
- submenu items appear beneath
- destination pages remain route-based

## 11. Fallback behavior
If 3D cannot load:
- keep left-side navigation fully usable
- show stylized static image, silhouette, or simplified animated SVG body
- preserve brand feel
