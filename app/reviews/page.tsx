import type { Metadata } from 'next';
import { aboutClosing } from '@/data/about';
import { company } from '@/data/company';
import RatingSummary from '@/components/reviews/RatingSummary';
import ReviewWall from '@/components/reviews/ReviewWall';
import { googleRating, googleReviews, googleReviewsUrl } from '@/data/reviews';
import styles from './reviews.module.css';

// Give the Reviews page its own title and search description.
export const metadata: Metadata = {
  title: 'Reviews | Clear Impression Services',
  description:
    'Rated 5.0 on Google. Read what homeowners and businesses across Mesa and the Phoenix metro say about Clear Impression window cleaning.',
};

// Where the small gold sparkles sit in the header, and when each one twinkles.
const sparkles = [
  { x: '56%', y: '22%', size: 22, delay: 0 },
  { x: '70%', y: '60%', size: 16, delay: 1.1 },
  { x: '83%', y: '28%', size: 30, delay: 2.3 },
  { x: '64%', y: '80%', size: 12, delay: 0.6 },
  { x: '91%', y: '66%', size: 20, delay: 1.8 },
  { x: '77%', y: '10%', size: 14, delay: 2.9 },
  { x: '48%', y: '62%', size: 11, delay: 3.4 },
];

export default function ReviewsPage() {
  return (
    // The shared layout already supplies the website's header and footer.
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* Same header height as the other pages, with a few twinkling stars. */}
      <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div aria-hidden='true' className='absolute inset-0 -z-10'>
          {sparkles.map((sparkle) => (
            <span
              key={`${sparkle.x}-${sparkle.y}`}
              className={styles.sparkle}
              style={
                {
                  left: sparkle.x,
                  top: sparkle.y,
                  width: sparkle.size,
                  height: sparkle.size,
                  animationDelay: `${sparkle.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
        <div className='mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <p className={`${styles.lift} text-sm font-semibold uppercase tracking-widest text-[#efb52b]`}>
            Google reviews
          </p>
          <h1
            className={`${styles.lift} mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl`}
            style={{ animationDelay: '120ms' }}>
            Customer Reviews
          </h1>
          <p
            className={`${styles.lift} mt-6 max-w-2xl text-lg text-white/80`}
            style={{ animationDelay: '240ms' }}>
            See what our customers say about their experiences with us.
          </p>
        </div>
      </section>

      {/* The overall rating, counting up as it comes into view. */}
      <section className='relative z-10 mx-auto -mt-10 max-w-7xl px-6 sm:px-8'>
        <RatingSummary
          score={googleRating.score}
          count={googleRating.count}
          sourceUrl={googleReviewsUrl}
        />
      </section>

      {/* Real Google reviews drifting past in two rows. */}
      <section
        aria-labelledby='wall-heading'
        className='mt-16 bg-[#f7f4fb] py-16 sm:mt-20 sm:py-20'>
        <div className='mx-auto max-w-7xl px-6 sm:px-8'>
          <h2
            id='wall-heading'
            className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            What customers are saying
          </h2>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-gray-600'>
            Real reviews from our Google Business Profile. Hover over a review
            to stop and read it.
          </p>
        </div>
        <div className='mt-10'>
          <ReviewWall reviews={googleReviews} />
        </div>
      </section>

      {/* End with the same call to action as the other pages. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <div className='rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {aboutClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{aboutClosing.text}</p>
          <a
            href={company.phoneHref}
            className='mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
            Call {company.phone} for a quote
          </a>
        </div>
      </section>
    </main>
  );
}
