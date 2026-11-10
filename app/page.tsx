import { getPageHeader } from '@/lib/page-headers';
import type { Metadata } from 'next';
import HomeHero from '@/components/home/HomeHero';
import HomeTrust from '@/components/home/HomeTrust';
import HomePureWater from '@/components/home/HomePureWater';
import HomeServices from '@/components/home/HomeServices';
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
  servingSince,
} from '@/data/home';
import { googleRating, homeReviews } from '@/data/reviews';
import { getLocations, withCityCount } from '@/lib/locations';

// Name every city we serve, so the search description stays current.
export async function generateMetadata(): Promise<Metadata> {
  const { cities } = await getLocations();
  const cityList = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
  }).format(cities.map((city) => city.name));

  return {
    title: 'Window Cleaning in Phoenix Metro | Clear Impression Services',
    description: `Residential and commercial window cleaning in ${cityList}. Explore our cleaning methods and request a free quote.`,
  };
}

export default async function Home() {
  const header = await getPageHeader('home');
  const { cities } = await getLocations();
  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* Build the page from sections so their content can change independently. */}
      <HomeHero {...homeHero} titleLines={header.title.split('\n')} subtitle={header.subtitle} rating={googleRating.score} />
      <HomeTrust
        score={googleRating.score}
        count={googleRating.count}
        since={servingSince}
        cityCount={cities.length}
      />
      {/* Follow the path visitors take: find their city, pick a service, get a quote. */}
      <HomeServiceArea
        {...homeAreas}
        lead={withCityCount(homeAreas.lead, cities.length)}
        cities={cities.map(({ name, coordinates }) => ({ name, coordinates }))}
        cityPages={cities}
      />
      <HomeServices {...homeServices} />
      <HomePureWater {...pureWater} />
      <HomeReviews
        reviews={homeReviews}
        score={googleRating.score}
        count={googleRating.count}
      />
      <HomeClosing
        {...homeClosing}
        steps={homeSteps.steps}
      />
    </main>
  );
}
