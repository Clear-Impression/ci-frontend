// The estimate: Bronze, Silver and Gold window packages, the extras, the
// Clear Club plans and the wording around them.
//
// PLACEHOLDER PRICES: the window, screen, track and solar numbers come from
// the instant estimate settings in data/estimate.ts, which are still stand-ins
// until Niels confirms his real rates. Change them there and both the old
// calculator and this page update.

import { getEstimateTab, type EstimateTab, type EstimateValues } from '@/data/estimate';

export type PackageId = 'bronze' | 'silver' | 'gold';

export type HomeDetails = {
  // Window panes.
  size: number;
  style?: string;
  stories: 1 | 2;
  dirt: 'light' | 'normal' | 'rough';
  hardWater: boolean;
};

export const startingHome: HomeDetails = { size: 24, style: 'none', stories: 1, dirt: 'normal', hardWater: false };

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

// Special services: priced by a person after the request (no instant
// price). The names and notes match the Services page.
export type ExtraId = string;

export const extras: readonly { id: ExtraId; name: string; note: string; includedIn?: PackageId }[] = [
  { id: 'house-wash', name: 'Exterior house wash', note: 'Confirmed after review', includedIn: 'gold' },
  { id: 'french-storm-windows', name: 'French & Storm Windows', note: 'Detailed care for specialty window designs.' },
  { id: 'glass-door-mirror-polishing', name: 'Glass Door & Mirror Polishing', note: 'Keep high-touch glass bright and spotless.' },
  { id: 'skylight-rooftop-glass', name: 'Skylight & Rooftop Glass', note: 'Brighten hard-to-reach glass above your home.' },
  { id: 'chandelier-cleaning', name: 'Chandelier Cleaning', note: 'Bring back the sparkle of your light fixtures.' },
  { id: 'awning-sunroom-cleaning', name: 'Awning & Sunroom Cleaning', note: 'Make your covered outdoor spaces feel fresh.' },
  { id: 'post-construction-cleanup', name: 'Post-Construction Cleanup', note: 'Clear away the mess left after a project.' },
  { id: 'move-in-move-out-servicing', name: 'Move-In / Move-Out Servicing', note: 'Start or finish a move with a clean property.' },
  { id: 'graffiti-removal-service', name: 'Graffiti Removal Service', note: 'Get exterior surfaces looking like new again.' },
  { id: 'general-property-maintenance', name: 'General Property Maintenance', note: 'Keep your property looking its best year-round.' },
];

// The bonus offer, shown once two services are picked. The bonus
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
  title: 'Join the Clear Club?',
  text: 'Come back every 3 or 6 months and save on each visit after this one. No sign-up today; we set it up when we call.',
};

export type ClubPlan = 'once' | 'six' | 'three';

export const clubPlans: readonly { id: ClubPlan; label: string; hint: string }[] = [
  { id: 'once', label: 'Just this once', hint: 'No plan' },
  { id: 'six', label: 'Every 6 months', hint: 'Save on each visit' },
  { id: 'three', label: 'Every 3 months', hint: 'Save on each visit' },
];

// Shown once if someone looks like they're leaving the estimate.
// The referral amount came from the team; confirm the details with Niels.
export const leaveOffers = {
  referral: {
    title: 'Refer a friend, get $50 off',
    text: 'Send a friend our way. Once they book, you get $50 off your next service.',
  },
  guarantee: {
    title: 'Gold comes with a 7-day guarantee',
    text: 'Pick Gold and if anything isn’t right within 7 days, we come back and touch it up.',
  },
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
  price *= choice(windows, 'style', home.style ?? 'none')?.multiply ?? 1;
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

// The windows answers as home details for the packages.
export function homeFromValues(values: EstimateValues): HomeDetails {
  const dirt = values.dirt;
  return {
    size: Number(values.size) || startingHome.size,
    style: typeof values.style === 'string' ? values.style : 'none',
    stories: values.height === 'two' ? 2 : 1,
    dirt: dirt === 'light' || dirt === 'rough' ? dirt : 'normal',
    hardWater: false,
  };
}

// Keeps only answers the questions allow, so a changed page can't send odd values.
export function cleanValues(tabData: EstimateTab, raw: unknown): EstimateValues {
  const given = raw !== null && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};
  const values: EstimateValues = {};
  for (const question of tabData.questions) {
    const answer = given[question.id];
    if (question.kind === 'slider') {
      const amount = Math.round(Number(answer) / question.step) * question.step;
      values[question.id] = Number.isFinite(amount) ? Math.min(question.max, Math.max(question.min, amount)) : question.start;
    } else if (question.kind === 'choice') {
      values[question.id] = question.options.some((option) => option.id === answer) ? (answer as string) : question.start;
    } else {
      const list = Array.isArray(answer) ? answer : question.start;
      values[question.id] = question.options.map((option) => option.id).filter((id) => list.includes(id));
    }
  }
  return values;
}

const dollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

export const formatDollars = (value: number) => dollars.format(value);

export const formatRange = (range: Range) => `${formatDollars(range.low)} to ${formatDollars(range.high)}`;
