import Link from 'next/link';
import { getJobOpenings } from '@/lib/careers';
import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import { company } from '@/data/company';
import QuoteActions from '@/components/ui/QuoteActions';
import { careersClosing, careersPage, careersPerks, hiringSteps } from '@/data/careers';
import styles from '@/app/feedback/feedback.module.css';

const title = 'Careers | Clear Impression';
const description =
  'Join Clear Impression, a window cleaning company in Mesa serving the Phoenix metro area. See open roles and apply online.';

export const metadata = createPageMetadata({
  path: '/careers',
  title,
  description,
});

// Roles published in Sanity appear within a minute.
export const revalidate = 60;

export default async function CareersPage() {
  const [header, openings] = await Promise.all([getPageHeader('careers'), getJobOpenings()]);

  return (
    // The shared layout already supplies the website's header and footer.
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* Same header height and sizes as the other pages. */}
      <section className='page-hero relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div aria-hidden='true' className={`${styles.glow} absolute -z-10`} />
        <div className='mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <p className={`${styles.enter} text-sm font-semibold uppercase tracking-widest text-[#efb52b]`}>
            {careersPage.eyebrow}
          </p>
          <h1
            className={`${styles.enter} mt-3 max-w-3xl whitespace-pre-line text-4xl font-semibold tracking-tight sm:text-5xl`}
            style={{ '--delay': '90ms' } as React.CSSProperties}>
            {header.title}
          </h1>
          {header.subtitle && (
            <p
              className={`${styles.enter} mt-6 max-w-2xl text-lg text-white/80`}
              style={{ '--delay': '180ms' } as React.CSSProperties}>
              {header.subtitle}
            </p>
          )}
        </div>
      </section>

      {/* Open roles, straight from Sanity. */}
      <section aria-labelledby='open-roles' className='bg-[#f7f4fb]'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:px-8'>
          <div className='flex flex-wrap items-end justify-between gap-4'>
            <div>
              <h2 id='open-roles' className='text-2xl font-semibold tracking-tight sm:text-3xl'>
                Open roles
              </h2>
              <p className='mt-2 leading-relaxed text-[#686170]'>A resume is required with every application.</p>
            </div>
            {openings.length > 0 && (
              <p className='text-sm text-[#686170]'>
                {openings.length} open {openings.length === 1 ? 'role' : 'roles'}
              </p>
            )}
          </div>

          {openings.length > 0 ? (
            <ul className='mt-7 space-y-4'>
              {openings.map((opening, index) => (
                <li
                  key={opening.slug}
                  className={styles.enter}
                  style={{ '--delay': `${250 + index * 90}ms` } as React.CSSProperties}>
                  <Link
                    href={`/careers/${opening.slug}`}
                    className='group flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#200b38]/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] sm:p-7'>
                    <span className='min-w-0 flex-1 basis-96'>
                      <span className='flex flex-wrap gap-2'>
                        <span className='rounded-full bg-[#eee7f8] px-2.5 py-1 text-[13px] font-semibold text-[#4b2a85]'>
                          {opening.employmentType}
                        </span>
                        {opening.pay && (
                          <span className='rounded-full bg-[#fff6d8] px-2.5 py-1 text-[13px] font-semibold text-[#6b4e00]'>
                            {opening.pay}
                          </span>
                        )}
                      </span>
                      <span className='mt-3.5 block text-xl font-semibold'>{opening.title}</span>
                      <span className='mt-2 block max-w-2xl leading-relaxed text-[#4f4857]'>{opening.summary}</span>
                    </span>
                    <span className='inline-flex min-h-12 items-center gap-2 rounded-xl bg-[#200b38] px-5 text-sm font-semibold text-white transition group-hover:bg-[#33195a]'>
                      View role &amp; apply
                      <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4.5 transition group-hover:translate-x-0.5' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M5 12h14M13 6l6 6-6 6' />
                      </svg>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className='mt-7 rounded-2xl border border-dashed border-[#cfc6dc] bg-white p-10 text-center'>
              <h3 className='text-xl font-semibold'>No open roles right now</h3>
              <p className='mx-auto mt-2.5 max-w-md leading-relaxed text-[#686170]'>
                We post new roles here as soon as we’re hiring. You can also call or text{' '}
                <a href={company.phoneHref} className='font-semibold text-[#6c3fb8] underline underline-offset-4'>
                  {company.phone}
                </a>{' '}
                to ask.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8'>
        <h2 className='text-2xl font-semibold tracking-tight sm:text-3xl'>Why work with us</h2>
        <ul className='mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {careersPerks.map((perk) => (
            <li key={perk.title} className='rounded-2xl p-6 ring-1 ring-gray-200'>
              <span className='grid size-11 place-items-center rounded-xl bg-[#f7f4fb] text-[#200b38]'>
                <svg aria-hidden='true' viewBox='0 0 24 24' className='size-5.5' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'>
                  <path d={perk.icon} />
                </svg>
              </span>
              <p className='mt-4 font-semibold'>{perk.title}</p>
              <p className='mt-1.5 text-sm leading-6 text-[#686170]'>{perk.text}</p>
            </li>
          ))}
        </ul>

        <h2 className='mt-14 text-2xl font-semibold tracking-tight sm:text-3xl'>How hiring works</h2>
        <ol className='mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3'>
          {hiringSteps.map((step, index) => (
            <li key={step.title} className='flex gap-4'>
              <span className='grid size-9 shrink-0 place-items-center rounded-full bg-[#efb52b] font-bold text-[#200b38]'>
                {index + 1}
              </span>
              <div>
                <p className='mt-1.5 font-semibold'>{step.title}</p>
                <p className='mt-1.5 text-sm leading-6 text-[#686170]'>{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* End with the same call to action as the other pages. */}
      <section className='mx-auto max-w-7xl px-6 pb-16 sm:px-8 sm:pb-20'>
        <div className='rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>{careersClosing.heading}</h2>
          <p className='mt-4 max-w-2xl text-white/80'>{careersClosing.text}</p>
          <QuoteActions />
        </div>
      </section>
    </main>
  );
}
