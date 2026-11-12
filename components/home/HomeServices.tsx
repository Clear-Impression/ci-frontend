import Link from 'next/link';
import HxIcon from '@/components/home/HxIcon';
import ServiceIcon from '@/components/services/ServiceIcon';
import type { HomeServiceCard } from '@/data/home';
import { getServices } from '@/lib/services';

type HomeServicesProps = {
  eyebrow: string;
  title: string;
  lead: string;
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

export default async function HomeServices({
  eyebrow,
  title,
  lead,
  cards,
}: HomeServicesProps) {
  const services = await getServices();
  // Read titles from the service catalog and leave out missing pages.
  const items = cards.flatMap((card) => {
    const service = services.find((item) => item.slug === card.slug);
    return service ? [{ ...card, title: service.title }] : [];
  });

  return (
    <section
      id='home-services'
      aria-labelledby='home-services-heading'
      className='hx-section hx-services scroll-mt-6'>
      <div className='hx-container'>
        <div className='hx-heading-row'>
          <div>
            <p className='hx-eyebrow hx-reveal'>{eyebrow}</p>
            <h2
              id='home-services-heading'
              className='hx-h2'>
              <span className='line-mask'>
                <span className='line-rise'>{title}</span>
              </span>
            </h2>
          </div>
          <div className='hx-reveal'>
            <p className='hx-lead max-w-md'>{lead}</p>
            <Link
              href='/services'
              className='hx-link mt-5'>
              See all services <HxIcon name='arrow' />
            </Link>
          </div>
        </div>

        <ul className='hx-service-grid'>
          {items.map((item, index) => (
            <li
              key={item.slug}
              className='hx-reveal'
              style={{ '--d': `${(index % 3) * 70}ms` } as React.CSSProperties}>
              <Link
                href={`/services/${item.slug}`}
                aria-labelledby={`home-service-${item.slug}`}
                className='hx-service-card'>
                <span className='hx-service-icon'>
                  <ServiceIcon
                    slug={item.slug}
                    paths={homeIcons[item.slug]}
                    className='size-6'
                  />
                </span>
                <span>
                  <h3 id={`home-service-${item.slug}`}>{item.title}</h3>
                  <p>{item.blurb}</p>
                </span>
                <span
                  aria-hidden='true'
                  className='hx-card-arrow'>
                  <HxIcon name='arrow' />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
