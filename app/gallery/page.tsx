import type { Metadata } from 'next';
import PageGuide from '@/components/layout/PageGuide';
import ClearerViewCta from '@/components/ui/ClearerViewCta';
import GalleryBrowser, { type GalleryCity } from '@/components/gallery/GalleryBrowser';
import GalleryCompare from '@/components/gallery/GalleryCompare';
import { galleryPage } from '@/data/gallery';
import { getValleyMap } from '@/lib/cityShapes';
import { getGallery } from '@/lib/gallery';
import { getLocations } from '@/lib/locations';
import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import styles from './gallery.module.css';

export const metadata: Metadata = createPageMetadata({
  path: '/gallery',
  title: 'Window Cleaning Photos and Before & After | Clear Impression',
  description:
    'Before-and-after photos and recent window cleaning jobs from homes and businesses across Mesa and the Phoenix metro.',
});

const mapSize = { width: 560, height: 380 };

// Which side of its pin each name sits on, so nearby cities don't overlap.
// Cities not listed here put their name on the left.
const labelsOnRight = new Set(['Glendale', 'Scottsdale', 'Mesa', 'Gilbert', 'Fountain Hills']);

export default async function GalleryPage() {
  const [header, { jobs, pairs }, { cities }] = await Promise.all([
    getPageHeader('gallery'),
    getGallery(),
    getLocations(),
  ]);

  // The same map math as the Locations header, without the route. It needs
  // at least two cities to know how big to draw the Valley.
  const { pins, outlines } = cities.length > 1
    ? getValleyMap(
        cities.map(({ name, coordinates }) => ({ name, coordinates })),
        [],
        { ...mapSize, padding: 48 },
      )
    : { pins: [], outlines: [] };
  const mapCities: GalleryCity[] = cities.flatMap((city) => {
    const pin = pins.find((item) => item.name === city.name);
    if (!pin) return [];
    return [{
      name: city.name,
      href: city.href,
      x: (pin.x / mapSize.width) * 100,
      y: (pin.y / mapSize.height) * 100,
      outline: outlines.find((item) => item.name === city.name)?.path ?? '',
      labelSide: labelsOnRight.has(city.name) ? 'right' : 'left',
    }];
  });

  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* The "On this page" menu on the left. */}
      <PageGuide
        label='Gallery page sections'
        groups={[
          {
            title: 'Our work',
            items: [
              { id: 'overview', label: 'Before and after' },
              { id: 'jobs', label: 'Recent jobs' },
            ],
          },
          { title: 'Next step', items: [{ id: 'get-started', label: 'Get a quote' }] },
        ]}
      />
      {/* The shared layout already supplies the website's header and footer. */}
      <section
        id='overview'
        aria-labelledby='gallery-heading'
        className='page-hero relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div
          aria-hidden='true'
          className={`${styles.heroGlow} pointer-events-none absolute -z-10`}
        />
        <div className='mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-12'>
          <GalleryCompare pairs={pairs}>
            <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
              {galleryPage.eyebrow}
            </p>
            <h1
              id='gallery-heading'
              className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl'>
              <span className='line-mask'>
                <span className='line-rise'>{header.title}</span>
              </span>
            </h1>
            {header.subtitle && (
              <p className={`${styles.headerIntro} mt-6 max-w-md text-base leading-8 text-white/80 sm:text-lg`}>
                {header.subtitle}
              </p>
            )}
          </GalleryCompare>
        </div>
      </section>

      <section
        id='jobs'
        aria-labelledby='jobs-heading'
        className='scroll-mt-10 mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16'>
        <GalleryBrowser
          jobs={jobs}
          cities={mapCities}
          mapSize={mapSize}
        />
      </section>

      {/* End with the same wipe-the-window call to action as the other pages. */}
      <section
        id='get-started'
        className='mx-auto max-w-7xl px-6 pb-16 sm:px-8 sm:pb-20'>
        <ClearerViewCta />
      </section>
    </main>
  );
}
