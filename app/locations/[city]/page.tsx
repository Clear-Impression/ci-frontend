import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeContact from '@/components/home/HomeContact';
import { company } from '@/data/company';
import {
  cityPageContent,
  getLocationBySlug,
  locationPages,
  locationServices,
} from '@/data/locations';
import styles from '../locations.module.css';

type CityPageProps = {
  params: Promise<{ city: string }>;
};

// Build one page for each served city; other city URLs return a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return locationPages.map((location) => ({ city: location.slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) notFound();

  return {
    title: `Window Cleaning in ${location.name}, AZ | ${company.name}`,
    description: location.intro,
  };
}

export default async function CityPage({ params }: CityPageProps) {
  const { city } = await params;
  const location = getLocationBySlug(city);
  if (!location) notFound();

  return (
    <main className='flex-1 border-0 bg-white text-[#200b38]'>
      {/* The shared layout supplies the original header, footer, and font. */}
      <section className='bg-[#200b38] text-white'>
        <div className='mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20'>
          <Link
            href='/locations'
            className={`${styles.arrowLink} ${styles.backLink}`}>
            <span className={styles.arrow} aria-hidden='true'>←</span>
            <span className={styles.linkText}>{cityPageContent.backLabel}</span>
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
            <p className={styles.photoEyebrow}>{cityPageContent.photoEyebrow}</p>
            <h2 className={styles.photoHeading}>{cityPageContent.photoHeading}</h2>
            <p className={styles.cityDescription}>{location.description}</p>
            <a
              href={company.phoneHref}
              className={`${styles.quoteButton} inline-flex min-h-11 items-center justify-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]`}>
              {cityPageContent.quoteLabel}
            </a>
          </div>
          {/* Reuse the existing photo; Next.js serves a suitable image size. */}
          <Image
            src={cityPageContent.photo}
            alt={cityPageContent.photoAlt}
            width={1440}
            height={1440}
            sizes='(max-width: 760px) 100vw, 50vw'
            className={styles.servicePhoto}
          />
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
                {cityPageContent.servicesDescription}
              </p>
            </div>
            <Link
              href='/services'
              className={`${styles.arrowLink} ${styles.allServicesLink}`}>
              <span className={styles.linkText}>
                {cityPageContent.servicesLinkLabel}
              </span>
              <span className={styles.arrow} aria-hidden='true'>→</span>
            </Link>
          </div>
          {/* Keep all six summaries visible without flip cards or dropdowns. */}
          <ul className={styles.servicesGrid}>
            {locationServices.map((service) => (
              <li key={service.name} className={styles.serviceItem}>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeContact />
    </main>
  );
}
