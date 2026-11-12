import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { company } from '@/data/company';
import QuoteActions from '@/components/ui/QuoteActions';
import { feedbackClosing, feedbackPage } from '@/data/feedback';
import { googleRating, googleWriteReviewUrl } from '@/data/reviews';
import styles from './feedback.module.css';

const title = 'Feedback | Clear Impression Services';
const description =
  'Share feedback about your window cleaning service with Clear Impression. Tell us what went well and what we can improve.';

export const metadata = createPageMetadata({
  path: '/feedback',
  title,
  description,
});

// Short points beside the form about how feedback is handled.
const highlights = [
  {
    title: 'Quick to fill out',
    text: 'Three fields and about a minute of your time.',
    icon: 'M12 7v5l3 2M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0',
  },
  {
    title: 'Read by our team',
    text: 'Every message goes straight to the people doing the work.',
    icon: 'M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6zM12 14.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  },
  {
    title: 'Used to improve',
    text: 'Your ideas help us decide what to do better on every visit.',
    icon: 'M4 17l5-5 4 4 7-7M15 9h5v5',
  },
];

export default async function FeedbackPage() {
  const header = await getPageHeader('feedback');
  return (
    // The shared layout already supplies the website's header and footer.
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* Same header height and sizes as the other pages. */}
      <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        {/* A soft glow that drifts slowly behind the header. */}
        <div aria-hidden='true' className={`${styles.glow} absolute -z-10`} />
        <div className='mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <p className={`${styles.enter} text-sm font-semibold uppercase tracking-widest text-[#efb52b]`}>
            {feedbackPage.eyebrow}
          </p>
          <h1
            className={`${styles.enter} mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl`}
            style={{ '--delay': '90ms' } as React.CSSProperties}>
            {header.title}
          </h1>
          <p
            className={`${styles.enter} mt-6 max-w-2xl text-lg text-white/80`}
            style={{ '--delay': '180ms' } as React.CSSProperties}>
            {header.subtitle}
          </p>
        </div>
      </section>

      <section className='bg-[#f7f4fb]'>
        <div className='mx-auto grid max-w-7xl gap-10 px-6 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-16'>
          {/* Why feedback matters, and a faster route for anything urgent. */}
          <aside className='lg:pt-4'>
            <h2
              className={`${styles.enter} text-2xl font-semibold tracking-tight`}
              style={{ '--delay': '250ms' } as React.CSSProperties}>
              Your opinion shapes our service
            </h2>
            <p
              className={`${styles.enter} mt-4 leading-relaxed text-gray-700`}
              style={{ '--delay': '320ms' } as React.CSSProperties}>
              Whether it’s a compliment for the crew or something we missed,
              your feedback helps us keep every visit at our standard.
            </p>
            <ul className='mt-8 space-y-5'>
              {highlights.map((item, index) => (
                <li
                  key={item.title}
                  className={`${styles.slideIn} flex gap-4`}
                  style={{ '--delay': `${420 + index * 110}ms` } as React.CSSProperties}>
                  <span className={`${styles.tile} grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#200b38] shadow-sm ring-1 ring-gray-200`}>
                    <svg aria-hidden='true' viewBox='0 0 24 24' className='size-5' fill='none' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round'>
                      <path d={item.icon} />
                    </svg>
                  </span>
                  <div>
                    <p className='font-semibold'>{item.title}</p>
                    <p className='mt-1 text-sm leading-6 text-gray-600'>{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            {/* Happy customers can share it publicly on Google. */}
            <a
              href={googleWriteReviewUrl}
              target='_blank'
              rel='noopener noreferrer'
              className={`${styles.enter} ${styles.review} group mt-10 flex flex-wrap items-center gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]`}
              style={{ '--delay': '700ms' } as React.CSSProperties}>
              <span className='grid size-12 shrink-0 place-items-center rounded-full bg-white shadow-sm ring-1 ring-gray-200'>
                {/* Google's four-color G. */}
                <svg aria-hidden='true' viewBox='0 0 24 24' className='size-6'>
                  <path fill='#4285F4' d='M22.5 12.3c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.5c2.1-1.9 3.3-4.7 3.3-8z' />
                  <path fill='#34A853' d='M12 23c3 0 5.5-1 7.3-2.7l-3.5-2.7c-1 .7-2.3 1.1-3.8 1.1-2.9 0-5.4-2-6.3-4.6H2v2.8A11 11 0 0 0 12 23z' />
                  <path fill='#FBBC05' d='M5.7 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2a11 11 0 0 0 0 9.8l3.7-2.8z' />
                  <path fill='#EA4335' d='M12 5.4c1.6 0 3.1.6 4.2 1.7l3.1-3.1A11 11 0 0 0 2 7.1l3.7 2.8C6.6 7.3 9.1 5.4 12 5.4z' />
                </svg>
              </span>
              <span className='min-w-0 flex-1 basis-48'>
                <span className='block font-semibold text-[#200b38]'>Happy with your clean?</span>
                <span className='mt-0.5 block text-sm leading-6 text-gray-600'>
                  Leave us a Google review. It helps neighbors find us.
                </span>
                <span
                  aria-hidden='true'
                  className={`${styles.stars} mt-1 flex gap-0.5 text-[#efb52b]`}>
                  {[0, 1, 2, 3, 4].map((star) => (
                    <span
                      key={star}
                      style={{ '--s': star } as React.CSSProperties}>
                      ★
                    </span>
                  ))}
                </span>
              </span>
              <span className='w-full shrink-0 rounded-full bg-[#200b38] px-4 py-2.5 text-center text-sm font-semibold text-white transition group-hover:bg-[#33195a] sm:w-auto'>
                Write a review
                <span className='sr-only'> on Google (opens in a new tab). We have {googleRating.count} reviews so far.</span>
              </span>
            </a>

            {/* Urgent issues go straight to a person. */}
            <div
              className={`${styles.enter} ${styles.shine} relative mt-4 overflow-hidden rounded-2xl bg-[#200b38] p-6 text-white`}
              style={{ '--delay': '780ms' } as React.CSSProperties}>
              <p className='text-sm text-white/70'>Need something fixed after a recent clean?</p>
              <a
                href={company.phoneHref}
                className='mt-2 inline-block rounded-sm text-2xl font-semibold tracking-tight text-[#efb52b] hover:text-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
                {company.phone}
              </a>
              <p className='mt-1 text-sm text-white/70'>Call or text, and we’ll make it right.</p>
            </div>
          </aside>

          <div
            className={styles.rise}
            style={{ '--delay': '300ms' } as React.CSSProperties}>
            <FeedbackForm phone={company.phone} phoneHref={company.phoneHref} />
          </div>
        </div>
      </section>

      {/* End with the same call to action as the other pages. */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <div className='rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {feedbackClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{feedbackClosing.text}</p>
          <QuoteActions />
        </div>
      </section>
    </main>
  );
}
