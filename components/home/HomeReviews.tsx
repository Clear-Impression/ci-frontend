'use client';

import Link from 'next/link';
import { useEffect, useState, type CSSProperties } from 'react';
import HxIcon from '@/components/home/HxIcon';
import { googleReviewsUrl, type Review } from '@/data/reviews';

type HomeReviewsProps = {
  reviews: readonly Review[];
  score: number;
  count: number;
};

// Real Google reviews, three at a time (one on phones), with arrows and dots.
export default function HomeReviews({ reviews, score, count }: HomeReviewsProps) {
  const [perPage, setPerPage] = useState(3);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 760px)');
    const update = () => setPerPage(narrow.matches ? 1 : 3);
    update();
    narrow.addEventListener('change', update);
    return () => narrow.removeEventListener('change', update);
  }, []);

  const pages = Math.max(1, Math.ceil(reviews.length / perPage));
  const current = Math.min(page, pages - 1);
  const shown = reviews.slice(current * perPage, current * perPage + perPage);
  const go = (next: number) => setPage((next + pages) % pages);

  return (
    <section
      aria-labelledby='home-reviews-heading'
      className='hx-section hx-reviews'>
      <div className='hx-container'>
        <div className='hx-reviews-head'>
          <div>
            <p className='hx-eyebrow hx-reveal'>From our customers</p>
            <h2
              id='home-reviews-heading'
              className='hx-h2'>
              <span className='line-mask'>
                <span className='line-rise'>The clearest proof</span>
              </span>{' '}
              <span className='line-mask'>
                <span
                  className='line-rise'
                  style={{ '--i': 1 } as CSSProperties}>
                  is a happy client.
                </span>
              </span>
            </h2>
          </div>
          <div className='hx-reveal flex flex-col items-start gap-4 lg:items-end'>
            <a
              href={googleReviewsUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='hx-rating'>
              <span
                aria-hidden='true'
                className='hx-google-g'>
                G
              </span>
              <span className='hx-rating-text'>
                <span
                  aria-hidden='true'
                  className='hx-stars'>
                  ★★★★★
                </span>
                <strong>{score.toFixed(1)} on Google</strong>
                <small>Based on {count} Google reviews</small>
              </span>
              <span className='sr-only'> (opens in a new tab)</span>
            </a>
            <Link
              href='/reviews'
              className='hx-link'>
              Read all reviews <HxIcon name='arrow' />
            </Link>
          </div>
        </div>

        <ul
          aria-live='polite'
          className='hx-review-grid'>
          {shown.map((review, index) => (
            <li
              key={`${current}-${review.id}`}
              className='hx-review-card'
              style={{ '--i': index } as CSSProperties}>
              <span
                className='hx-stars'
                aria-label={`${review.rating} out of 5 stars`}>
                {'★'.repeat(review.rating)}
              </span>
              <blockquote>“{review.quote}”</blockquote>
              <div className='hx-reviewer'>
                <span aria-hidden='true'>{review.name.charAt(0)}</span>
                <div>
                  <strong>{review.name}</strong>
                  <small>Google review</small>
                </div>
                <i aria-hidden='true'>G</i>
              </div>
            </li>
          ))}
        </ul>

        {pages > 1 && (
          <div className='hx-review-controls'>
            <button
              type='button'
              onClick={() => go(current - 1)}
              aria-label='Previous reviews'>
              <HxIcon name='chevronLeft' />
            </button>
            <div className='hx-dots'>
              {Array.from({ length: pages }, (_, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={() => go(index)}
                  aria-label={`Show reviews page ${index + 1} of ${pages}`}
                  aria-current={index === current}>
                  <i />
                </button>
              ))}
            </div>
            <button
              type='button'
              onClick={() => go(current + 1)}
              aria-label='Next reviews'>
              <HxIcon name='chevronRight' />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
