import Image from 'next/image';
import Link from 'next/link';
import { manrope } from '@/app/fonts';
import HxIcon from '@/components/home/HxIcon';
import type { HomeServiceCard } from '@/data/home';
import { getServices } from '@/lib/services';

type HomeServicesProps = {
  eyebrow: string;
  titleLines: readonly string[];
  lead: string;
  popularLabel: string;
  cards: readonly HomeServiceCard[];
};

// "Our services": four flip cards on a light cream band, in Manrope. The front
// is the photo and the service name. Pointing at a card (or tabbing to it, or
// tapping it on a phone) flips it over: the back has the details on see-through
// plum glass over the same photo, blurred. The most popular service gets a
// green folder tab on top. A service's own photo from Sanity wins over the
// default one, unless the card says to prefer its own photo.
export default async function HomeServices({ eyebrow, titleLines, lead, popularLabel, cards }: HomeServicesProps) {
  const services = await getServices();
  const items = cards.flatMap((card) => {
    const service = services.find((item) => item.slug === card.slug);
    if (!service) return [];
    const photo =
      service.image?.url && !card.preferThisImage
        ? { src: service.image.url, alt: service.image.alt, position: undefined }
        : { src: card.image, alt: card.imageAlt, position: card.imagePosition };
    return [{ ...card, title: service.title, photo }];
  });
  const lastLine = titleLines.length - 1;

  return (
    <section
      id='home-services'
      aria-labelledby='home-services-heading'
      className={`hx-section hx-sv scroll-mt-6 ${manrope.variable}`}>
      <div className='hx-container'>
        <div className='hx-sv-head hx-reveal'>
          <p className='hx-sv-eyebrow'>{eyebrow}</p>
          <h2
            id='home-services-heading'
            className='hx-sv-title'>
            {titleLines.map((line, index) => (
              <span
                key={line}
                className='hx-sv-line'>
                {index === lastLine && lastLine > 0 ? <em>{line}</em> : line}
              </span>
            ))}
          </h2>
          <p className='hx-sv-lead'>{lead}</p>
        </div>

        <ul className='hx-sv-grid'>
          {items.map((item, index) => (
            <li
              key={item.slug}
              className='hx-reveal'
              style={{ '--d': `${index * 90}ms` } as React.CSSProperties}>
              {/* Focusable, so a tap (phones) or Tab (keyboards) also flips it. */}
              <article
                tabIndex={0}
                aria-labelledby={`home-service-${item.slug}`}
                className='hx-sv-card'>
                {item.popular && (
                  <span className='hx-sv-popular'>
                    <svg
                      aria-hidden='true'
                      viewBox='0 0 24 24'>
                      <path d='M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z' />
                    </svg>
                    {popularLabel}
                  </span>
                )}
                <div className='hx-sv-flip'>
                  <div
                    className='hx-sv-face hx-sv-front'
                    aria-hidden='true'>
                    <Image
                      src={item.photo.src}
                      alt=''
                      fill
                      sizes='(min-width: 1180px) 270px, (min-width: 900px) 25vw, (min-width: 480px) 50vw, 100vw'
                      style={{ objectPosition: item.photo.position }}
                      className='hx-sv-photo'
                    />
                    <span className='hx-sv-front-text'>
                      <b>{item.title}</b>
                      <small>
                        <span className='hx-sv-hint-hover'>Hover to flip</span>
                        <span className='hx-sv-hint-tap'>Tap to flip</span> ↻
                      </small>
                    </span>
                  </div>
                  <div className='hx-sv-face hx-sv-back'>
                    <Image
                      src={item.photo.src}
                      alt={item.photo.alt}
                      fill
                      sizes='(min-width: 1180px) 270px, (min-width: 900px) 25vw, (min-width: 480px) 50vw, 100vw'
                      style={{ objectPosition: item.photo.position }}
                      className='hx-sv-photo hx-sv-photo-blur'
                    />
                    <span
                      aria-hidden='true'
                      className='hx-sv-glass'
                    />
                    <div className='hx-sv-back-body'>
                      <span className='hx-sv-badge'>{item.badge}</span>
                      <h3 id={`home-service-${item.slug}`}>{item.title}</h3>
                      <p>{item.blurb}</p>
                      <ul className='hx-sv-points'>
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
                        className='hx-sv-link'>
                        {item.cta} <HxIcon name='arrow' />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
