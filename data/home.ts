// Keep the homepage copy separate so it can move to a CMS later.
export const homeHero = {
  eyebrow: 'Window cleaning in the Phoenix metro area',
  title: 'Clear Impressions. Always.',
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
  { name: 'Mesa', coordinates: [33.4152, -111.8315] },
  { name: 'Gilbert', coordinates: [33.3528, -111.789] },
  { name: 'Chandler', coordinates: [33.3062, -111.8413] },
  { name: 'Tempe', coordinates: [33.4255, -111.94] },
];

export type HomeService = {
  id: string;
  name: string;
  title: string;
  steps: { label: string; description: string }[];
  ordered: boolean;
  result: string;
  image: string;
  imageAlt: string;
};

// Use the same cleaning explanations and images as the current website.
export const homeServices: readonly HomeService[] = [
  {
    id: 'pure-water-cleaning',
    name: 'Solar Panel Cleaning & Maintenance',
    title: 'Easy as 1, 2, 3',
    ordered: true,
    steps: [
      { label: 'Carbon Filter', description: 'Removes chlorine and sediment.' },
      {
        label: 'RO Membrane',
        description: 'Strips 98% of minerals and impurities.',
      },
      {
        label: 'DI Resin',
        description: 'The final polish for 100% pure water.',
      },
    ],
    result:
      'Just pure water that evaporates to leave a spotless, crystal-clear finish. Windows stay clean for longer!',
    image: '/images/home/pure-water-cleaning.webp',
    imageAlt: 'XERO water purification equipment used for pure-water cleaning.',
  },
  {
    id: 'window-cleaning',
    name: 'Residential & Commercial Window Cleaning',
    title: 'Hand-Detailed Precision',
    ordered: false,
    steps: [
      {
        label: 'The Method',
        description:
          'Professional-grade squeegees, microfiber washers, and eco-friendly soaps.',
      },
      {
        label: 'The Benefit',
        description:
          'Hand-scrubbed and polished to remove fingerprints, grease, and debris.',
      },
      {
        label: 'Best For',
        description:
          'Interior glass, deep-cleaning frames, and a mirror-like finish at eye level.',
      },
    ],
    result: 'Hand-detailed for a streak-free shine.',
    image: '/images/home/window-cleaning.webp',
    imageAlt:
      'A window cleaner using a squeegee on a large window in an Arizona home.',
  },
];
