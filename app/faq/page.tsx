import FAQAccordion from "./faqAccordion";
import { getFAQs } from "@/lib/api";
import type { FAQItem } from "@/types/faq";

export default async function FAQPage() {
  let faqItems: FAQItem[] = [];
  let unavailable = false;

  try {
    faqItems = await getFAQs();
  } catch {
    unavailable = true;
  }

  return (
    <main className="flex-1 px-6 py-16">
      {/* title */}
      <h1 className="text-3xl font-semibold">
        Frequently Asked Questions
      </h1>

      {/* title spacing */}
      <div className="mt-8">
        {unavailable ? (
          <p role="status" className="text-gray-600">
            FAQs are temporarily unavailable. Please try again shortly.
          </p>
        ) : faqItems.length === 0 ? (
          <p className="text-gray-600">There are no published FAQs yet.</p>
        ) : (
          <FAQAccordion items={faqItems} />
        )}
      </div>
    </main>
  );
}
