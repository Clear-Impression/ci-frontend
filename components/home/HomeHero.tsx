import HeroBackdropVideo from '@/components/home/HeroBackdropVideo';
import HxIcon from '@/components/home/HxIcon';
import QuoteButton from '@/components/quote/QuoteButton';
import { googleReviewsUrl } from '@/data/reviews';

type HomeHeroProps = {
  eyebrow: string;
  titleLines: readonly string[];
  subtitle?: string;
  rating: number;
  reviewCount: number;
};

// The homepage hero: the words on the left over a full-width drone video of
// a home at sunset.
export default function HomeHero({ eyebrow, titleLines, subtitle, rating, reviewCount }: HomeHeroProps) {
  const lastLine = titleLines.length - 1;

  return (
    <section
      aria-labelledby='home-heading'
      className='hx-hero'>
      {/* A drone flies in over a neighborhood at sunset, down to one of our
          cleaners squeegeeing a big window. The clip is cut before its white
          end frames. A light wash on the left keeps the words easy to read. */}
      <HeroBackdropVideo />
      <span
        aria-hidden='true'
        className='hx-hero-wash'
      />

      <div className='hx-container hx-hero-grid'>
        <div className='hx-hero-copy'>
          <p className='hx-eyebrow hx-reveal'>{eyebrow}</p>
          <h1
            id='home-heading'
            className='hx-h1'>
            {titleLines.map((line, index) => (
              <span
                key={line}
                className='line-mask'>
                <span
                  className='line-rise'
                  style={{ '--i': index } as React.CSSProperties}>
                  {index === lastLine && lastLine > 0 ? <em>{line}</em> : line}
                </span>{' '}
              </span>
            ))}
          </h1>
          {subtitle && (
            <p
              className='hx-hero-sub hx-reveal'
              style={{ '--d': '150ms' } as React.CSSProperties}>
              {subtitle}
            </p>
          )}
          <div
            className='hx-button-row hx-reveal'
            style={{ '--d': '250ms' } as React.CSSProperties}>
            <QuoteButton className='hx-btn'>
              Get a free quote <HxIcon name='arrow' />
            </QuoteButton>
            <a
              href='#services'
              className='hx-btn-secondary'>
              Our services
            </a>
          </div>
          {/* The rating opens our Google Business listing in a new tab. */}
          <a
            href={googleReviewsUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='hx-rating hx-reveal'
            style={{ '--d': '350ms' } as React.CSSProperties}>
            <span
              aria-hidden='true'
              className='hx-google-g'>
              G
            </span>
            <span className='hx-rating-text'>
              <span
                aria-hidden='true'
                className='hx-stars'>
                ★★★★★
              </span>
              <strong>{rating.toFixed(1)} on Google</strong>
              <small>Based on {reviewCount} Google reviews</small>
            </span>
            <span className='sr-only'> (opens in a new tab)</span>
          </a>
        </div>

      </div>
    </section>
  );
}
