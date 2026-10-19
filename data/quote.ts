import { services } from '@/data/company';

// Keep the options outside the form so they can come from a CMS later.
export const quoteOptions = {
  services,
  propertyTypes: ['Residential', 'Commercial'],
} as const;

export type QuoteOptions = {
  services: readonly string[];
  propertyTypes: readonly string[];
};
