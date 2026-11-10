import { aboutIntro } from './about';
import { feedbackPage } from './feedback';
import { homeHero } from './home';
import { locationsPageContent } from './locations';
import { termsEffectiveDate } from './terms';

export type PageHeader = {
  title: string;
  subtitle: string;
};

export type PageHeaderSettings = PageHeader & { label: string };

export const pageHeaders: Record<string, PageHeaderSettings> = {
  home: {
    label: 'Home',
    title: homeHero.titleLines.join('\n'),
    subtitle: '',
  },
  faq: {
    label: 'FAQ',
    title: 'Frequently asked questions',
    subtitle: 'Quick answers to what customers ask us most. Don’t see your question? Call or text, and we’ll help.',
  },
  services: {
    label: 'Services',
    title: 'Every pane,\ncleaned the right way.',
    subtitle: 'Window and exterior cleaning for homes and businesses across Mesa and the Phoenix metro.',
  },
  about: { label: 'About', title: aboutIntro.title, subtitle: aboutIntro.lead },
  locations: {
    label: 'Locations',
    title: locationsPageContent.title,
    subtitle: locationsPageContent.description,
  },
  reviews: {
    label: 'Reviews',
    title: 'Customer Reviews',
    subtitle: 'What our customers say about us.',
  },
  feedback: {
    label: 'Feedback',
    title: feedbackPage.title,
    subtitle: feedbackPage.description,
  },
  estimate: {
    label: 'Get a free quote',
    title: 'Get a free quote.',
    subtitle: 'See a ballpark price in about two minutes, or request an exact quote from our team.',
  },
  quote: {
    label: 'Request a quote',
    title: 'Request a quote.',
    subtitle: 'Fresh windows. A brighter space. Tell us a little about your home or business and the cleaning you have in mind.',
  },
  terms: {
    label: 'Service terms',
    title: 'Appointment, Cancellation,\nand Service Terms.',
    subtitle: termsEffectiveDate,
  },
};
