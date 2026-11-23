import { cache } from 'react';
import {
  fallbackJobs,
  fallbackPairs,
  galleryJobTypes,
  type GalleryJob,
  type GalleryJobType,
  type GalleryPair,
} from '@/data/gallery';
import { toMedia, type MediaDocument } from '@/lib/locations';
import { client } from '@/sanity/client';
import { GALLERY_QUERY } from '@/sanity/queries';

type ImageDocument = {
  url?: string | null;
  hotspot?: { x?: number; y?: number } | null;
} | null;

type GalleryDocument = {
  jobs: {
    _id: string;
    title?: string | null;
    caption?: string | null;
    jobType?: string | null;
    size?: string | null;
    city?: string | null;
    service?: { title?: string | null; slug?: string | null } | null;
    media?: MediaDocument[] | null;
  }[];
  pairs: {
    title?: string | null;
    caption?: string | null;
    alt?: string | null;
    before?: ImageDocument;
    after?: ImageDocument;
  }[];
};

export type GalleryContent = {
  jobs: GalleryJob[];
  pairs: GalleryPair[];
};

const jobTypes = new Set<string>(galleryJobTypes.map(({ value }) => value));

// The CSS object-position for the point chosen in Studio.
function focusOf(image: ImageDocument) {
  const { x, y } = image?.hotspot ?? {};
  return typeof x === 'number' && typeof y === 'number' ? `${x * 100}% ${y * 100}%` : undefined;
}

// Skip a job that is missing what its tile needs: a title, a city, a known
// type, and a photo to show in the grid.
function toJob(job: GalleryDocument['jobs'][number]): GalleryJob[] {
  const media = (job.media ?? []).flatMap((item) => toMedia(item) ?? []);
  const { title, city, jobType } = job;
  if (!title?.trim() || !city?.trim() || !jobType || !jobTypes.has(jobType) || !media[0]?.photo) {
    return [];
  }

  return [{
    id: job._id,
    title,
    caption: job.caption?.trim() ?? '',
    city,
    service: job.service?.title && job.service.slug
      ? { title: job.service.title, href: `/services/${job.service.slug}` }
      : null,
    type: jobType as GalleryJobType,
    size: job.size === 'tall' || job.size === 'wide' ? job.size : 'normal',
    media,
  }];
}

function toPair(pair: GalleryDocument['pairs'][number]): GalleryPair[] {
  const { title, before, after } = pair;
  if (!title?.trim() || !before?.url || !after?.url) return [];

  return [{
    title,
    caption: pair.caption?.trim() ?? '',
    before: { url: before.url, focus: focusOf(before) },
    after: { url: after.url, focus: focusOf(after) },
    alt: pair.alt?.trim() ?? '',
  }];
}

// Keep the demo jobs and the homepage's pairs until real ones are added in Sanity.
export const getGallery = cache(async (): Promise<GalleryContent> => {
  try {
    const { jobs, pairs } = await client.fetch<GalleryDocument>(
      GALLERY_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    const liveJobs = jobs.flatMap(toJob);
    const livePairs = pairs.flatMap(toPair);

    return {
      jobs: liveJobs.length > 0 ? liveJobs : fallbackJobs,
      pairs: livePairs.length > 0 ? livePairs : fallbackPairs,
    };
  } catch (error) {
    console.error('Unable to load the gallery from Sanity.', error);
    return { jobs: fallbackJobs, pairs: fallbackPairs };
  }
});
