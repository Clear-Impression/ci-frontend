import Link from 'next/link';
import HxIcon from '@/components/home/HxIcon';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
import type { ServiceCity } from '@/data/home';

type HomeServiceAreaProps = {
  eyebrow: string;
  title: string;
  lead: string;
  cities: readonly ServiceCity[];
  cityPages: readonly { name: string; href: string }[];
};

// "Do we serve your area?": a chip for every city page beside the real map.
export default function HomeServiceArea({ eyebrow, title, lead, cities, cityPages }: HomeServiceAreaProps) {
  return (
    <section
      aria-labelledby='home-areas-heading'
      className='hx-section'>
      <div className='hx-container hx-location-grid'>
        <div>
          <p className='hx-eyebrow hx-reveal'>{eyebrow}</p>
          <h2
            id='home-areas-heading'
            className='hx-h2'>
            <span className='line-mask'>
              <span className='line-rise'>{title}</span>
            </span>
          </h2>
          <p className='hx-lead hx-reveal'>{lead}</p>

          {/* Each city's page. Real links, so search engines find them all from here. */}
          <ul
            aria-label='City pages'
            className='hx-chips'>
            {cityPages.map((city, index) => (
              <li
                key={city.href}
                className='hx-reveal'
                style={{ '--d': `${index * 40}ms` } as React.CSSProperties}>
                <Link
                  href={city.href}
                  className='hx-chip'>
                  <HxIcon
                    name='pin'
                    size={15}
                  />
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href='/locations'
            className='hx-link hx-reveal'>
            Explore all locations <HxIcon name='arrow' />
          </Link>
        </div>

        <div className='hx-map-card hx-reveal'>
          {/* The chips beside it already list every city, so the map skips its own. */}
          <ServiceAreaMap
            cities={cities}
            showBoundaries
            cityButtons={false}
          />
        </div>
      </div>
    </section>
  );
}
