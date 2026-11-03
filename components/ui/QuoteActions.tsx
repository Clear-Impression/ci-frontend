import { company } from '@/data/company';

// The two buttons at the bottom of a page: the quote form and a phone call.
export default function QuoteActions() {
  return (
    <div className='relative mt-8 flex flex-wrap gap-3'>
      <a
        href={company.quoteFormUrl}
        target='_blank'
        rel='noopener noreferrer'
        className='inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
        Get a free quote
        <span className='sr-only'> (opens in a new tab)</span>
      </a>
      <a
        href={company.phoneHref}
        className='inline-flex min-h-11 items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
        Call {company.phone}
      </a>
    </div>
  );
}
