// The 3-step estimate: Bronze, Silver and Gold packages, the optional
// add-ons, and the wording around them.
//
// PLACEHOLDER PRICES: the window, screen, track and solar numbers come from
// the instant estimate settings in data/estimate.ts, which are still stand-ins
// until Niels confirms his real rates. Change them there and both the old
// calculator and this page update.

import { getEstimateTab, type EstimateTab } from '@/data/estimate';

export type PackageId = 'bronze' | 'silver' | 'gold';

export type HomeDetails = {
  size: number;
  stories: 1 | 2;
  dirt: 'light' | 'normal' | 'rough';
  hardWater: boolean;
};

export const startingHome: HomeDetails = { size: 2000, stories: 1, dirt: 'normal', hardWater: false };

export const homeSize = { min: 600, max: 6500, step: 50 };

export const dirtOptions = [
  { id: 'light', label: 'Light', hint: 'Cleaned in the last year' },
  { id: 'normal', label: 'Normal', hint: 'A season or two of dust' },
  { id: 'rough', label: 'Rough', hint: 'Years of buildup or monsoon film' },
] as const;

export type Package = {
  id: PackageId;
  name: string;
  note: string;
  // What it includes. "added" marks what's new compared with the level below.
  includes: readonly { label: string; added?: boolean }[];
  // Gold's house wash is confirmed by a person, so its price is "from".
  needsReview?: string;
  recommended?: boolean;
};

export const packages: readonly Package[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    note: 'Most affordable',
    includes: [{ label: 'Exterior windows' }, { label: 'Frames and sills wiped' }, { label: 'Pure water rinse, spot-free' }],
  },
  {
    id: 'silver',
    name: 'Silver',
    note: 'Best for complete window cleaning',
    recommended: true,
    includes: [
      { label: 'Everything in Bronze' },
      { label: 'Interior windows too', added: true },
      { label: 'Drop cloths and shoe covers inside', added: true },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    note: 'The full treatment',
    needsReview: '+ house wash, confirmed after review',
    includes: [
      { label: 'Everything in Silver' },
      { label: 'Screens washed', added: true },
      { label: 'Tracks detailed', added: true },
      { label: 'Exterior house wash', added: true },
      { label: 'Priority scheduling', added: true },
      { label: '7-day touch-up guarantee', added: true },
    ],
  },
];

export const upgradeNotes: Record<PackageId, string> = {
  bronze: 'Silver adds the inside of every window, with drop cloths and shoe covers.',
  silver: 'Gold adds screens, tracks, a house wash, priority scheduling and a 7-day touch-up guarantee.',
  gold: 'You have everything: inside and out, screens, tracks, house wash, priority scheduling and our 7-day touch-up guarantee.',
};

export type AddonId = 'screens' | 'solar' | 'hardWater' | 'houseWash' | 'chandelier';

export type Addon = {
  id: AddonId;
  name: string;
  note: string;
  // Instant add-ons are priced here; the rest are quoted by a person.
  instant: boolean;
  // Counts toward the "add one more and unlock a bonus" offer.
  qualifies?: boolean;
  // Already part of this package, so it isn't offered.
  includedIn?: PackageId;
};

export const addons: readonly Addon[] = [
  { id: 'screens', name: 'Screens and tracks', note: 'Screens washed, tracks detailed', instant: true, qualifies: true, includedIn: 'gold' },
  { id: 'solar', name: 'Solar panel cleaning', note: 'Pure water and soft brushes', instant: true, qualifies: true },
  { id: 'hardWater', name: 'Hard water stain removal', note: 'Priced from a photo', instant: false },
  { id: 'houseWash', name: 'Exterior house wash', note: 'Confirmed after review', instant: false, includedIn: 'gold' },
  { id: 'chandelier', name: 'Chandelier cleaning', note: 'Custom quote', instant: false },
];

// The bonus offer, shown once one qualifying add-on is picked. The bonus
// itself is still to be decided by Niels; set `enabled` to false to hide it.
export const bonusOffer = {
  enabled: true,
  text: 'Add one more qualifying service and unlock a free bonus.',
};

export const clearPricePromise = {
  title: 'Our Clear Price Promise',
  text: "Your estimate is based on the details you provide. We'll verify the scope and agree on your final price before any work begins. If anything changes, we'll explain why and get your approval first. No surprise charges.",
};

export const clearClub = {
  title: 'Clear Club',
  text: 'Come back every 3 or 6 months and save on each visit after this one. No sign-up needed today.',
};

export const paymentNote = 'No payment now. We take cash, check or Zelle on cleaning day.';

// ---------- Pricing ----------
// Prices come from the instant estimate settings, which Niels edits in Sanity
// ("Instant prices"). Pass in the tabs loaded with getEstimatePricing(); the
// built-in defaults are used only if none are given.

type Tabs = readonly EstimateTab[];

function tab(tabs: Tabs, slug: string): EstimateTab {
  const found = tabs.find((entry) => entry.slug === slug) ?? getEstimateTab(slug);
  if (!found) throw new Error(`Missing estimate settings for ${slug}`);
  return found;
}

function choice(tabData: EstimateTab, questionId: string, optionId: string) {
  const question = tabData.questions.find((entry) => entry.id === questionId);
  if (question?.kind !== 'choice') return undefined;
  return question.options.find((option) => option.id === optionId);
}

function addonAmount(tabData: EstimateTab, addonId: string) {
  for (const question of tabData.questions) {
    if (question.kind !== 'addons') continue;
    const found = question.options.find((option) => option.id === addonId);
    if (found) return found.add ?? 0;
  }
  return 0;
}

export type Range = { low: number; high: number };

// The same spread and rounding as the instant estimate settings in Sanity.
function toRange(middle: number, tabData: EstimateTab): Range {
  const spread = (tabData.rangePercent ?? 12) / 100;
  const step = tabData.roundingIncrement ?? 5;
  const round = (value: number) => Math.round(value / step) * step;
  return { low: round(middle * (1 - spread)), high: round(middle * (1 + spread)) };
}

// Screens and tracks together, from the windows settings.
function screensAndTracks(windows: EstimateTab) {
  return addonAmount(windows, 'screens') + addonAmount(windows, 'tracks');
}

function windowsPrice(windows: EstimateTab, home: HomeDetails, outsideOnly: boolean) {
  let price = home.size * windows.rate;
  price *= choice(windows, 'height', home.stories === 2 ? 'two' : 'one')?.multiply ?? 1;
  if (outsideOnly) price *= choice(windows, 'sides', 'outside')?.multiply ?? 1;
  price += choice(windows, 'dirt', home.dirt)?.add ?? 0;
  return Math.max(windows.minimum, price);
}

export function packagePrice(id: PackageId, home: HomeDetails, tabs: Tabs = []): Range {
  const windows = tab(tabs, 'residential-window-washing');
  if (id === 'bronze') return toRange(windowsPrice(windows, home, true), windows);
  if (id === 'silver') return toRange(windowsPrice(windows, home, false), windows);
  return toRange(windowsPrice(windows, home, false) + screensAndTracks(windows), windows);
}

export const solarPanels = { min: 4, max: 60, start: 20 };

export function addonPrice(id: AddonId, home: HomeDetails, panels: number, tabs: Tabs = []): Range | null {
  if (id === 'screens') {
    const windows = tab(tabs, 'residential-window-washing');
    return toRange(screensAndTracks(windows), windows);
  }
  if (id === 'solar') {
    const solar = tab(tabs, 'solar-panel-cleaning');
    const height = choice(solar, 'height', home.stories === 2 ? 'two' : 'one')?.multiply ?? 1;
    return toRange(Math.max(solar.minimum, panels * solar.rate * height), solar);
  }
  return null;
}

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const formatDollars = (value: number) => dollars.format(value);

export const formatRange = (range: Range) => `${formatDollars(range.low)} to ${formatDollars(range.high)}`;
