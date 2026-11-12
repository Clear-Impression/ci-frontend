import { getPageHeader } from '@/lib/page-headers';
import type { Metadata } from 'next';
import './home-redesign.css';
import { manrope } from './fonts';
import HomeMotion from '@/components/home/HomeMotion';
import HomeHero from '@/components/home/HomeHero';
import HomeTrust from '@/components/home/HomeTrust';
import HomePureWater from '@/components/home/HomePureWater';
import HomeServices from '@/components/home/HomeServices';
import HomeReviews from '@/components/home/HomeReviews';
import HomeServiceArea from '@/components/home/HomeServiceArea';
import HomeClosing from '@/components/home/HomeClosing';
import HomeBeforeAfter from '@/components/home/HomeBeforeAfter';
import { beforeAfter } from '@/data/beforeAfter';
import HomePromise from '@/components/home/HomePromise';
import { promise } from '@/data/promise';
import SectionRail, { type RailSection } from '@/components/home/SectionRail';
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

// The sections listed in the "On this page" guide, top to bottom. Each id wraps one section below.
const railSections = [
  { id: 'top', label: 'Welcome' },
  { id: 'why-us', label: 'Why Us' },
  { id: 'service-area', label: 'Where We Work' },
  { id: 'services', label: 'Services' },
  { id: 'results', label: 'Before & After' },
  { id: 'pure-water', label: 'Our Technology' },
  { id: 'promise', label: 'Our Promise' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'get-started', label: 'Get Started' },
] satisfies RailSection[];

export default async function Home() {
  const header = await getPageHeader('home');
  const { cities } = await getLocations();
  return (
    <main className={`hx ${manrope.variable} flex-1`}>
      <HomeMotion />
      <SectionRail sections={railSections} />
      {/* Build the page from sections so their content can change independently. */}
      <div id='top'>
        <HomeHero
          {...homeHero}
          titleLines={header.title.split('\n')}
          subtitle={header.subtitle}
          rating={googleRating.score}
          reviewCount={googleRating.count}
        />
      </div>
      <div id='why-us'>
        <HomeTrust
          score={googleRating.score}
          count={googleRating.count}
          since={servingSince}
          cityCount={cities.length}
        />
      </div>
      {/* Follow the path visitors take: find their city, pick a service, get a quote. */}
      <div id='service-area'>
        <HomeServiceArea
          {...homeAreas}
          lead={withCityCount(homeAreas.lead, cities.length)}
          cities={cities.map(({ name, coordinates }) => ({ name, coordinates }))}
          cityPages={cities}
        />
      </div>
      <div id='services'>
        <HomeServices {...homeServices} />
      </div>
      <div id='results'>
        <HomeBeforeAfter {...beforeAfter} />
      </div>
      <div id='pure-water'>
        <HomePureWater {...pureWater} />
      </div>
      <div id='promise'>
        <HomePromise {...promise} />
      </div>
      <div id='reviews'>
        <HomeReviews
          reviews={homeReviews}
          score={googleRating.score}
          count={googleRating.count}
        />
      </div>
      <div id='get-started'>
        <HomeClosing
          {...homeClosing}
          steps={homeSteps.steps}
        />
      </div>
    </main>
  );
}
