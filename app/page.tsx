import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import HomeServices from '@/components/home/HomeServices';
import HomeContact from '@/components/home/HomeContact';
import HomeReviews from '@/components/home/HomeReviews';
import { homeHero, homeServices, serviceCities } from '@/data/home';
import { googleReviewsUrl, reviews } from '@/data/reviews';

export const metadata: Metadata = {
  title: 'Window Cleaning in Phoenix Metro | Clear Impression Services',
  description:
    'Residential and commercial window cleaning in Mesa, Gilbert, Chandler, and Tempe. Explore our cleaning methods and request a free quote.',
};

export default function Home() {
  return (
    <main className='flex-1'>
      {/* Build the page from sections so their content can change independently. */}
      <HomeHero {...homeHero} cities={serviceCities} />
      <HomeServices services={homeServices} />
      <HomeReviews reviews={reviews} sourceUrl={googleReviewsUrl} />
      <HomeContact />
    </main>
  );
}
