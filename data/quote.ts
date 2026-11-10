export const quoteOptions = {
  services: [
    { id: 'window-cleaning', label: 'Window cleaning' },
    { id: 'solar-panel-cleaning', label: 'Solar panel cleaning' },
    { id: 'screen-cleaning', label: 'Screen cleaning' },
  ],
  propertyTypes: ['Residential', 'Commercial'],
} as const;

export type QuoteOptions = {
  services: readonly { id: string; label: string }[];
  propertyTypes: readonly string[];
};
