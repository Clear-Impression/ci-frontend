import { jobOpenings, type JobOpening } from '@/data/careers';

// The open roles, in the order they're listed in data/careers.ts.
export function getJobOpenings(): JobOpening[] {
  return jobOpenings;
}

// Null when the role doesn't exist, including one that has been removed.
export function getJobOpening(slug: string): JobOpening | null {
  return jobOpenings.find((opening) => opening.slug === slug) ?? null;
}
