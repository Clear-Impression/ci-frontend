import { serviceCities } from './home';

// Locations content now comes from Sanity (see lib/locations.ts). This file is
// the starting text for Studio, and the backup if Sanity can't be reached.
export const locationsPageContent = {
  eyebrow: 'Where we work',
  title: 'Clear views across the Valley.',
  // {count} becomes the number of cities, so this stays right when one is added.
  description: 'Residential and commercial window cleaning in {count} cities, from Glendale to Queen Creek.',
  citiesHeading: 'Cities we serve.',
  citiesDescription: 'Explore window cleaning in your city.',
  // The bottom band sends visitors on to Services, the next stop before a quote.
  nextHeading: 'See what we can do for you.',
  nextText: 'Every service we offer across the Valley, with a free quote whenever you’re ready.',
  servicesLabel: 'See our services',
};

// Edit these draft descriptions when the business supplies more local details.
const cityDescriptions: Record<string, string> = {
  Mesa:
    'Mesa is home to Clear Impression Services. We help local homeowners and businesses care for their windows, screens, and solar panels. Whether you’re freshening up your home or improving the view from your workplace, get in touch to discuss what your property needs.',
  Phoenix:
    'Phoenix brings together residential neighborhoods and busy commercial spaces. Clear Impression Services offers window cleaning for homes and businesses in the city, along with screen and solar panel cleaning. From the windows you look through every morning to the glass your customers see first, we’re here to help.',
  Glendale:
    'Glendale is home to established neighborhoods, growing business districts, and popular destinations throughout the West Valley. Clear Impression Services provides window cleaning for local homes and businesses, with screen and solar panel cleaning also available. Contact us for dependable service tailored to your property.',
  Gilbert:
    'Gilbert’s residential neighborhoods and downtown Heritage District give the town a character of its own. Clear Impression Services provides window cleaning for local homes and businesses, with screen and solar panel cleaning also available. Contact us to plan the cleaning your property needs.',
  Chandler:
    'Chandler is home to established neighborhoods and a range of business districts. Clear Impression Services helps homeowners and businesses care for their windows, with screen and solar panel cleaning available alongside. Whether your property needs a refresh or ongoing attention, tell us what you have in mind.',
  'Paradise Valley':
    'Paradise Valley is known for its beautiful homes, desert surroundings, and exceptional resorts. Clear Impression Services provides detailed window cleaning for local residences and businesses, along with screen and solar panel cleaning to help keep every property looking its best. Contact us for reliable service tailored to your space.',
  'Fountain Hills':
    'Fountain Hills sits at the edge of the McDowell Mountains and is known for its famous fountain and wide desert views. Clear Impression Services provides window cleaning for local homes and businesses, with screen and solar panel cleaning also available. Contact us to plan the cleaning your property needs.',
  Scottsdale:
    'Known for its vibrant neighborhoods, resorts, and growing business community, Scottsdale is home to a wide range of residential and commercial properties. Clear Impression Services provides window cleaning for local homes and businesses, with screen and solar panel cleaning also available. Whether you are maintaining your home or preparing a commercial space, contact us to discuss the care your property needs.',
  'Queen Creek':
    'Queen Creek combines growing neighborhoods, open spaces, and a welcoming small-town atmosphere. Clear Impression Services helps homeowners and businesses keep their windows clean and bright, with screen and solar panel cleaning available as well. Get in touch to plan the cleaning services that fit your property.',
  Tempe:
    'Tempe combines a university setting with residential neighborhoods and local businesses. Clear Impression Services offers window cleaning for homes and commercial properties, plus screen and solar panel cleaning. Whether you’re preparing your space for visitors or keeping up with routine care, contact us to discuss your next cleaning.',
};

// The short line under each city in the header's Locations preview.
export const cityRegions: Record<string, string> = {
  Mesa: 'Our home base · East Valley',
  Phoenix: 'Central Valley',
  Glendale: 'West Valley',
  'Paradise Valley': 'Northeast Valley',
  Scottsdale: 'Northeast Valley',
  'Fountain Hills': 'Northeast Valley',
  Tempe: 'East Valley',
  Chandler: 'East Valley',
  Gilbert: 'East Valley',
  'Queen Creek': 'Southeast Valley',
};

// A photo, a video, or both. The video plays in place of the photo.
export type LocationMedia = {
  photo: {
    url: string;
    width: number;
    height: number;
    // The point to keep in view when the photo is cropped (0 to 1).
    hotspot: { x: number; y: number } | null;
  } | null;
  video: { url: string; mimeType: string } | null;
  alt: string;
};

export type LocationPage = {
  name: string;
  slug: string;
  href: string;
  title: string;
  intro: string;
  description: string;
  region: string;
  coordinates: [number, number];
  // Empty means the city uses the shared photo or video.
  media: LocationMedia | null;
};

// Use the map's city list for routes and footer links, with Mesa shown first.
export const locationPages: LocationPage[] = [...serviceCities]
  .sort((first, second) => {
    if (first.name === 'Mesa') return -1;
    if (second.name === 'Mesa') return 1;
    return 0;
  })
  .map((city) => {
    const slug = city.name.toLowerCase().replace(/ /g, '-');
    return {
      name: city.name,
      slug,
      href: `/locations/${slug}`,
      title: `Window cleaning in ${city.name}, AZ.`,
      intro:
        city.name === 'Mesa'
          ? 'Clear Impression Services is based in Mesa, providing residential and commercial window cleaning across the Phoenix metro area.'
          : `Residential and commercial window cleaning in ${city.name}, provided by Clear Impression Services.`,
      description: cityDescriptions[city.name],
      region: cityRegions[city.name] ?? 'Phoenix metro',
      coordinates: city.coordinates,
      media: null,
    };
  });

export const cityPageContent = {
  backLabel: 'All locations',
  photoEyebrow: 'For your home or business',
  photoHeading: 'A clearer view,\ncloser to home.',
  quoteLabel: 'Call for a quote',
  servicesDescription:
    'Cleaning for your home, business, and the details in between.',
  servicesLinkLabel: 'Explore all services',
};

// The photo city pages use until one is added in Sanity.
export const defaultCityMedia: LocationMedia = {
  photo: {
    url: '/images/home/window-cleaning.webp',
    width: 1440,
    height: 1440,
    hotspot: null,
  },
  video: null,
  alt: 'A window cleaner using a squeegee on a large window in an Arizona home.',
};

// Show a short service summary here; the Services page keeps its full catalog.
export const locationServices: { name: string; description: string }[] = [
  {
    name: 'Window cleaning',
    description:
      'Residential and commercial glass, cleaned for a clearer view.',
  },
  {
    name: 'Screen cleaning',
    description:
      'Remove the dust and debris collected on your window screens.',
  },
  {
    name: 'Solar panel cleaning',
    description:
      'Cleaning to remove dust and buildup from your solar panels.',
  },
  {
    name: 'Hard water stain removal',
    description:
      'Target mineral deposits that leave stubborn marks on glass.',
  },
  {
    name: 'Post-construction cleanup',
    description:
      'Clear construction dust, labels, and residue from newly finished spaces.',
  },
  {
    name: 'Glass door & mirror polishing',
    description:
      'Remove fingerprints and smudges from the glass you use every day.',
  },
];
