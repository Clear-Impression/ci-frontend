export type Review = {
  id: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
};

export const googleReviewsUrl =
  'https://www.google.com/maps/place/Clear+Impression/@33.518397,-112.2247357,10z/data=!4m14!1m7!3m6!1s0x88ea73417cd69627:0xaeaf3e7753765f64!2sClear+Impression!8m2!3d33.518261!4d-111.8950935!16s%2Fg%2F11zb4n8t1_!3m5!1s0x88ea73417cd69627:0xaeaf3e7753765f64!8m2!3d33.518261!4d-111.8950935!16s%2Fg%2F11zb4n8t1_';

// These short excerpts were checked on Google Maps on October 7, 2026.
// Update them by hand when we choose new reviews.
export const reviews: readonly Review[] = [
  {
    id: 'kate-willenborg',
    name: 'Kate Willenborg',
    rating: 5,
    quote: 'They were prompt, efficient, friendly, professional, and so kind.',
  },
  {
    id: 'ali-pano',
    name: 'Ali Pano',
    rating: 5,
    quote: 'Great customer service, great price',
  },
  {
    id: 'shannon-horton',
    name: 'Shannon Horton PhD',
    rating: 5,
    quote: 'My windows are very clear. Professional service.',
  },
];

// Overall Google rating shown on the Reviews page.
// Checked on Google on October 22, 2026. Update the count when it changes.
export const googleRating = {
  score: 5.0,
  count: 110,
} as const;

// Full Google reviews for the Reviews page, copied word for word on
// October 22, 2026. Text marked with … was shortened, not reworded.
// The homepage keeps using the short `reviews` excerpts above.
export const googleReviews: readonly Review[] = [
  {
    id: 'robin-haney',
    name: 'Robin Haney',
    rating: 5,
    quote:
      'Niels was friendly, professional, and did an excellent job washing our windows. The windows look spotless, and his attention to detail really showed. On top of the great service, his prices were very reasonable and offered excellent value. I highly recommend Niels to anyone looking for a reliable window washer!',
  },
  {
    id: 'shannon-horton-full',
    name: 'Shannon Horton PhD',
    rating: 5,
    quote:
      'Wonderful experience! My windows are very clear. Professional service. Clear/clean windows are symbolic for seeing clearly in life. Excited to use them again and lighten my task load.',
  },
  {
    id: 'bryce',
    name: 'Bryce',
    rating: 5,
    quote:
      'Can’t say enough good things windows look awesome. Great communication and quality work all round. Recommending to everyone if your windows need some love!',
  },
  {
    id: 'mary-blake',
    name: 'Mary Blake',
    rating: 5,
    quote:
      'They did a great job! Fulfilled all my requests, and the windows look nice and shiny. Our house looks much better.',
  },
  {
    id: 'ali-pano-full',
    name: 'Ali Pano',
    rating: 5,
    quote:
      'What an amazing job this lovely young man did! Our office really needed our windows cleaned so he came in at the perfect time! Great customer service, great price and I have him booked to do my home this week as well! Thank you so much for your excellent service!',
  },
  {
    id: 'appliances-4-less-tempe',
    name: 'Appliances 4 Less Tempe',
    rating: 5,
    quote:
      'Niels stopped by and offered windows cleaning for a great price. Did the job on the spot, quickly and efficiently. Great work. … I respect the hustle, Hire this guy if you get a chance.',
  },
  {
    id: 'kate-willenborg-full',
    name: 'Kate Willenborg',
    rating: 5,
    quote: 'They were prompt, efficient, friendly, professional, and so kind.',
  },
  {
    id: 'ali-nia',
    name: 'Ali Nia',
    rating: 5,
    quote:
      'Had Clear Impression Window Cleaning come by today and they did our front door windows for us and they are responsible for doing some of our neighboring businesses window cleaning for them. Great guy and great company, if we ever switch we will give them a try for sure!',
  },
];
