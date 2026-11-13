// Instant estimate settings: one tab per service, each with its own
// questions, hints and price panel.
//
// PLACEHOLDER PRICES: every rate, minimum and add-on below is a stand-in until
// our sponsor confirms his real prices. Change them here and the whole
// estimator updates. Because they're placeholders, prices show as a range.
//
// How a price is worked out for one tab:
//   slider amount x rate, then each picked choice multiplies it and/or adds to
//   it, plus any ticked add-ons, never below the minimum. The range is that
//   price minus and plus 12%, rounded to the nearest $5.

export type EstimateOption = {
  id: string;
  label: string;
  hint?: string;
  multiply?: number;
  add?: number;
};

export type EstimateAddon = {
  id: string;
  label: string;
  // A flat amount, or an amount for each unit on the slider (each window, say).
  add?: number;
  perUnit?: number;
};

export type EstimateQuestion =
  | {
      kind: 'slider';
      id: string;
      label: string;
      unit: string;
      min: number;
      max: number;
      step: number;
      start: number;
      help?: string;
    }
  | {
      kind: 'choice';
      id: string;
      label: string;
      start: string;
      options: readonly EstimateOption[];
      // Show the options as cards with hints instead of a slim toggle.
      cards?: boolean;
      help?: string;
    }
  | {
      kind: 'addons';
      id: string;
      label: string;
      start: readonly string[];
      options: readonly EstimateAddon[];
      help?: string;
    };

export type EstimateTab = {
  slug: string;
  name: string;
  tab: string;
  tabNote: string;
  // 'range' prices it here; 'photo' explains why it needs a photo instead.
  mode: 'range' | 'photo';
  rate: number;
  minimum: number;
  questions: readonly EstimateQuestion[];
  panel: {
    text: string;
    textCta: string;
    learnMore: string;
  };
  // Only for photo tabs.
  photo?: {
    why: string;
    steps: readonly { title: string; text: string }[];
    scope: string;
  };
};

const homeSize = (help: string): EstimateQuestion => ({
  kind: 'slider',
  id: 'size',
  label: 'Home size',
  unit: 'sq ft',
  min: 600,
  max: 6500,
  step: 50,
  start: 2000,
  help,
});

const height = (help: string): EstimateQuestion => ({
  kind: 'choice',
  id: 'height',
  label: 'Height',
  start: 'one',
  options: [
    { id: 'one', label: '1 story' },
    { id: 'two', label: '2 story', multiply: 1.2 },
  ],
  help,
});

export const estimateTabs: readonly EstimateTab[] = [
  {
    slug: 'residential-window-washing',
    name: 'Residential Window Washing',
    tab: 'Windows',
    tabNote: 'By home size',
    mode: 'range',
    rate: 0.12,
    minimum: 149,
    questions: [
      homeSize('The living space on your listing or tax record. A guess is fine.'),
      height('Second-story glass is cleaned from the ground with a water-fed pole.'),
      {
        kind: 'choice',
        id: 'sides',
        label: 'Sides',
        start: 'both',
        options: [
          { id: 'outside', label: 'Outside only', multiply: 0.6 },
          { id: 'both', label: 'Inside & out' },
        ],
      },
      {
        kind: 'choice',
        id: 'dirt',
        label: 'How dirty, honestly?',
        start: 'normal',
        cards: true,
        options: [
          { id: 'light', label: 'Light', hint: 'Cleaned within the last year.', add: -20 },
          { id: 'normal', label: 'Normal', hint: 'A season or two of dust, sprinkler spray and cobwebs.' },
          { id: 'rough', label: 'Rough', hint: 'Years of buildup or monsoon film.', add: 50 },
        ],
      },
      {
        kind: 'addons',
        id: 'extras',
        label: 'Tracks and screens',
        start: [],
        options: [
          { id: 'tracks', label: 'Tracks vacuumed & scrubbed', add: 40 },
          { id: 'screens', label: 'Screens washed & re-hung', add: 45 },
        ],
      },
    ],
    panel: {
      text: 'Hand-detailed glass, frames and sills. Drop cloths and shoe covers inside; pure water outside, so the glass dries spot-free.',
      textCta: 'Text this estimate',
      learnMore: 'How window cleaning works',
    },
  },
  {
    slug: 'commercial-office-glass',
    name: 'Commercial & Office Glass',
    tab: 'Commercial',
    tabNote: 'By building',
    mode: 'range',
    rate: 0.08,
    minimum: 199,
    questions: [
      {
        kind: 'slider',
        id: 'size',
        label: 'Building size',
        unit: 'sq ft',
        min: 500,
        max: 20000,
        step: 100,
        start: 3000,
        help: 'The floor area of the space. Storefront glass only? Slide toward the low end.',
      },
      {
        kind: 'choice',
        id: 'frequency',
        label: 'How often',
        start: 'once',
        options: [
          { id: 'once', label: 'One time' },
          { id: 'monthly', label: 'Monthly', multiply: 0.85 },
          { id: 'biweekly', label: 'Bi-weekly', multiply: 0.78 },
          { id: 'weekly', label: 'Weekly', multiply: 0.7 },
        ],
        help: 'Regular visits are scheduled around your business hours.',
      },
      {
        kind: 'choice',
        id: 'height',
        label: 'Height',
        start: 'ground',
        options: [
          { id: 'ground', label: 'Ground level' },
          { id: 'upper', label: 'Multi-story', multiply: 1.25 },
        ],
        help: 'Upper floors are cleaned from the ground with a water-fed pole, so no lifts or ladders.',
      },
    ],
    panel: {
      text: 'Storefronts, restaurants and low-rise offices. Squeegee and applicator on ground-level glass, pure water up high, with minimal disruption to your staff and customers.',
      textCta: 'Text this estimate',
      learnMore: 'How commercial cleaning works',
    },
  },
  {
    slug: 'solar-panel-cleaning',
    name: 'Solar Panel Cleaning',
    tab: 'Solar',
    tabNote: 'By the panel',
    mode: 'range',
    rate: 7,
    minimum: 99,
    questions: [
      {
        kind: 'slider',
        id: 'size',
        label: 'How many panels?',
        unit: 'panels',
        min: 4,
        max: 60,
        step: 1,
        start: 20,
        help: 'Count them from the driveway, or read the number off your solar monitoring app.',
      },
      height('Two-story roofs take longer to set up and reach safely.'),
    ],
    panel: {
      text: '100% pure, deionized water and soft, scratch-free brushes. Never tap water or harsh soap, which can etch the coating.',
      textCta: 'Text this estimate',
      learnMore: 'How solar cleaning works',
    },
  },
  {
    slug: 'gutter-roof-care',
    name: 'Gutter & Roof Care',
    tab: 'Gutters',
    tabNote: 'By the home',
    mode: 'range',
    rate: 0.09,
    minimum: 149,
    questions: [
      homeSize('Bigger homes usually mean more roofline and more gutter. A guess is fine.'),
      height('Two-story rooflines take longer to reach safely.'),
      {
        kind: 'choice',
        id: 'fill',
        label: 'How full are they?',
        start: 'normal',
        cards: true,
        options: [
          { id: 'normal', label: 'Some debris', hint: 'Leaves and dust, still draining.' },
          { id: 'packed', label: 'Packed', hint: 'Nests, roof granules, water spilling over.', add: 40 },
        ],
      },
    ],
    panel: {
      text: 'Debris scooped out by hand and bagged, then every downspout flushed so water runs away from your foundation. We’ll tell you about loose brackets or separating seams.',
      textCta: 'Text this estimate',
      learnMore: 'How gutter care works',
    },
  },
  {
    slug: 'hard-water-stain-removal',
    name: 'Hard Water Stain Removal',
    tab: 'Hard water',
    tabNote: 'From a photo',
    mode: 'photo',
    rate: 0,
    minimum: 0,
    questions: [],
    panel: {
      text: 'We look at your photos and reply with a price for your glass, plus a straight answer on any stain that will lighten rather than disappear.',
      textCta: 'Text us a photo',
      learnMore: 'How stain removal works',
    },
    photo: {
      why: 'Hard water staining changes so much from one pane to the next that size alone can’t price it. We need to see how deep the minerals go, so this one is quoted from a photo.',
      steps: [
        { title: 'A close-up of the worst stain', text: 'So we can see how heavy the buildup is.' },
        { title: 'The whole window', text: 'Stand back far enough to get the frame in.' },
        { title: 'How many windows look like this', text: 'A guess is fine.' },
      ],
      scope: 'Windows, glass doors and shower glass marked by sprinkler overspray or mineral-rich water.',
    },
  },
  {
    slug: 'screen-deep-cleaning',
    name: 'Screens & Tracks',
    tab: 'Screens & tracks',
    tabNote: 'By the window',
    mode: 'range',
    rate: 0,
    minimum: 59,
    questions: [
      {
        kind: 'slider',
        id: 'size',
        label: 'How many windows?',
        unit: 'windows',
        min: 1,
        max: 60,
        step: 1,
        start: 12,
        help: 'Count the windows with screens or sliding tracks. Sliding doors count too.',
      },
      {
        kind: 'addons',
        id: 'parts',
        label: 'What should we clean?',
        start: ['screens', 'tracks'],
        options: [
          { id: 'screens', label: 'Screens washed & re-hung', perUnit: 6 },
          { id: 'tracks', label: 'Tracks vacuumed & scrubbed', perUnit: 5 },
        ],
        help: 'Pick at least one.',
      },
    ],
    panel: {
      text: 'Screens brushed, washed and dried before going back up. Tracks vacuumed, scrubbed into the corners and weep holes, and wiped down so windows glide again.',
      textCta: 'Text this estimate',
      learnMore: 'How screen cleaning works',
    },
  },
];

// What the visitor picked on one tab.
export type EstimateValues = Record<string, number | string | readonly string[]>;

export function getEstimateTab(slug: string) {
  return estimateTabs.find((tab) => tab.slug === slug);
}

export function startingValues(tab: EstimateTab): EstimateValues {
  return Object.fromEntries(tab.questions.map((question) => [question.id, question.start]));
}

const roundTo5 = (value: number) => Math.round(value / 5) * 5;

// The likely price range for one tab, or null if it can't be priced here.
export function rangeFor(tab: EstimateTab, values: EstimateValues): { low: number; high: number } | null {
  if (tab.mode !== 'range') return null;
  const amount = Number(values.size ?? 0);
  let price = amount * tab.rate;
  let extra = 0;
  let picked = 0;
  for (const question of tab.questions) {
    if (question.kind === 'choice') {
      const option = question.options.find((entry) => entry.id === values[question.id]);
      if (option?.multiply) price *= option.multiply;
      if (option?.add) extra += option.add;
    }
    if (question.kind === 'addons') {
      const ticked = (values[question.id] as readonly string[] | undefined) ?? [];
      for (const addon of question.options) {
        if (!ticked.includes(addon.id)) continue;
        picked++;
        extra += (addon.add ?? 0) + (addon.perUnit ?? 0) * amount;
      }
    }
  }
  // Screens & tracks has no base rate, so it needs at least one part picked.
  if (tab.rate === 0 && picked === 0) return null;
  const middle = Math.max(tab.minimum, price + extra);
  return { low: Math.max(tab.minimum, roundTo5(middle * 0.88)), high: roundTo5(middle * 1.12) };
}

// "2,000 sq ft · 2 story · Inside & out"
export function describeValues(tab: EstimateTab, values: EstimateValues) {
  return tab.questions
    .map((question) => {
      if (question.kind === 'slider') return formatAmount(Number(values[question.id]), question.unit);
      if (question.kind === 'choice') return question.options.find((option) => option.id === values[question.id])?.label;
      const ticked = (values[question.id] as readonly string[] | undefined) ?? [];
      return question.options
        .filter((addon) => ticked.includes(addon.id))
        .map((addon) => addon.label)
        .join(', ');
    })
    .filter(Boolean)
    .join(' · ');
}

const money = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export const formatMoney = (value: number) => money.format(value);

export const formatRange = (range: { low: number; high: number }) =>
  `${formatMoney(range.low)} – ${formatMoney(range.high)}`;

// "1 window", "20 panels". Units like "sq ft" stay as they are.
export const formatAmount = (amount: number, unit: string) =>
  `${amount.toLocaleString('en-US')} ${amount === 1 && unit.endsWith('s') ? unit.slice(0, -1) : unit}`;

export const estimateNote =
  'A range, not a bid. Your final price is confirmed with a free on-site or photo quote, with no surprises.';

// One line on the visitor's summary: a service, its range (or none, for
// photo quotes) and what they picked.
export type EstimateLine = {
  slug: string;
  name: string;
  range: { low: number; high: number } | null;
  details: string;
};

export function linesFor(added: readonly string[], values: Record<string, EstimateValues>): EstimateLine[] {
  return added.flatMap((slug) => {
    const tab = getEstimateTab(slug);
    if (!tab) return [];
    const picked = values[slug] ?? startingValues(tab);
    return [
      {
        slug,
        name: tab.name,
        range: rangeFor(tab, picked),
        details: tab.mode === 'photo' ? 'Quoted from a photo' : describeValues(tab, picked),
      },
    ];
  });
}

// The total of every priced line, or null if none of them has a price.
export function totalRange(lines: readonly EstimateLine[]) {
  const priced = lines.filter((line) => line.range);
  if (priced.length === 0) return null;
  return {
    low: priced.reduce((sum, line) => sum + (line.range?.low ?? 0), 0),
    high: priced.reduce((sum, line) => sum + (line.range?.high ?? 0), 0),
  };
}
