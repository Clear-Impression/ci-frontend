import { beforeAfter, type BeforeAfterPair } from './beforeAfter';
import type { LocationMedia } from './locations';

// Gallery content comes from Sanity (see lib/gallery.ts). This file has the
// job types Studio offers, and the backup if Sanity has no jobs yet.

// The filter buttons on the Gallery page. Studio offers the same list when a
// job is added, so every job has a button.
export const galleryJobTypes = [
  { value: 'homes', label: 'Homes' },
  { value: 'businesses', label: 'Businesses' },
  { value: 'solar', label: 'Solar panels' },
  { value: 'screens', label: 'Screens and tracks' },
  { value: 'gutters', label: 'Gutters and roof' },
] as const;

export type GalleryJobType = (typeof galleryJobTypes)[number]['value'];

export type GalleryMedia = LocationMedia;

// One visit to one home or business: a few photos or videos, the city, and the
// service. The first photo is the one shown in the grid.
export type GalleryJob = {
  id: string;
  title: string;
  caption: string;
  city: string;
  service: { title: string; href: string } | null;
  type: GalleryJobType;
  // Tall and wide tiles take up two spots in the grid.
  size: 'normal' | 'tall' | 'wide';
  media: GalleryMedia[];
};

// A matching pair of photos for the slider at the top of the page.
export type GalleryPair = {
  title: string;
  caption: string;
  before: { url: string; focus?: string };
  after: { url: string; focus?: string };
  alt: string;
};

export const galleryPage = {
  eyebrow: 'Gallery',
  jobsHeading: 'Recent jobs',
  mapHint: 'Tap a pin to see one city. Tap it again to see them all.',
};

// Until the before-and-after pairs are added in Sanity, use the homepage's.
export const fallbackPairs: GalleryPair[] = beforeAfter.pairs.map((pair: BeforeAfterPair) => ({
  title: pair.title,
  caption: pair.caption,
  before: { url: pair.before, focus: pair.focus },
  after: { url: pair.after, focus: pair.focus },
  alt: pair.alt,
}));

// A placeholder photo from public/images. The page crops photos to fit, so the
// size here only needs to be roughly right.
function photo(url: string, alt: string): GalleryMedia {
  return {
    photo: { url, width: 1440, height: 1440, hotspot: null },
    video: null,
    alt,
  };
}

// DEMO JOBS ONLY: these use the site's placeholder photos, and the cities are
// samples. They show until the first real job is added in Sanity Studio.
export const fallbackJobs: GalleryJob[] = [
  {
    id: 'demo-stucco-home',
    title: 'Stucco home, top to bottom',
    caption: 'Hand-squeegeed sliders, then the tracks brushed and vacuumed.',
    city: 'Mesa',
    service: { title: 'Only Traditional Tools', href: '/services/window-washing-traditional-tools' },
    type: 'homes',
    size: 'tall',
    media: [
      photo('/images/home/window-cleaning.webp', 'A window cleaner squeegeeing a sliding window on a stucco home.'),
      photo('/images/services/tracks.jpg', 'A gloved hand brushing dirt out of a sliding window track.'),
    ],
  },
  {
    id: 'demo-rooftop-solar',
    title: 'Rooftop solar wash',
    caption: 'Soft-brush wash with pure water, so the panels dry without spots.',
    city: 'Gilbert',
    service: { title: 'Solar Panel Cleaning', href: '/services/solar-panel-cleaning' },
    type: 'solar',
    size: 'wide',
    media: [photo('/images/services/solar.jpg', 'A technician on a tile roof cleaning solar panels with a long brush.')],
  },
  {
    id: 'demo-storefront',
    title: 'Storefront before opening',
    caption: 'Storefront glass washed with a water-fed pole before the doors opened.',
    city: 'Tempe',
    service: { title: 'Commercial & Office Glass', href: '/services/commercial-office-glass' },
    type: 'businesses',
    size: 'tall',
    media: [photo('/images/services/commercial.jpg', 'A window cleaner washing the glass front of an office building with a water-fed pole.')],
  },
  {
    id: 'demo-two-story',
    title: 'Two-story, inside and out',
    caption: 'Every pane on a two-story home, inside and outside.',
    city: 'Chandler',
    service: { title: 'Residential Window Washing', href: '/services/residential-window-washing' },
    type: 'homes',
    size: 'normal',
    media: [photo('/images/home/residential-card.jpg', 'A window cleaner washing the front picture window of a two-story home.')],
  },
  {
    id: 'demo-railings',
    title: 'Glass railings, no spots',
    caption: 'Railings rinsed with filtered water, so nothing dries spotty.',
    city: 'Scottsdale',
    service: { title: '100% Pure Deionized Water', href: '/services/window-washing-100-percent-pure-water' },
    type: 'homes',
    size: 'tall',
    media: [photo('/images/home/pure-water-cleaning.webp', 'A window cleaner rinsing glass railings with filtered water.')],
  },
  {
    id: 'demo-office-glass',
    title: 'Office glass from the ground',
    caption: 'Upper office glass reached with a pole, no lift needed.',
    city: 'Phoenix',
    service: { title: 'Commercial & Office Glass', href: '/services/commercial-office-glass' },
    type: 'businesses',
    size: 'wide',
    media: [photo('/images/home/commercial-glass-card.jpg', 'A window cleaner reaching the upper glass of an office building with a pole.')],
  },
  {
    id: 'demo-gutters',
    title: 'Gutters before monsoon',
    caption: 'Gutters cleared by hand and downspouts checked.',
    city: 'Mesa',
    service: { title: 'Gutter & Roof Care', href: '/services/gutter-roof-care' },
    type: 'gutters',
    size: 'normal',
    media: [photo('/images/services/gutter.jpg', 'A technician on a ladder clearing debris from a gutter under a tile roof.')],
  },
];
