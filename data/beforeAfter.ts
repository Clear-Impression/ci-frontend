// Before-and-after photos for the homepage "Drag the handle" section.
//
// DEMO PHOTOS ONLY: the pairs below are sample before/after photos found
// online, cropped into matching halves. They are not Clear Impression jobs,
// so swap them for our sponsor's real photos before this goes live.
//
// To use real photos:
//   1. Put each pair in public/images/results/, e.g. storefront-before.webp
//      and storefront-after.webp (same size and framing for both).
//   2. Point `before` and `after` at them and update the title and caption.
//   3. Delete the demo files in public/images/results/ that are no longer used.
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
    'Slide across each photo to compare the glass before we start and after we pack up.',
  pairs: [
    {
      title: 'Desert dust, gone.',
      caption: 'A season of dust and sprinkler spray lifted off, so the view comes back.',
      before: '/images/results/stucco-before.webp',
      after: '/images/results/stucco-after.webp',
      alt: 'A two-pane window on a stucco Arizona home',
    },
    {
      title: 'Film you stop noticing.',
      caption: 'From inside it looked fine. Side by side, the clean pane is what glass should look like.',
      before: '/images/results/patio-before.webp',
      after: '/images/results/patio-after.webp',
      alt: 'A sliding glass door looking out on a backyard patio',
    },
  ] satisfies BeforeAfterPair[],
};
