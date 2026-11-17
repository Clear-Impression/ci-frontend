import type { MetadataRoute } from 'next';
import { company } from '@/data/company';
import { getBlogs } from '@/lib/blog';
import { getLocations } from '@/lib/locations';
import { getServices } from '@/lib/services';

const publicPaths = [
  '/',
  '/about',
  '/blog',
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
  const [{ cities }, services, blogs] = await Promise.all([
    getLocations(),
    getServices(),
    getBlogs(),
  ]);
  const paths = new Set([
    ...publicPaths,
    ...cities.map((city) => city.href),
    ...services.filter((service) => service.slug).map((service) => '/services/' + service.slug),
  ]);

  const entries: MetadataRoute.Sitemap = Array.from(paths, (path) => ({
    url: new URL(path, company.website).href,
  }));

  return [
    ...entries,
    ...blogs.map((blog) => ({
      url: new URL(`/blog/${blog.slug}`, company.website).href,
      lastModified: new Date(`${blog.date}T00:00:00Z`),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ];
}
