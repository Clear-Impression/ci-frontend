import type { Metadata } from 'next';
import ServiceAreaMap from '@/components/home/ServiceAreaMap';
import HomeContact from '@/components/home/HomeContact';
import { serviceCities } from '@/data/home';
import { locationDetails, locationsPageContent } from '@/data/locations';

// Give the Locations page its own title and search description.
export const metadata: Metadata = {
  title: 'Locations | Clear Impression Services',
  description:
    'Explore our window cleaning service cities: Phoenix, Mesa, Gilbert, Chandler, and Tempe.',
};

export default function LocationsPage() {
  return (
    <main className='flex-1 border-0 bg-white text-[#200b38]'>
      {/* The shared layout already supplies the website's header and footer. */}
      <section
        aria-labelledby='locations-heading'
        className='bg-[#200b38] text-white'>
        <div className='mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20'>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            {locationsPageContent.eyebrow}
          </p>
          <h1
            id='locations-heading'
            className='mt-4 text-4xl font-semibold tracking-tight sm:text-5xl'>
            {locationsPageContent.title}
          </h1>
          <p className='mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg'>
            {locationsPageContent.description}
          </p>
        </div>
      </section>

      <section
        aria-label='Service area map'
        className='bg-[#faf8fd]'>
        <div className='mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16'>
          {/* Reuse the homepage map, with more height and the full page width. */}
          <ServiceAreaMap cities={serviceCities} large />

          <div className='mt-12 sm:mt-16'>
            <h2 className='text-3xl font-semibold tracking-tight text-[#000000] sm:text-4xl'>
              {locationsPageContent.citiesHeading}
            </h2>
            {/* Match the FAQ: white boxes and native black arrow markers. */}
            <div className='mt-6 space-y-4'>
              {serviceCities.map((city) => (
                <details
                  key={city.name}
                  className='rounded-lg border border-[#e5e7eb] bg-[#ffffff]'>
                  <summary className='min-h-16 cursor-pointer rounded-lg px-5 py-5 text-lg font-semibold text-[#171717] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
                    {city.name}
                  </summary>
                  {/* City names are placeholders. Add details in data/locations.ts. */}
                  {locationDetails[city.name] && (
                    <p className='px-5 pb-5 whitespace-pre-line leading-7 text-[#686170]'>
                      {locationDetails[city.name]}
                    </p>
                  )}
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reuse the existing quote and text-message buttons. */}
      <HomeContact />
    </main>
  );
}
