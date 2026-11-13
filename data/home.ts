import { company } from './company';

const quoteHref = company.quoteFormUrl;

// Keep the homepage copy separate so it can move to a CMS later.
export const homeHero = {
  eyebrow: 'Window cleaning in the Phoenix metro area',
  titleLines: ['Clear Impression.', 'Always.'],
  quoteHref,
};

export type ServiceCity = {
  name: string;
  coordinates: [number, number];
};

// These are city centers, not the edges of our service coverage.
export const serviceCities: readonly ServiceCity[] = [
  { name: 'Phoenix', coordinates: [33.4484, -112.074] },
  { name: 'Glendale', coordinates: [33.5483, -112.1917]},
  { name: 'Paradise Valley', coordinates: [33.53111, -111.94278]},
  { name: 'Tempe', coordinates: [33.4255, -111.94] },
  { name: 'Scottsdale', coordinates: [33.50921, -111.89903]},
  { name: 'Fountain Hills', coordinates: [33.6117, -111.7173]},
  { name: 'Chandler', coordinates: [33.3062, -111.8413] },
  { name: 'Mesa', coordinates: [33.4152, -111.8315] },
  { name: 'Gilbert', coordinates: [33.3528, -111.789] },
  { name: 'Queen Creek', coordinates: [33.24866, -111.63430]},
];

// This is the founder's start year from the About page.
export const servingSince = 2018;

export type PureWaterStep = {
  label: string;
  detail: string;
};

export const pureWater = {
  eyebrow: 'New technology, same reliable results',
  title: 'Easy as 1, 2, 3.',
  lead: 'Tap water leaves spots. Ours goes through three stages first, so nothing is left behind when it dries.',
  steps: [
    {
      label: 'Carbon Filter',
      detail: 'Removes chlorine and sediment from the water before anything else.',
    },
    {
      label: 'RO Membrane',
      detail: 'Reverse osmosis strips out 98% of the minerals and impurities that cause spots.',
    },
    {
      label: 'DI Resin',
      detail: 'The final polish: deionization leaves 100% pure water that dries without a trace.',
    },
  ] as readonly PureWaterStep[],
  result:
    'Just pure water that evaporates to leave a spotless, crystal-clear finish. Windows stay clean for longer!',
  image: '/images/home/pure-water-cleaning.webp',
  imageAlt: 'XERO water purification equipment used for pure-water cleaning.',
  caption: 'The filtration system we bring to every pure water job.',
};

export type HomeServiceCard = {
  // An existing service slug, so the card links to the right page.
  slug: string;
  // A short label in the pill above the title.
  badge: string;
  blurb: string;
  // Three short points, taken from that service's page.
  points: readonly [string, string, string];
  cta: string;
  // Used until the service has its own photo in Sanity.
  image: string;
  imageAlt: string;
  // Which part of the photo stays in view in the tall card, e.g. '70% center'.
  imagePosition?: string;
};

// The "What we clean" section: four tall photo cards for our main services.
export const homeServices = {
  eyebrow: 'What we clean',
  titleLines: ['Homes. Storefronts.', 'Solar. Gutters.'],
  lead: 'Our four most-booked services, for homes and businesses across Mesa and the Phoenix metro. Screens, tracks, hard water stains and more are on the services page.',
  cards: [
    {
      slug: 'residential-window-washing',
      badge: 'Inside & out',
      blurb:
        'Hand-detailed glass inside, pure water outside. Fingerprints, dog smudges and monsoon splatter, gone.',
      points: ['Drop cloths & shoe covers', 'Water-fed pole outside', 'Dries spot-free'],
      cta: 'See window cleaning',
      // Our own photo of a clean home window.
      image: '/images/home/home-window-card.jpg',
      imageAlt: 'Spotless windows on a stucco home with palm trees reflected in the glass.',
    },
    {
      slug: 'commercial-office-glass',
      badge: 'On your schedule',
      blurb:
        'Storefronts, restaurants and low-rise offices kept sharp, with minimal disruption to your staff and customers.',
      points: ['Retail & restaurants', 'Weekly, bi-weekly or monthly', 'No lifts or ladders upstairs'],
      cta: 'See commercial glass',
      image: '/images/home/commercial-glass-card.jpg',
      imageAlt: 'A window cleaner using a water-fed pole on the glass front of an office building.',
      imagePosition: '72% center',
    },
    {
      slug: 'solar-panel-cleaning',
      badge: 'Warranty-safe',
      blurb:
        'Desert dust blocks the sun your panels need. We rinse it off without anything that can etch the coating.',
      points: ['100% pure, deionized water', 'Soft, scratch-free brushes', 'No tap water or harsh soap'],
      cta: 'See solar cleaning',
      image: '/images/home/solar-card.jpg',
      imageAlt: 'Workers cleaning rows of solar panels with long brushes and a hose.',
      imagePosition: '55% center',
    },
    {
      slug: 'gutter-roof-care',
      badge: 'Monsoon ready',
      blurb:
        'Clogged gutters overflow in a monsoon. We clear them by hand, then flush every downspout so water flows away.',
      points: ['Debris scooped & bagged', 'Downspouts flushed', 'Loose brackets flagged'],
      cta: 'See gutter care',
      image: '/images/home/roof-card.jpg',
      imageAlt: 'A worker on a tiled roof spraying away built-up grime.',
      imagePosition: '72% center',
    },
  ] as readonly HomeServiceCard[],
};

export type HomeStep = {
  title: string;
  text: string;
};

export const homeSteps = {
  eyebrow: 'How it works',
  title: 'No surprises, start to finish.',
  steps: [
    {
      title: 'Tell us about your property',
      text: `Call or text ${company.phone}, or send a request with your address and what needs cleaning.`,
    },
    {
      title: 'Get an honest quote',
      text: 'Clear communication and fair pricing up front, with the right method chosen for your glass.',
    },
    {
      title: 'We treat it like our own',
      text: 'Drop cloths and shoe covers inside, pure water outside, and every pane hand-detailed.',
    },
    {
      title: 'Not done until you’re happy',
      text: 'If something isn’t right, we make it right. That’s the Clear Impression promise.',
    },
  ] as readonly HomeStep[],
};

export const homeAreas = {
  eyebrow: 'Where we work',
  title: 'Do we serve your area?',
  // Name the service and the region, so this short section still helps search.
  // {count} becomes the number of cities shown on the website.
  lead: 'Window cleaning in {count} cities across the Phoenix metro. Pick yours to see what we do there.',
  cityPagesLabel: 'See the page for your city',
};

export const homeClosing = {
  quoteHref: '/estimate',
  heading: 'Unlock the beauty beyond the glass.',
  text: 'Tell us about your home or business and we’ll get back to you with a free quote, no surprises. Rather talk it through? Call or text us any time.',
  stepsLabel: 'What happens next?',
  // Free Unsplash photo (unsplash.com/license). Swap in one of our own job photos any time.
  image:
    'https://images.unsplash.com/photo-1706403222567-06fe8d8dc93e?auto=format&fit=crop&w=2000&q=80',
  imageAlt: 'The Phoenix valley and mountains at golden hour',
};
