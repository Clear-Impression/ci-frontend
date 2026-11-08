import { pageHeaders, type PageHeader } from '@/data/page-headers';
import { client } from '@/sanity/client';
import { PAGE_HEADER_QUERY } from '@/sanity/queries';

export async function getPageHeader(pageId: string): Promise<PageHeader> {
  const fallback = pageHeaders[pageId];
  if (!fallback) throw new Error(`Unknown page header: ${pageId}`);

  try {
    const header = await client.fetch<Partial<PageHeader> | null>(
      PAGE_HEADER_QUERY,
      { id: `pageHeader.${pageId}` },
      { next: { revalidate: 60 } },
    );
    return {
      title: typeof header?.title === 'string' && header.title.trim()
        ? header.title : fallback.title,
      subtitle: header
        ? (typeof header.subtitle === 'string' ? header.subtitle : '')
        : fallback.subtitle,
    };
  } catch (error) {
    console.error('Unable to load page header.', error);
    return { title: fallback.title, subtitle: fallback.subtitle };
  }
}
