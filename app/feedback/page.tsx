import type { Metadata } from 'next';
import FeedbackForm from '@/components/feedback/FeedbackForm';
import { company } from '@/data/company';
import { feedbackPage } from '@/data/feedback';
import styles from './feedback.module.css';

const title = 'Feedback | Clear Impression Services';
const description =
  'Share feedback about your window cleaning service with Clear Impression. Tell us what went well and what we can improve.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${company.website}feedback` },
};

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

export default function FeedbackPage() {
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
            {feedbackPage.title}
          </h1>
          <p
            className={`${styles.enter} mt-6 max-w-2xl text-lg text-white/80`}
            style={{ '--delay': '180ms' } as React.CSSProperties}>
            {feedbackPage.description}
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
            {/* Urgent issues go straight to a person. */}
            <div
              className={`${styles.enter} ${styles.shine} relative mt-10 overflow-hidden rounded-2xl bg-[#200b38] p-6 text-white`}
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
            <FeedbackForm
              phone={company.phone}
              phoneHref={company.phoneHref}
              formUrl={company.feedbackFormUrl}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
