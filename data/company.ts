// Keep company details in one place for the header and footer.
export const company = {
  name: 'Clear Impression Services',
  description:
    'Residential and commercial window cleaning for a clearer view across the Phoenix metro area.',
  phone: '(480) 622-0622',
  phoneHref: 'tel:+14806220622',
  email: 'info@clearimpressionservices.com',
  emailHref: 'mailto:info@clearimpressionservices.com',
  website: 'https://clearimpressionservices.com/',
  logo: '/logos/logo.png',
} as const;

export type NavigationItem = {
  label: string;
  href: string;
  available: boolean;
};

// Set available to true only when the page exists.
export const navigation: readonly NavigationItem[] = [
  { label: 'Home', href: '/', available: true },
  { label: 'Services', href: '/services', available: true },
  { label: 'Locations', href: '/locations', available: false },
  { label: 'About', href: '/about', available: true },
  { label: 'Reviews', href: '/reviews', available: true },
  { label: 'FAQ', href: '/faq', available: true },
];

// These lists are display text for now, not links to unfinished pages.
export const services = [
  'Window cleaning',
  'Solar panel cleaning',
  'Screen cleaning',
] as const;

export const serviceAreas = [
  'Mesa',
  'Gilbert',
  'Chandler',
  'Tempe',
  'Phoenix metro',
] as const;
