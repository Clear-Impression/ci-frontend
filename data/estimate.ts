import { serviceAreas } from '@/data/company';

// Instant estimate settings.
//
// PLACEHOLDER PRICES: every number below is a stand-in until Niels confirms
// his real prices. Change them here and the whole estimator updates.
//
// How a price is worked out for one service:
//   size x rate, then each picked option multiplies it and/or adds to it,
//   never below the minimum, rounded to the nearest $5.

export type EstimateMeasure = {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  start: number;
};

export type EstimateOption = {
  id: string;
  label: string;
  hint?: string;
  multiply?: number;
  add?: number;
};

export type EstimateChoice = {
  id: string;
  label: string;
  options: readonly EstimateOption[];
  // The option picked to begin with.
  start: string;
  // Show the options as cards with hints instead of a slim toggle.
  cards?: boolean;
};

export type EstimateService = {
  slug: string;
  name: string;
  summary: string;
  measure: EstimateMeasure;
  rate: number;
  minimum: number;
  choices?: readonly EstimateChoice[];
};

const homeSize = (start: number): EstimateMeasure => ({
  label: 'Home size',
  unit: 'sq ft',
  min: 600,
  max: 6500,
  step: 50,
  start,
});

const count = (label: string, unit: string, start: number, max = 60): EstimateMeasure => ({
  label,
  unit,
  min: 1,
  max,
  step: 1,
  start,
});

const stories: EstimateChoice = {
  id: 'stories',
  label: 'Height',
  start: 'one',
  options: [
    { id: 'one', label: '1 story' },
    { id: 'two', label: '2 story', multiply: 1.2 },
  ],
};

export const estimateServices: readonly EstimateService[] = [
  {
    slug: 'residential-window-washing',
    name: 'Residential Window Washing',
    summary: 'Glass, frames, and sills',
    measure: homeSize(1800),
    rate: 0.12,
    minimum: 149,
    choices: [
      stories,
      {
        id: 'sides',
        label: 'Sides',
        start: 'both',
        options: [
          { id: 'outside', label: 'Outside only', multiply: 0.6 },
          { id: 'both', label: 'Inside & out' },
        ],
      },
      {
        id: 'dirt',
        label: 'How dirty, honestly?',
        start: 'normal',
        cards: true,
        options: [
          { id: 'light', label: 'Light', hint: 'Cleaned within the last year.', add: -20 },
          { id: 'normal', label: 'Normal', hint: 'A season or two of dust and sprinkler spray.' },
          { id: 'rough', label: 'Rough', hint: 'Years of buildup or monsoon film.', add: 50 },
        ],
      },
    ],
  },
  {
    slug: 'commercial-office-glass',
    name: 'Commercial & Office Glass',
    summary: 'Storefronts and offices',
    measure: { label: 'Building size', unit: 'sq ft', min: 500, max: 20000, step: 100, start: 3000 },
    rate: 0.08,
    minimum: 199,
    choices: [
      {
        id: 'frequency',
        label: 'How often',
        start: 'once',
        options: [
          { id: 'once', label: 'One time' },
          { id: 'monthly', label: 'Monthly', multiply: 0.85 },
          { id: 'weekly', label: 'Weekly', multiply: 0.7 },
        ],
      },
    ],
  },
  {
    slug: 'solar-panel-cleaning',
    name: 'Solar Panel Cleaning',
    summary: 'Pure water, coating-safe',
    measure: count('Number of panels', 'panels', 20, 80),
    rate: 7,
    minimum: 99,
    choices: [stories],
  },
  {
    slug: 'gutter-roof-care',
    name: 'Gutter & Roof Care',
    summary: 'Clear and flush gutters',
    measure: homeSize(1800),
    rate: 0.09,
    minimum: 149,
    choices: [stories],
  },
  {
    slug: 'hard-water-stain-removal',
    name: 'Hard Water Stain Removal',
    summary: 'Mineral spots lifted',
    measure: count('Windows with stains', 'windows', 8),
    rate: 22,
    minimum: 99,
    choices: [
      {
        id: 'severity',
        label: 'Staining',
        start: 'some',
        options: [
          { id: 'some', label: 'Some spots' },
          { id: 'heavy', label: 'Heavy buildup', multiply: 1.4 },
        ],
      },
    ],
  },
  {
    slug: 'screen-deep-cleaning',
    name: 'Screen Deep Cleaning',
    summary: 'Washed and re-hung',
    measure: count('Number of screens', 'screens', 12),
    rate: 6,
    minimum: 59,
  },
  {
    slug: 'track-detailing',
    name: 'Track Detailing',
    summary: 'Vacuumed and scrubbed',
    measure: count('Number of windows', 'windows', 12),
    rate: 5,
    minimum: 59,
  },
];

export const estimateCities = [...serviceAreas, 'Other'] as const;

// What the visitor picked for one service.
export type CartItem = {
  slug: string;
  amount: number;
  picks: Record<string, string>;
};

export function getEstimateService(slug: string) {
  return estimateServices.find((service) => service.slug === slug);
}

export function startingItem(service: EstimateService): CartItem {
  return {
    slug: service.slug,
    amount: service.measure.start,
    picks: Object.fromEntries((service.choices ?? []).map((choice) => [choice.id, choice.start])),
  };
}

const roundTo5 = (value: number) => Math.round(value / 5) * 5;

export function priceFor(item: CartItem) {
  const service = getEstimateService(item.slug);
  if (!service) return 0;
  let price = item.amount * service.rate;
  let extra = 0;
  for (const choice of service.choices ?? []) {
    const option = choice.options.find((entry) => entry.id === item.picks[choice.id]);
    if (option?.multiply) price *= option.multiply;
    if (option?.add) extra += option.add;
  }
  return roundTo5(Math.max(service.minimum, price + extra));
}

export const totalFor = (cart: readonly CartItem[]) =>
  cart.reduce((sum, item) => sum + priceFor(item), 0);

// "1,800 sq ft · 2 story · Inside & out"
export function describeItem(item: CartItem) {
  const service = getEstimateService(item.slug);
  if (!service) return '';
  const picks = (service.choices ?? [])
    .map((choice) => choice.options.find((option) => option.id === item.picks[choice.id])?.label)
    .filter(Boolean);
  return [formatAmount(item.amount, service.measure.unit), ...picks].join(' · ');
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const formatMoney = (value: number) => money.format(value);

// "1 screen", "20 screens". Units like "sq ft" stay as they are.
export const formatAmount = (amount: number, unit: string) =>
  `${amount.toLocaleString('en-US')} ${amount === 1 && unit.endsWith('s') ? unit.slice(0, -1) : unit}`;

export const estimateNote =
  'Ballpark only. Your final price is confirmed with a free on-site or photo quote, with no surprises.';
