'use client';

import { useState } from 'react';
import QuoteButton from '@/components/quote/QuoteButton';
import ReviewPanel from '@/components/reviews/ReviewPanel';
import ReviewRolodex from '@/components/reviews/ReviewRolodex';
import '@/components/reviews/rolodex.css';
import type { Review } from '@/data/reviews';
import styles from '@/app/reviews/reviews.module.css';

type ReviewsHeroProps = {
  title: string;
  subtitle?: string;
  // The reviews on the rolodex on the right.
  reviews: readonly Review[];
  googleUrl: string;
  writeReviewUrl: string;
};

// The Reviews page header: big words on the left and a spinning rolodex of
// real Google reviews on the right. Each card opens the full review.
export default function ReviewsHero({ title, subtitle, reviews, googleUrl, writeReviewUrl }: ReviewsHeroProps) {
  const words = title.trim().split(' ');
  const lastWord = words.length > 1 ? words.pop() : '';
  const firstWords = words.join(' ');
  const [open, setOpen] = useState<Review | null>(null);

  return (
    <section
      className={`${styles.hero} relative isolate overflow-hidden text-[#200b38]`}>
      <div className='mx-auto grid max-w-7xl items-center gap-14 px-6 pb-28 pt-14 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pb-32 lg:pt-12'>
        <div>
          <p className={`${styles.lift} inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-[#a87400]`}>
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
              className={`${styles.lift} mt-5 max-w-md text-lg leading-relaxed text-[#625c64]`}
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

        {/* Every review on a rolodex that flips to the next card on its own. */}
        <ReviewRolodex
          reviews={reviews}
          googleUrl={googleUrl}
          onOpen={setOpen}
        />
      </div>

      <ReviewPanel
        review={open}
        fallbackUrl={googleUrl}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
