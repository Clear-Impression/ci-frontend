import HeroBackdropVideo from '@/components/home/HeroBackdropVideo';
import HxIcon from '@/components/home/HxIcon';
import QuoteButton from '@/components/quote/QuoteButton';
import { manrope } from '@/app/fonts';
import { googleReviewsUrl } from '@/data/reviews';

type HomeHeroProps = {
  titleLines: readonly string[];
  lead: string;
  rating: number;
  reviewCount: number;
  // The stats strip, shown along the bottom of the hero over the video.
  children?: React.ReactNode;
};

// Each letter waits this long after the one before it, so the headline
// types itself out.
const TYPE_MS = 55;
// A short pause before the next line starts typing.
const LINE_PAUSE_MS = 300;

// The time each letter of each line appears, in milliseconds.
function typeSchedule(lines: readonly string[]) {
  let clock = 400;
  const result = lines.map((line) => {
    const letters = Array.from(line).map((letter, index) => ({ letter, at: clock + index * TYPE_MS }));
    const start = clock;
    clock += letters.length * TYPE_MS + LINE_PAUSE_MS;
    return { line, letters, start };
  });
  return { lines: result, doneAt: clock };
}

// The homepage hero: a full-width drone video under a purple shade, the
// headline typing itself out in Manrope ("ZERO cut corners. ONE CLEAR
// IMPRESSION.", with the last line in gold), then a line with the
// rating and buttons. The promise strip sits along the bottom, over
// the same video.
export default function HomeHero({ titleLines, lead, rating, reviewCount, children }: HomeHeroProps) {
  const lastLine = titleLines.length - 1;

  // When each letter appears. Worked out up front, so the typing is pure CSS
  // and the page needs no script for it.
  const typed = typeSchedule(titleLines);
  const doneAt = typed.doneAt;

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
          <h1
            id='home-heading'
            className={`hx-h1 hx-typed ${manrope.variable}`}>
            {/* Screen readers and search engines get the whole line at once. */}
            <span className='sr-only'>{titleLines.join(' ')}</span>
            <span aria-hidden='true'>
              <span className='hx-mobile-title'>
                {titleLines.map((line, index) => {
                  const words = line.split(' ');
                  const wrapLastWord = index === lastLine && words.length > 1;
                  return (
                    <span
                      key={line}
                      className={index === lastLine && lastLine > 0 ? 'hx-typed-label' : undefined}>
                      {wrapLastWord ? (
                        <>
                          {words.slice(0, -1).join(' ')}
                          <br />
                          {words.at(-1)}
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  );
                })}
              </span>
              <span className='hx-animated-title'>
                {typed.lines.map(({ line, letters, start }, index) => (
                  <span
                    key={line}
                    className='hx-typed-line'>
                    <span
                      className={index === lastLine && lastLine > 0 ? 'hx-typed-label' : undefined}
                      style={{ '--start': `${start}ms` } as React.CSSProperties}>
                      {letters.map(({ letter, at }, position) => (
                        <span
                          key={position}
                          className='hx-typed-ch'
                          style={{ '--at': `${at}ms` } as React.CSSProperties}>
                          {letter}
                        </span>
                      ))}
                      {index === lastLine && (
                        <span
                          className='hx-typed-caret'
                          style={{ '--at': `${doneAt}ms` } as React.CSSProperties}
                        />
                      )}
                    </span>
                  </span>
                ))}
              </span>
            </span>
          </h1>
          <p className='hx-hero-service-line'>{lead}</p>
          <div className='hx-hero-bottom'>
            <div>
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
