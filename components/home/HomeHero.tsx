import { company } from '@/data/company';
import type { ServiceCity } from '@/data/home';
import ServiceAreaMap from './ServiceAreaMap';

type HomeHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  cities: readonly ServiceCity[];
};

export default function HomeHero({
  eyebrow,
  title,
  description,
  cities,
}: HomeHeroProps) {
  return (
    <section
      className='bg-[#faf8fd]'
      aria-labelledby='home-heading'>
      <div className='mx-auto grid max-w-7xl items-center gap-10 px-6 py-12 sm:px-8 sm:py-16 lg:grid-cols-2 lg:gap-16'>
        {/* Keep the live site's main message, using our purple theme. */}
        <div>
          <p className='text-sm font-semibold leading-6 text-[#6c3fb8]'>
            {eyebrow}
          </p>
          <h1
            id='home-heading'
            className='mt-4 max-w-lg text-4xl font-semibold leading-tight tracking-tight text-[#200b38] sm:text-5xl lg:text-6xl'>
            {title}
          </h1>
          <p className='mt-6 max-w-lg text-base leading-8 text-[#686170] sm:text-lg'>
            {description}
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            {/* Send quote requests to the working website until our form is ready. */}
            <a
              href={`${company.website}get-a-quote`}
              className='inline-flex min-h-12 items-center justify-center rounded-lg bg-[#200b38] px-6 py-3 text-sm font-semibold text-white hover:bg-[#432462] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
              Get a free quote
            </a>
            <a
              href='#home-services'
              className='inline-flex min-h-12 items-center justify-center rounded-lg border border-[#200b38]/20 px-6 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#eee6f7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
              Our services
            </a>
          </div>
          <p className='mt-6 text-sm leading-6 text-[#686170]'>
            Residential &amp; commercial · Phoenix metro
          </p>
        </div>
        {/* Show the named service cities instead of the old map image. */}
        <ServiceAreaMap cities={cities} />
      </div>
    </section>
  );
}
