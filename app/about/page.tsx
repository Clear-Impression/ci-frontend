import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import Image from 'next/image';
import { company } from '@/data/company';
import {
  aboutIntro,
  aboutOwner,
  aboutPromise,
  aboutStory,
  aboutValues,
} from '@/data/about';
import Reveal from '@/components/services/Reveal';
import ServiceIcon from '@/components/services/ServiceIcon';
import TiltCard from '@/components/about/TiltCard';
import ClearerViewCta from '@/components/ui/ClearerViewCta';

// Give the About page its own title and search description.
export const metadata = createPageMetadata({
  path: '/about',
  title: 'Meet the Owner | Clear Impression Services',
  description:
    'Meet Niels, who founded Clear Impression in Mesa in 2018. Honest, detail-focused window and exterior cleaning across the Phoenix metro area.',
});

// Split text into words so each one can animate on its own.
// The spaces stay as real text, so the sentence still reads normally.
function Words({ text, className }: { text: string; className: string }) {
  return text.split(' ').map((word, index, words) => (
    <span key={`${word}-${index}`}>
      <span
        className={className}
        style={{ '--w': index } as React.CSSProperties}>
        {word}
      </span>
      {index < words.length - 1 ? ' ' : null}
    </span>
  ));
}

export default async function AboutPage() {
  const header = await getPageHeader('about');
  return (
    // Let the page fill the space between the header and footer.
    <main className='flex-1 bg-white text-gray-900'>
      {/* Same header as the other pages. The words come into focus one by one. */}
      <section className='page-hero relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div aria-hidden='true' className='about-glow absolute inset-0 -z-10' />
        <div className='focus-out mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <p className='focus-in text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            {aboutIntro.eyebrow}
          </p>
          <h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            <Words text={header.title} className='focus-word' />
          </h1>
          <p className='focus-in focus-in-late mt-6 max-w-2xl text-lg text-white/80'>
            {header.subtitle}
          </p>
        </div>
      </section>

      {/* The owner's photo on one side, the story on the other. */}
      <section className='mx-auto max-w-7xl overflow-x-clip px-6 py-16 sm:px-8 sm:py-20'>
        <div className='grid items-start gap-14 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-16'>
          <Reveal className='story-col from-left'>
            <figure className='relative mx-auto max-w-sm lg:mx-0'>
              {aboutOwner.photo ? (
                <Image
                  src={aboutOwner.photo}
                  alt={`${aboutOwner.name}, founder of ${company.name}`}
                  width={704}
                  height={880}
                  sizes='(min-width: 1024px) 22rem, 90vw'
                  className='relative aspect-4/5 w-full rounded-3xl object-cover'
                />
              ) : (
                // Space saved for the headshot until the photo arrives.
                <div className='relative grid aspect-4/5 w-full place-items-center rounded-3xl bg-[#f7f4fb] ring-2 ring-[#200b38]/15 ring-inset'>
                  <div className='flex flex-col items-center gap-3 text-[#542d90]'>
                    <svg
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                      className='size-16'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.3'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <circle cx='12' cy='8.5' r='3.5' />
                      <path d='M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5' />
                    </svg>
                    <span className='text-sm font-medium'>Photo coming soon</span>
                  </div>
                </div>
              )}
              <figcaption className='relative -mt-8 mx-5 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-lg shadow-[#200b38]/15 ring-1 ring-gray-200'>
                <span
                  aria-hidden='true'
                  className='size-2.5 shrink-0 rounded-full bg-[#55ab68]'
                />
                <span>
                  <span className='block text-lg font-semibold text-[#200b38]'>{aboutOwner.name}</span>
                  <span className='block text-sm text-gray-600'>{aboutOwner.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal className='story-col from-right space-y-12'>
            {aboutStory.map((section) => (
              <article key={section.heading}>
                <h2 className='text-2xl font-semibold text-[#200b38]'>
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={paragraph}
                    style={{ '--i': paragraphIndex + 1 } as React.CSSProperties}
                    className='blur-in mt-4 leading-relaxed text-gray-700'>
                    {paragraph}
                  </p>
                ))}
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Highlight the company promise and the values behind it. */}
      <section className='bg-[#f7f4fb]'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
          <Reveal>
            <h2 className='blur-in text-2xl font-semibold text-[#200b38]'>
              {aboutPromise.heading}
            </h2>
            {/* The quote darkens word by word as it scrolls up the screen. */}
            <blockquote className='ink-quote mt-6 border-l-4 border-[#efb52b] pl-6 text-2xl font-medium text-[#200b38] sm:text-3xl'>
              <Words
                text={`“${aboutPromise.tagline}”`}
                className='ink-word'
              />
            </blockquote>
            <div className='mt-8 max-w-3xl space-y-4'>
              {aboutPromise.paragraphs.map((paragraph, index) => (
                <p
                  key={paragraph}
                  style={{ '--i': index + 2 } as React.CSSProperties}
                  className='blur-in leading-relaxed text-gray-700'>
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          {/* The value cards are dealt onto the table, then tilt toward the cursor. */}
          <Reveal as='div' className='mt-12'>
            <ul className='tilt-stage grid gap-6 sm:grid-cols-3'>
              {aboutValues.map((value, index) => (
                <TiltCard
                  key={value.title}
                  style={{ '--i': index } as React.CSSProperties}
                  className='deal-card rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200'>
                  <span className='icon-pop grid size-12 place-items-center rounded-lg bg-[#efb52b]/15'>
                    <ServiceIcon
                      slug={value.icon}
                      draw='none'
                      className='size-7 text-[#200b38]'
                    />
                  </span>
                  <h3 className='mt-5 text-lg font-semibold text-[#200b38]'>
                    {value.title}
                  </h3>
                  <p className='mt-2 text-gray-700'>{value.description}</p>
                </TiltCard>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* End with a window visitors can wipe clean, then a way to get in touch. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <ClearerViewCta />
      </section>
    </main>
  );
}
