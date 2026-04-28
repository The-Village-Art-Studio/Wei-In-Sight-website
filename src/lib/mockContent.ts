import { SectionKey } from './supabase';

export type BlockType = 'text' | 'image' | 'gallery' | 'audio' | 'video' | 'video-gallery' | 'process' | 'quote' | 'logo-grid' | 'form' | 'profile-photo' | 'exhibition-list' | 'pillar-grid' | 'dna-section';

export interface PillarItem {
  title: string;
  content: string;
}

export interface ExhibitionItem {
  title: string;
  location: string;
  year: string;
  isAward?: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  year: string;
  medium: string;
  description: string;
  link?: string;
}

export interface Album {
  id: string;
  title: string;
  description?: string;
  coverImages: string[];
  items: GalleryItem[];
}

export interface ContentBlock {
  type: BlockType;
  content?: string;
  url?: string;
  caption?: string;
  items?: string[] | GalleryItem[]; // Updated to support complex items
  logoItems?: { logoUrl: string; title: string; description: string; link?: string; preserveColor?: boolean }[];
  exhibitionItems?: ExhibitionItem[];
  pillarItems?: PillarItem[];
  dnaItems?: string[];
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
  albums?: Album[]; // New field for album-folder views
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
        content: `### TEXTURE OF MEMORY\n\nThese works represent a five-year exploration of sensory memory. Each stroke is a translation of a specific moment in time—a vibration captured through heavy impasto and gold leaf.`
      }
    ],
    albums: [
      {
        id: 'atmospheric-studies',
        title: 'Atmospheric Studies',
        description: 'Large scale oil works focusing on light and depth.',
        coverImages: [
          '/assets/art/sight_paintings_1_1776627360680.png',
          '/assets/art/sight_paintings_2_1776627384437.png',
          '/assets/art/sight_paintings_hero_1776626955531.png'
        ],
        items: [
          {
            id: 'as-1',
            url: '/assets/art/sight_paintings_1_1776627360680.png',
            title: 'Nocturne in Gold',
            year: '2024',
            medium: 'Oil and Gold Leaf on Canvas',
            description: 'An exploration of urban light at midnight, translated through heavy impasto.'
          },
          {
            id: 'as-2',
            url: '/assets/art/sight_paintings_2_1776627384437.png',
            title: 'Ethereal Drift',
            year: '2023',
            medium: 'Mixed Media on Wood',
            description: 'The tension between atmospheric haze and structured geometry.'
          }
        ]
      },
      {
        id: 'memory-fragments',
        title: 'Memory Fragments',
        description: 'Small format sketches and process artifacts.',
        coverImages: [
          '/assets/art/sight_paintings_hero_1776626955531.png',
          '/assets/art/sight_paintings_1_1776627360680.png'
        ],
        items: [
          {
            id: 'mf-1',
            url: '/assets/art/sight_paintings_hero_1776626955531.png',
            title: 'Shattered Mirror',
            year: '2024',
            medium: 'Acrylic and Charcoal',
            description: 'Capturing the fragmented nature of childhood memories.'
          }
        ]
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
        content: `### THE VOID BEYOND\n\nPhotography, for me, is an exercise in subtractive composition.`
      }
    ],
    albums: [
      {
        id: 'brutalist-rhythms',
        title: 'Brutalist Rhythms',
        description: 'Monolithic studies in shadow and structure.',
        coverImages: [
          '/assets/art/sight_photography_1_1776627407211.png',
          '/assets/art/sight_photography_2_1776627429953.png',
          '/assets/art/sight_photography_3_1776627454474.png'
        ],
        items: [
          {
            id: 'br-1',
            url: '/assets/art/sight_photography_1_1776627407211.png',
            title: 'Concrete Echo',
            year: '2024',
            medium: 'Digital Photography',
            description: 'The silent pulse of a brutalist facade.'
          }
        ]
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
        content: `### TACTILE BRUTALISM\n\nMy sculptures are physical manifestations of internal friction.`
      }
    ],
    albums: [
      {
        id: 'glass-steel',
        title: 'Glass & Steel',
        description: 'Exploring transparency and weight.',
        coverImages: [
          '/assets/art/sight_sculpture_1_1776627480388.png',
          '/assets/art/sight_sculpture_2_1776627504199.png'
        ],
        items: [
          {
            id: 'gs-1',
            url: '/assets/art/sight_sculpture_1_1776627480388.png',
            title: 'Tension III',
            year: '2024',
            medium: 'Oxidized Steel and Blown Glass',
            description: 'A study in material fragility versus industrial strength.'
          }
        ]
      }
    ]
  },
  'sight/collections': {
    id: 's4',
    slug: 'collections',
    sectionId: 'sight',
    title: 'Digital Arts Archive',
    subtitle: 'Curated series of digital artifacts and mixed media studies.',
    heroImage: '/assets/art/sight_collections_preview_1776627027864.png',
    blocks: [
      {
        type: 'text',
        content: `### THE CREATIVE ATLAS\n\nCollections represent the connective tissue between my disparate disciplines.`
      }
    ],
    albums: [
      {
        id: 'digital-studies',
        title: 'Digital Studies',
        description: 'New media interventions.',
        coverImages: [
          '/assets/art/sight_collections_1_1776627530672.png'
        ],
        items: [
          {
            id: 'ds-1',
            url: '/assets/art/sight_collections_1_1776627530672.png',
            title: 'Data Flux',
            year: '2025',
            medium: 'Generative Art',
            description: 'Visualizing memory as a decaying digital stream.'
          }
        ]
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
    heroImage: '/assets/art/sight_photography_preview_1776626984989.png',
    blocks: [
      {
        type: 'logo-grid',
        logoItems: [
          {
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg',
            title: 'Spotify',
            description: "Stream my latest conceptual soundscapes, original albums, and immersive audio explorations.",
            link: 'https://open.spotify.com/artist/4DebGnDY4FnrE3cy6PrWWK?si=GohtblluTIeLIvGUnB-etQ',
            preserveColor: true
          },
          {
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Apple_Music_icon_iOS_26.svg',
            title: 'Apple Music',
            description: "Find my entire discography and narratively-driven scores in high-fidelity spatial audio.",
            link: 'https://music.apple.com/ca/artist/the-prof/1733168743',
            preserveColor: true
          },
          {
            logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/YouTube_Music_icon_2024.svg',
            title: 'YouTube Music',
            description: "A centralized hub to watch my audio-visual projects and listen to my official track releases.",
            link: 'https://music.youtube.com/channel/UCfG9SAkCC8sNDAKV5qbOSZA?si=-gBjmrbJhLyaCCia',
            preserveColor: true
          }
        ]
      }
    ]
  },
  'sound/audio-visual-work': {
    id: 'so3',
    slug: 'audio-visual-work',
    sectionId: 'sound',
    title: 'Audio-Visual Work',
    subtitle: 'Cinematic scores and experimental video pieces.',
    heroImage: '/assets/art/sight_sculpture_preview_1776627004575.png',
    blocks: [
      {
        type: 'video-gallery',
        items: [
          {
            id: 'av-1',
            url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            title: 'Resonance in Void',
            year: '2025',
            medium: 'Video',
            description: 'An exploration of sound and isolated space.'
          },
          {
            id: 'av-2',
            url: 'https://www.youtube.com/embed/jNQXAC9IVRw',
            title: 'Neon Pulse',
            year: '2024',
            medium: 'Video',
            description: 'Synthwave visualizer and original score.'
          },
          {
            id: 'av-3',
            url: 'https://www.youtube.com/embed/ScMzIvxBSi4',
            title: 'Echoes of the Atlas',
            year: '2025',
            medium: 'Video',
            description: 'Concept trailer for the novel project.'
          }
        ]
      }
    ]
  },
  'sound/music-archive': {
    id: 'so4',
    slug: 'music-archive',
    sectionId: 'sound',
    title: 'Music Archive',
    subtitle: 'A historical catalog of past audio experiments.',
    heroImage: '/assets/art/sight_photography_2_1776627429953.png',
    blocks: [
      {
        type: 'gallery',
        items: [
          {
            id: 'ma-1',
            url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
            title: 'Lost Tapes Vol. 1',
            year: '2023',
            medium: 'Analog Cassette',
            description: 'Early electronic sketches.'
          },
          {
            id: 'ma-2',
            url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745',
            title: 'Studio Sessions',
            year: '2024',
            medium: 'Digital',
            description: 'Live performance outtakes.'
          },
          {
            id: 'ma-3',
            url: 'https://images.unsplash.com/photo-1514525253344-781472993a4a',
            title: 'Synthesizer Study',
            year: '2023',
            medium: 'Modular Synth',
            description: 'Patch bay experiments.'
          },
          {
            id: 'ma-4',
            url: 'https://images.unsplash.com/photo-1459749411177-042180ce673c',
            title: 'Acoustic Fragments',
            year: '2025',
            medium: 'Piano',
            description: 'Unfinished compositions.'
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
    heroImage: '/assets/art/sight_paintings_hero_1776626955531.png',
    blocks: [
      {
        type: 'gallery',
        items: [
          {
            id: 'p-1',
            url: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
            title: 'Syllables of Light',
            year: '2024',
            medium: 'Ink on Vellum',
            description: 'Original manuscript page.',
            link: 'https://jackyho.com/poems/syllables'
          },
          {
            id: 'p-2',
            url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a',
            title: 'Nocturne III',
            year: '2024',
            medium: 'Typewritten',
            description: 'Captured during the midnight watch.',
            link: 'https://jackyho.com/poems/nocturne'
          },
          {
            id: 'p-3',
            url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f',
            title: 'The Void',
            year: '2023',
            medium: 'Digital',
            description: 'Minimalist layout study.',
            link: 'https://jackyho.com/poems/void'
          },
          {
            id: 'p-4',
            url: 'https://images.unsplash.com/photo-1471107340929-a87cd0f5b5f3',
            title: 'Transience',
            year: '2025',
            medium: 'Journal Entry',
            description: 'A study on fading ink.',
            link: 'https://jackyho.com/poems/transience'
          }
        ]
      }
    ]
  },
  'voice/lyrics': {
    id: 'v2',
    slug: 'lyrics',
    sectionId: 'voice',
    title: 'Lyrics',
    subtitle: 'The skeletal remains of songs.',
    heroImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
    blocks: [
      {
        type: 'gallery',
        items: [
          {
            id: 'l-1',
            url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d',
            title: 'Shattered Rhythm',
            year: '2024',
            medium: 'Digital Note',
            description: 'Scrawled in the back of a taxi.'
          },
          {
            id: 'l-2',
            url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9',
            title: 'Neon Ghost',
            year: '2025',
            medium: 'Typewritten',
            description: 'A study in urban isolation.'
          },
          {
            id: 'l-3',
            url: 'https://images.unsplash.com/photo-1514525253344-781472993a4a',
            title: 'The Gutter',
            year: '2024',
            medium: 'Handwritten',
            description: 'Finding beauty in the discarded.'
          },
          {
            id: 'l-4',
            url: 'https://images.unsplash.com/photo-1459749411177-042180ce673c',
            title: 'Resonance',
            year: '2025',
            medium: 'Digital',
            description: 'The echo of a forgotten verse.'
          }
        ]
      }
    ]
  },
  // TOUCH
  'touch/material-experiments': {
    id: 't1',
    slug: 'material-experiments',
    sectionId: 'touch',
    title: 'Fabric & Friction',
    subtitle: 'Tactile studies on organic textiles and mineral pigments.',
    heroImage: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974',
    blocks: [
      { type: 'text', content: 'A study on how different fabrics react to water-based pigments over time.' }
    ],
    albums: [
      {
        id: 'linen-clay',
        title: 'Linen & Clay',
        description: 'Tactile experiments with organic materials.',
        coverImages: [
          'https://images.unsplash.com/photo-1544256718-3bcf237f3974',
          'https://images.unsplash.com/photo-1549490349-8643362247b5'
        ],
        items: [
          {
            id: 'lc-1',
            url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974',
            title: 'Earthbound I',
            year: '2024',
            medium: 'Clay Pigment on Linen',
            description: 'A study of mineral absorption into organic fibers.'
          }
        ]
      }
    ]
  },
  'touch/mixed-media': {
    id: 't2',
    slug: 'mixed-media',
    sectionId: 'touch',
    title: 'Mixed Media',
    subtitle: 'Exploring the intersection of physical and digital materials.',
    heroImage: '/assets/art/sight_paintings_2_1776627384437.png',
    blocks: [
      { type: 'text', content: 'A collection of works that blend traditional painting techniques with modern digital fabrication.' }
    ],
    albums: [
      {
        id: 'synthetic-nature',
        title: 'Synthetic Nature',
        description: 'Blending organic forms with artificial materials.',
        coverImages: ['/assets/art/sight_paintings_2_1776627384437.png'],
        items: [
          {
            id: 'sn-1',
            url: '/assets/art/sight_paintings_2_1776627384437.png',
            title: 'Resin & Wood',
            year: '2023',
            medium: 'Mixed Media',
            description: 'Exploration of natural wood textures encased in synthetic resin.'
          }
        ]
      }
    ]
  },
  'touch/watchmaking': {
    id: 't3',
    slug: 'watchmaking',
    sectionId: 'touch',
    title: 'Watchmaking',
    subtitle: 'Precision, time, and micro-mechanics.',
    heroImage: '/assets/art/sight_photography_1_1776627407211.png',
    blocks: [
      { type: 'text', content: 'The art of horology and micro-mechanical engineering as a form of expression.' }
    ],
    albums: [
      {
        id: 'mechanical-precision',
        title: 'Mechanical Precision',
        description: 'Macro studies of custom gears, bridges, and escapements.',
        coverImages: [
          'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5',
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
          'https://images.unsplash.com/photo-1585123334904-845d60e97b29'
        ],
        items: [
          {
            id: 'mp-1',
            url: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ad5',
            title: 'Escapement Wheel',
            year: '2024',
            medium: 'Macro Photography',
            description: 'The heartbeat of a mechanical movement.'
          },
          {
            id: 'mp-2',
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
            title: 'Tourbillon Cage',
            year: '2024',
            medium: 'Technical Render',
            description: 'Gravity-defying precision.'
          }
        ]
      },
      {
        id: 'horological-sculpture',
        title: 'Horological Sculpture',
        description: 'Finished timepieces and case architecture.',
        coverImages: [
          'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7',
          'https://images.unsplash.com/photo-1547996160-81dfa63595dd'
        ],
        items: [
          {
            id: 'hs-1',
            url: 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7',
            title: 'Obsidian Chronograph',
            year: '2025',
            medium: 'Mixed Media',
            description: 'A study in light absorption and time.'
          }
        ]
      }
    ]
  },
  'touch/fashion': {
    id: 't4',
    slug: 'fashion',
    sectionId: 'touch',
    title: 'Fashion',
    subtitle: 'Wearable art and textile exploration.',
    heroImage: '/assets/art/sight_sculpture_1_1776627480388.png',
    blocks: [
      { type: 'text', content: 'Translating visual concepts into wearable garments and fashion artifacts.' }
    ],
    albums: [
      {
        id: 'textile-narratives',
        title: 'Textile Narratives',
        description: 'Explorations in fabric manipulation and organic dyes.',
        coverImages: [
          'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17',
          'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
          'https://images.unsplash.com/photo-1576016773324-47c37407ca29'
        ],
        items: [
          {
            id: 'tn-1',
            url: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17',
            title: 'Shattered Silk',
            year: '2024',
            medium: 'Distressed Fabric',
            description: 'A study in material decay and beauty.'
          },
          {
            id: 'tn-2',
            url: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3',
            title: 'Indigo Void',
            year: '2024',
            medium: 'Hand-dyed Wool',
            description: 'Depth achieved through 40 layers of indigo.'
          }
        ]
      },
      {
        id: 'avant-garde-forms',
        title: 'Avant-Garde Forms',
        description: 'Structural garments and conceptual silhouettes.',
        coverImages: [
          'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f'
        ],
        items: [
          {
            id: 'agf-1',
            url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b',
            title: 'Monolith Cloak',
            year: '2025',
            medium: 'Technical Canvas',
            description: 'Architectural protection for the urban voyager.'
          }
        ]
      }
    ]
  },
  // DREAM
  'dream/novels': {
    id: 'd1',
    slug: 'novels',
    sectionId: 'dream',
    title: 'Novels',
    subtitle: 'Insights into the ongoing novel project.',
    heroImage: '/assets/art/sight_paintings_hero_1776626955531.png',
    blocks: [
      {
        type: 'gallery',
        items: [
          {
            id: 'd-1',
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570',
            title: 'The Atlas Architecture',
            year: '2025',
            medium: 'Concept Art',
            description: 'Visualizing the floating archives.',
            link: 'https://jackyho.com/novels/atlas'
          },
          {
            id: 'd-2',
            url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba',
            title: 'Mountain Pass',
            year: '2024',
            medium: 'Digital Matte Painting',
            description: 'The journey to the North Spires.',
            link: 'https://jackyho.com/novels/mountain'
          },
          {
            id: 'd-3',
            url: 'https://images.unsplash.com/photo-1532012197367-275d06cb4941',
            title: 'Codex Wei',
            year: '2024',
            medium: 'Prop Study',
            description: 'The forbidden book of shadows.',
            link: 'https://jackyho.com/novels/codex'
          },
          {
            id: 'd-4',
            url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26',
            title: 'Void Station',
            year: '2025',
            medium: 'Cinematic Render',
            description: 'The point where dreams converge.',
            link: 'https://jackyho.com/novels/void'
          }
        ]
      }
    ]
  },
  'dream/quotes': {
    id: 'd2',
    slug: 'quotes',
    sectionId: 'dream',
    title: 'Quotes',
    subtitle: 'Voices from the world of Wei.',
    heroImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
    blocks: [
      {
        type: 'gallery',
        items: [
          {
            id: 'q-1',
            url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
            title: 'The First Law',
            year: '2024',
            medium: 'Stone Inscription',
            description: 'To see is to forget.'
          },
          {
            id: 'q-2',
            url: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
            title: 'On Memory',
            year: '2025',
            medium: 'Digital Scroll',
            description: 'We are the sum of what we lose.'
          },
          {
            id: 'q-3',
            url: 'https://images.unsplash.com/photo-1506466010722-395aa2bef877',
            title: 'The Weaver',
            year: '2024',
            medium: 'Ancient Text',
            description: 'Silence is the only true translation.'
          },
          {
            id: 'q-4',
            url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744',
            title: 'Void Speak',
            year: '2025',
            medium: 'Conceptual Art',
            description: 'The future is a memory not yet forgotten.'
          }
        ]
      }
    ]
  },
  // HEART
  'heart/exhibitions-features': {
    id: 'h4',
    slug: 'exhibitions-features',
    sectionId: 'heart',
    title: 'Exhibitions & Features',
    subtitle: 'Official record of public displays and recognitions.',
    blocks: [
      {
        type: 'exhibition-list',
        exhibitionItems: [
          {
            title: 'The Great Outdoors by Northern Contemporary Gallery',
            location: 'Toronto, Canada',
            year: '2026'
          },
          {
            title: 'Miami Art Weeks 2025',
            location: 'Miami, USA',
            year: '2025'
          },
          {
            title: 'Trace by PDA at Avant Garde Gallery',
            location: 'Toronto, Canada',
            year: '2025'
          },
          {
            title: 'Natalie Solo Show by La Gloria Mexican Coffee',
            location: 'Toronto, Canada',
            year: '2025'
          },
          {
            title: 'Featured Artist in 101 Artbook Landscape Edition by Arts to Hearts Magazine',
            location: 'Worldwide',
            year: '2025',
            isAward: true
          }
        ]
      }
    ]
  },
  'heart/philosophy': {
    id: 'h2',
    slug: 'philosophy',
    sectionId: 'heart',
    title: 'Philosophy',
    subtitle: 'The inner compass of a multidisciplinary search.',
    blocks: [
      {
        type: 'text',
        content: `### THE MANIFESTO OF TRACE\n\nArt is not a search for decoration or a pursuit of perfection. It is a form of truth-telling—a way to leave a human trace in a world that often moves too fast to feel. \n\nCreative expression is an act of translation, giving form to the invisible threads of memory, emotion, and presence. It is the bridge between the silent inner world and the visible outer one.`
      },
      {
        type: 'pillar-grid',
        pillarItems: [
          {
            title: 'Expression Over Perfection',
            content: 'The heartbeat of the work is not in the flawless line, but in the honest one. Perfection is a destination; expression is a journey toward truth.'
          },
          {
            title: 'Medium as Language',
            content: 'Painting, sound, material, and word are not separate disciplines, but different dialects of the same search. Each offers a unique way to hold a feeling.'
          },
          {
            title: 'Beauty Must Carry Weight',
            content: 'Aesthetic grace is only meaningful when it holds a core of truth—a weight of lived experience, a shadow of longing, or a spark of hope.'
          },
          {
            title: 'The Handmade & Imagined',
            content: 'The friction between the tactile craftsmanship of the hand and the reaches of science fiction creates a space where the past meets the future.'
          },
          {
            title: 'Memory as Material',
            content: 'Memory is not just a subject; it is a raw material to be shaped, layered, and transformed, much like oil paint, clay, or a haunting melody.'
          },
          {
            title: 'Art as Human Trace',
            content: 'Each work is an emotional vessel, evidence of existence, and a lasting echo of what it means to be alive and to feel deeply.'
          }
        ]
      },
      {
        type: 'dna-section',
        caption: 'CREATIVE DNA',
        dnaItems: [
          'Science Fiction', 'Cinema', 'Romance', 'Migration', 'Memory',
          'Craftsmanship', 'Everyday Tenderness', 'Emotional Aftermath',
          'Material Experimentation', 'Time', 'Human Connection'
        ]
      },
      {
        type: 'text',
        content: `### THE NON-LINEAR PROCESS\n\nThe creative act is rarely linear. It begins as a vibration—a sudden image, a specific texture, a haunting sound, or a single line of writing. \n\nFrom this seed, the work finds its own form, moving fluidly between mediums until it captures the exact frequency of the original feeling. Whether it becomes a painting, a sculpture, or a poem, the search remains the same.`
      },
      {
        type: 'quote',
        content: 'Art is not about perfection. It is about expression.'
      },
      {
        type: 'text',
        content: `### THE REMAINING ECHO\n\nIn the intersection of image, sound, and story, art becomes more than an object. It becomes a fragment of life meant not only to appear, but to remain—a quiet evidence of the soul\'s journey through the atlas of existence.`
      }
    ]
  },
  'heart/about': {
    id: 'h1',
    slug: 'about',
    sectionId: 'heart',
    title: 'The Artist',
    subtitle: 'Jacky Ho\'s journey through multidisciplinarity.',
    blocks: [
      { type: 'profile-photo', url: '/assets/art/sight_photography_preview_1776626984989.png' },
      { type: 'text', content: 'Jacky Ho is a Toronto-based multidisciplinary artist working across painting, sculpture, photography, music, poetry, watchmaking, design, and object-making. His practice moves fluidly between mediums, guided by the belief that each form offers a different way to hold memory, emotion, and presence.\n\nKnown creatively as Wei In Sight, Jacky builds work that lingers. The name reflects his desire to create pieces that remain in people’s sight not merely as decoration, but as memory, atmosphere, and emotional trace. His artistic identity is also rooted in the name Wei Ho, given to him by his grandfather, a fine art teacher whose quiet devotion to art left a lasting mark on the way he sees creation, resilience, and purpose.\n\nInfluenced by migration, longing, craftsmanship, cinema, romance, and science fiction, Jacky creates works that exist in the space between tenderness and structure, intimacy and futurism, the handmade and the imagined. His pieces often carry a cinematic quality, inviting viewers not only to observe, but to step into an atmosphere shaped by feeling, texture, and story.\n\nRather than pursuing perfection, Jacky approaches art as an act of translation — a way of giving form to what is difficult to name. Through color, material, sound, image, and language, he builds works that function as emotional vessels, holding traces of what has been lived, remembered, and transformed. His multidisciplinary practice reflects a continuous search for the right language for each idea, whether that language becomes a painting, a sculpture, a melody, a poem, or an object shaped by hand.\n\nOutside the studio, Jacky is also an entrepreneur and educator who has taught in colleges and universities for years, building spaces where craft, curiosity, and confidence can grow. That same spirit of exploration runs through all of his work, where tradition, technology, and human emotion are often brought into conversation with one another.\n\nHis creative world also extends into literature. Writing a novel had long been one of his childhood dreams, and that dream came to life through The Dinner, a contemporary romance born from a romantic watercolor series and shaped by his enduring interest in intimacy, memory, healing, and human connection. Like the rest of his practice, the work is grounded in the belief that ordinary moments can carry extraordinary emotional weight.\n\nAt the core of Jacky’s philosophy is a simple but enduring truth: art is not about perfection, but expression. In this way, each work becomes more than an object. It becomes evidence of being, a fragment of the inner world made visible, and a lasting echo of what it means to feel deeply.' }
    ]
  },
  'heart/journey': {
    id: 'h2',
    slug: 'journey',
    sectionId: 'heart',
    title: 'The Journey',
    subtitle: 'Milestones of a creative odyssey.',
    heroImage: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    blocks: [
      {
        type: 'gallery',
        items: [
          {
            id: 'j-1',
            url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
            title: 'The Crossing',
            year: '2023',
            medium: 'Photography',
            description: 'Leaving the familiar behind.',
            link: 'https://jackyho.com/journey/crossing'
          },
          {
            id: 'j-2',
            url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
            title: 'Quiet Peak',
            year: '2024',
            medium: 'Digital Study',
            description: 'The height of creative isolation.',
            link: 'https://jackyho.com/journey/peak'
          },
          {
            id: 'j-3',
            url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e',
            title: 'Deep Woods',
            year: '2024',
            medium: 'Concept Art',
            description: 'Losing one\'s way to find the path.',
            link: 'https://jackyho.com/journey/woods'
          },
          {
            id: 'j-4',
            url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470',
            title: 'Return',
            year: '2025',
            medium: 'Photography',
            description: 'Carrying the world back with you.',
            link: 'https://jackyho.com/journey/return'
          }
        ]
      }
    ]
  },

  // PULSE
  'pulse/buy-art': {
    id: 'p2',
    slug: 'buy-art',
    sectionId: 'pulse',
    title: 'Acquisition Destinations',
    subtitle: 'Official channels for acquiring my physical works and fine art editions.',
    heroImage: '/assets/art/sight_collections_preview_1776627027864.png',
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
    title: 'Commissions',
    subtitle: 'Secure a custom-crafted audio experience for your vision.',
    heroImage: '/assets/art/sight_sculpture_preview_1776627004575.png',
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
    heroImage: '/assets/art/sight_photography_2_1776627429953.png',
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
