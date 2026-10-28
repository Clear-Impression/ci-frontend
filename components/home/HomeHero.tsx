import Image from 'next/image';
import { company } from '@/data/company';
import styles from '@/app/home.module.css';

type HomeHeroProps = {
  eyebrow: string;
  titleLines: readonly string[];
  description: string;
  quoteHref: string;
  rating: number;
};

// Stagger the drops so both sides of the window have moving water.
const drops = [
  { x: '12%', delay: '0.2s', height: '22px' },
  { x: '27%', delay: '2.6s', height: '14px' },
  { x: '39%', delay: '1.4s', height: '18px' },
  { x: '61%', delay: '3.2s', height: '24px' },
  { x: '74%', delay: '0.9s', height: '16px' },
  { x: '88%', delay: '2.1s', height: '20px' },
];

export default function HomeHero({
  eyebrow,
  titleLines,
  description,
  quoteHref,
  rating,
}: HomeHeroProps) {
  return (
    <section
      aria-labelledby='home-heading'
      className='relative isolate overflow-hidden bg-[#200b38] text-white'>
      <div
        aria-hidden='true'
        className={`${styles.heroGlow} absolute inset-0 -z-10`}
      />
      <div className='mx-auto grid max-w-7xl items-center gap-12 px-6 pb-28 pt-14 sm:px-8 sm:pb-32 sm:pt-20 lg:grid-cols-2 lg:gap-16 lg:pb-36'>
        <div>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            {eyebrow}
          </p>
          <h1
            id='home-heading'
            className='mt-4 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-5xl xl:text-6xl'>
            {titleLines.map((line, index) => (
              <span
                key={line}
                className='line-mask'>
                <span
                  className={`line-rise ${index === titleLines.length - 1 ? 'text-[#efb52b]' : ''}`}
                  style={{ '--i': index } as React.CSSProperties}>
                  {line}
                </span>{' '}
              </span>
            ))}
          </h1>
          <p className={`${styles.heroIntro} mt-6 max-w-lg text-lg leading-8 text-white/80`}>
            {description}
          </p>
          <div
            className={`${styles.heroIntro} mt-9 flex flex-wrap gap-3`}
            style={{ '--i': 1 } as React.CSSProperties}>
            <a
              href={quoteHref}
              className='inline-flex min-h-12 items-center justify-center rounded-lg bg-[#efb52b] px-6 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
              Get a free quote
            </a>
            <a
              href='#home-services'
              className='inline-flex min-h-12 items-center justify-center rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
              Our services
            </a>
          </div>
          <p
            className={`${styles.heroIntro} mt-7 text-sm text-white/70`}
            style={{ '--i': 2 } as React.CSSProperties}>
            Residential &amp; commercial · Call or text{' '}
            <a
              href={company.phoneHref}
              className='whitespace-nowrap rounded-sm font-medium text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
              {company.phone}
            </a>
          </p>
        </div>

        {/* Reuse the shared window details; the drops are home-page-only. */}
        <div className={styles.heroWindow}>
          <div className='relative rounded-2xl bg-[#140628] p-3 shadow-2xl shadow-black/40 sm:p-3.5'>
            <span
              aria-hidden='true'
              className='pointer-events-none absolute inset-1.5 rounded-xl border border-white/10'
            />
            <div className='relative h-72 overflow-hidden rounded-lg sm:h-96 lg:h-105'>
              <Image
                src='/images/home/window-cleaning.webp'
                alt='A window cleaner using a squeegee on a large window in an Arizona home.'
                fill
                priority
                sizes='(min-width: 1280px) 600px, (min-width: 1024px) 46vw, 100vw'
                className='object-cover'
              />
              {drops.map((drop) => (
                <span
                  key={drop.x}
                  aria-hidden='true'
                  className={styles.drop}
                  style={
                    {
                      '--x': drop.x,
                      '--delay': drop.delay,
                      '--h': drop.height,
                    } as React.CSSProperties
                  }
                />
              ))}
              <span
                aria-hidden='true'
                className={styles.glare}
              />
              <span
                aria-hidden='true'
                className='absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 bg-[#140628]'
              />
              <span
                aria-hidden='true'
                className='window-latch absolute left-1/2 top-1/2 h-12 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9b65f]'
              />
              <p className='absolute bottom-4 left-4 rounded-lg bg-[#200b38]/85 px-3.5 py-2 text-sm font-semibold backdrop-blur-sm'>
                <span className='text-[#efb52b]'>
                  <span aria-hidden='true'>★ </span>
                  {rating.toFixed(1)}
                </span>{' '}
                on Google
              </p>
            </div>
          </div>
          <div
            aria-hidden='true'
            className='window-sill'
          />
        </div>
      </div>
    </section>
  );
}
