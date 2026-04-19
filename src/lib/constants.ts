export interface SubMenu {
  id: string;
  label: string;
  href: string;
}

export interface AnchorPosition {
  x: number; // percentage from left
  y: number; // percentage from top
}

export type Point3D = [number, number, number];

export interface Section {
  id: string;
  label: string;
  poeticLabel: string;
  practicalMeaning: string;
  href: string;
  bodyAnchor: string;
  anchorPos: AnchorPosition;
  anchorPos3D: Point3D;
  cameraPos3D: Point3D;
  cameraTarget3D: Point3D;
  submenus: SubMenu[];
  editorial: {
    layoutType: 'gallery' | 'audio' | 'process' | 'prose' | 'narrative' | 'profile' | 'pulse';
    moodColor?: string;
    accentColor?: string;
  };
}

export const IDENTITY = {
  wordmark: 'WEI IN SIGHT',
  subtitle: 'The creative atlas of Jacky Ho',
  intro: 'A multidisciplinary artist building worlds through image, sound, craft, poetry, and memory.',
  manifesto: 'Artist. Maker. Storyteller.',
};

export const FOOTER_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'Email', href: 'mailto:contact@weiinsight.com' },
  { label: 'Collect / Inquire', href: '/pulse/contact' },
];

export const NAV_SECTIONS: Section[] = [
  {
    id: 'sight',
    label: 'Sight',
    poeticLabel: 'Visual Arts',
    practicalMeaning: 'Visual Arts',
    href: '/sight',
    bodyAnchor: 'Eyes',
    anchorPos: { x: 50, y: 18 },
    anchorPos3D: [0, 1.33, 0.1],
    cameraPos3D: [0, 1.33, 1.8],
    cameraTarget3D: [0, 1.33, 0.1],
    submenus: [
      { id: 'paintings', label: 'Paintings', href: '/sight/paintings' },
      { id: 'photography', label: 'Photography', href: '/sight/photography' },
      { id: 'sculpture', label: 'Sculpture', href: '/sight/sculpture' },
      { id: 'collections', label: 'Collections', href: '/sight/collections' },
    ],
    editorial: {
      layoutType: 'gallery',
      accentColor: '#ff00ff',
    },
  },
  {
    id: 'sound',
    label: 'Sound',
    poeticLabel: 'Music & Audio',
    practicalMeaning: 'Music & Audio',
    href: '/sound',
    bodyAnchor: 'Ears',
    anchorPos: { x: 55, y: 22 },
    anchorPos3D: [-0.12, 1.33, 0.05],
    cameraPos3D: [-0.12, 1.33, 1.8],
    cameraTarget3D: [-0.12, 1.33, 0.05],
    submenus: [
      { id: 'streaming-platforms', label: 'Streaming Platforms', href: '/sound/streaming-platforms' },
      { id: 'original-songs', label: 'Original Songs', href: '/sound/original-songs' },
      { id: 'audio-visual-work', label: 'Audio-Visual Work', href: '/sound/audio-visual-work' },
      { id: 'music-archive', label: 'Music Archive', href: '/sound/music-archive' },
    ],
    editorial: {
      layoutType: 'audio',
      accentColor: '#00ffff',
    },
  },
  {
    id: 'touch',
    label: 'Touch',
    poeticLabel: 'Mixed Media & Process',
    practicalMeaning: 'Mixed Media & Process',
    href: '/touch',
    bodyAnchor: 'Hand/Fingertips',
    anchorPos: { x: 30, y: 55 },
    anchorPos3D: [-0.38, 0.07, 0.1],
    cameraPos3D: [-0.38, 0.07, 1.8],
    cameraTarget3D: [-0.38, 0.07, 0.1],
    submenus: [
      { id: 'mixed-media', label: 'Mixed Media', href: '/touch/mixed-media' },
      { id: 'material-experiments', label: 'Material Experiments', href: '/touch/material-experiments' },
      { id: 'fabric-texture-work', label: 'Fabric & Texture Work', href: '/touch/fabric-texture-work' },
      { id: 'studio-process', label: 'Studio Process', href: '/touch/studio-process' },
    ],
    editorial: {
      layoutType: 'process',
      accentColor: '#ffa500',
    },
  },
  {
    id: 'voice',
    label: 'Voice',
    poeticLabel: 'Poems & Lyrics',
    practicalMeaning: 'Poems & Lyrics',
    href: '/voice',
    bodyAnchor: 'Throat',
    anchorPos: { x: 50, y: 28 },
    anchorPos3D: [0, 1.24, 0.1],
    cameraPos3D: [0, 1.24, 1.8],
    cameraTarget3D: [0, 1.24, 0.1],
    submenus: [
      { id: 'poems', label: 'Poems', href: '/voice/poems' },
      { id: 'lyrics', label: 'Lyrics', href: '/voice/lyrics' },
      { id: 'spoken-word', label: 'Spoken Word', href: '/voice/spoken-word' },
      { id: 'journal-fragments', label: 'Journal Fragments', href: '/voice/journal-fragments' },
    ],
    editorial: {
      layoutType: 'prose',
      accentColor: '#ffffff',
    },
  },
  {
    id: 'dream',
    label: 'Dream',
    poeticLabel: 'Novel & Story World',
    practicalMeaning: 'Novel & Story World',
    href: '/dream',
    bodyAnchor: 'Forehead/Temple',
    anchorPos: { x: 50, y: 12 },
    anchorPos3D: [0, 1.41, 0.1],
    cameraPos3D: [0, 1.41, 1.8],
    cameraTarget3D: [0, 1.41, 0.1],
    submenus: [
      { id: 'the-novel', label: 'The Novel', href: '/dream/the-novel' },
      { id: 'story-world', label: 'Story World', href: '/dream/story-world' },
      { id: 'excerpts', label: 'Excerpts', href: '/dream/excerpts' },
      { id: 'behind-the-story', label: 'Behind the Story', href: '/dream/behind-the-story' },
    ],
    editorial: {
      layoutType: 'narrative',
      accentColor: '#7b68ee',
    },
  },
  {
    id: 'heart',
    label: 'Heart',
    poeticLabel: 'About / Philosophy / Journey',
    practicalMeaning: 'About / Philosophy / Journey',
    href: '/heart',
    bodyAnchor: 'Chest/Heart',
    anchorPos: { x: 50, y: 42 },
    anchorPos3D: [0, 0.94, 0.15],
    cameraPos3D: [0, 0.94, 1.8],
    cameraTarget3D: [0, 0.94, 0.15],
    submenus: [
      { id: 'about', label: 'About', href: '/heart/about' },
      { id: 'philosophy', label: 'Philosophy', href: '/heart/philosophy' },
      { id: 'journey', label: 'Journey', href: '/heart/journey' },
      { id: 'exhibitions-features', label: 'Exhibitions & Features', href: '/heart/exhibitions-features' },
    ],
    editorial: {
      layoutType: 'profile',
      accentColor: '#ff6b6b',
    },
  },
  {
    id: 'pulse',
    label: 'Pulse',
    poeticLabel: 'Buy Art / Commissions / Contact',
    practicalMeaning: 'Buy Art / Commissions / Contact',
    href: '/pulse',
    bodyAnchor: 'Wrist',
    anchorPos: { x: 65, y: 62 },
    anchorPos3D: [0.28, 0.27, 0.1],
    cameraPos3D: [0.28, 0.27, 1.8],
    cameraTarget3D: [0.28, 0.27, 0.1],
    submenus: [
      { id: 'buy-art', label: 'Buy Art', href: '/pulse/buy-art' },
      { id: 'available-works', label: 'Available Works', href: '/pulse/available-works' },
      { id: 'commissions', label: 'Commissions', href: '/pulse/commissions' },
      { id: 'contact', label: 'Contact', href: '/pulse/contact' },
    ],
    editorial: {
      layoutType: 'pulse',
      accentColor: '#00ffc3',
    },
  },
];
