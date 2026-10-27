import ReviewCard from "@/components/ui/ReviewCard";
import { reviews, googleReviewsUrl } from "@/data/reviews";

import FAQAccordion from "@/app/faq/faqAccordion";
import { reviewFaqs } from "@/data/reviewFaqs";

export default function ReviewsPage() {
  return (
    // same header and footer
    <main className="flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold">
        Customer Reviews
      </h1>

      <p className="mt-4 max-w-2xl text-gray-600 leading-7">
        See what our customers say about their experiences with us.
      </p>

      {/* one column for mobile, two for wider screens */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {reviews.map((review) => (
            <ReviewCard key={review.id} {...review} />
        ))}
      </div>

      {/* link to the rest of the google reviews */}
      <a href={googleReviewsUrl} className="mt-8 inline-flex rounded-lg border border-[#200b38]/20 px-5 py-3 font-semibold text-[#200b38] hover:bg-[#f5f0fb] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]">
        Read reviews on Google
      </a>

      {/* faq for reviews and transparency */}
      <section aria-labelledby="review-faq-heading" className="mt-16">
        <h2 id="review-faq-heading" className="text-2xl font-semibold">
          Review FAQs
      </h2>

      <div className="mt-8">
        <FAQAccordion items={reviewFaqs} />
      </div>
      </section>
    </main>
  );
}