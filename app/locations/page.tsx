import { getPageHeader } from '@/lib/page-headers';
import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
//import HomeContact from '@/components/home/HomeContact';
import Reveal from '@/components/services/Reveal'
import { company } from '@/data/company';
import { getLocations, withCityCount } from '@/lib/locations';
import ValleyRoute from '@/components/locations/ValleyRoute';
import styles from './locations.module.css';

// Give the Locations page its own title and search description. List every
// city by name, so the description stays current as cities are added.
export async function generateMetadata(): Promise<Metadata> {
  const { cities } = await getLocations();
  const cityList = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  }).format(cities.map((location) => location.name));

  return createPageMetadata({
    path: '/locations',
    title: 'Window Cleaning Service Areas | Clear Impression Services',
    description: `Residential and commercial window cleaning in ${cityList}. Find your city and see what we do there.`,
  });
}

export default async function LocationsPage() {
  const header = await getPageHeader('locations');
  const { page, cities } = await getLocations();
  // The map only needs each city's name and pin.
  const mapCities = cities.map(({ name, coordinates }) => ({ name, coordinates }));

  return (
    <main className='flex-1 border-0 bg-white text-[#200b38]'>
      {/* The shared layout already supplies the website's header and footer. */}
      <section
        aria-labelledby='locations-heading'
        className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div className='relative mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          {/* A route draws itself across the Valley as each city's pin drops in.
              On small screens it sits faintly behind the text. */}
          <ValleyRoute
            cities={mapCities}
            className='pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-25 lg:left-1/2 lg:w-1/2 lg:opacity-100'
          />
          <div className='lg:max-w-[calc(50%-2rem)]'>
            <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
              {page.eyebrow}
            </p>
            <h1
              id='locations-heading'
              className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl'>
              <span className='line-mask'>
                <span className='line-rise'>{header.title}</span>
              </span>
            </h1>
            <p className={`${styles.headerIntro} mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg`}>
              {withCityCount(header.subtitle, cities.length)}
            </p>
          </div>
        </div>
      </section>

      <section
        aria-label='Service area map'
        className='bg-[#faf8fd]'>
        <div className='mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16'>
          {/* Reuse the homepage map, with more height and the full page width. */}
          <ServiceAreaMap cities={mapCities} large showBoundaries />

          <div className='mt-12 sm:mt-16'>
            {/* The heading rises in like the other pages' section headings. */}
            <Reveal>
              <h2 className='text-3xl font-semibold tracking-tight text-[#000000] sm:text-4xl'>
                <span className='line-mask'>
                  <span className='line-rise'>{page.citiesHeading}</span>
                </span>
              </h2>
              <p className={`${styles.directoryDescription} fade-up`}>
                {page.citiesDescription}
              </p>
            </Reveal>
            {/* Each city name opens its own page instead of a dropdown. */}
            <Reveal>
              <ul className={styles.cityGrid}>
                {cities.map((location, index) => (
                  <li
                    key={location.slug}
                    style={{ '--i': index } as React.CSSProperties}>
                    <Link href={location.href} className={styles.cityLink}>
                      <span className={styles.linkText}>{location.name}</span>
                      {/* Nov 12, 2026 - Change from arrow to greater than symbol due to webkit rendering it as an emoji*/}
                      <span aria-hidden='true'>&gt;</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Same panel as the About page, pointing on to Services or a quote. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <Reveal className='cta-shine relative overflow-hidden rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {page.nextHeading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{page.nextText}</p>
          <div className='relative mt-8 flex flex-wrap gap-3'>
            <Link
              href='/services'
              className='inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
              {page.servicesLabel}
            </Link>
            <Link
              href={company.quoteFormUrl}
              className='inline-flex min-h-11 items-center rounded-lg border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
              Get a free quote
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
