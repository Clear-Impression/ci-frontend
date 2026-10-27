import Link from 'next/link';
import Reveal from '@/components/services/Reveal';
import ReviewWall from '@/components/reviews/ReviewWall';
import type { Review } from '@/data/reviews';

type HomeReviewsProps = {
  reviews: readonly Review[];
  score: number;
  count: number;
};

// Use the existing review wall and its pause control.
export default function HomeReviews({ reviews, score, count }: HomeReviewsProps) {
  return (
    <section
      aria-labelledby='home-reviews-heading'
      className='bg-[#f7f4fb] py-20 sm:py-24'>
      <div className='mx-auto flex max-w-7xl flex-wrap items-end justify-between gap-6 px-6 sm:px-8'>
        <Reveal className='max-w-3xl'>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
            Straight from Google
          </p>
          <h2
            id='home-reviews-heading'
            className='mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl'>
            <span className='line-mask'>
              <span className='line-rise'>
                {score.toFixed(1)} stars from {count} Google reviews, and
                counting.
              </span>
            </span>
          </h2>
        </Reveal>
        <Link
          href='/reviews'
          className='draw-link rounded-sm py-1 font-semibold text-[#6c3fb8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
          Read all reviews
        </Link>
      </div>
      <div className='mt-10'>
        <ReviewWall reviews={reviews} />
      </div>
    </section>
  );
}
