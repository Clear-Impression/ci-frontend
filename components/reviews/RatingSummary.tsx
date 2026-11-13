'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/reviews/reviews.module.css';

type RatingSummaryProps = {
  score: number;
  count: number;
  sourceUrl: string;
  writeReviewUrl: string;
  // Names of reviewers shown on this page, for the row of initials.
  reviewers: readonly string[];
};

// The overall Google rating. A purple panel holds the score, which counts up
// as the card flips into view; next to it, a row of reviewer initials and the
// two Google links.
export default function RatingSummary({ score, count, sourceUrl, writeReviewUrl, reviewers }: RatingSummaryProps) {
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const faces = reviewers.slice(0, 5);
  const others = Math.max(0, count - faces.length);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShown(true);
        if (reduceMotion) {
          setProgress(1);
          return;
        }
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / 1600, 1);
          // Ease out so the numbers slow down as they land.
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(card);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      data-shown={shown ? '' : undefined}
      className={styles.summary}>
      {/* Screen readers get the final numbers once, not every frame. */}
      <p className='sr-only'>
        Rated {score.toFixed(1)} out of 5 from {count} Google reviews.
      </p>

      {/* The score, on a purple panel with a soft gold glow. */}
      <div
        aria-hidden='true'
        className={styles.summaryScore}>
        <span className={styles.summaryLabel}>
          <span className={styles.googleG}>G</span>
          Google rating
        </span>
        <span className={styles.summaryNumber}>
          {(score * progress).toFixed(1)}
          <small>/ 5</small>
        </span>
        <span className='flex gap-1 text-2xl text-[#efb52b]'>
          {[0, 1, 2, 3, 4].map((star) => (
            <span
              key={star}
              className={styles.summaryStar}
              style={{ '--s': star } as React.CSSProperties}>
              ★
            </span>
          ))}
        </span>
      </div>

      {/* Who's behind the number. */}
      <div className={styles.summaryMiddle}>
        <p
          aria-hidden='true'
          className='text-xl font-semibold text-[#200b38] sm:text-2xl'>
          Based on <span className='tabular-nums'>{Math.round(count * progress)}</span> Google reviews
        </p>
        <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-3'>
          <span
            aria-hidden='true'
            className={styles.faces}>
            {faces.map((name, index) => (
              <span
                key={name}
                style={{ '--f': index } as React.CSSProperties}>
                {name.charAt(0)}
              </span>
            ))}
            {others > 0 && <span className={styles.facesMore}>+{others}</span>}
          </span>
          <p className='text-sm leading-snug text-gray-600'>
            {faces
              .slice(0, 2)
              .map((name) => name.split(' ')[0])
              .join(', ')}{' '}
            and {count - 2} more customers
            <br className='hidden sm:block' /> shared their experience on Google.
          </p>
        </div>
      </div>

      {/* Where to read them all, or add one. */}
      <div className={styles.summaryActions}>
        <a
          href={sourceUrl}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.summaryPrimary}>
          Read all reviews on Google
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M7 17L17 7M9 7h8v8' />
          </svg>
          <span className='sr-only'> (opens in a new tab)</span>
        </a>
        <a
          href={writeReviewUrl}
          target='_blank'
          rel='noopener noreferrer'
          className={styles.summarySecondary}>
          <span aria-hidden='true'>★</span> Leave a review
          <span className='sr-only'> (opens Google in a new tab)</span>
        </a>
      </div>
    </div>
  );
}
