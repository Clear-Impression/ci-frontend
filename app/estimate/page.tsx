import { createPageMetadata } from '@/lib/seo';
import { jakarta } from '@/app/fonts';
import OnePageEstimate from '@/components/estimate/OnePageEstimate';
import { getAvailability } from '@/lib/availability';
import { getEstimatePricing } from '@/lib/estimate-pricing';

const title = 'Get a Free Quote | Clear Impression';
const description =
  'Get an instant price for window cleaning in the Phoenix metro area: pick Bronze, Silver or Gold, add extras and request a day, all on one page.';

export const metadata = createPageMetadata({
  path: '/estimate',
  title,
  description,
});

// Prices (from Sanity) and open days are checked again every 10 minutes.
export const revalidate = 600;

export default async function EstimatePage() {
  const [tabs, availability] = await Promise.all([getEstimatePricing(), getAvailability()]);

  return (
    // The shared layout already supplies the website's header and footer.
    <main className={`${jakarta.variable} oe-page flex-1`}>
      <div
        id='estimate'
        style={{ scrollMarginTop: 100 }}>
        <OnePageEstimate
          tabs={tabs}
          availability={availability}
        />
      </div>
    </main>
  );
}
