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
          {/* bullet box only when the faq response has bullets */}
          {item.bullets && item.bullets.length > 0 && (
            <div className="mt-4 rounded-xl border-l-4 border-blue-600 bg-blue-50 p-5">
              <ul className="list-disc space-y-2 pl-5 text-gray-700">
                {item.bullets.map((bullet, index) => (
                  <li key={`${item.id}-bullet-${index}`}>{bullet}</li>
                ))}
              </ul>
            </div>
          )}
          {/* the answer. keep the line breaks from the original text */}
          <p className="mt-3 whitespace-pre-line leading-7 text-gray-600">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
