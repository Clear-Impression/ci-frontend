import type { CSSProperties } from 'react';
import type { PromiseIcon } from '@/data/promise';

const icons: Record<PromiseIcon, React.ReactNode> = {
  clock: (
    <>
      <circle cx='12' cy='12' r='8.5' />
      <path d='M12 7.5V12l3 2' />
    </>
  ),
  tag: (
    <>
      <path d='M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.7 7.7a1 1 0 0 1-1.4 0z' />
      <circle cx='8' cy='8' r='1.4' />
    </>
  ),
  sparkle: (
    <>
      <path d='M11 3.5 12.7 8.3 17.5 10l-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7z' />
      <path d='m18 14.5.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z' />
    </>
  ),
  return: (
    <>
      <path d='M4.5 12a7.5 7.5 0 1 0 2.2-5.3' />
      <path d='M4.5 4.5v4h4' />
    </>
  ),
};

type HomePromiseProps = {
  eyebrow: string;
  title: readonly string[];
  intro: string;
  items: readonly { icon: PromiseIcon; title: string; text: string }[];
};

// "The Clear Impression Promise": four commitments on a deep purple section.
export default function HomePromise({ eyebrow, title, intro, items }: HomePromiseProps) {
  const lastLine = title.length - 1;
  return (
    <section
      aria-labelledby='promise-heading'
      className='hx-section hx-promise hx-on-dark'>
      <div className='hx-container'>
        <p className='hx-eyebrow hx-eyebrow-light hx-reveal'>{eyebrow}</p>
        <div className='hx-heading-row'>
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
          <p className='hx-reveal'>{intro}</p>
        </div>

        <ul className='hx-promise-grid'>
          {items.map((item, index) => (
            <li
              key={item.title}
              className='hx-promise-card hx-reveal'
              style={{ '--d': `${index * 80}ms` } as CSSProperties}>
              <b>{String(index + 1).padStart(2, '0')}</b>
              <span className='hx-promise-icon'>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className='size-[22px]'>
                  {icons[item.icon]}
                </svg>
              </span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
