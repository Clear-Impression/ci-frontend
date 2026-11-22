import PageGuide from '@/components/layout/PageGuide';
import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import RatingSummary from '@/components/reviews/RatingSummary';
import ReviewThemes from '@/components/reviews/ReviewThemes';
import { googleRating, googleReviews, googleReviewsUrl, googleWriteReviewUrl } from '@/data/reviews';
import ReviewsHero from '@/components/reviews/ReviewsHero';
import ClearerViewCta from '@/components/ui/ClearerViewCta';
import { jakarta } from '../fonts';

// Give the Reviews page its own title and search description.
export const metadata = createPageMetadata({
  path: '/reviews',
  title: 'Reviews | Clear Impression',
  description:
    'Rated 5.0 on Google. Read what homeowners and businesses across Mesa and the Phoenix metro say about Clear Impression window cleaning.',
});

export default async function ReviewsPage() {
  const header = await getPageHeader('reviews');
  return (
    // The shared layout already supplies the website's header and footer.
    <main className={`${jakarta.variable} reviews-page flex-1 bg-white text-[#200b38]`}>
      {/* The "On this page" menu on the left. */}
      <PageGuide
        label='Reviews page sections'
        groups={[
          {
            title: 'Reviews',
            items: [
              { id: 'overview', label: 'Customer reviews' },
              { id: 'rating', label: 'Our rating' },
              { id: 'themes', label: 'What people mention' },
            ],
          },
          { title: 'Next step', items: [{ id: 'get-started', label: 'Get a quote' }] },
        ]}
      />
      {/* Big words on the left, a spinning rolodex of real reviews on the right. */}
      <div id='overview'>
        <ReviewsHero
          title={header.title}
          subtitle={header.subtitle}
          reviews={googleReviews}
          googleUrl={googleReviewsUrl}
        />
      </div>

      {/* The overall rating, counting up as it flips into view. */}
      <section
        id='rating'
        className='relative z-10 mx-auto -mt-10 max-w-7xl px-6 sm:px-8'>
        <RatingSummary
          score={googleRating.score}
          count={googleRating.count}
          sourceUrl={googleReviewsUrl}
          writeReviewUrl={googleWriteReviewUrl}
          reviewers={googleReviews.map((review) => review.name)}
        />
      </section>

      {/* What customers mention most, and a nudge to leave a review. The
          reviews themselves live on the rolodex at the top. */}
      <section
        id='themes'
        aria-labelledby='themes-heading'
        className='mt-16 bg-[#f7f4fb] py-16 sm:mt-20 sm:py-24'>
        <div className='mx-auto max-w-7xl px-6 sm:px-8'>
          <ReviewThemes
            reviews={googleReviews}
            writeReviewUrl={googleWriteReviewUrl}
          />
        </div>
      </section>

      {/* End with the same wipe-the-window call to action as the other pages. */}
      <section
        id='get-started'
        className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <ClearerViewCta />
      </section>
    </main>
  );
}
