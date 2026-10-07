import type { Metadata } from 'next';
import { company, serviceAreas, services } from '@/data/company';
import {
  aboutClosing,
  aboutIntro,
  aboutPromise,
  aboutStory,
  aboutValues,
} from '@/data/about';

// Give the About page its own title and search description.
export const metadata: Metadata = {
  title: 'About Us | Clear Impression Services',
  description:
    'Founded in 2018 in Mesa, Clear Impression delivers honest, detail-focused window and exterior cleaning across the Phoenix metro area.',
};

export default function AboutPage() {
  return (
    // Let the page fill the space between the header and footer.
    <main className='flex-1 bg-white text-gray-900'>
      {/* Introduce the page with the same purple as the header. */}
      <section className='bg-[#200b38] text-white'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-24'>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            {aboutIntro.eyebrow}
          </p>
          <h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            {aboutIntro.title}
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-white/80'>
            {aboutIntro.lead}
          </p>
        </div>
      </section>

      {/* Tell the company story side by side on large screens. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <div className='grid gap-12 lg:grid-cols-2'>
          {aboutStory.map((section) => (
            <article key={section.heading}>
              <h2 className='text-2xl font-semibold text-[#200b38]'>
                {section.heading}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className='mt-4 leading-relaxed text-gray-700'>
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>

        {/* Reuse the shared lists so services and areas stay in sync. */}
        <div className='mt-12 grid gap-8 rounded-2xl bg-gray-50 p-8 sm:grid-cols-2'>
          <div>
            <h3 className='text-sm font-semibold uppercase tracking-wider text-gray-500'>
              What we do
            </h3>
            <ul className='mt-3 flex flex-wrap gap-2'>
              {services.map((service) => (
                <li
                  key={service}
                  className='rounded-full bg-white px-4 py-2 text-sm font-medium text-[#200b38] ring-1 ring-gray-200'>
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
              {serviceAreas.map((area) => (
                <li
                  key={area}
                  className='rounded-full bg-white px-4 py-2 text-sm font-medium text-[#200b38] ring-1 ring-gray-200'>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Highlight the company promise and the values behind it. */}
      <section className='bg-[#f7f4fb]'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
          <h2 className='text-2xl font-semibold text-[#200b38]'>
            {aboutPromise.heading}
          </h2>
          <blockquote className='mt-6 border-l-4 border-[#efb52b] pl-6 text-2xl font-medium text-[#200b38] sm:text-3xl'>
            “{aboutPromise.tagline}”
          </blockquote>
          <div className='mt-8 max-w-3xl space-y-4'>
            {aboutPromise.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className='leading-relaxed text-gray-700'>
                {paragraph}
              </p>
            ))}
          </div>
          <ul className='mt-12 grid gap-6 sm:grid-cols-3'>
            {aboutValues.map((value) => (
              <li
                key={value.title}
                className='rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200'>
                <h3 className='text-lg font-semibold text-[#200b38]'>
                  {value.title}
                </h3>
                <p className='mt-2 text-gray-700'>{value.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* End with a way to get in touch, matching the header button. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <div className='rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {aboutClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{aboutClosing.text}</p>
          <a
            href={company.phoneHref}
            className='mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
            Call {company.phone} for a quote
          </a>
        </div>
      </section>
    </main>
  );
}