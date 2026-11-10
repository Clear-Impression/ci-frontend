import { company, navigation } from '@/data/company';
import { coreServices, services } from '@/data/services';
import type { SearchEntry } from '@/lib/search';

// What the header search looks through. This file loads the first time
// someone opens search, so it doesn't slow down the first page load.

// A short line and other words people might type for each menu page.
const pageDetails: Record<string, { description: string; keywords: string[] }> = {
  '/': {
    description: 'Window cleaning for homes and businesses across the Phoenix metro.',
    keywords: ['home page', 'start'],
  },
  '/locations': {
    description: 'Every city we serve, with a map of our service area.',
    keywords: ['areas', 'cities', 'service area', 'near me', 'map', 'where'],
  },
  '/services': {
    description: 'Everything we clean, from windows to solar panels.',
    keywords: ['all services', 'what we do', 'prices'],
  },
  '/about': {
    description: 'Our story, how we clean, and the promise behind our work.',
    keywords: ['company', 'story', 'team', 'owner', 'who', 'how we clean'],
  },
  '/reviews': {
    description: 'What customers say about us on Google.',
    keywords: ['ratings', 'testimonials', 'google', 'stars', 'reviews'],
  },
  '/faq': {
    description: 'Answers to common questions.',
    keywords: ['questions', 'help', 'faq', 'frequently asked'],
  },
  '/feedback': {
    description: 'Tell us how your cleaning went.',
    keywords: ['comment', 'complaint', 'feedback', 'tell us'],
  },
};

// Other words people might type for each service, beyond its name and description.
const serviceKeywords: Record<string, string[]> = {
  'window-washing-traditional-tools': ['squeegee', 'hand', 'interior', 'inside', 'streak free', 'method'],
  'window-washing-100-percent-pure-water': ['deionized', 'di water', 'water fed pole', 'spotless', 'mineral free', 'exterior', 'high windows', 'second story', 'method'],
  'residential-window-washing': ['home', 'house', 'windows', 'inside', 'outside', 'residential'],
  'commercial-office-glass': ['business', 'office', 'storefront', 'restaurant', 'store', 'shop', 'commercial'],
  'solar-panel-cleaning': ['solar', 'panels', 'energy', 'power'],
  'gutter-roof-care': ['gutters', 'roof', 'debris', 'leaves', 'downspouts'],
  'track-detailing': ['tracks', 'sliding', 'slider', 'stuck window', 'dirt'],
  'hard-water-stain-removal': ['spots', 'minerals', 'stains', 'calcium', 'sprinkler'],
  'screen-deep-cleaning': ['screens', 'mesh', 'bugs'],
  'post-construction-cleanup': ['construction', 'new build', 'renovation', 'paint', 'stickers', 'remodel'],
  'graffiti-removal-service': ['graffiti', 'paint', 'vandalism', 'tagging', 'spray paint'],
  'french-storm-windows': ['french', 'storm', 'divided panes', 'grids'],
  'glass-door-mirror-polishing': ['mirrors', 'shower', 'glass doors', 'patio door'],
  'chandelier-cleaning': ['chandelier', 'light fixtures', 'crystal'],
  'awning-sunroom-cleaning': ['awning', 'sunroom', 'patio', 'cover'],
  'move-in-move-out-servicing': ['moving', 'move out', 'move in', 'rental', 'landlord', 'realtor'],
  'skylight-rooftop-glass': ['skylights', 'roof glass', 'rooftop'],
  'general-property-maintenance': ['cobwebs', 'dusting', 'light fixtures', 'maintenance', 'wasp nests'],
};

const quoteEntry: SearchEntry = {
  type: 'page',
  title: 'Get a free quote',
  href: company.quoteFormUrl,
  external: true,
  description: 'Tell us about your property and get a free quote.',
  keywords: ['quote', 'price', 'cost', 'estimate', 'book', 'schedule', 'appointment', 'how much'],
  boost: 0.5,
};

export const siteSearchEntries: SearchEntry[] = [
  // Every page in the main menu.
  ...navigation
    .filter((item) => item.available)
    .map((item): SearchEntry => ({
      type: 'page',
      title: item.label,
      href: item.href,
      description: pageDetails[item.href]?.description ?? '',
      keywords: pageDetails[item.href]?.keywords ?? [],
    })),
  quoteEntry,
  {
    type: 'page',
    title: 'Service terms',
    href: '/terms-and-conditions',
    description: 'Appointments, cancellations, rescheduling, weather, and payment.',
    keywords: ['terms', 'policy', 'cancel', 'cancellation', 'reschedule', 'payment', 'weather', 'rain'],
  },
  // Every service page. The main services rank a little higher.
  ...services.map((service): SearchEntry => ({
    type: 'service',
    title: service.title,
    href: `/services/${service.slug}`,
    description: `${service.previewDescription} ${service.largeDescription}`,
    short: service.previewDescription,
    keywords: serviceKeywords[service.slug] ?? [],
    boost: coreServices.includes(service) ? 0.3 : 0,
  })),
  // City pages come from Sanity through /api/search/locations.
];

// Shown before anything is typed.
const popularHrefs = [
  '/services/residential-window-washing',
  '/services/commercial-office-glass',
  '/services/solar-panel-cleaning',
  '/locations',
  company.quoteFormUrl,
];

export const popularSearches = popularHrefs
  .map((href) => siteSearchEntries.find((entry) => entry.href === href))
  .filter((entry): entry is SearchEntry => entry !== undefined);
