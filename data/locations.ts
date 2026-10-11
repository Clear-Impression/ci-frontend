// Keep Locations page copy here so it can move to a CMS later.
export const locationsPageContent = {
  eyebrow: 'Where we work',
  title: 'Our locations.',
  description:
    'Residential and commercial window cleaning across Phoenix, Mesa, Gilbert, Chandler, and Tempe.',
  citiesHeading: 'Cities we serve.',
} as const;

// Each value is the text shown inside that city's dropdown.
// City names are placeholders; replace them with descriptions later.
// Dropdown headings and map pins come from serviceCities in data/home.ts.
export const locationDetails: Record<string, string> = {
  Phoenix: 'Phoenix',
  Mesa: 'Mesa',
  Gilbert: 'Gilbert',
  Chandler: 'Chandler',
  Tempe: 'Tempe',
};
