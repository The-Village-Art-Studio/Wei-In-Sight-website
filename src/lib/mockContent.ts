import { SectionKey } from './supabase';

export type BlockType = 'text' | 'image' | 'gallery' | 'audio' | 'video' | 'process' | 'quote';

export interface ContentBlock {
  type: BlockType;
  content?: string;
  url?: string;
  caption?: string;
  items?: string[]; // For gallery or process steps
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
  'sound/original-songs': {
    id: 'so1',
    slug: 'original-songs',
    sectionId: 'sound',
    title: 'Resonance Theory',
    subtitle: 'A collection of ambient and experimental soundscapes.',
    blocks: [
      { type: 'audio', url: '/mock-audio/resonance-1.mp3', caption: 'Resonance 01: The Void', metadata: { duration: '4:20', platform: 'Spotify' } },
      { type: 'text', content: 'Sound is more than vibration; it is the architecture of the invisible.' }
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
  'pulse/available-works': {
    id: 'p1',
    slug: 'available-works',
    sectionId: 'pulse',
    title: 'Current Collections',
    subtitle: 'Works available for acquisition.',
    blocks: [
      { type: 'gallery', items: [
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5',
        'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3'
      ], caption: 'Inquire for pricing and shipping details.' }
    ]
  }
};

export function getContent(sectionId: string, slug: string): DeepContent | undefined {
  return MOCK_CONTENT[`${sectionId}/${slug}`];
}
