// Before-and-after photos for the homepage "Drag the handle" section.
//
// Real Clear Impression jobs, photographed by Niels. Each pair was lined up so
// the same spot sits in the same place on both sides of the slider.
//
// To add a pair:
//   1. Put it in public/images/results/, e.g. storefront-before.webp and
//      storefront-after.webp (same size and framing for both).
//   2. Add an entry below with a short title and caption.
//
// `simulated: true` adds a fake layer of dust to the "before" side. It's only
// for trying the slider with a single photo; real pairs don't need it.

export type BeforeAfterPair = {
  title: string;
  caption: string;
  before: string;
  after: string;
  alt: string;
  // Which part of the photo to keep in frame, as CSS object-position.
  focus?: string;
  simulated?: boolean;
};

export const beforeAfter = {
  eyebrow: 'See the difference',
  title: ['Drag the handle.', 'Same glass, same day.'],
  intro:
    'Move across each photo to compare it before we start and after we pack up.',
  pairs: [
    {
      title: 'Sunroom glass, cleared.',
      caption: 'Spots and haze off the sunroom glass, so you can see straight into the room again.',
      before: '/images/results/sunroom-before.webp',
      after: '/images/results/sunroom-after.webp',
      alt: 'Sunroom window looking into a living room',
    },
    {
      title: 'Concrete, power washed.',
      caption: 'The pad around a sidewalk sewer cover, washed back to clean concrete.',
      before: '/images/results/concrete-before.webp',
      after: '/images/results/concrete-after.webp',
      alt: 'Concrete pad around a sewer cover on a sidewalk',
    },
  ] satisfies BeforeAfterPair[],
};
