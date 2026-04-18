export interface SubMenu {
  id: string;
  label: string;
  href: string;
}

export interface Section {
  id: string;
  label: string;
  poeticLabel: string;
  practicalMeaning: string;
  href: string;
  bodyAnchor: string;
  submenus: SubMenu[];
}

export const NAV_SECTIONS: Section[] = [
  {
    id: 'sight',
    label: 'Sight',
    poeticLabel: 'Visual Arts',
    practicalMeaning: 'Visual Arts',
    href: '/sight',
    bodyAnchor: 'Eyes',
    submenus: [
      { id: 'paintings', label: 'Paintings', href: '/sight/paintings' },
      { id: 'photography', label: 'Photography', href: '/sight/photography' },
      { id: 'sculpture', label: 'Sculpture', href: '/sight/sculpture' },
      { id: 'collections', label: 'Collections', href: '/sight/collections' },
    ],
  },
  {
    id: 'sound',
    label: 'Sound',
    poeticLabel: 'Music & Audio',
    practicalMeaning: 'Music & Audio',
    href: '/sound',
    bodyAnchor: 'Ears',
    submenus: [
      { id: 'streaming-platforms', label: 'Streaming Platforms', href: '/sound/streaming-platforms' },
      { id: 'original-songs', label: 'Original Songs', href: '/sound/original-songs' },
      { id: 'audio-visual-work', label: 'Audio-Visual Work', href: '/sound/audio-visual-work' },
      { id: 'music-archive', label: 'Music Archive', href: '/sound/music-archive' },
    ],
  },
  {
    id: 'touch',
    label: 'Touch',
    poeticLabel: 'Mixed Media & Process',
    practicalMeaning: 'Mixed Media & Process',
    href: '/touch',
    bodyAnchor: 'Hand/Fingertips',
    submenus: [
      { id: 'mixed-media', label: 'Mixed Media', href: '/touch/mixed-media' },
      { id: 'material-experiments', label: 'Material Experiments', href: '/touch/material-experiments' },
      { id: 'fabric-texture-work', label: 'Fabric & Texture Work', href: '/touch/fabric-texture-work' },
      { id: 'studio-process', label: 'Studio Process', href: '/touch/studio-process' },
    ],
  },
  {
    id: 'voice',
    label: 'Voice',
    poeticLabel: 'Poems & Lyrics',
    practicalMeaning: 'Poems & Lyrics',
    href: '/voice',
    bodyAnchor: 'Throat',
    submenus: [
      { id: 'poems', label: 'Poems', href: '/voice/poems' },
      { id: 'lyrics', label: 'Lyrics', href: '/voice/lyrics' },
      { id: 'spoken-word', label: 'Spoken Word', href: '/voice/spoken-word' },
      { id: 'journal-fragments', label: 'Journal Fragments', href: '/voice/journal-fragments' },
    ],
  },
  {
    id: 'dream',
    label: 'Dream',
    poeticLabel: 'Novel & Story World',
    practicalMeaning: 'Novel & Story World',
    href: '/dream',
    bodyAnchor: 'Forehead/Temple',
    submenus: [
      { id: 'the-novel', label: 'The Novel', href: '/dream/the-novel' },
      { id: 'story-world', label: 'Story World', href: '/dream/story-world' },
      { id: 'excerpts', label: 'Excerpts', href: '/dream/excerpts' },
      { id: 'behind-the-story', label: 'Behind the Story', href: '/dream/behind-the-story' },
    ],
  },
  {
    id: 'heart',
    label: 'Heart',
    poeticLabel: 'About / Philosophy / Journey',
    practicalMeaning: 'About / Philosophy / Journey',
    href: '/heart',
    bodyAnchor: 'Chest/Heart',
    submenus: [
      { id: 'about', label: 'About', href: '/heart/about' },
      { id: 'philosophy', label: 'Philosophy', href: '/heart/philosophy' },
      { id: 'journey', label: 'Journey', href: '/heart/journey' },
      { id: 'exhibitions-features', label: 'Exhibitions & Features', href: '/heart/exhibitions-features' },
    ],
  },
  {
    id: 'pulse',
    label: 'Pulse',
    poeticLabel: 'Buy Art / Commissions / Contact',
    practicalMeaning: 'Buy Art / Commissions / Contact',
    href: '/pulse',
    bodyAnchor: 'Wrist',
    submenus: [
      { id: 'buy-art', label: 'Buy Art', href: '/pulse/buy-art' },
      { id: 'available-works', label: 'Available Works', href: '/pulse/available-works' },
      { id: 'commissions', label: 'Commissions', href: '/pulse/commissions' },
      { id: 'contact', label: 'Contact', href: '/pulse/contact' },
    ],
  },
];
