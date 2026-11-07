import Reveal from '@/components/services/Reveal';
import { company } from '@/data/company';
import type { HomeStep } from '@/data/home';

type HomeClosingProps = {
  heading: string;
  text: string;
  quoteHref: string;
  stepsLabel: string;
  steps: readonly HomeStep[];
};

export default function HomeClosing({
  heading,
  text,
  quoteHref,
  stepsLabel,
  steps,
}: HomeClosingProps) {
  return (
    <section
      aria-labelledby='home-closing-heading'
      className='mx-auto max-w-7xl px-6 pb-16 sm:px-8 sm:pb-20'>
      <Reveal className='cta-reveal rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
        <div className='flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h2
              id='home-closing-heading'
              className='text-2xl font-semibold sm:text-3xl'>
              {heading}
            </h2>
            <p className='mt-4 max-w-2xl text-white/80'>{text}</p>
          </div>
          <div className='flex shrink-0 flex-wrap gap-3'>
            <a
              href={quoteHref}
              className='inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
              Get a free quote
            </a>
            <a
              href={company.phoneHref}
              className='inline-flex min-h-11 items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
              Call {company.phone}
            </a>
          </div>
        </div>

        {/* How it works, folded away until someone wants it. The steps stay in
            the page, so search engines still read them. */}
        <details className='group mt-10 rounded-xl border border-white/15 bg-white/5'>
          <summary className='flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 font-semibold hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b] [&::-webkit-details-marker]:hidden'>
            {stepsLabel}
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='size-5 shrink-0 motion-safe:transition-transform group-open:rotate-180'>
              <path d='M6 9l6 6 6-6' />
            </svg>
          </summary>
          <ol className='grid gap-6 px-5 pb-6 pt-2 sm:grid-cols-2'>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className='flex gap-4'>
                <span
                  aria-hidden='true'
                  className='grid size-9 shrink-0 place-items-center rounded-full bg-[#efb52b] text-sm font-semibold text-[#200b38]'>
                  {index + 1}
                </span>
                <div>
                  <h3 className='font-semibold'>{step.title}</h3>
                  <p className='mt-1 text-sm leading-relaxed text-white/75'>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </details>
      </Reveal>
    </section>
  );
}
