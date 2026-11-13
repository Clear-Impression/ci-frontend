import { formatRange, getEstimateTab, rangeFor, type EstimateValues } from '@/data/estimate';

// Where the instant estimate keeps the visitor's answers for this browser tab,
// and the event it fires when they change, so the floating bar stays in sync.
export const estimateStorageKey = 'ci-instant-estimate-v3';
export const estimateChangeEvent = 'ci:estimate-change';

export type SavedEstimate = {
  // The service tab that's open.
  tab: string;
  // Answers for each tab the visitor has touched, by service slug.
  values: Record<string, EstimateValues>;
};

export type EstimateSummary = {
  service: string;
  range: string;
};

export function loadEstimate(): SavedEstimate | null {
  try {
    const saved = window.sessionStorage.getItem(estimateStorageKey);
    return saved ? (JSON.parse(saved) as SavedEstimate) : null;
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

// The open tab's price range, for the floating bar. Nothing if there isn't one.
export function readEstimate(): EstimateSummary | null {
  const saved = loadEstimate();
  if (!saved) return null;
  const tab = getEstimateTab(saved.tab);
  const values = saved.values?.[saved.tab];
  if (!tab || !values) return null;
  const range = rangeFor(tab, values);
  return range ? { service: tab.name, range: formatRange(range) } : null;
}
