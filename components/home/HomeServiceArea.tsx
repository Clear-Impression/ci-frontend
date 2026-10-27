import Link from 'next/link';
import Reveal from '@/components/services/Reveal';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
import type { ServiceCity } from '@/data/home';
import styles from '@/app/home.module.css';

type HomeServiceAreaProps = {
  eyebrow: string;
  title: string;
  lead: string;
  cities: readonly ServiceCity[];
  cityPages: readonly { name: string; href: string }[];
};

export default function HomeServiceArea({
  eyebrow,
  title,
  lead,
  cities,
  cityPages,
}: HomeServiceAreaProps) {
  return (
    <section
      aria-labelledby='home-areas-heading'
      className='mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16'>
      <Reveal>
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
        <ul
          aria-label='City pages'
          className='mt-8 flex flex-wrap gap-2.5'>
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
      </Reveal>
      {/* Reuse the Locations map without changing its buttons or boundaries. */}
      <ServiceAreaMap
        cities={cities}
        showBoundaries
      />
    </section>
  );
}
