import { NextResponse } from 'next/server';
import { getFAQs } from '@/lib/api';
import type { SearchEntry } from '@/lib/search';

// FAQ questions for the header search. Search asks for these the first time
// it opens, so the backend is only called when someone actually searches.
export async function GET() {
  try {
    const faqs = await getFAQs();
    const entries: SearchEntry[] = faqs.map((faq) => ({
      type: 'faq',
      title: faq.question,
      // Opens the FAQ page with this answer already showing.
      href: `/faq?open=${encodeURIComponent(faq.id)}#faq-${encodeURIComponent(faq.id)}`,
      description: [faq.answer, ...(faq.bullets ?? [])].join(' '),
      short: faq.answer,
      keywords: [],
    }));
    return NextResponse.json(entries, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch {
    // Search still works without the FAQs while the backend is down.
    return NextResponse.json([], {
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
