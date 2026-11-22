import type { Metadata } from 'next';
import { createPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeContact from '@/components/home/HomeContact';
import CityMedia from '@/components/locations/CityMedia';
import { company } from '@/data/company';
import { getLocationBySlug, getLocations } from '@/lib/locations';
import { getServices } from '@/lib/services';
import styles from '../locations.module.css';
import ClearerViewCta from '@/components/ui/ClearerViewCta';

// City summaries can use shorter names than their service detail pages.
const cityServiceSlugs = new Map([
  ['window cleaning', 'residential-window-washing'],
  ['screen cleaning', 'screen-deep-cleaning'],
  ['solar panel cleaning', 'solar-panel-cleaning'],
  ['hard water stain removal', 'hard-water-stain-removal'],
  ['post-construction cleanup', 'post-construction-cleanup'],
  ['glass door & mirror polishing', 'glass-door-mirror-polishing'],
]);

type CityPageProps = {
  params: Promise<{ city: string }>;
};

// Build a page for each city in Sanity. A city added after the site is
// built gets its page on the first visit; hidden or unknown cities return a 404.
export async function generateStaticParams() {
  const { cities } = await getLocations();
  return cities.map((location) => ({ city: location.slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const location = await getLocationBySlug(city);
  if (!location) notFound();

  return createPageMetadata({
    path: location.href,
    title: `Window Cleaning in ${location.name}, AZ | ${company.name}`,
    description: location.intro,
  });
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const location = await getLocationBySlug(city);
  if (!location) notFound();

  const [{ cityPage }, publishedServices] = await Promise.all([getLocations(), getServices()]);
  const publishedSlugs = new Set(publishedServices.map((service) => service.slug));

  return (
    <main className='flex-1 border-0 bg-white text-[#200b38]'>
      {/* The shared layout supplies the original header, footer, and font. */}
      <section className='page-hero bg-[#200b38] text-white'>
        <div className='mx-auto max-w-7xl px-6 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-8'>
          <Link
            href='/locations'
            className='group mb-4 inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-white hover:text-[#efb52b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
            <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='size-4 shrink-0'>
              <path d='M19 12H5m6 6-6-6 6-6' />
            </svg>
            <span className='underline-offset-4 group-hover:underline group-focus-visible:underline'>{cityPage.backLabel}</span>
          </Link>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            {location.name}, Arizona
          </p>
          <h1 className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl'>
            {location.title}
          </h1>
          <p className='mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg'>
            {location.intro}
          </p>
        </div>
      </section>

      <section className={styles.photoSection}>
        <div className={`mx-auto max-w-7xl px-6 sm:px-8 ${styles.photoGrid}`}>
          <div>
            <p className={styles.photoEyebrow}>{cityPage.photoEyebrow}</p>
            <h2 className={styles.photoHeading}>{cityPage.photoHeading}</h2>
            <p className={styles.cityDescription}>{location.description}</p>
            <a
              href={company.phoneHref}
              className={`${styles.quoteButton} inline-flex min-h-11 items-center justify-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]`}>
              {cityPage.quoteLabel}
            </a>
          </div>
          {/* The city's own photo or video, or the shared one if it has none. */}
          <CityMedia media={location.media ?? cityPage.media} />
        </div>
      </section>

      <section
        className={styles.servicesSection}
        aria-labelledby='city-services-heading'>
        <div className='mx-auto max-w-7xl px-6 sm:px-8'>
          <div className={styles.servicesHeader}>
            <div>
              <h2 id='city-services-heading' className={styles.servicesHeading}>
                Services in {location.name}.
              </h2>
              <p className={styles.servicesDescription}>
                {cityPage.servicesDescription}
              </p>
            </div>
            <Link
              href='/services'
              className={`${styles.arrowLink} ${styles.allServicesLink}`}>
              <span className={styles.linkText}>
                {cityPage.servicesLinkLabel}
              </span>
              <span className={styles.arrow} aria-hidden='true'>→</span>
            </Link>
          </div>
          {/* Keep every summary visible without flip cards or dropdowns. */}
          <ul className={styles.servicesGrid}>
            {cityPage.services.map((service) => {
              const slug = cityServiceSlugs.get(service.name.trim().toLowerCase());
              return (
                <li key={service.name} className={styles.serviceItem}>
                  <h3>
                    {slug && publishedSlugs.has(slug) ? (
                      <Link
                        href={`/services/${slug}`}
                        className='underline decoration-[#6c3fb8] underline-offset-4 hover:text-[#6c3fb8]'>
                        {service.name}
                      </Link>
                    ) : service.name}
                  </h3>
                  <p>{service.description}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-20'>
        <ClearerViewCta />
      </section>
      
    </main>
  );
}
