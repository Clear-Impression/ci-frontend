import { totalFor, getEstimateService, type CartItem } from '@/data/estimate';

// Where the instant estimate keeps its progress for this browser tab, and the
// event it fires when that changes, so the floating bar can stay in sync.
export const estimateStorageKey = 'ci-instant-estimate-v2';
export const estimateChangeEvent = 'ci:estimate-change';

export type EstimateSummary = {
  total: number;
  services: string[];
};

// Read the saved estimate. Returns nothing if there isn't one (or storage is blocked).
export function readEstimate(): EstimateSummary | null {
  try {
    const saved = window.sessionStorage.getItem(estimateStorageKey);
    if (!saved) return null;
    const cart: CartItem[] = JSON.parse(saved)?.cart ?? [];
    if (!Array.isArray(cart) || cart.length === 0) return null;
    return {
      total: totalFor(cart),
      services: cart.map((item) => getEstimateService(item.slug)?.name).filter((name): name is string => Boolean(name)),
    };
  } catch {
    return null;
  }
}
