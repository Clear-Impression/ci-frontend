import Link from 'next/link';
import { howWeDoIt } from '@/data/services';
import Reveal from '@/components/services/Reveal';
import ServiceIcon from '@/components/services/ServiceIcon';
import ServiceMedia from '@/components/services/ServiceMedia';
import WindowPane from '@/components/services/WindowPane';

// The two cleaning methods, shown as the two sashes of one window.
// Each half links to the full page for that method.
// It follows the story section on the same white background, so it skips its
// own top padding to keep the gap between them the same as other sections.
export default function HowWeClean() {
  return (
    <section
      id='how-we-clean'
      aria-labelledby='how-we-clean-heading'
      className='mx-auto max-w-7xl scroll-mt-32 px-6 pb-16 sm:px-8 sm:pb-20'>
      <Reveal className='max-w-2xl'>
        <h2
          id='how-we-clean-heading'
          className='text-3xl font-semibold tracking-tight sm:text-4xl'>
          <span className='line-mask'>
            <span className='line-rise'>How we clean your windows.</span>
          </span>
        </h2>
        <p className='fade-up mt-4 text-lg leading-relaxed text-gray-600'>
          Two methods, chosen for your glass. Most homes get both.
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
                    className='pane-content flex h-full flex-col p-5 sm:p-6'
                    style={{ '--i': index } as React.CSSProperties}>
                    {/* The photo is the view through this half of the window. */}
                    <ServiceMedia
                      slug={service.slug}
                      sizes='(min-width: 768px) 45vw, 100vw'
                      className='aspect-16/9 rounded-md'
                    />
                    <h3
                      id={`${service.slug}-heading`}
                      className='mt-6 flex items-center gap-3 px-2 text-2xl font-semibold leading-tight tracking-tight sm:px-3 sm:text-3xl'>
                      <span className='grid size-10 shrink-0 place-items-center rounded-lg bg-[#efb52b]/15'>
                        <ServiceIcon
                          slug={service.slug}
                          className='size-6 text-[#200b38]'
                        />
                      </span>
                      {service.title}
                    </h3>
                    <p className='mt-3 px-2 font-medium text-[#6c3fb8] sm:px-3'>
                      {service.previewDescription}
                    </p>
                    <span className='flex-1' />
                    <Link
                      href={`/services/${service.slug}`}
                      className='draw-link mx-2 mb-2 mt-6 self-start rounded-sm py-1 font-semibold sm:mx-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
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
  );
}
