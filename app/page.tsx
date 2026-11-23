import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import './home-redesign.css';
import { jakarta } from './fonts';
import HomeMotion from '@/components/home/HomeMotion';
import HomeHero from '@/components/home/HomeHero';
import HomePromiseStrip from '@/components/home/HomePromiseStrip';
import HomePureWater from '@/components/home/HomePureWater';
import HomeServices from '@/components/home/HomeServices';
import HomeReviews from '@/components/home/HomeReviews';
import HomeServiceArea from '@/components/home/HomeServiceArea';
import HomeClosing from '@/components/home/HomeClosing';
import HomeBeforeAfter from '@/components/home/HomeBeforeAfter';
import { beforeAfter } from '@/data/beforeAfter';
import HomePromise from '@/components/home/HomePromise';
import OfferPopup from '@/components/home/OfferPopup';
import { company } from '@/data/company';
import { promise } from '@/data/promise';
import PageGuide, { type GuideGroup } from '@/components/layout/PageGuide';
import {
  homeAreas,
  homeClosing,
  homeHero,
  homeServices,
  homeSteps,
  pureWater,
} from '@/data/home';
import { googleRating, homeReviews } from '@/data/reviews';
import { getLocations, withCityCount } from '@/lib/locations';
import { getSeasonalOffers } from '@/lib/seasonal-offers';

export const metadata = createPageMetadata({
  path: '/',
  title: 'Window Cleaning in Phoenix Metro | Clear Impression',
  description:
    'Residential and commercial window cleaning across the Phoenix metro area. Explore our services and request a free quote from Clear Impression.',
});

const organizationStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: company.name,
  url: company.website,
  logo: new URL(company.logo, company.website).href,
  telephone: company.phoneHref.replace(/^tel:/, ''),
};

// The sections listed in the "On this page" guide, top to bottom. Each id wraps one section below.
// The "On this page" menu, in three short groups.
const guideGroups = [
  {
    title: 'Get to know us',
    items: [
      { id: 'top', label: 'Welcome' },
      { id: 'why-us', label: 'Our Promise' },
      { id: 'services', label: 'Services' },
      { id: 'service-area', label: 'Where We Work' },
    ],
  },
  {
    title: 'What we do',
    items: [
      { id: 'results', label: 'Before & After' },
      { id: 'pure-water', label: 'Our Technology' },
    ],
  },
  {
    title: 'Trust',
    items: [
      { id: 'promise', label: 'Promise in Detail' },
      { id: 'reviews', label: 'Reviews' },
      { id: 'get-started', label: 'Get Started' },
    ],
  },
] satisfies GuideGroup[];

export default async function Home() {
  const header = await getPageHeader('home');
  const { cities } = await getLocations();
  const { popup } = await getSeasonalOffers();
  return (
    <main className={`hx ${jakarta.variable} flex-1`}>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData).replace(/</g, '\\u003c'),
        }}
      />
      <HomeMotion />
      {/* The seasonal offer popup, if it's turned on in Sanity. */}
      {popup && <OfferPopup offer={popup} />}
      <PageGuide
        label='Homepage sections'
        groups={guideGroups}
      />
      {/* Build the page from sections so their content can change independently. */}
      <div id='top'>
        <HomeHero
          {...homeHero}
          titleLines={header.title.split('\n')}
          subtitle={header.subtitle || homeHero.subtitle}
          rating={googleRating.score}
          reviewCount={googleRating.count}>
          {/* The Clear Impression Promise, along the bottom of the hero. */}
          <div id='why-us'>
            <HomePromiseStrip
              eyebrow={promise.eyebrow}
              items={promise.items}
            />
          </div>
        </HomeHero>
      </div>
      {/* Our services, right under the promise. */}
      <div id='services'>
        <HomeServices {...homeServices} />
      </div>
      {/* Then find your city. */}
      <div id='service-area'>
        <HomeServiceArea
          {...homeAreas}
          lead={withCityCount(homeAreas.lead, cities.length)}
          cities={cities.map(({ name, coordinates }) => ({ name, coordinates }))}
          cityPages={cities}
        />
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
