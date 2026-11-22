import { estimateTabs, type EstimateTab } from './estimate';

// IDs are fixed so pricing cannot accidentally be attached to another service.
export const pricingSections = estimateTabs.filter((tab) => tab.mode === 'range').map((tab) => ({
  tab,
  title: `${tab.tab} — ${tab.tabNote}`,
  schemaType: `instantPrice_${tab.slug.replaceAll('-', '_')}`,
  documentId: `instant-price-${tab.slug}`,
}));

export function initialPricing(tab: EstimateTab) {
  return {
    rate: tab.rate,
    minimum: tab.minimum,
    rangePercent: tab.rangePercent ?? 12,
    roundingIncrement: tab.roundingIncrement ?? 5,
    ...Object.fromEntries(tab.questions.filter((question) => question.kind !== 'slider').map((question) => [
      question.id,
      Object.fromEntries(question.options.map((option) => [option.id, question.kind === 'choice'
        ? { multiply: 'multiply' in option ? option.multiply ?? 1 : 1, add: option.add ?? 0 }
        : { add: option.add ?? 0, perUnit: 'perUnit' in option ? option.perUnit ?? 0 : 0 },
      ])),
    ])),
  };
}

function record(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function number(value: unknown, fallback: number, min = 0, max = 1_000_000) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max ? value : fallback;
}

// Merge only known numeric fields; absent or invalid fields keep their defaults.
// Labels, IDs, service order and photo-only quoting stay owned by the website.
export function applyEstimatePricing(documents: unknown): readonly EstimateTab[] {
  if (!Array.isArray(documents)) return estimateTabs;
  return estimateTabs.map((tab) => {
    const section = pricingSections.find((entry) => entry.tab.slug === tab.slug);
    if (!section) return tab;
    const raw = record(documents.find((entry) => record(entry)._id === section.documentId));
    return {
      ...tab,
      rate: number(raw.rate, tab.rate, tab.rateMin ?? 0),
      minimum: number(raw.minimum, tab.minimum),
      rangePercent: number(raw.rangePercent, tab.rangePercent ?? 12, 0, 99),
      roundingIncrement: number(raw.roundingIncrement, tab.roundingIncrement ?? 5, 0.01, 100),
      questions: tab.questions.map((question) => {
        if (question.kind === 'slider') return question;
        const adjustments = record(raw[question.id]);
        if (question.kind === 'choice') {
          return { ...question, options: question.options.map((option) => {
            const value = record(adjustments[option.id]);
            return { ...option, multiply: number(value.multiply, option.multiply ?? 1, 0, 100), add: number(value.add, option.add ?? 0, -1_000_000) };
          }) };
        }
        return { ...question, options: question.options.map((option) => {
          const value = record(adjustments[option.id]);
          return { ...option, add: number(value.add, option.add ?? 0), perUnit: number(value.perUnit, option.perUnit ?? 0) };
        }) };
      }),
    };
  });
}
