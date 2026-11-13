import Image from 'next/image';
import Link from 'next/link';
import HxIcon from '@/components/home/HxIcon';
import type { HomeServiceCard } from '@/data/home';
import { getServices } from '@/lib/services';

type HomeServicesProps = {
  eyebrow: string;
  titleLines: readonly string[];
  lead: string;
  cards: readonly HomeServiceCard[];
};

// "What we clean": four tall photo cards, one per main service. Each card
// has a label, the service name, a short line, three points and a link to the
// service page. A service's own photo from Sanity wins over the default one.
export default async function HomeServices({ eyebrow, titleLines, lead, cards }: HomeServicesProps) {
  const services = await getServices();
  const items = cards.flatMap((card) => {
    const service = services.find((item) => item.slug === card.slug);
    if (!service) return [];
    const photo = service.image?.url
      ? { src: service.image.url, alt: service.image.alt, position: undefined }
      : { src: card.image, alt: card.imageAlt, position: card.imagePosition };
    return [{ ...card, title: service.title, photo }];
  });
  const lastLine = titleLines.length - 1;

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
              {titleLines.map((line, index) => (
                <span
                  key={line}
                  className='line-mask'>
                  <span
                    className='line-rise'
                    style={{ '--i': index } as React.CSSProperties}>
                    {index === lastLine && lastLine > 0 ? <em>{line}</em> : line}
                  </span>
                </span>
              ))}
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

        <ul className='hx-wd-grid'>
          {items.map((item, index) => (
            <li
              key={item.slug}
              className='hx-reveal'
              style={{ '--d': `${index * 90}ms` } as React.CSSProperties}>
              <article
                aria-labelledby={`home-service-${item.slug}`}
                className='hx-wd-card'>
                <Image
                  src={item.photo.src}
                  alt={item.photo.alt}
                  fill
                  sizes='(min-width: 1180px) 300px, (min-width: 760px) 50vw, 100vw'
                  style={{ objectPosition: item.photo.position }}
                  className='hx-wd-photo'
                />
                <span
                  aria-hidden='true'
                  className='hx-wd-shade'
                />
                <div className='hx-wd-body'>
                  <span className='hx-wd-badge'>
                    <HxIcon
                      name='sparkle'
                      size={14}
                    />
                    {item.badge}
                  </span>
                  <h3 id={`home-service-${item.slug}`}>{item.title}</h3>
                  <p>{item.blurb}</p>
                  <ul className='hx-wd-points'>
                    {item.points.map((point) => (
                      <li key={point}>
                        <svg
                          aria-hidden='true'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2.4'
                          strokeLinecap='round'
                          strokeLinejoin='round'>
                          <path d='M5 12.5l4.5 4.5L19 7.5' />
                        </svg>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${item.slug}`}
                    className='hx-wd-link'>
                    {item.cta} <HxIcon name='arrow' />
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
