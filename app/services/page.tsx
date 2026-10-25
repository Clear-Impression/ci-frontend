import type { Metadata } from 'next';
import Link from 'next/link';
import { aboutClosing } from '@/data/about';
import { company } from '@/data/company';
import { coreServices, howWeDoIt, specializedServices } from '@/data/services';
import Reveal from '@/components/services/Reveal';
import ServiceIcon from '@/components/services/ServiceIcon';
import WindowPane from '@/components/services/WindowPane';
import ServiceIndex from './ServiceIndex';

// Describe the page for search engines and link previews.
export const metadata: Metadata = {
  title: 'Services | Clear Impression Services',
  description:
    'Window cleaning with traditional tools or 100% pure water, plus hard water stain removal, screen cleaning, and more across Mesa and the Phoenix metro.',
};

const heroLines = ['Every pane,', 'cleaned the right way.'];

export default function Services() {
  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* The headline rises behind fogged glass, then a squeegee wipes it clear. */}
      <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div aria-hidden='true' className='hero-glare absolute inset-0 -z-10' />
        {/* Same height, sizes, and spacing as the other page headers. */}
        <div className='hero-drift mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
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
          <p className='hero-after mt-6 max-w-2xl text-lg text-white/80'>
            Window and exterior cleaning for homes and businesses across Mesa and the Phoenix metro.
          </p>
        </div>
        <div aria-hidden='true' className='squeegee-fog absolute inset-0' />
        <div aria-hidden='true' className='squeegee-blade absolute inset-y-0' />
      </section>

      {/* The two core methods are the two sashes of one window. */}
      <section
        aria-labelledby='core-heading'
        className='mx-auto max-w-7xl px-6 pb-8 pt-16 sm:px-8 sm:pb-10 sm:pt-20'>
        <Reveal className='max-w-2xl'>
          <h2
            id='core-heading'
            className='text-3xl font-semibold tracking-tight sm:text-4xl'>
            <span className='line-mask'>
              <span className='line-rise'>How we clean your windows.</span>
            </span>
          </h2>
          <p className='fade-up mt-4 text-lg leading-relaxed text-gray-600'>
            We choose the method that best suits the glass. Many homes get both: hand detailing inside, pure water outside.
          </p>
        </Reveal>

        {/* A real window: outer frame, inner bead, two sashes, a latch, and a sill. */}
        <Reveal className='window mt-12'>
          <div className='window-frame relative rounded-2xl bg-[#200b38] p-3 shadow-xl shadow-[#200b38]/25 sm:p-4'>
            {/* The inner bead is the second border, just inside the frame. */}
            <span
              aria-hidden='true'
              className='pointer-events-none absolute inset-1.5 rounded-xl border border-white/15'
            />
            <div className='relative grid gap-3 sm:gap-4 md:grid-cols-2'>
              {howWeDoIt.map((service, index) => (
                <div
                  key={service.slug}
                  className='window-sash rounded-lg bg-[#33195a] p-2 sm:p-2.5'>
                  <WindowPane className='relative h-full rounded-md'>
                    <article
                      aria-labelledby={`${service.slug}-heading`}
                      className='pane-content flex h-full flex-col p-8 sm:p-10'
                      style={{ '--i': index } as React.CSSProperties}>
                      <span className='grid size-14 place-items-center rounded-lg bg-[#efb52b]/15'>
                        <ServiceIcon
                          slug={service.slug}
                          className='size-8 text-[#200b38]'
                        />
                      </span>
                      <h3
                        id={`${service.slug}-heading`}
                        className='mt-8 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl'>
                        {service.title}
                      </h3>
                      <p className='mt-3 font-medium text-[#6c3fb8]'>
                        {service.previewDescription}
                      </p>
                      <p className='mt-5 flex-1 leading-relaxed text-gray-700'>
                        {service.largeDescription}
                      </p>
                      <Link
                        href={`/services/${service.slug}`}
                        className='draw-link mt-8 self-start rounded-sm py-1 font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
                        How this method works
                      </Link>
                    </article>
                  </WindowPane>
                </div>
              ))}
              {/* The latch sits where the two sashes meet. */}
              <span
                aria-hidden='true'
                className='window-latch absolute left-1/2 top-1/2 hidden h-12 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d9b65f] md:block'
              />
            </div>
          </div>
          <div aria-hidden='true' className='window-sill' />
        </Reveal>
      </section>

      <section
        aria-labelledby='core-services-heading'
        className='bg-[#eee6f9]'>
        <div className='mx-auto max-w-7xl px-6 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10'>
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
          </Reveal>
          <div className='mt-12 grid gap-6 md:grid-cols-2'>
            {coreServices.map((service) => (
              <article
                key={service.slug}
                className='rounded-2xl border border-[#200b38]/10 bg-[#faf8fd] p-8 shadow-sm'>
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

      {/* End with the same call to action as the other pages. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <Reveal className='cta-reveal rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {aboutClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{aboutClosing.text}</p>
          <a
            href={company.phoneHref}
            className='mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
            Call {company.phone} for a quote
          </a>
        </Reveal>
      </section>
    </main>
  );
}