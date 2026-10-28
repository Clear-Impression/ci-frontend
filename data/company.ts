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
  // Google Forms collect quote requests and feedback until the site's own forms can send.
  quoteFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSeBNIiA-2ARD6cFt-8b4Qk-QQyFrjhL8AwlswpYtWp3SCTMWw/viewform',
  feedbackFormUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSevEVD-eUzXwsID7ZJc0XC7KFT5cKhLwyUU9Ifvm2ILNu9F1A/viewform',
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
  { label: 'Locations', href: '/locations', available: true },
  { label: 'About', href: '/about', available: true },
  { label: 'Reviews', href: '/reviews', available: true },
  { label: 'FAQ', href: '/faq', available: true },
  { label: 'Feedback', href: '/feedback', available: true },
];

// These lists are display text for now, not links to unfinished pages.
export const services = [
  'Window cleaning',
  'Solar panel cleaning',
  'Screen cleaning',
] as const;

// Keep these names in sync with serviceCities in data/home.ts.
export const serviceAreas = [
  'Mesa',
  'Phoenix',
  'Glendale',
  'Paradise Valley',
  'Tempe',
  'Scottsdale',
  'Chandler',
  'Gilbert',
  'Queen Creek',
] as const;
