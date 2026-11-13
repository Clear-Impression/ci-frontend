import { createPageMetadata } from "@/lib/seo";
import FAQAccordion from "./faqAccordion";
import styles from "./faq.module.css";
import ClearerViewCta from "@/components/ui/ClearerViewCta";
import { getFAQs } from "@/lib/api";
import type { FAQItem } from "@/types/faq";
import { getPageHeader } from "@/lib/page-headers";

const title = "FAQ | Clear Impression Services";
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
      {/* same header band as the other pages */}
      <section className="relative isolate overflow-hidden bg-[#200b38] text-white">
        {/* a soft glow that drifts slowly behind the title */}
        <div aria-hidden="true" className={`${styles.glow} absolute -z-10`} />
        <div className="mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12">
          <p className={`${styles.enter} text-sm font-semibold uppercase tracking-widest text-[#efb52b]`}>
            FAQ
          </p>
          <h1
            className={`${styles.enter} mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl`}
            style={{ "--delay": "90ms" } as React.CSSProperties}
          >
            {header.title}
          </h1>
          <p
            className={`${styles.enter} mt-6 max-w-2xl text-lg text-white/80`}
            style={{ "--delay": "180ms" } as React.CSSProperties}
          >
            {header.subtitle}
          </p>
        </div>
      </section>

      <section className="bg-[#f7f4fb]">
        {/* the questions */}
        <div
          className={`${styles.enter} mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20`}
          style={{ "--delay": "250ms" } as React.CSSProperties}
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
            <FAQAccordion
              items={faqItems}
              openId={typeof open === "string" ? open : undefined}
            />
          )}
        </div>
      </section>

      {/* End with the same wipe-the-window call to action as the other pages. */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20">
        <ClearerViewCta />
      </section>
    </main>
  );
}
