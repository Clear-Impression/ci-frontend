'use client';

import { useEffect, useRef, useState } from 'react';
import QuoteButton from '@/components/quote/QuoteButton';
import ReviewPanel from '@/components/reviews/ReviewPanel';
import type { Review } from '@/data/reviews';
import styles from '@/app/reviews/reviews.module.css';

type ReviewsHeroProps = {
  title: string;
  subtitle?: string;
  // The few reviews fanned out on the right.
  featured: readonly Review[];
  googleUrl: string;
  writeReviewUrl: string;
};

// The Reviews page header: big words on the left and a small 3D stack of real
// review cards on the right. The stack fans out under the mouse, tips back as
// you scroll down, and each card opens the full review.
export default function ReviewsHero({ title, subtitle, featured, googleUrl, writeReviewUrl }: ReviewsHeroProps) {
  const words = title.trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const firstWords = words.join(' ');
  const heroRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Review | null>(null);

  // Share how far the header has scrolled away (0 to 1) with the CSS.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / hero.offsetHeight));
      hero.style.setProperty('--scroll', progress.toFixed(3));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className={`${styles.hero} relative isolate overflow-hidden bg-[#200b38] text-white`}>
      <div className='mx-auto grid max-w-7xl items-center gap-14 px-6 pb-28 pt-14 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-32 lg:pt-12'>
        <div>
          <p className={`${styles.lift} inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#efb52b]`}>
            <span
              aria-hidden='true'
              className={styles.googleG}>
              G
            </span>
            Google reviews
          </p>
          <h1 className={`${styles.heroTitle} mt-4`}>
            <span className={styles.titleLine}>
              <span>{firstWords || title}</span>
            </span>
            {lastWord && (
              <span className={styles.titleLine}>
                <span style={{ '--i': 1 } as React.CSSProperties}>
                  <em>{lastWord}</em>
                </span>
              </span>
            )}
          </h1>
          {subtitle && (
            <p
              className={`${styles.lift} mt-5 max-w-md text-lg leading-relaxed text-white/80`}
              style={{ animationDelay: '350ms' }}>
              {subtitle}
            </p>
          )}
          <div
            className={`${styles.lift} mt-8 flex flex-wrap items-center gap-3`}
            style={{ animationDelay: '480ms' }}>
            <QuoteButton className={styles.heroQuote}>
              Get a free quote
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M5 12h14M13 6l6 6-6 6' />
              </svg>
            </QuoteButton>
            <a
              href={writeReviewUrl}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.heroGhost}>
              <span aria-hidden='true'>★</span> Leave us a review
              <span className='sr-only'> (opens Google in a new tab)</span>
            </a>
          </div>
        </div>

        {/* A small fanned stack of real reviews. */}
        <div className={styles.deck}>
          <ul className={styles.deckInner}>
            {featured.map((review, index) => (
              <li
                key={review.id}
                className={styles.deckCard}
                style={{ '--d': index } as React.CSSProperties}>
                <button
                  type='button'
                  aria-haspopup='dialog'
                  onClick={() => setOpen(review)}>
                  <span
                    aria-hidden='true'
                    className='block text-lg tracking-widest text-[#efb52b]'>
                    {'★'.repeat(review.rating)}
                  </span>
                  <span className='sr-only'>{review.rating} out of 5 stars.</span>
                  <span className={styles.deckQuote}>“{review.quote}”</span>
                  <span className={`${styles.deckName} flex items-center gap-3 pt-4 text-sm font-bold text-[#200b38]`}>
                    <span
                      aria-hidden='true'
                      className={styles.gridAvatar}>
                      {review.name.charAt(0)}
                    </span>
                    {review.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ReviewPanel
        review={open}
        fallbackUrl={googleUrl}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
