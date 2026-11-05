import Link from 'next/link';
import Reveal from '@/components/services/Reveal';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
import type { ServiceCity } from '@/data/home';
import styles from '@/app/home.module.css';

type HomeServiceAreaProps = {
  eyebrow: string;
  title: string;
  lead: string;
  cityPagesLabel: string;
  cities: readonly ServiceCity[];
  cityPages: readonly { name: string; href: string }[];
};

export default function HomeServiceArea({
  eyebrow,
  title,
  lead,
  cityPagesLabel,
  cities,
  cityPages,
}: HomeServiceAreaProps) {
  return (
    <section
      aria-labelledby='home-areas-heading'
      className='mx-auto grid max-w-7xl gap-8 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-x-16'>
      {/* On small screens this reads text, map, then the city pages. On wide
          screens the text and city pages share the left column beside the map. */}
      <Reveal className='lg:self-end'>
        <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
          {eyebrow}
        </p>
        <h2
          id='home-areas-heading'
          className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
          <span className='line-mask'>
            <span className='line-rise'>{title}</span>
          </span>
        </h2>
        <p className='fade-up mt-4 text-lg leading-relaxed text-gray-600'>
          {lead}
        </p>
      </Reveal>
      {/* A shorter version of the Locations map, with the same city buttons. */}
      <div className='lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center'>
        <ServiceAreaMap
          cities={cities}
          showBoundaries
          compact
        />
      </div>
      <Reveal className='lg:col-start-1 lg:row-start-2 lg:self-start'>
        {/* Each city's page, folded into a dropdown. The links stay in the page,
            so search engines still find every city page from here. */}
        <details className='group/pages rounded-xl border border-[#200b38]/10 bg-white'>
          <summary className='flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 font-semibold text-[#200b38] hover:bg-[#f7f4fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] [&::-webkit-details-marker]:hidden'>
            {cityPagesLabel}
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='size-5 shrink-0 text-[#6c3fb8] motion-safe:transition-transform group-open/pages:rotate-180'>
              <path d='M6 9l6 6 6-6' />
            </svg>
          </summary>
          <ul
            aria-label='City pages'
            className='flex flex-wrap gap-2.5 px-5 pb-5 pt-1'>
            {cityPages.map((city, index) => (
              <li
                key={city.href}
                className={styles.rise}
                style={{ '--i': index + 2 } as React.CSSProperties}>
                <Link
                  href={city.href}
                  className='group inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#200b38]/15 bg-white px-4 py-2 text-sm font-medium text-[#200b38] transition-colors hover:border-[#200b38] hover:bg-[#200b38] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]'>
                  {city.name}
                  <span
                    aria-hidden='true'
                    className='text-[#6c3fb8] transition-colors group-hover:text-[#efb52b]'>
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </details>
      </Reveal>
    </section>
  );
}
