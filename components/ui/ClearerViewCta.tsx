'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import QuoteButton from '@/components/quote/QuoteButton';
import { company } from '@/data/company';
import { clearerViewCta } from '@/data/about';
import { googleRating, googleReviews } from '@/data/reviews';
import { servingSince } from '@/data/home';
import './clearer-view.css';

const photo = {
  src: '/images/services/commercial.jpg',
  alt: 'A window cleaner washing the glass front of an office building with a water-fed pole.',
};

// The shorter real reviews fit the little card in the corner.
const shortReviews = googleReviews.filter((review) => review.quote.length <= 110);

// The closing "Let's make your windows shine." block: a full photo of our
// cleaner at work, with a frosted glass card on the right holding the words,
// the quote button and the Google rating. A short real review floats in the
// corner and changes every few seconds.
export default function ClearerViewCta() {
  const [reviewIndex, setReviewIndex] = useState(0);
  const review = shortReviews[reviewIndex % Math.max(1, shortReviews.length)];

  // A new review every few seconds, unless motion is turned down.
  useEffect(() => {
    if (shortReviews.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => setReviewIndex((value) => value + 1), 6500);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section
      aria-labelledby='clearer-view-heading'
      className='cv'>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes='(min-width: 1280px) 1200px, 100vw'
        className='cv-photo'
      />
      <span
        aria-hidden='true'
        className='cv-shade'
      />

      <div className='cv-glass'>
        <p className='cv-eyebrow'>{clearerViewCta.eyebrow}</p>
        <h2
          id='clearer-view-heading'
          className='cv-title'>
          {clearerViewCta.headingLines.join(' ')} <em>{clearerViewCta.highlight}</em>
        </h2>
        <p className='cv-text'>{clearerViewCta.text}</p>

        <div className='cv-actions'>
          {/* Opens a popup explaining the instant estimate and the detailed quote. */}
          <QuoteButton className='cv-quote'>
            Get a free quote
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />
            </svg>
          </QuoteButton>
          <a
            href={company.phoneHref}
            className='cv-call'>
            Call {company.phone}
          </a>
        </div>

        <dl className='cv-facts'>
          <div>
            <dt>Google rating</dt>
            <dd>
              {googleRating.score.toFixed(1)} <span aria-hidden='true'>★</span>
            </dd>
          </div>
          <div>
            <dt>Reviews</dt>
            <dd>{googleRating.count}</dd>
          </div>
          <div>
            <dt>Serving since</dt>
            <dd>{servingSince}</dd>
          </div>
        </dl>
      </div>

      {review && (
        <figure
          key={review.id}
          className='cv-review'>
          <span
            aria-hidden='true'
            className='cv-stars'>
            {'★'.repeat(review.rating)}
          </span>
          <blockquote>&ldquo;{review.quote}&rdquo;</blockquote>
          <figcaption>Google review</figcaption>
        </figure>
      )}
    </section>
  );
}
