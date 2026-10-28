import Reveal from '@/components/services/Reveal';
import { company } from '@/data/company';

type HomeClosingProps = {
  heading: string;
  text: string;
  quoteHref: string;
};

export default function HomeClosing({ heading, text, quoteHref }: HomeClosingProps) {
  return (
    <section
      aria-labelledby='home-closing-heading'
      className='mx-auto max-w-7xl px-6 pb-16 sm:px-8 sm:pb-20'>
      <Reveal className='cta-reveal flex flex-col gap-8 rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12 lg:flex-row lg:items-center lg:justify-between'>
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
      </Reveal>
    </section>
  );
}
