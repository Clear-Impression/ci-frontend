import type { Metadata } from 'next';
import Link from 'next/link';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
//import HomeContact from '@/components/home/HomeContact';
import Reveal from '@/components/services/Reveal'
import { company } from '@/data/company';;
import { serviceCities } from '@/data/home';
import { aboutClosing } from '@/data/about';
import { locationPages, locationsPageContent } from '@/data/locations';
import ValleyRoute from '@/components/locations/ValleyRoute';
import styles from './locations.module.css';

// List every city by name, so the description stays current as cities are added.
const cityList = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
}).format(locationPages.map((location) => location.name));

// Give the Locations page its own title and search description.
export const metadata: Metadata = {
  title: 'Window Cleaning Service Areas | Clear Impression Services',
  description: `Residential and commercial window cleaning in ${cityList}. Find your city and see what we do there.`,
};

export default function LocationsPage() {
  return (
    <main className='flex-1 border-0 bg-white text-[#200b38]'>
      {/* The shared layout already supplies the website's header and footer. */}
      <section
        aria-labelledby='locations-heading'
        className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div className='relative mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          {/* A route draws itself across the Valley as each city's pin drops in.
              On small screens it sits faintly behind the text. */}
          <ValleyRoute className='pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-25 lg:left-1/2 lg:w-1/2 lg:opacity-100' />
          <div className='lg:max-w-[calc(50%-2rem)]'>
            <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
              {locationsPageContent.eyebrow}
            </p>
            <h1
              id='locations-heading'
              className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl'>
              <span className='line-mask'>
                <span className='line-rise'>{locationsPageContent.title}</span>
              </span>
            </h1>
            <p className={`${styles.headerIntro} mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg`}>
              {locationsPageContent.description}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label='Service area map'
        className='bg-[#faf8fd]'>
        <div className='mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16'>
          {/* Reuse the homepage map, with more height and the full page width. */}
          <ServiceAreaMap cities={serviceCities} large showBoundaries />

          <div className='mt-12 sm:mt-16'>
            {/* The heading rises in like the other pages' section headings. */}
            <Reveal>
              <h2 className='text-3xl font-semibold tracking-tight text-[#000000] sm:text-4xl'>
                <span className='line-mask'>
                  <span className='line-rise'>{locationsPageContent.citiesHeading}</span>
                </span>
              </h2>
              <p className={`${styles.directoryDescription} fade-up`}>
                {locationsPageContent.citiesDescription}
              </p>
            </Reveal>
            {/* Each city name opens its own page instead of a dropdown. */}
            <Reveal>
              <ul className={styles.cityGrid}>
                {locationPages.map((location, index) => (
                  <li
                    key={location.slug}
                    style={{ '--i': index } as React.CSSProperties}>
                    <Link href={location.href} className={styles.cityLink}>
                      <span className={styles.linkText}>{location.name}</span>
                      <span className={styles.arrow} aria-hidden='true'>↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Reuse quote footer panel from about page.tsx */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <Reveal className='cta-shine relative overflow-hidden rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {aboutClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{aboutClosing.text}</p>
          <a
            href={company.phoneHref}
            className='relative mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
            Call {company.phone} for a quote
          </a>
        </Reveal>
      </section>
    </main>
  );
}
