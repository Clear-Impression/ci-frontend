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
