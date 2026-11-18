import Image from 'next/image';
import Link from 'next/link';
import ServiceIcon from '@/components/services/ServiceIcon';

export type CoreCard = {
  slug: string;
  title: string;
  previewDescription: string;
  largeDescription: string;
  image: { url: string; alt: string; position?: string };
};

type CoreServiceCardsProps = {
  cards: readonly CoreCard[];
};

// The core services as one row of tall, floating photo cards, set a little
// up and down. Each shows its photo, name and short line. Pointing at a card
// (or tabbing to it) widens it and slides up the full description and an
// "Explore" link, while the others narrow. On smaller screens every card is
// shown open. The whole card links to the service page.
export default function CoreServiceCards({ cards }: CoreServiceCardsProps) {
  return (
    <ul className='sp-cards'>
      {cards.map((card, index) => (
        <li
          key={card.slug}
          className='sp-card-slot'
          style={{ '--n': index } as React.CSSProperties}>
          <article
            aria-labelledby={`core-${card.slug}`}
            className='sp-card'>
            <Image
              src={card.image.url}
              alt={card.image.alt}
              fill
              sizes='(min-width: 1100px) 520px, (min-width: 700px) 50vw, 100vw'
              style={{ objectPosition: card.image.position }}
              className='sp-card-photo'
            />
            <span
              aria-hidden='true'
              className='sp-card-shade'
            />
            <span className='sp-card-badge'>
              <ServiceIcon
                slug={card.slug}
                draw='none'
                className='size-4'
              />
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className='sp-card-body'>
              <h3 id={`core-${card.slug}`}>
                <Link href={`/services/${card.slug}`}>{card.title}</Link>
              </h3>
              <p className='sp-card-kicker'>{card.previewDescription}</p>
              {/* Slides open when the card is pointed at. */}
              <div className='sp-card-more-wrap'>
                <div>
                  <p className='sp-card-text'>{card.largeDescription}</p>
                  <span
                    aria-hidden='true'
                    className='sp-card-more'>
                    Explore this service
                    <svg
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
