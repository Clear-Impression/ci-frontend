'use client';

import { useState } from 'react';
import type { Review } from '@/data/reviews';
import styles from '@/app/reviews/reviews.module.css';

type ReviewWallProps = {
  reviews: readonly Review[];
};

// One review card. The initial stands in for the reviewer's photo.
function WallCard({ review }: { review: Review }) {
  return (
    <figure className={`${styles.card} flex w-[20rem] shrink-0 flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:w-[24rem] sm:p-7`}>
      <div className='flex items-center gap-3'>
        <span
          aria-hidden='true'
          className='grid size-10 shrink-0 place-items-center rounded-full bg-[#200b38] text-sm font-semibold text-[#efb52b]'>
          {review.name.charAt(0)}
        </span>
        <div>
          <figcaption className='font-semibold text-[#200b38]'>
            {review.name}
          </figcaption>
          <p className={`${styles.cardStars} text-sm tracking-widest text-[#efb52b]`}>
            <span className='sr-only'>{review.rating} out of 5 stars</span>
            <span aria-hidden='true'>{'★'.repeat(review.rating)}</span>
          </p>
        </div>
      </div>
      <blockquote className='mt-4 leading-relaxed text-gray-700'>
        <p>“{review.quote}”</p>
      </blockquote>
    </figure>
  );
}

// Two rows of reviews drift past in opposite directions.
// Hovering, focusing, or the pause button stops them so they can be read.
export default function ReviewWall({ reviews }: ReviewWallProps) {
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half)];

  return (
    <div
      className={styles.wall}
      data-paused={paused ? '' : undefined}>
      <div className='mx-auto flex max-w-7xl justify-end px-6 sm:px-8'>
        <button
          type='button'
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          className={`${styles.pause} inline-flex min-h-11 items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-[#200b38] ring-1 ring-[#200b38]/15 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]`}>
          <span aria-hidden='true'>{paused ? '▶' : '❚❚'}</span>
          {paused ? 'Play reviews' : 'Pause reviews'}
        </button>
      </div>

      <div className='mt-6 space-y-6'>
        {rows.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={styles.row}>
            <div
              className={`${styles.track} ${rowIndex === 1 ? styles.trackReverse : ''} flex w-max items-start gap-6`}>
              {/* The first copy is the real list. The second only fills the loop. */}
              {[0, 1].map((copy) => (
                <div
                  key={copy}
                  aria-hidden={copy === 1 ? true : undefined}
                  className={`${copy === 1 ? styles.copy : ''} flex shrink-0 items-start gap-6`}>
                  {row.map((review) => (
                    <WallCard
                      key={`${review.id}-${copy}`}
                      review={review}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
