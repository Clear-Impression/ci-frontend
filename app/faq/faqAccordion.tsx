
// Use the same FAQ data shape as our content source.
import type { FAQItem } from "@/types/faq";

// the list of faqs this block needs
type FAQAccordionProps = {
  items: FAQItem[];
  // the faq to show open, when the site search links to it
  openId?: string;
};

// the list to be taken in for faqs. gives the info for showing the questions and answers
export default function FAQAccordion({ items, openId }: FAQAccordionProps) {
  return (
    <div className="space-y-3">
      {/* one box for each faq. click to open or close */}
      {items.map((item) => (
        // use the id to keep track of which faq is which
        <details
          key={item.id}
          id={`faq-${item.id}`}
          open={item.id === openId}
          className="group rounded-xl border border-[#200b38]/10 bg-white open:border-[#6c3fb8]/30 open:shadow-sm"
        >
          {/* the question. click here to see the answer. same dropdown style as the homepage */}
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-5 py-4 font-semibold text-[#200b38] hover:bg-[#f7f4fb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 shrink-0 text-[#6c3fb8] motion-safe:transition-transform group-open:rotate-180"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="px-5 pb-5">
            {/* bullet box only when the faq response has bullets */}
            {item.bullets && item.bullets.length > 0 && (
              <div className="mt-1 rounded-xl border-l-4 border-[#6c3fb8] bg-[#f7f4fb] p-5">
                <ul className="list-disc space-y-2 pl-5 text-gray-700 marker:text-[#6c3fb8]">
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
          </div>
        </details>
      ))}
    </div>
  );
}
