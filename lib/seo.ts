import type { Metadata } from 'next';
import { company } from '@/data/company';

// The picture shown when someone shares a link to the site (texts, social
// posts). 1200 by 630 is the size most apps expect.
const socialImage = {
  url: '/images/social/link-preview.jpg',
  width: 1200,
  height: 630,
  alt: 'Clear Impression Window Cleaning: window cleaning in Phoenix Metro. Call or text (480) 622-0622.',
};

type PageMetadata = {
  path: string;
  title: string;
  description: string;
};

export function createPageMetadata({ path, title, description }: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: company.name,
      locale: 'en_US',
      url: path,
      title,
      description,
      images: [socialImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [socialImage],
    },
  };
}
