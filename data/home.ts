import { company } from '@/data/company';

// Send quote requests to the Google Form until the new form can submit them.
const quoteHref = company.quoteFormUrl;

// Keep the homepage copy separate so it can move to a CMS later.
export const homeHero = {
  eyebrow: 'Window cleaning in the Phoenix metro area',
  titleLines: ['Clear Impression.', 'Always.'],
  quoteHref,
  description:
    'Serving Phoenix Metro with spotless windows that brighten your home or business inside and out.',
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
  eyebrow: 'Our pure water method',
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
  slug: string;
  blurb: string;
};

// Use existing service slugs so the cards link to the right pages.
export const homeServices = {
  eyebrow: 'What we do',
  title: 'Built for Arizona glass.',
  cards: [
    {
      slug: 'residential-window-washing',
      blurb:
        'Drop cloths and shoe covers inside, pure water outside. Fingerprints, dog smudges and monsoon splatter, gone.',
    },
    {
      slug: 'commercial-office-glass',
      blurb:
        'Storefronts, restaurants and offices on a weekly, bi-weekly or monthly schedule built around your hours.',
    },
    {
      slug: 'solar-panel-cleaning',
      blurb:
        'Dusty panels make less power. We never use tap water or harsh soap that can etch the coating.',
    },
    {
      slug: 'hard-water-stain-removal',
      blurb:
        'Valley water bakes mineral deposits onto glass. We assess it first, then bring back the shine safely.',
    },
    {
      slug: 'screen-deep-cleaning',
      blurb:
        'Dust, pollen and debris out of your screens, for cleaner airflow and brighter natural light.',
    },
    {
      slug: 'track-detailing',
      blurb:
        'Packed-in dirt, dead bugs and mud vacuumed and scrubbed out, so your windows glide again.',
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
  title: 'From Glendale to Queen Creek.',
  lead: 'Nine cities across the Valley, from West Valley storefronts to new homes in Queen Creek. Pick yours to see what we do there.',
};

export const homeClosing = {
  quoteHref,
  heading: 'Unlock the beauty beyond the glass.',
  text: 'Tell us about your home or business and we’ll get back to you with a free quote, no surprises. Rather talk it through? Call or text us any time.',
};
