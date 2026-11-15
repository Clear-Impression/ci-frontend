// Keep company details in one place for the header and footer.
export const company = {
  name: 'Clear Impression Services',
  description:
    'Residential and commercial window cleaning for a clearer view across the Phoenix metro area.',
  phone: '(480) 622-0622',
  phoneHref: 'tel:+14806220622',
  email: 'info@clearimpressionservices.com',
  emailHref: 'mailto:info@clearimpressionservices.com',
  googleHref: 'https://maps.app.goo.gl/yeWqwmgf9EPuVkqL8',
  homeAdvisorHref: 'https://www.homeadvisor.com/rated.ClearImpression.165676077.html',
  instagramHref: 'https://www.instagram.com/clearimpressionwindowcleaning/',
  facebookHref: 'https://www.facebook.com/profile.php?id=61590409861022',
  bbbHref: 'https://www.bbb.org/us/az/mesa/profile/window-cleaning/clear-impression-llc-1126-1000184565',
  website: 'https://clearimpressionservices.com/',
  logo: '/logos/logo.png',
  // Wide version of the logo for the header bar.
  logoHorizontal: '/logos/logo-horizontal.png',
  quoteFormUrl: '/quote',
} as const;

export type NavigationItem = {
  label: string;
  href: string;
  available: boolean;
  // Show a preview panel when this tab is hovered or focused.
  preview?: 'services' | 'locations' | 'about' | 'help';
  // Pages grouped under this tab. The tab stays gold on any of them, and the
  // phone menu lists them under the tab's name.
  links?: readonly { label: string; href: string }[];
};

// Set available to true only when the page exists.
export const navigation: readonly NavigationItem[] = [
  { label: 'Home', href: '/', available: true },
  { label: 'Services', href: '/services', available: true, preview: 'services' },
  { label: 'Reviews', href: '/reviews', available: true },
  { label: 'Locations', href: '/locations', available: true, preview: 'locations' },
  {
    label: 'Help',
    href: '/faq',
    available: true,
    preview: 'help',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Feedback', href: '/feedback' },
    ],
  },
  {
    label: 'About',
    href: '/about',
    available: true,
    preview: 'about',
    links: [
      { label: 'Meet the owner', href: '/about' },
      { label: 'Blog', href: '/blog' },
    ],
  },
];

// These lists are display text for now, not links to unfinished pages.
export const services = [
  'Window cleaning',
  'Solar panel cleaning',
  'Screen cleaning',
] as const;
