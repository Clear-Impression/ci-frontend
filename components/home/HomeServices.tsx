import Link from 'next/link';
import Reveal from '@/components/services/Reveal';
import ServiceIcon from '@/components/services/ServiceIcon';
import type { HomeServiceCard } from '@/data/home';
import { getServiceBySlug } from '@/data/services';
import styles from '@/app/home.module.css';

type HomeServicesProps = {
  eyebrow: string;
  title: string;
  cards: readonly HomeServiceCard[];
};

// These four icons are specific to the home page. The rest use the shared set.
const homeIcons: Record<string, string[]> = {
  'residential-window-washing': [
    'M3.5 11L12 4l8.5 7',
    'M5.5 9.5V20h13V9.5',
    'M9.5 12.5h5v5h-5z',
    'M12 12.5v5',
    'M9.5 15h5',
  ],
  'commercial-office-glass': [
    'M5 3.5h14v17H5z',
    'M8.5 7h2M13.5 7h2',
    'M8.5 11h2M13.5 11h2',
    'M8.5 15h2M13.5 15h2',
    'M10.5 20.5V18h3v2.5',
  ],
  'solar-panel-cleaning': [
    'M4 20l2.5-8h11l2.5 8z',
    'M9.7 12L9 20M14.3 12L15 20',
    'M5.3 16h13.4',
    'M12 3v2.2M7.4 5.4l1.4 1.4M16.6 5.4l-1.4 1.4',
  ],
  'track-detailing': [
    'M4 19.5h16',
    'M6 19.5V5h12v14.5',
    'M6 16h12',
    'M9 10.5h5.5',
    'M12.5 8.5l2 2-2 2',
  ],
};

export default function HomeServices({
  eyebrow,
  title,
  cards,
}: HomeServicesProps) {
  // Read titles from the service catalog and leave out missing pages.
  const items = cards.flatMap((card) => {
    const service = getServiceBySlug(card.slug);
    return service ? [{ ...card, title: service.title }] : [];
  });

  return (
    <section
      id='home-services'
      aria-labelledby='home-services-heading'
      className='scroll-mt-6 bg-[#f7f4fb]'>
      <div className='mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24'>
        <div className='flex flex-wrap items-end justify-between gap-6'>
          <Reveal className='max-w-2xl'>
            <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
              {eyebrow}
            </p>
            <h2
              id='home-services-heading'
              className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
              <span className='line-mask'>
                <span className='line-rise'>{title}</span>
              </span>
            </h2>
          </Reveal>
          <Link
            href='/services'
            className='draw-link rounded-sm py-1 font-semibold text-[#6c3fb8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
            See all services
          </Link>
        </div>

        <ul className='mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {items.map((item, index) => (
            <Reveal
              key={item.slug}
              as='li'
              delay={(index % 3) * 90}
              className={`${styles.rise} h-full`}>
              <Link
                href={`/services/${item.slug}`}
                aria-labelledby={`home-service-${item.slug}`}
                className={`${styles.serviceCard} group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-7 ring-1 ring-[#200b38]/10 hover:shadow-xl hover:shadow-[#200b38]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] motion-safe:transition motion-safe:duration-300 motion-safe:hover:-translate-y-1 sm:p-8`}>
                <span className='grid size-14 place-items-center rounded-xl bg-[#efb52b]/15'>
                  <ServiceIcon
                    slug={item.slug}
                    paths={homeIcons[item.slug]}
                    className='size-8 text-[#200b38]'
                  />
                </span>
                <h3
                  id={`home-service-${item.slug}`}
                  className='mt-6 text-xl font-semibold tracking-tight text-[#200b38]'>
                  {item.title}
                </h3>
                <p className='mt-3 flex-1 leading-relaxed text-gray-600'>
                  {item.blurb}
                </p>
                <p
                  aria-hidden='true'
                  className='mt-5 text-sm font-semibold text-[#6c3fb8]'>
                  Explore{' '}
                  <span className='inline-block motion-safe:transition-transform motion-safe:group-hover:translate-x-1'>
                    →
                  </span>
                </p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
