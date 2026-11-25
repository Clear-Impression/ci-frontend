import type { CSSProperties } from 'react';
import { manrope } from '@/app/fonts';
import type { PromiseIcon } from '@/data/promise';

type HomePromiseProps = {
  eyebrow: string;
  title: readonly string[];
  intro: string;
  items: readonly { icon: PromiseIcon; title: string; text: string }[];
};

// "The Clear Impression Promise" on a deep purple section: the heading on the
// left, and the four promises on a beige paper slip signed by Niels, with a
// "Zero cut corners" stamp. The ticks draw in one by one when it scrolls in.
export default function HomePromise({ eyebrow, title, intro, items }: HomePromiseProps) {
  const lastLine = title.length - 1;
  return (
    <section
      aria-labelledby='promise-heading'
      className={`hx-section hx-promise hx-on-dark ${manrope.variable}`}>
      <div className='hx-container hx-slip-grid'>
        <div>
          <p className='hx-eyebrow hx-eyebrow-light hx-reveal'>{eyebrow}</p>
          <h2
            id='promise-heading'
            className='hx-h2'>
            {title.map((line, index) => (
              <span
                key={line}
                className='line-mask'>
                <span
                  className='line-rise'
                  style={{ '--i': index } as CSSProperties}>
                  {index === lastLine && lastLine > 0 ? <em>{line}</em> : line}
                </span>{' '}
              </span>
            ))}
          </h2>
          <p className='hx-slip-intro hx-reveal'>{intro}</p>
        </div>

        <div className='hx-slip hx-reveal'>
          <div className='hx-slip-head'>
            <span>Our promise to you</span>
            <span>Every job</span>
          </div>
          <ol>
            {items.map((item, index) => (
              <li
                key={item.title}
                style={{ '--k': index } as CSSProperties}>
                <span
                  aria-hidden='true'
                  className='hx-slip-box'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='3'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='m5 12.5 4.5 4.5L19 7.5' />
                  </svg>
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className='hx-slip-sign'>
            <div>
              <b>Niels</b>
              <small>Owner, Clear Impression</small>
            </div>
            <span
              aria-hidden='true'
              className='hx-slip-stamp'>
              Zero
              <br />
              cut
              <br />
              corners
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
