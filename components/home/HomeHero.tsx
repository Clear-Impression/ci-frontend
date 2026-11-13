import Image from 'next/image';
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

// Free Unsplash photo (unsplash.com/license): a clear desert view through a
// modern home window. Swap in one of our own photos any time.
const heroImage =
  'https://images.unsplash.com/photo-1688600792894-61645c2d866c?auto=format&fit=crop&w=1600&q=85';

// The homepage hero. When the page loads, a squeegee wipes across a dusty
// window to reveal the clean view underneath, then water drops run down the
// glass and a glare sweeps across it every few seconds.
export default function HomeHero({ eyebrow, titleLines, subtitle, rating, reviewCount }: HomeHeroProps) {
  const lastLine = titleLines.length - 1;

  return (
    <section
      aria-labelledby='home-heading'
      className='hx-hero'>
      <div
        aria-hidden='true'
        className='hx-hero-shape'
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

        <div className='hx-hero-visual'>
          <div className='hx-hero-image'>
            <Image
              src={heroImage}
              alt='A clear desert view through a large window in a modern Arizona home.'
              fill
              priority
              sizes='(min-width: 1280px) 620px, (min-width: 760px) 50vw, 100vw'
            />
            {/* The same photo, dusty, on top. The squeegee wipes it away. */}
            <div
              aria-hidden='true'
              className='hx-dirty-glass'>
              <Image
                src={heroImage}
                alt=''
                fill
                sizes='(min-width: 1280px) 620px, (min-width: 760px) 50vw, 100vw'
              />
            </div>
            <div
              aria-hidden='true'
              className='hx-squeegee'>
              <span className='hx-squeegee-handle' />
              <span className='hx-squeegee-blade' />
            </div>
            <div
              aria-hidden='true'
              className='hx-drops'>
              <i />
              <i />
              <i />
              <i />
              <i />
            </div>
            <span
              aria-hidden='true'
              className='hx-glint'>
              <HxIcon
                name='sparkle'
                size={30}
              />
            </span>
            <span
              aria-hidden='true'
              className='hx-photo-glare'
            />
            <span
              aria-hidden='true'
              className='hx-sun-flare'
            />
          </div>
          <div className='hx-hero-note'>
            <span aria-hidden='true'>
              <HxIcon name='sparkle' />
            </span>
            <div>
              <small>OUR STANDARD</small>
              <strong>
                Pure water.
                <br />
                Spot-free finish.
              </strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
