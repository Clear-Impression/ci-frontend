import Link from 'next/link';
import { company } from '@/data/company';

// The two buttons at the bottom of a page: the quote form and a phone call.
export default function QuoteActions() {
  return (
    <div className='relative mt-8 flex flex-wrap gap-3'>
      <Link
        href={company.quoteFormUrl}
        className='inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
        Get a free quote
      </Link>
      <a
        href={company.phoneHref}
        className='inline-flex min-h-11 items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
        Call {company.phone}
      </a>
    </div>
  );
}
