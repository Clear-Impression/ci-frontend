import type { Metadata } from 'next';
import TermsContent from '@/components/terms/TermsContent';
import { company } from '@/data/company';
import { termsEffectiveDate, termsIntroduction, termsNavigation, termsSections } from '@/data/terms';

const title = 'Appointment, Cancellation, and Service Terms | Clear Impression';
const description = 'Read Clear Impression’s appointment, cancellation, rescheduling, weather, payment, property access, and service terms.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${company.website}terms-and-conditions` },
  openGraph: {
    title,
    description,
    url: `${company.website}terms-and-conditions`,
    images: [{ url: `${company.website}images/home/window-cleaning.webp`, alt: 'Window cleaning for an Arizona home' }],
  },
};

export default function TermsPage() {
  return (
    <main id='service-terms' className='flex-1 bg-[#faf8fd]'>
      <header className='border-b border-[#200b38]/10'>
        <div className='mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16'>
          <p className='text-sm font-semibold text-[#6c3fb8]'>Clear Impression Window Cleaning</p>
          <h1 className='mt-4 max-w-4xl text-3xl font-semibold leading-tight tracking-tight text-[#200b38] sm:text-5xl'>Appointment, Cancellation,<br className='hidden sm:block' /> and Service Terms<span className='text-[#6c3fb8]'>.</span></h1>
          <p className='mt-6 inline-flex flex-wrap gap-x-2 rounded-lg border border-[#efb52b]/30 bg-[#fffaf0] px-4 py-2 text-sm leading-6 text-[#59441c]'>
            <span className='font-semibold'>Effective date:</span> {termsEffectiveDate}
          </p>
        </div>
      </header>

      <div className='mx-auto grid max-w-7xl items-start gap-8 px-6 py-10 sm:px-8 sm:py-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-12'>
        {/* Plain anchor links work with a keyboard and need no client JavaScript. */}
        <aside className='lg:sticky lg:top-8'>
          <nav aria-label='Jump to terms topic'>
            <h2 className='text-xs font-semibold uppercase tracking-widest text-[#6c3fb8]'>On this page</h2>
            <ul className='mt-4 flex flex-wrap gap-2 lg:flex-col'>
              {termsNavigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className='flex min-h-11 items-center rounded-lg border border-[#200b38]/10 bg-white px-4 py-3 text-sm font-medium text-[#200b38] transition hover:border-[#6c3fb8]/40 hover:bg-[#f5f0fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]'>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className='mt-6 border-t border-[#200b38]/10 pt-6'>
            <p className='text-sm font-semibold text-[#200b38]'>Questions about your appointment?</p>
            <a href={company.phoneHref} className='mt-2 inline-flex min-h-11 items-center rounded-sm text-sm text-[#542d90] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]'>Call {company.phone}</a>
          </div>
        </aside>

        <TermsContent introduction={termsIntroduction} sections={termsSections} />
      </div>
    </main>
  );
}
