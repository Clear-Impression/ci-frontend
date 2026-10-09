// import faq data type.
import type { FAQItem } from "@/types/faq";

// export list for raq page (list of faq's)
// later builder.io can grab this content
export const faqItems: FAQItem[] = [
  {
    // Give each faq a unique id
    id: "professional-window-cleaning",

    // text when faq is closed
    question: "will my window cleaning profession",

    // text when it is open
    answer: "yes",

    bullets: [
        "First bullet",
        "Second bullet",
        "Third bullet"
    ],
  },
  {
    // second faq
    id: "second-test-question",

    // temporary stuff
    question: "Can I open this second question?",
    answer: "Yes. Each question opens and closes independently.",
  },
];
