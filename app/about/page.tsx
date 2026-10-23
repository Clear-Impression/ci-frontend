import type { Metadata } from 'next';
import { company, serviceAreas, services } from '@/data/company';
import {
  aboutClosing,
  aboutIntro,
  aboutPromise,
  aboutStory,
  aboutValues,
} from '@/data/about';
import Reveal from '@/components/services/Reveal';
import ServiceIcon from '@/components/services/ServiceIcon';
import TiltCard from '@/components/about/TiltCard';

// Give the About page its own title and search description.
export const metadata: Metadata = {
  title: 'About Us | Clear Impression Services',
  description:
    'Founded in 2018 in Mesa, Clear Impression delivers honest, detail-focused window and exterior cleaning across the Phoenix metro area.',
};

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

export default function AboutPage() {
  return (
    // Let the page fill the space between the header and footer.
    <main className='flex-1 bg-white text-gray-900'>
      {/* Same header as the other pages. The words come into focus one by one. */}
      <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div aria-hidden='true' className='about-glow absolute inset-0 -z-10' />
        <div className='focus-out mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <p className='focus-in text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            {aboutIntro.eyebrow}
          </p>
          <h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            <Words text={aboutIntro.title} className='focus-word' />
          </h1>
          <p className='focus-in focus-in-late mt-6 max-w-2xl text-lg text-white/80'>
            {aboutIntro.lead}
          </p>
        </div>
      </section>

      {/* The two halves of the story slide in from opposite sides. */}
      <section className='mx-auto max-w-7xl overflow-x-clip px-6 py-16 sm:px-8 sm:py-20'>
        <div className='grid gap-12 lg:grid-cols-2'>
          {aboutStory.map((section, index) => (
            <Reveal
              key={section.heading}
              className={`story-col ${index === 0 ? 'from-left' : 'from-right'}`}>
              <article>
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
            </Reveal>
          ))}
        </div>

        {/* Reuse the shared lists so services and areas stay in sync. */}
        <Reveal className='tag-box mt-12 grid gap-8 rounded-2xl bg-gray-50 p-8 sm:grid-cols-2'>
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
              What we do
            </h3>
            <ul className='mt-3 flex flex-wrap gap-2'>
              {services.map((service, index) => (
                <li
                  key={service}
                  style={{ '--i': index } as React.CSSProperties}
                  className='tag-flip rounded-full bg-white px-4 py-2 text-sm font-medium text-[#200b38] ring-1 ring-gray-200'>
                  {service}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
              Where we work
            </h3>
            <ul className='mt-3 flex flex-wrap gap-2'>
              {serviceAreas.map((area, index) => (
                <li
                  key={area}
                  style={{ '--i': index + 3 } as React.CSSProperties}
                  className='tag-flip rounded-full bg-white px-4 py-2 text-sm font-medium text-[#200b38] ring-1 ring-gray-200'>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
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

      {/* End with a way to get in touch. A band of light passes over it once. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <Reveal className='cta-shine relative overflow-hidden rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {aboutClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{aboutClosing.text}</p>
          <a
            href={company.phoneHref}
            className='relative mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
            Call {company.phone} for a quote
          </a>
        </Reveal>
      </section>
    </main>
  );
}
