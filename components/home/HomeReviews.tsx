import ReviewCard from '@/components/ui/ReviewCard';
import type { Review } from '@/data/reviews';

type HomeReviewsProps = {
  reviews: readonly Review[];
  sourceUrl: string;
};

export default function HomeReviews({ reviews, sourceUrl }: HomeReviewsProps) {
  return (
    <section
      aria-labelledby='home-reviews-heading'
      className='bg-white'>
      <div className='mx-auto max-w-7xl px-6 pb-14 sm:px-8 sm:pb-16'>
        <div className='mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h2
              id='home-reviews-heading'
              className='text-2xl font-semibold tracking-tight text-[#200b38]'>
              Hear from our customers
            </h2>
            <p className='mt-3 max-w-xl text-sm leading-7 text-[#686170]'>
              Excerpts from Google reviews.
            </p>
          </div>
          {/* Let visitors read the full reviews at their source. */}
          <a
            href={sourceUrl}
            className='inline-flex min-h-12 shrink-0 items-center justify-center rounded-lg border border-[#200b38]/20 px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f5f0fb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
            Read reviews on Google{' '}
            <span
              aria-hidden='true'
              className='ml-2'>
              ↗
            </span>
          </a>
        </div>
        {/* Keep the review content in data so other pages can use these cards too. */}
        <div className='grid gap-6 md:grid-cols-3'>
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              {...review}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
