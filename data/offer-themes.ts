// The icons the seasonal offers can use. They're drawn in
// components/layout/OfferIcon.tsx.
export const offerIcons = [
  { id: 'sparkle', title: 'Sparkle' },
  { id: 'tag', title: 'Price tag' },
  { id: 'percent', title: 'Percent' },
  { id: 'gift', title: 'Gift' },
  { id: 'home', title: 'Home' },
  { id: 'sun', title: 'Sun' },
  { id: 'heart', title: 'Heart' },
  { id: 'crescent', title: 'Crescent moon' },
  { id: 'flower', title: 'Flower' },
  { id: 'egg', title: 'Egg' },
  { id: 'star', title: 'Star' },
  { id: 'storm', title: 'Storm cloud' },
  { id: 'pumpkin', title: 'Pumpkin' },
  { id: 'diya', title: 'Diya' },
  { id: 'leaf', title: 'Leaf' },
  { id: 'snowflake', title: 'Snowflake' },
] as const;

export type OfferIconId = (typeof offerIcons)[number]['id'];

// The looks the seasonal offers can take, picked under Seasonal offers in
// Sanity, roughly in calendar order (Eid's date moves each year). Their colors
// are in app/globals.css (search for data-offer-theme). "Make your own" uses
// the color and icon picked in Sanity instead.
export const offerThemes = [
  { id: 'regular', title: 'Regular', label: 'Special offer', icon: 'sparkle' },
  { id: 'valentines', title: 'Valentine’s Day', label: 'Valentine’s special', icon: 'heart' },
  { id: 'eid', title: 'Eid', label: 'Eid special', icon: 'crescent' },
  { id: 'spring', title: 'Spring cleaning', label: 'Spring cleaning special', icon: 'flower' },
  { id: 'easter', title: 'Easter', label: 'Easter special', icon: 'egg' },
  { id: 'fourth-of-july', title: 'Fourth of July', label: 'Fourth of July special', icon: 'star' },
  { id: 'monsoon', title: 'Monsoon season', label: 'Monsoon special', icon: 'storm' },
  { id: 'halloween', title: 'Halloween', label: 'Halloween special', icon: 'pumpkin' },
  { id: 'diwali', title: 'Diwali', label: 'Diwali special', icon: 'diya' },
  { id: 'thanksgiving', title: 'Thanksgiving', label: 'Thanksgiving special', icon: 'leaf' },
  { id: 'holidays', title: 'Holidays', label: 'Holiday special', icon: 'snowflake' },
  { id: 'custom', title: 'Make your own', label: 'Special offer', icon: 'tag' },
] as const satisfies readonly { id: string; title: string; label: string; icon: OfferIconId }[];

export type OfferThemeId = (typeof offerThemes)[number]['id'];

// Colors he can pick with one click for "Make your own". Any other color
// works too.
export const offerColorSwatches = [
  '#55ab68',
  '#0f766e',
  '#1d3a8a',
  '#6c3fb8',
  '#200b38',
  '#b3202c',
  '#e0457b',
  '#f27a1a',
  '#7a3e1d',
  '#cde9fb',
  '#f9cfe0',
  '#fdf0c4',
];
