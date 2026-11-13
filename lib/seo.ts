import type { Metadata } from 'next';
import { company } from '@/data/company';

const socialImage = {
  url: '/images/home/window-cleaning.webp',
  alt: 'Window cleaning for an Arizona home',
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
