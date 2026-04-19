import { SectionKey } from './supabase';

export type BlockType = 'text' | 'image' | 'gallery' | 'audio' | 'video' | 'process' | 'quote' | 'logo-grid' | 'form';

export interface ContentBlock {
  type: BlockType;
  content?: string;
  url?: string;
  caption?: string;
  items?: string[]; // For gallery or process steps
  logoItems?: { logoUrl: string; title: string; description: string; preserveColor?: boolean }[];
  formType?: 'contact' | 'commission';
  metadata?: Record<string, any>;
}

export interface DeepContent {
  id: string;
  slug: string;
  sectionId: string;
  title: string;
  subtitle?: string;
  heroImage?: string;
  blocks: ContentBlock[];
}

export const MOCK_CONTENT: Record<string, DeepContent> = {
  // SIGHT
  'sight/paintings': {
    id: 's1',
    slug: 'paintings',
    sectionId: 'sight',
    title: 'The Inner Landscape',
    subtitle: 'A series of atmospheric oil abstractions exploring memory and spatial resonance.',
    heroImage: '/assets/art/sight_paintings_hero_1776626955531.png',
    blocks: [
      { 
        type: 'text', 
        content: `### TEXTURE OF MEMORY\n\nThese works represent a five-year exploration of sensory memory. Each stroke is a translation of a specific moment in time—a vibration captured through heavy impasto and gold leaf. \n\nThe palette is restricted to charcoal, deep violets, and oxidized golds, focusing the viewer's attention on the physical rhythm of the paint.` 
      },
      { 
        type: 'gallery', 
        items: [
          '/assets/art/sight_paintings_1_1776627360680.png',
          '/assets/art/sight_paintings_2_1776627384437.png'
        ], 
        caption: 'Selected large-scale oil works on canvas, 2024.' 
      }
    ]
  },
  'sight/photography': {
    id: 's2',
    slug: 'photography',
    sectionId: 'sight',
    title: 'Architectural Silence',
    subtitle: 'High-contrast studies of brutalist geometry and the play of light.',
    heroImage: '/assets/art/sight_photography_preview_1776626984989.png',
    blocks: [
      { 
        type: 'text', 
        content: `### THE VOID BEYOND\n\nPhotography, for me, is an exercise in subtractive composition. By removing color and isolating monolithic structures, I seek to reveal the "silent pulse" of the built environment. \n\nThis series focuses on the intersection of concrete, shadow, and a single, unforgiving beam of light.` 
      },
      { 
        type: 'gallery', 
        items: [
          '/assets/art/sight_photography_1_1776627407211.png',
          '/assets/art/sight_photography_2_1776627429953.png',
          '/assets/art/sight_photography_3_1776627454474.png'
        ], 
        caption: 'Monolithic studies in shadow and structure.' 
      }
    ]
  },
  'sight/sculpture': {
    id: 's3',
    slug: 'sculpture',
    sectionId: 'sight',
    title: 'Frozen Motion',
    subtitle: 'Brutalist mixed media forms exploring the tension between glass and steel.',
    heroImage: '/assets/art/sight_sculpture_preview_1776627004575.png',
    blocks: [
      { 
        type: 'text', 
        content: `### TACTILE BRUTALISM\n\nMy sculptures are physical manifestations of internal friction. Using industrial materials like oxidized steel, cracked glass, and raw concrete, I build forms that feel like they are either emerging from or collapsing into their environment.` 
      },
      { 
        type: 'gallery', 
        items: [
          '/assets/art/sight_sculpture_1_1776627480388.png',
          '/assets/art/sight_sculpture_2_1776627504199.png'
        ], 
        caption: 'Brutalist interventions in space.' 
      }
    ]
  },
  'sight/collections': {
    id: 's4',
    slug: 'collections',
    sectionId: 'sight',
    title: 'Archival Assemblages',
    subtitle: 'Curated series of artifacts and mixed media studies.',
    heroImage: '/assets/art/sight_collections_preview_1776627027864.png',
    blocks: [
      { 
        type: 'text', 
        content: `### THE CREATIVE ATLAS\n\nCollections represent the connective tissue between my disparate disciplines. These are not just finished works, but the process records—sketches, prototypes, and material fragments—grouped to reveal the thematic throughlines of the Wei In Sight project.` 
      },
      { 
        type: 'gallery', 
        items: [
          '/assets/art/sight_collections_1_1776627530672.png'
        ], 
        caption: 'Thematic groupings of archival process artifacts.' 
      }
    ]
  },

  // SOUND
  'sound/streaming-platforms': {
    id: 'so2',
    slug: 'streaming-platforms',
    sectionId: 'sound',
    title: 'Digital Resonance',
    subtitle: 'Where to experience my cinematic soundscapes and audio explorations.',
    blocks: [
      { 
        type: 'logo-grid', 
        logoItems: [
          { 
            logoUrl: '/assets/spotify-logo.png', 
            title: 'Spotify', 
            description: "Stream my latest conceptual soundscapes, original albums, and immersive audio explorations.",
            preserveColor: true
          },
          { 
            logoUrl: '/assets/apple-music-logo.png', 
            title: 'Apple Music', 
            description: "Find my entire discography and narratively-driven scores in high-fidelity spatial audio.",
            preserveColor: true
          },
          { 
            logoUrl: '/assets/youtube-music-logo.png', 
            title: 'YouTube Music', 
            description: "A centralized hub to watch my audio-visual projects and listen to my official track releases.",
            preserveColor: true
          }
        ]
      }
    ]
  },

  // VOICE
  'voice/poems': {
    id: 'v1',
    slug: 'poems',
    sectionId: 'voice',
    title: 'Syllables of Light',
    subtitle: 'Selected poetry from the 2023-2025 journals.',
    blocks: [
      { type: 'quote', content: 'The way the shadow falls / tells me where the sun has been / but not where it is going.' },
      { type: 'text', content: 'These poems were written mostly in transit, captured on paper scraps and digital notes during the building of the Wei series.' }
    ]
  },
  // TOUCH
  'touch/material-experiments': {
    id: 't1',
    slug: 'material-experiments',
    sectionId: 'touch',
    title: 'Fabric & Friction',
    subtitle: 'Tactile studies on organic textiles and mineral pigments.',
    blocks: [
      { type: 'text', content: 'A study on how different fabrics react to water-based pigments over time.' },
      { type: 'gallery', items: [
        'https://images.unsplash.com/photo-1544256718-3bcf237f3974',
        'https://images.unsplash.com/photo-1549490349-8643362247b5'
      ], caption: 'Detail shots of linen and clay experiments.' }
    ]
  },
  // DREAM
  'dream/the-novel': {
    id: 'd1',
    slug: 'the-novel',
    sectionId: 'dream',
    title: 'The Atlas of Unmade Worlds',
    subtitle: 'Insights into the ongoing novel project.',
    blocks: [
      { type: 'text', content: 'The world of Wei is one built on the remnants of forgotten languages.' },
      { type: 'quote', content: 'To dream is to remember a future that hasn\'t happened yet.' }
    ]
  },
  // HEART
  'heart/about': {
    id: 'h1',
    slug: 'about',
    sectionId: 'heart',
    title: 'The Artist',
    subtitle: 'Jacky Ho\'s journey through multidisciplinarity.',
    blocks: [
      { type: 'text', content: 'Jacky Ho is an artist based between worlds, focusing on the intersection of memory and technology.' }
    ]
  },

  // PULSE
  'pulse/buy-art': {
    id: 'p2',
    slug: 'buy-art',
    sectionId: 'pulse',
    title: 'Acquisition Destinations',
    subtitle: 'Official channels for acquiring my physical works and fine art editions.',
    blocks: [
      {
        type: 'logo-grid',
        logoItems: [
          { 
            logoUrl: '/assets/artrewards-logo.png', 
            title: 'ArtRewards', 
            description: "Discover curated physical editions and exclusive prints of my visual works available for collectors." 
          },
          { 
            logoUrl: '/assets/artsy-logo.png', 
            title: 'Artsy', 
            description: "Access my larger fine art pieces and high-end works through global gallery partners and auctions." 
          },
          { 
            logoUrl: '/assets/helloart-logo.png', 
            title: 'HelloArt', 
            description: "Encounter my work in person at various high-traffic professional venues and galleries across North America." 
          },
          { 
            logoUrl: '/assets/righttime-logo.png', 
            title: 'Right Time', 
            description: "Explore my horological collaborations where art meets precision in exclusive Swiss-made collections." 
          }
        ]
      }
    ]
  },
  'pulse/commissions': {
    id: 'p3',
    slug: 'commissions',
    sectionId: 'pulse',
    title: 'Sound Commissions',
    subtitle: 'Secure a custom-crafted audio experience for your vision.',
    blocks: [
      {
        type: 'text',
        content: `### COLLABORATIVE CREATION\n\nI am currently accepting commissions related to cinematic sound design, original scoring, and experimental audio-visual landscapes. \n\nWhether you are a filmmaker, game developer, or performance artist, we can build a sonic universe that resonates with your core narrative. Use the form below to share your project details.`
      },
      {
        type: 'form',
        formType: 'commission'
      }
    ]
  },
  'pulse/contact': {
    id: 'p4',
    slug: 'contact',
    sectionId: 'pulse',
    title: 'Inquiries & Resonance',
    subtitle: 'Initiate a dialogue regarding exhibitions, press, or general inquiries.',
    blocks: [
      {
        type: 'text',
        content: `### REACH OUT\n\nFor general curiosities, press inquiries, or exhibition opportunities, please use the standard inquiry form below. I typically respond within 2-3 business sunrises.`
      },
      {
        type: 'form',
        formType: 'contact'
      }
    ]
  },
};

export function getContent(sectionId: string, slug: string): DeepContent | undefined {
  return MOCK_CONTENT[`${sectionId}/${slug}`];
}
