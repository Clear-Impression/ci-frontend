import FAQAccordion from "./faqAccordion";
import QuoteActions from "@/components/ui/QuoteActions";
import { aboutClosing } from "@/data/about";
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

      {/* End with the same call to action as the other pages. */}
      <section className="mt-16 rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12">
        <h2 className="text-2xl font-semibold sm:text-3xl">
          {aboutClosing.heading}
        </h2>
        <p className="mt-4 max-w-2xl text-white/80">{aboutClosing.text}</p>
        <QuoteActions />
      </section>
    </main>
  );
}
