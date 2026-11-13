import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import RatingSummary from '@/components/reviews/RatingSummary';
import ReviewGrid from '@/components/reviews/ReviewGrid';
import { googleRating, googleReviews, googleReviewsUrl, googleWriteReviewUrl } from '@/data/reviews';
import ReviewsHero from '@/components/reviews/ReviewsHero';
import { manrope } from '@/app/fonts';
import styles from './reviews.module.css';
import ClearerViewCta from '@/components/ui/ClearerViewCta';

// Give the Reviews page its own title and search description.
export const metadata = createPageMetadata({
  path: '/reviews',
  title: 'Reviews | Clear Impression Services',
  description:
    'Rated 5.0 on Google. Read what homeowners and businesses across Mesa and the Phoenix metro say about Clear Impression window cleaning.',
});

// The three shortest reviews fit best in the stack at the top of the page.
const featured = [...googleReviews].sort((a, b) => a.quote.length - b.quote.length).slice(0, 3);

export default async function ReviewsPage() {
  const header = await getPageHeader('reviews');
  return (
    // The shared layout already supplies the website's header and footer.
    <main className={`${manrope.variable} flex-1 bg-white text-[#200b38]`}>
      {/* Big words on the left, a fanned stack of real reviews on the right. */}
      <ReviewsHero
        title={header.title}
        subtitle={header.subtitle}
        featured={featured}
        googleUrl={googleReviewsUrl}
        writeReviewUrl={googleWriteReviewUrl}
      />

      {/* The overall rating, counting up as it comes into view. */}
      <section className='relative z-10 mx-auto -mt-10 max-w-7xl px-6 sm:px-8'>
        <RatingSummary
          score={googleRating.score}
          count={googleRating.count}
          sourceUrl={googleReviewsUrl}
        />
      </section>

      {/* Every review as a card. Click one to read it in full. */}
      <section
        aria-labelledby='wall-heading'
        className='mt-16 bg-[#f7f4fb] py-16 sm:mt-20 sm:py-24'>
        <div className='mx-auto max-w-7xl px-6 sm:px-8'>
          <h2
            id='wall-heading'
            className={`${styles.wallTitle} text-3xl sm:text-5xl`}>
            What customers are <mark>saying</mark>
          </h2>
          <p className='mt-4 max-w-2xl text-lg leading-relaxed text-gray-600'>
            Real reviews from our Google Business Profile. Click any review to
            read it in full.
          </p>
          <ReviewGrid
            reviews={googleReviews}
            googleUrl={googleReviewsUrl}
          />
        </div>
      </section>

      {/* End with the same wipe-the-window call to action as the other pages. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <ClearerViewCta />
      </section>
    </main>
  );
}
