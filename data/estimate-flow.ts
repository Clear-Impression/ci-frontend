import { linesFor, rangeFor, startingValues, type EstimateTab, type EstimateValues } from './estimate';

export const WINDOW_SERVICE = 'residential-window-washing';
export const GUTTER_SERVICE = 'gutter-roof-care';
export const SOLAR_SERVICE = 'solar-panel-cleaning';
const heightServices = [WINDOW_SERVICE, GUTTER_SERVICE, SOLAR_SERVICE];
export const PHOTO_SERVICE = 'hard-water-stain-removal';
export const quoteServices = [
  { slug: WINDOW_SERVICE, label: 'Window cleaning', note: 'By home size' },
  { slug: 'screen-deep-cleaning', label: 'Screens & tracks', note: 'By the window' },
  { slug: PHOTO_SERVICE, label: 'Hard water removal', note: 'From a photo' },
  { slug: GUTTER_SERVICE, label: 'Gutters', note: 'By the home' },
  { slug: SOLAR_SERVICE, label: 'Solar', note: 'By the panel' },
] as const;

export type PropertyType = 'home' | 'business';
export type QuoteFlow = {
  propertyType: PropertyType;
  step: string;
  selected: string[];
  values: Record<string, EstimateValues>;
  photoSent: boolean;
  finalizeUnlocked: boolean;
};

// The customer flow uses the residential / single-building pricing.
// Removing the old window extras here also removes their charges from restored estimates.
export function quoteTabs(tabs: readonly EstimateTab[]): readonly EstimateTab[] {
  return quoteServices.flatMap(({ slug }) => {
    const tab = tabs.find((entry) => entry.slug === slug);
    return tab ? [{ ...tab, questions: tab.questions.filter((question) => slug !== WINDOW_SERVICE || question.id !== 'extras') }] : [];
  });
}

export function quoteSteps(flow: Pick<QuoteFlow, 'selected' | 'finalizeUnlocked'>) {
  return ['select-services', ...quoteServices.filter((service) => flow.selected.includes(service.slug)).map((service) => service.slug),
    'summary', ...(flow.finalizeUnlocked ? ['finalize'] : [])];
}

const record = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};

export function restoreQuoteFlow(tabs: readonly EstimateTab[], saved?: unknown, requested?: string | null): QuoteFlow {
  const raw = record(saved);
  const stored = record(raw.values);
  const isBusinessLink = requested === 'commercial-office-glass';
  const requestedSlug = isBusinessLink ? WINDOW_SERVICE : requested;
  const prior = Array.isArray(raw.added) ? raw.added : [];
  const selected = quoteServices.filter(({ slug }) => prior.includes(slug) || requestedSlug === slug ||
    (slug === WINDOW_SERVICE && prior.includes('commercial-office-glass'))).map(({ slug }) => String(slug));
  const values: Record<string, EstimateValues> = {};
  for (const tab of tabs) {
    const answers = record(stored[tab.slug]);
    values[tab.slug] = startingValues(tab);
    for (const question of tab.questions) {
      const answer = answers[question.id];
      if (question.kind === 'slider' && typeof answer === 'number' && Number.isFinite(answer)) {
        values[tab.slug][question.id] = Math.max(question.min, Math.min(question.max * 4, answer));
      } else if (question.kind === 'choice' && question.options.some((option) => option.id === answer)) {
        values[tab.slug][question.id] = answer as string;
      } else if (question.kind === 'addons' && Array.isArray(answer)) {
        values[tab.slug][question.id] = question.options.filter((option) => answer.includes(option.id)).map((option) => option.id);
      }
    }
  }
  // Size applies to windows/gutters; height describes the building for all three.
  // Prefer a selected service's saved answer over an unselected service's default.
  for (const id of ['size', 'height']) {
    const linkedServices = id === 'height' ? heightServices : [WINDOW_SERVICE, GUTTER_SERVICE];
    const hasAnswer = (slug: string) => record(stored[slug])[id] !== undefined;
    const sharedSource = linkedServices.find((slug) => selected.includes(slug) && hasAnswer(slug)) ??
      linkedServices.find(hasAnswer) ?? WINDOW_SERVICE;
    const shared = values[sharedSource]?.[id];
    if (shared !== undefined) {
      for (const slug of linkedServices) if (values[slug]) values[slug][id] = shared;
    }
  }
  const flow: QuoteFlow = {
    propertyType: 'home',
    step: 'select-services', selected, values, photoSent: raw.photoSent === true,
    finalizeUnlocked: raw.finalizeUnlocked === true && selected.length > 0,
  };
  if (!canFinalizeQuote(flow, tabs)) flow.finalizeUnlocked = false;
  if (typeof requestedSlug === 'string' && selected.includes(requestedSlug)) flow.step = requestedSlug;
  else if (typeof raw.step === 'string' && quoteSteps(flow).includes(raw.step) && (raw.step === 'select-services' || selected.length > 0)) flow.step = raw.step;
  return flow;
}

export function updateQuoteAnswer(flow: QuoteFlow, slug: string, id: string, answer: EstimateValues[string]): QuoteFlow {
  const values = { ...flow.values, [slug]: { ...flow.values[slug], [id]: answer } };
  const linkedServices = id === 'height' && heightServices.includes(slug) ? heightServices :
    id === 'size' && [WINDOW_SERVICE, GUTTER_SERVICE].includes(slug) ? [WINDOW_SERVICE, GUTTER_SERVICE] : [];
  for (const linked of linkedServices) {
    values[linked] = { ...values[linked], [id]: answer };
  }
  return { ...flow, values, finalizeUnlocked: false };
}

export function selectQuoteService(flow: QuoteFlow, slug: string, selected: boolean, jump = false): QuoteFlow {
  const chosen = quoteServices.filter((service) => selected && service.slug === slug ||
    service.slug !== slug && flow.selected.includes(service.slug)).map((service) => String(service.slug));
  const step = jump && selected ? slug : flow.step === 'finalize' ? 'summary' :
    flow.step === slug && !selected ? 'select-services' : flow.step;
  return { ...flow, selected: chosen, step: chosen.length ? step : 'select-services', finalizeUnlocked: false };
}

export function incompleteQuoteServices(flow: QuoteFlow, tabs: readonly EstimateTab[]) {
  return tabs.filter((tab) => flow.selected.includes(tab.slug) && tab.mode === 'range' && !rangeFor(tab, flow.values[tab.slug] ?? startingValues(tab)));
}

export function canFinalizeQuote(flow: QuoteFlow, tabs: readonly EstimateTab[]) {
  return flow.selected.length > 0 && incompleteQuoteServices(flow, tabs).length === 0;
}

export function quoteLines(flow: QuoteFlow, tabs: readonly EstimateTab[]) {
  return linesFor(flow.selected, flow.values, tabs).map((line) => line.slug === PHOTO_SERVICE
    ? { ...line, details: `${flow.photoSent ? 'Photos sent' : 'Photos still needed'} · Price confirmed after photo review` }
    : line);
}
