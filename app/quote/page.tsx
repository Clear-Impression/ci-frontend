import type { Metadata } from 'next';
import QuoteForm from '@/components/quote/QuoteForm';
import { company } from '@/data/company';
import { quoteOptions } from '@/data/quote';

const title = 'Request a Quote | Clear Impression Services';
const description = 'Plan your window, solar panel, or screen cleaning in the Phoenix metro area. Tell Clear Impression about your home or business.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${company.website}quote` },
  openGraph: {
    title,
    description,
    url: `${company.website}quote`,
    images: [{ url: `${company.website}images/home/window-cleaning.webp`, alt: 'Window cleaning for an Arizona home' }],
  },
};

export default function QuotePage() {
  return (
    <main className='flex-1 bg-[#faf8fd]'>
      <div className='mx-auto grid max-w-7xl items-start gap-10 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16'>
        {/* Keep the introduction short so the form stays easy to find. */}
        <section aria-labelledby='quote-heading' className='lg:pt-6'>
          <p className='text-sm font-semibold text-[#6c3fb8]'>A clearer view starts here</p>
          <h1 id='quote-heading' className='mt-4 max-w-md text-4xl font-semibold leading-tight tracking-tight text-[#200b38] sm:text-5xl lg:text-6xl'>Request a quote<span className='text-[#6c3fb8]'>.</span></h1>
          <p className='mt-6 max-w-md text-base leading-8 text-[#686170]'>Fresh windows. A brighter space. Tell us a little about your home or business and the cleaning you have in mind.</p>
          <div className='mt-8 flex flex-wrap gap-2 text-xs font-medium text-[#542d90]'>
            <span className='rounded-full border border-[#6c3fb8]/15 bg-white px-3 py-2'>Residential &amp; commercial</span>
            <span className='rounded-full border border-[#6c3fb8]/15 bg-white px-3 py-2'>Phoenix metro</span>
          </div>

          {/* Phone and text still work while the quote form is a preview. */}
          <div className='mt-10 max-w-md border-t border-[#200b38]/10 pt-8'>
            <h2 className='text-lg font-semibold text-[#200b38]'>Rather talk it through?</h2>
            <p className='mt-2 text-sm leading-7 text-[#686170]'>Call or text us to ask a question or request your quote directly.</p>
            <a href={company.phoneHref} className='mt-4 inline-block rounded-sm text-2xl font-semibold tracking-tight text-[#200b38] hover:text-[#6c3fb8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>{company.phone}</a>
            <div className='mt-4'>
              <a href='sms:+14806220622' className='inline-flex min-h-11 items-center gap-2 rounded-lg border border-[#200b38]/20 bg-white px-4 py-2 text-sm font-semibold text-[#200b38] hover:bg-[#eee6f7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>Send a text <span aria-hidden='true'>↗</span></a>
            </div>
          </div>
        </section>

        <QuoteForm options={quoteOptions} phoneHref={company.phoneHref} phone={company.phone} />
      </div>
    </main>
  );
}
