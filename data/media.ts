// One place for every service photo and video.
//
// To add media for a service:
// 1. Put the file in public/media/services/ (webp for photos, mp4 for videos).
// 2. Add or update the entry below, using the service's slug as the key.
// 3. Write alt text that describes what the photo shows, not what it is for.
//
// Services without an entry show a branded placeholder until we have media.
// Stock media is fine for now, but note it in `credit` so we can swap it later.

export type ServiceMedia = {
  image?: { src: string; alt: string };
  // Short, silent clips work best. The image is used as the poster frame.
  video?: { src: string };
  // Where the media came from, such as 'Clear Impression' or a stock site.
  credit?: string;
};

// The current photos are placeholders until Niels sends real job photos.
const handSqueegee = {
  src: '/images/home/window-cleaning.webp',
  alt: 'A window cleaner squeegeeing a sliding window on a stucco home, with a saguaro reflected in the glass',
};
const pureWaterCart = {
  src: '/images/home/pure-water-cleaning.webp',
  alt: 'A window cleaner rinsing glass railings with a hose fed by a two-tank pure water filtration cart',
};

export const serviceMedia: Readonly<Record<string, ServiceMedia>> = {
  'window-washing-traditional-tools': { image: handSqueegee, credit: 'Placeholder' },
  'window-washing-100-percent-pure-water': { image: pureWaterCart, credit: 'Placeholder' },
  // Add more services here as photos and videos come in.
};

export function getServiceMedia(slug: string): ServiceMedia {
  return serviceMedia[slug] ?? {};
}
