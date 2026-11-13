import type { MetadataRoute } from 'next';
import { company } from '@/data/company';
import { getLocations } from '@/lib/locations';
import { getServices } from '@/lib/services';

// Add the blog when it has published articles.
const publicPaths = [
  '/',
  '/about',
  '/estimate',
  '/faq',
  '/feedback',
  '/locations',
  '/quote',
  '/reviews',
  '/services',
  '/terms-and-conditions',
];

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [{ cities }, services] = await Promise.all([getLocations(), getServices()]);
  const paths = new Set([
    ...publicPaths,
    ...cities.map((city) => city.href),
    ...services.filter((service) => service.slug).map((service) => '/services/' + service.slug),
  ]);

  return Array.from(paths, (path) => ({ url: new URL(path, company.website).href }));
}
