import { client } from '@/sanity/client';
import { JOB_OPENING_QUERY, JOB_OPENINGS_QUERY } from '@/sanity/queries';
import type { JobOpening } from '@/data/careers';

// Open roles from Sanity, in display order. There is no local fallback, so a
// role deleted or paused in Studio never comes back. If Sanity can't be
// reached, the page shows "No open roles right now" instead.
export async function getJobOpenings(): Promise<JobOpening[]> {
  try {
    return await client.fetch<JobOpening[]>(JOB_OPENINGS_QUERY, {}, { next: { revalidate: 60 } });
  } catch (error) {
    console.error('Unable to load job openings.', error);
    return [];
  }
}

// Null when the role doesn't exist, is paused, or Sanity can't be reached.
export async function getJobOpening(slug: string): Promise<JobOpening | null> {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  try {
    return await client.fetch<JobOpening | null>(
      JOB_OPENING_QUERY,
      { slug },
      { next: { revalidate: 60 } },
    );
  } catch (error) {
    console.error('Unable to load job opening.', error);
    return null;
  }
}
