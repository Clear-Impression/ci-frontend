// faq block
import FAQAccordion from "./faqAccordion";
// Read FAQ content from Sanity.
import { client } from "@/sanity/client";
import { FAQ_QUERY } from "@/sanity/queries";
import type { FAQItem } from "@/types/faq";

// main faq page. use already made hader and footer
export default async function FAQPage() {
  // Fetch published FAQs with a 30-second cache revalidation interval.
  const faqItems = await client.fetch<FAQItem[]>(
    FAQ_QUERY,
    {},
    { cache: "no-store" }
  );
  return (
    <main className="flex-1 px-6 py-16">
      {/* title */}
      <h1 className="text-3xl font-semibold">
        Frequently Asked Questions
      </h1>

      {/* title spacing */}
      <div className="mt-8">
        {/* Pass the FAQ data into the reusable accordion. */}
        <FAQAccordion items={faqItems} />
      </div>
    </main>
  );
}
