import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { coreServices, howWeDoIt, specializedServices } from '@/data/services';
import Reveal from '@/components/services/Reveal';
import ServiceIndex from './ServiceIndex';
import ClearerViewCta from '@/components/ui/ClearerViewCta';
import HeroVideo from '@/components/ui/HeroVideo';

// Describe the page for search engines and link previews.
export const metadata = createPageMetadata({
  path: '/services',
  title: 'Services | Clear Impression Services',
  description:
    'Window cleaning with traditional tools or 100% pure water, plus hard water stain removal, screen cleaning, and more across Mesa and the Phoenix metro.',
});

// The two cleaning methods, linked from the Core Services intro.
const [traditional, pureWater] = howWeDoIt;
const methodLink =
  'rounded-sm font-medium text-[#6c3fb8] underline underline-offset-4 hover:text-[#200b38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]';

export default async function Services() {
  const header = await getPageHeader('services');
  const heroLines = header.title.split('\n');
  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* The headline rises behind fogged glass, then a squeegee wipes it clear. */}
      <section className='page-hero relative isolate overflow-hidden bg-[linear-gradient(118deg,#fffdf9_0%,#faf7fc_54%,#eee7f4_100%)] text-[#200b38]'>
        {/* Solar panels being scrubbed with pure water, mountains behind. The clip is
            mirrored so the cleaner stands on the right, clear of the words. */}
        <HeroVideo
          webm='/videos/services-hero.webm'
          mp4='/videos/services-hero.mp4'
          poster='/videos/services-hero-poster.jpg'
          className='absolute inset-0 -z-20 size-full object-cover object-[65%_center]'
        />
        {/* A soft beige wash only behind the words, like the homepage hero, so the
            rest of the video shows in full color. */}
        <div
          aria-hidden='true'
          className='absolute inset-0 -z-10 bg-linear-to-r from-[#fffdf9]/92 from-15% via-[#fffdf9]/60 via-38% to-transparent to-58% max-sm:bg-linear-to-b max-sm:from-[#fffdf9]/94 max-sm:via-[#fffdf9]/85 max-sm:to-[#fffdf9]/60'
        />
        {/* Taller than the other page headers, so more of the video shows. */}
        <div className='hero-drift mx-auto flex min-h-[30rem] max-w-7xl flex-col justify-center px-6 py-14 sm:min-h-[34rem] sm:px-8 sm:py-16'>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#b47c00]'>
            What we do
          </p>
          <h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            {heroLines.map((line, index) => (
              <span key={line} className='line-mask'>
                <span
                  className='line-rise'
                  style={{ '--i': index } as React.CSSProperties}>
                  {line}
                </span>
              </span>
            ))}
          </h1>
          <p className='hero-after mt-6 max-w-xl text-lg text-[#625c64]'>
            {header.subtitle}
          </p>
        </div>
        <div aria-hidden='true' className='squeegee-fog absolute inset-0' />
        <div aria-hidden='true' className='squeegee-blade absolute inset-y-0' />
      </section>

      <section
        aria-labelledby='core-services-heading'
        className='bg-[#eee6f9]'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
          <Reveal className='max-w-2xl'>
            <h2
              id='core-services-heading'
              className='text-3xl font-semibold tracking-tight sm:text-4xl'>
              <span className='line-mask'>
                <span className='line-rise'>Core Services</span>
              </span>
            </h2>
            <p className='fade-up mt-4 text-lg leading-relaxed text-gray-600'>
              Reliable property care for homes, businesses, and outdoor surfaces across the Phoenix Valley.
            </p>
            {/* These links keep both method pages one click from Services
                for visitors and search engines. */}
            <p className='fade-up mt-3 leading-relaxed text-gray-600'>
              We clean with{' '}
              <Link
                href={`/services/${traditional.slug}`}
                className={methodLink}>
                traditional tools
              </Link>
              ,{' '}
              <Link
                href={`/services/${pureWater.slug}`}
                className={methodLink}>
                100% pure water
              </Link>
              , or both, chosen for your glass.
            </p>
          </Reveal>
          <div className='mt-12 grid gap-6 md:grid-cols-2'>
            {coreServices.map((service) => (
              <article
                key={service.slug}
                className='card-edge rounded-2xl border border-[#200b38]/10 bg-[#faf8fd] p-8 shadow-sm'>
                <h3 className='text-2xl font-semibold tracking-tight'>
                  {service.title}
                </h3>
                <p className='mt-3 font-medium text-[#6c3fb8]'>
                  {service.previewDescription}
                </p>
                <p className='mt-5 leading-relaxed text-gray-700'>
                  {service.largeDescription}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className='draw-link mt-6 inline-block rounded-sm py-1 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
                  Explore this service
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialized services as a list with a detail pane on wide screens. */}
      <section
        aria-labelledby='specialized-heading'
        className='bg-[#f7f4fb]'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
          <Reveal className='max-w-2xl'>
            <h2
              id='specialized-heading'
              className='text-3xl font-semibold tracking-tight sm:text-4xl'>
              <span className='line-mask'>
                <span className='line-rise'>Specialized Services</span>
              </span>
            </h2>
            <p className='fade-up mt-4 text-lg leading-relaxed text-gray-600'>
              For all your needs to make a Clear Impression.
            </p>
          </Reveal>
          <div className='mt-12'>
            <ServiceIndex services={specializedServices} />
          </div>
        </div>
      </section>

      {/* End with the same wipe-the-window call to action as the other pages. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <ClearerViewCta />
      </section>
    </main>
  );
}
