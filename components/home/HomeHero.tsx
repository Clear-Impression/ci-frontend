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
  // The stats strip, shown along the bottom of the hero over the video.
  children?: React.ReactNode;
};

// The homepage hero: a full-width drone video under a purple shade, a big
// white headline, then a line with the intro, rating and buttons. The stats
// strip sits along the bottom, over the same video.
export default function HomeHero({ eyebrow, titleLines, subtitle, rating, reviewCount, children }: HomeHeroProps) {
  const lastLine = titleLines.length - 1;

  return (
    <section
      aria-labelledby='home-heading'
      className='hx-hero'>
      {/* A drone flies in over a neighborhood at sunset, down to one of our
          cleaners squeegeeing a big window. The clip is cut before its white
          end frames. A purple shade from the bottom keeps the white words easy
          to read. */}
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
          <div className='hx-hero-bottom'>
            <div>
              {subtitle && (
                <p className='hx-hero-sub'>{subtitle}</p>
              )}
              {/* The rating opens our Google Business listing in a new tab. */}
              <a
                href={googleReviewsUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='hx-hero-rating hx-reveal'
                style={{ '--d': '250ms' } as React.CSSProperties}>
                <span
                  aria-hidden='true'
                  className='hx-stars'>
                  ★★★★★
                </span>
                {rating.toFixed(1)} on Google · {reviewCount} reviews
                <span className='sr-only'> (opens in a new tab)</span>
              </a>
            </div>
            <div
              className='hx-button-row hx-reveal'
              style={{ '--d': '300ms' } as React.CSSProperties}>
              {/* The header has the quote button on wide screens, so this one
                  only shows on phones and tablets. */}
              <QuoteButton className='hx-btn hx-hero-quote'>
                Get a free quote <HxIcon name='arrow' />
              </QuoteButton>
              <a
                href='#services'
                className='hx-btn-secondary'>
                See services
              </a>
            </div>
          </div>
        </div>
      </div>

      {children}
    </section>
  );
}
