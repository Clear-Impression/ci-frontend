'use client';

import { useEffect, useRef, useState } from 'react';
import type { Review } from '@/data/reviews';
import ReviewPanel from '@/components/reviews/ReviewPanel';
import styles from '@/app/reviews/reviews.module.css';

type ReviewGridProps = {
  reviews: readonly Review[];
  googleUrl: string;
};

// Every review as a card. Cards tip up into place in 3D as you scroll to
// them, lean gently toward the mouse, and open the full review in a large
// panel when clicked.
export default function ReviewGrid({ reviews, googleUrl }: ReviewGridProps) {
  const gridRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<Review | null>(null);

  // Mark each card once it scrolls into view, so it can rise in.
  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll<HTMLElement>('[data-card]');
    if (!cards) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-in', '');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  // Lean the card a little toward the mouse.
  function tilt(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType !== 'mouse') return;
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    card.style.setProperty('--rx', `${-y * 6}deg`);
    card.style.setProperty('--ry', `${x * 8}deg`);
  }

  function untilt(event: React.PointerEvent<HTMLButtonElement>) {
    event.currentTarget.style.setProperty('--rx', '0deg');
    event.currentTarget.style.setProperty('--ry', '0deg');
  }

  return (
    <>
      <ul
        ref={gridRef}
        className={styles.grid}>
        {reviews.map((review, index) => (
          <li
            key={review.id}
            data-card
            className={styles.gridItem}
            style={{ '--n': index % 3 } as React.CSSProperties}>
            <button
              type='button'
              aria-haspopup='dialog'
              onClick={() => setOpen(review)}
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className={styles.gridCard}>
              <span className='flex items-center gap-3'>
                <span
                  aria-hidden='true'
                  className={styles.gridAvatar}>
                  {review.name.charAt(0)}
                </span>
                <span className='text-left'>
                  <span className='block font-extrabold text-[#200b38]'>{review.name}</span>
                  <span
                    aria-hidden='true'
                    className='block text-sm tracking-widest text-[#efb52b]'>
                    {'★'.repeat(review.rating)}
                  </span>
                  <span className='sr-only'>{review.rating} out of 5 stars.</span>
                </span>
              </span>
              <span className={styles.gridQuote}>“{review.quote}”</span>
              <span className={styles.gridMore}>
                Read full review
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
              </span>
            </button>
          </li>
        ))}
      </ul>
      <ReviewPanel
        review={open}
        fallbackUrl={googleUrl}
        onClose={() => setOpen(null)}
      />
    </>
  );
}
