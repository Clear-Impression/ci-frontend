'use client';

import { useEffect, useRef, useState } from 'react';
import styles from '@/app/reviews/reviews.module.css';

type RatingSummaryProps = {
  score: number;
  count: number;
  sourceUrl: string;
};

// Count the rating and review total up from zero when the card comes into view.
export default function RatingSummary({
  score,
  count,
  sourceUrl,
}: RatingSummaryProps) {
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
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
      className={`${styles.summary} relative rounded-2xl bg-white p-8 shadow-xl shadow-[#200b38]/10 ring-1 ring-gray-200 sm:p-10`}>
      {/* Screen readers get the final numbers once, not every frame. */}
      <p className='sr-only'>
        Rated {score.toFixed(1)} out of 5 from {count} Google reviews.
      </p>
      <div
        aria-hidden='true'
        className='flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-6'>
          <p className='text-6xl font-semibold tracking-tight text-[#200b38] tabular-nums sm:text-7xl'>
            {(score * progress).toFixed(1)}
          </p>
          <div>
            <p className='flex gap-1 text-3xl text-[#efb52b]'>
              {[0, 1, 2, 3, 4].map((star) => (
                <span
                  key={star}
                  className={styles.summaryStar}
                  style={{ '--s': star } as React.CSSProperties}>
                  ★
                </span>
              ))}
            </p>
            <p className='mt-2 text-gray-600'>
              Based on{' '}
              <span className='font-semibold text-[#200b38] tabular-nums'>
                {Math.round(count * progress)}
              </span>{' '}
              Google reviews
            </p>
          </div>
        </div>
      </div>
      <a
        href={sourceUrl}
        className='mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] sm:absolute sm:right-10 sm:top-1/2 sm:mt-0 sm:-translate-y-1/2'>
        Read all reviews on Google
      </a>
    </div>
  );
}
