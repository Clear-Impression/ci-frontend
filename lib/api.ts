import type { FAQItem } from "@/types/faq";

// Used by the FAQ server component. This URL does not need to be public.
export async function getFAQs(): Promise<FAQItem[]> {
  const baseUrl = process.env.API_BASE_URL || "http://127.0.0.1:8000";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/api/v1/faqs`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error("FAQs are temporarily unavailable.");
  }

  return response.json() as Promise<FAQItem[]>;
}
