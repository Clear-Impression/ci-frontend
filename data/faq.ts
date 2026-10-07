// Import the shared FAQ data type.
// "import type" is only used for checking types.
import type { FAQItem } from "@/types/faq";

// export list for raq page (list of faq's)
// Later, the page can get this same data shape from Builder.io.
export const faqItems: FAQItem[] = [
  {
    // Give each faq a unque table it
    id: "professional-window-cleaning",

    // text when faq is closed
    question: "will my window cleaning profession",

    // Text revealed when faq is opened
    answer: "yes",
  },
  {
    // Use a different ID for each FAQ in the list.
    id: "second-test-question",

    // Temporary content to check how multiple FAQs display.
    question: "Can I open this second question?",
    answer: "Yes. Each question opens and closes independently.",
  },
];
