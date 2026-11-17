import {
  formatRange,
  getEstimateTab,
  linesFor,
  rangeFor,
  totalRange,
  type EstimateValues,
} from '@/data/estimate';

// Where the instant estimate keeps the visitor's answers for this browser tab,
// and the event it fires when they change, so the floating bar stays in sync.
export const estimateStorageKey = 'ci-instant-estimate-v3';
export const estimateChangeEvent = 'ci:estimate-change';

export type EstimateDetails = {
  name: string;
  address: string;
  city: string;
};

export type SavedEstimate = {
  // The service tab that's open.
  tab: string;
  // Answers for each tab the visitor has touched, by service slug.
  values: Record<string, EstimateValues>;
  // Services added to their summary, in the order they were added.
  added: string[];
  details: EstimateDetails;
  downloaded: boolean;
};

export type EstimateSummary = {
  service: string;
  range: string;
};

export function loadEstimate(): Partial<SavedEstimate> | null {
  try {
    const saved = window.sessionStorage.getItem(estimateStorageKey);
    return saved ? (JSON.parse(saved) as Partial<SavedEstimate>) : null;
  } catch {
    return null;
  }
}

export function saveEstimate(estimate: SavedEstimate) {
  try {
    window.sessionStorage.setItem(estimateStorageKey, JSON.stringify(estimate));
  } catch {
    // Storage can be blocked; the estimate just won't follow them around.
  }
  window.dispatchEvent(new Event(estimateChangeEvent));
}

// For the floating bar: the total of their summary if they've added services,
// otherwise the open tab's range. Nothing if there's no price yet.
export function readEstimate(): EstimateSummary | null {
  const saved = loadEstimate();
  if (!saved?.tab) return null;
  const values = saved.values ?? {};
  const lines = linesFor(saved.added ?? [], values);
  const total = totalRange(lines);
  if (total) {
    return { service: lines.filter((line) => line.range).map((line) => line.name).join(', '), range: formatRange(total) };
  }
  const tab = getEstimateTab(saved.tab);
  const range = tab && values[saved.tab] ? rangeFor(tab, values[saved.tab]) : null;
  return tab && range ? { service: tab.name, range: formatRange(range) } : null;
}
