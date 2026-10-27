import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import HomeTrust from '@/components/home/HomeTrust';
import HomePureWater from '@/components/home/HomePureWater';
import HomeServices from '@/components/home/HomeServices';
import HomeSteps from '@/components/home/HomeSteps';
import HomeReviews from '@/components/home/HomeReviews';
import HomeServiceArea from '@/components/home/HomeServiceArea';
import HomeClosing from '@/components/home/HomeClosing';
import {
  homeAreas,
  homeClosing,
  homeHero,
  homeServices,
  homeSteps,
  pureWater,
  serviceCities,
  servingSince,
} from '@/data/home';
import { locationPages } from '@/data/locations';
import { googleRating, googleReviews } from '@/data/reviews';

export const metadata: Metadata = {
  title: 'Window Cleaning in Phoenix Metro | Clear Impression Services',
  description:
    'Residential and commercial window cleaning in Mesa, Phoenix, Glendale, Paradise Valley, Scottsdale, Queen Creek, Gilbert, Chandler, and Tempe. Explore our cleaning methods and request a free quote.',
};

export default function Home() {
  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* Build the page from sections so their content can change independently. */}
      <HomeHero {...homeHero} rating={googleRating.score} />
      <HomeTrust
        score={googleRating.score}
        count={googleRating.count}
        since={servingSince}
        cityCount={locationPages.length}
      />
      <HomePureWater {...pureWater} />
      <HomeServices {...homeServices} />
      <HomeSteps {...homeSteps} />
      <HomeReviews
        reviews={googleReviews}
        score={googleRating.score}
        count={googleRating.count}
      />
      <HomeServiceArea
        {...homeAreas}
        cities={serviceCities}
        cityPages={locationPages}
      />
      <HomeClosing {...homeClosing} />
    </main>
  );
}
