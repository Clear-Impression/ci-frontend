import 'server-only';
import { cache } from 'react';
import { estimateTabs, type EstimateTab } from '@/data/estimate';
import { applyEstimatePricing, pricingSections } from '@/data/estimate-pricing';
import { client } from '@/sanity/client';
import { ESTIMATE_PRICING_QUERY } from '@/sanity/queries';

export const getEstimatePricing = cache(async (): Promise<readonly EstimateTab[]> => {
  try {
    const documents = await client.fetch<unknown>(ESTIMATE_PRICING_QUERY,
      { ids: pricingSections.map((section) => section.documentId) },
      { next: { revalidate: 60 } },
    );
    return applyEstimatePricing(documents);
  } catch (error) {
    console.error('Unable to load instant estimate pricing; using default prices.', error);
    return estimateTabs;
  }
});
