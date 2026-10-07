// faq block
import FAQAccordion from "./faqAccordion";
// faq from local site
import { faqItems } from "@/data/faq";

// main faq page. use already made hader and footer
export default function FAQPage() {
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
