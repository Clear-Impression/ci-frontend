import { createPageMetadata } from '@/lib/seo';
import PriceCalculator from '@/components/estimate/PriceCalculator';
import { getPageHeader } from '@/lib/page-headers';

const title = 'Get a Free Quote | Clear Impression Services';
const description =
  'Get an instant ballpark price for window, solar panel, gutter, and screen cleaning in the Phoenix metro area, or request an exact quote.';

export const metadata = createPageMetadata({
  path: '/estimate',
  title,
  description,
});

export default async function EstimatePage() {
  const header = await getPageHeader('estimate');

  return (
    // The shared layout already supplies the website's header and footer.
    <main className='flex-1 bg-[#faf8fd] text-[#200b38]'>
      {/* Same header band as the other pages. */}
      <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div className='mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            Free quote
          </p>
          <h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            {header.title}
          </h1>
          {header.subtitle && (
            <p className='mt-6 max-w-2xl text-lg text-white/80'>{header.subtitle}</p>
          )}
        </div>
      </section>

      {/* A tab for each service, with its own questions and price. */}
      <PriceCalculator />
    </main>
  );
}
