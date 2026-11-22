import {
  fallbackJobs,
  fallbackPairs,
  type GalleryJob,
  type GalleryPair,
} from '@/data/gallery';

export type GalleryContent = {
  jobs: GalleryJob[];
  pairs: GalleryPair[];
};

// For now the jobs and before-and-after pairs come from data/gallery.ts.
// Loading them from Sanity is a separate change.
export async function getGallery(): Promise<GalleryContent> {
  return { jobs: fallbackJobs, pairs: fallbackPairs };
}
