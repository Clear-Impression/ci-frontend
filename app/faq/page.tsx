import PageGuide from "@/components/layout/PageGuide";
import { createPageMetadata } from "@/lib/seo";
import FAQBrowser from "./FAQBrowser";
import styles from "./faq.module.css";
import motion from "../feedback/feedback.module.css";
import ClearerViewCta from "@/components/ui/ClearerViewCta";
import { getFAQs } from "@/lib/api";
import type { FAQItem } from "@/types/faq";
import { getPageHeader } from "@/lib/page-headers";

const title = "FAQ | Clear Impression";
const description =
  "Answers to common questions about Clear Impression's window cleaning, scheduling, and service across the Phoenix metro area.";

export const metadata = createPageMetadata({
  path: '/faq',
  title,
  description,
});

type FAQPageProps = {
  searchParams: Promise<{ open?: string | string[] }>;
};

export default async function FAQPage({ searchParams }: FAQPageProps) {
  // the site search links here with ?open= so that answer shows right away
  const { open } = await searchParams;
  const header = await getPageHeader('faq');
  let faqItems: FAQItem[] = [];
  let unavailable = false;

  try {
    faqItems = await getFAQs();
  } catch {
    unavailable = true;
  }

  return (
    <main className="flex-1 bg-white text-[#200b38]">
      {/* The "On this page" menu on the left. */}
      <PageGuide
        label='FAQ page sections'
        groups={[
          {
            title: 'Questions',
            items: [
              { id: 'overview', label: 'Overview' },
              { id: 'questions', label: 'Common questions' },
            ],
          },
          { title: 'Next step', items: [{ id: 'get-started', label: 'Get a quote' }] },
        ]}
      />
      <section
        id="overview"
        aria-labelledby="faq-heading"
        className="page-hero relative isolate overflow-hidden bg-[#200b38] text-white"
      >
        {/* Use the same glow and entrance timing as the Feedback page. */}
        <div aria-hidden="true" className={`${motion.glow} pointer-events-none absolute -z-10`} />
        <div className={`${styles.guideGutter} mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12`}>
          <h1
            id="faq-heading"
            className={`${motion.enter} max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl`}
            style={{ "--delay": "90ms" } as React.CSSProperties}
          >
            {header.title}
          </h1>
          <p
            className={`${motion.enter} mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg`}
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            {header.subtitle}
          </p>
        </div>
      </section>

      <section id="questions" className="scroll-mt-10 bg-[#faf8fd]">
        <div
          className={`${styles.guideGutter} ${motion.rise} mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16`}
          style={{ "--delay": "300ms" } as React.CSSProperties}
        >
          {unavailable ? (
            <p role="status" className="rounded-xl bg-white p-5 text-gray-600 ring-1 ring-[#200b38]/10">
              FAQs are temporarily unavailable. Please try again shortly.
            </p>
          ) : faqItems.length === 0 ? (
            <p className="rounded-xl bg-white p-5 text-gray-600 ring-1 ring-[#200b38]/10">
              There are no published FAQs yet.
            </p>
          ) : (
            <FAQBrowser
              key={typeof open === "string" ? open : undefined}
              items={faqItems}
              openId={typeof open === "string" ? open : undefined}
            />
          )}
        </div>
      </section>

      {/* End with the same wipe-the-window call to action as the other pages. */}
      <section id="get-started" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <ClearerViewCta />
      </section>
    </main>
  );
}
