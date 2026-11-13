'use client';

import { useEffect, useRef } from 'react';
import type { Review } from '@/data/reviews';
import styles from '@/app/reviews/reviews.module.css';

type ReviewPanelProps = {
  review: Review | null;
  // Where "See Google review" goes when a review has no link of its own.
  fallbackUrl: string;
  onClose: () => void;
};

// A large panel that opens over the page with one review in full, and a
// button at the bottom to read it on Google. It's a native <dialog>, so focus
// stays inside it and Escape closes it.
export default function ReviewPanel({ review, fallbackUrl, onClose }: ReviewPanelProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (review && !dialog.open) dialog.showModal();
    if (!review && dialog.open) dialog.close();
  }, [review]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby='review-panel-name'
      onClose={onClose}
      // A click on the dimmed area outside the panel closes it.
      onClick={(event) => event.target === event.currentTarget && onClose()}
      className={styles.panel}>
      {review && (
        <div className={styles.panelBody}>
          <button
            type='button'
            onClick={onClose}
            aria-label='Close review'
            className={styles.panelClose}>
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.2'
              strokeLinecap='round'>
              <path d='M6 6l12 12M18 6L6 18' />
            </svg>
          </button>

          <div className='flex items-center gap-4'>
            <span
              aria-hidden='true'
              className={styles.panelAvatar}>
              {review.name.charAt(0)}
            </span>
            <div>
              <p
                id='review-panel-name'
                className='text-lg font-extrabold text-[#200b38]'>
                {review.name}
              </p>
              <p className='flex items-center gap-2 text-sm text-gray-500'>
                <span
                  aria-hidden='true'
                  className={styles.panelStars}>
                  {'★'.repeat(review.rating)}
                </span>
                <span className='sr-only'>{review.rating} out of 5 stars</span>
                on Google
              </p>
            </div>
          </div>

          <blockquote className={styles.panelQuote}>
            <p>“{review.quote}”</p>
          </blockquote>

          <div className={styles.panelFooter}>
            <span className='inline-flex items-center gap-2 text-sm font-semibold text-gray-500'>
              <span
                aria-hidden='true'
                className={styles.googleG}>
                G
              </span>
              From our Google reviews
            </span>
            <a
              href={review.url ?? fallbackUrl}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.panelGoogle}>
              See Google review
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M7 17L17 7M9 7h8v8' />
              </svg>
              <span className='sr-only'> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      )}
    </dialog>
  );
}
