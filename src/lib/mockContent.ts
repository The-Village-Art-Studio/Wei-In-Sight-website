import { SectionKey } from './supabase';

export type BlockType = 'text' | 'image' | 'gallery' | 'audio' | 'video' | 'process' | 'quote' | 'logo-grid';

export interface ContentBlock {
  type: BlockType;
  content?: string;
  url?: string;
  caption?: string;
  items?: string[]; // For gallery or process steps
  logoItems?: { logoUrl: string; title: string; description: string }[];
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
    subtitle: 'A series of oil on canvas exploring memory and space.',
    heroImage: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19',
    blocks: [
      { type: 'text', content: 'These works represent a five-year exploration of sensory memory. Each stroke is a translation of a specific moment in time.' },
      { type: 'gallery', items: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
        'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3'
      ], caption: 'Selected large-scale paintings from the 2024 collection.' }
    ]
  },

  // SOUND
  'sound/streaming-platforms': {
    id: 'so2',
    slug: 'streaming-platforms',
    sectionId: 'sound',
    title: 'Digital Resonance',
    subtitle: 'Stream and experience audio across the global atlas.',
    blocks: [
      { 
        type: 'logo-grid', 
        logoItems: [
          { 
            logoUrl: '/assets/spotify-logo.png', 
            title: 'Spotify', 
            description: "The world's most popular audio streaming subscription service, bringing your music to hundreds of millions of listeners globally.",
            preserveColor: true
          },
          { 
            logoUrl: '/assets/apple-music-logo.png', 
            title: 'Apple Music', 
            description: 'A premium listening experience with lossless audio and spatial sound, connecting you with listeners across the Apple ecosystem.',
            preserveColor: true
          },
          { 
            logoUrl: '/assets/youtube-music-logo.png', 
            title: 'YouTube Music', 
            description: "Integrates music videos and official tracks, leveraging the world's largest video community to expand your sonic reach.",
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
    subtitle: 'Where technical precision meets artistic craftsmanship.',
    blocks: [
      {
        type: 'logo-grid',
        logoItems: [
          { 
            logoUrl: '/assets/artrewards-logo.png', 
            title: 'ArtRewards', 
            description: "Showcase your work through meticulously curated collections and professional presentation that connects you with a global audience." 
          },
          { 
            logoUrl: '/assets/artsy-logo.png', 
            title: 'Artsy', 
            description: "The world’s leading online art marketplace, connecting artists with a community of over 3 million collectors." 
          },
          { 
            logoUrl: '/assets/helloart-logo.png', 
            title: 'HelloArt', 
            description: "Transforms commercial real estate into dynamic galleries by exhibiting your work in high-traffic professional venues." 
          },
          { 
            logoUrl: '/assets/righttime-logo.png', 
            title: 'Right Time', 
            description: "Celebrates horological excellence and the 'art of Swiss watchmaking', where technical precision meets artistic craftsmanship." 
          }
        ]
      }
    ]
  },
};

export function getContent(sectionId: string, slug: string): DeepContent | undefined {
  return MOCK_CONTENT[`${sectionId}/${slug}`];
}
