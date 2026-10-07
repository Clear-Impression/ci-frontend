// Use the same FAQ data shape as our content source.
import type { FAQItem } from "@/types/faq";

// the list of faqs this block needs
type FAQAccordionProps = {
  items: FAQItem[];
};

// the list to be taken in for faqs. gives the info for showing the questions and answers
export default function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <div className="space-y-4">
      {/* one box for each faq. click to open or close */}
      {items.map((item) => (
        // use the id to keep track of which faq is which
        <details
          key={item.id}
          className="rounded-lg border border-gray-200 p-5"
        >
          {/* the question. click here to see the answer */}
          <summary className="cursor-pointer font-semibold">
            {item.question}
          </summary>
          {/* the answer. keep the line breaks from the original text */}
          <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
