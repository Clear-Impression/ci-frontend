import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ApplicationForm from '@/components/careers/ApplicationForm';
import { getJobOpening, getJobOpenings } from '@/lib/careers';
import { createPageMetadata } from '@/lib/seo';
import { company } from '@/data/company';
import styles from '@/app/feedback/feedback.module.css';

type RolePageProps = {
  params: Promise<{ role: string }>;
};

// Only the listed roles have a page. Anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getJobOpenings().map((opening) => ({ role: opening.slug }));
}

export async function generateMetadata({ params }: RolePageProps): Promise<Metadata> {
  const { role } = await params;
  const opening = getJobOpening(role);
  if (!opening) notFound();

  return createPageMetadata({
    path: `/careers/${opening.slug}`,
    title: `${opening.title} | Careers | Clear Impression`,
    description: opening.summary,
  });
}
function DetailList({ heading, items }: { heading: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <>
      <h2 className='mt-8 text-xl font-semibold first:mt-0'>{heading}</h2>
      <ul className='mt-3 list-disc space-y-1.5 pl-5 leading-7 text-[#4f4857]'>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </>
  );
}

export default async function RolePage({ params }: RolePageProps) {
  const { role } = await params;
  const opening = getJobOpening(role);
  if (!opening) notFound();

  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
        <div aria-hidden='true' className={`${styles.glow} absolute -z-10`} />
        <div className='mx-auto max-w-7xl px-6 pt-8 pb-12 sm:px-8'>
          <Link
            href='/careers'
            className='inline-flex min-h-11 items-center gap-1.5 rounded-sm text-sm font-medium text-white/80 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
            <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M19 12H5M11 18l-6-6 6-6' />
            </svg>
            All open roles
          </Link>
          <p className={`${styles.enter} mt-3 text-sm font-semibold uppercase tracking-widest text-[#efb52b]`}>
            Now hiring
          </p>
          <h1
            className={`${styles.enter} mt-2.5 text-4xl font-semibold tracking-tight sm:text-5xl`}
            style={{ '--delay': '90ms' } as React.CSSProperties}>
            {opening.title}
          </h1>
          <div
            className={`${styles.enter} mt-5 flex flex-wrap gap-2 text-[13px] font-semibold`}
            style={{ '--delay': '180ms' } as React.CSSProperties}>
            <span className='rounded-full bg-white/12 px-3 py-1.5'>{opening.employmentType}</span>
            <span className='rounded-full bg-white/12 px-3 py-1.5'>Phoenix metro, based in Mesa</span>
            {opening.pay && (
              <span className='rounded-full bg-[#efb52b] px-3 py-1.5 text-[#200b38]'>{opening.pay}</span>
            )}
          </div>
        </div>
      </section>

      <section className='bg-[#f7f4fb]'>
        <div className='mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:gap-14'>
          {/* The role details from data/careers.ts. */}
          <aside className={styles.enter} style={{ '--delay': '250ms' } as React.CSSProperties}>
            <p className='leading-relaxed text-[#4f4857]'>{opening.summary}</p>
            <div className='mt-8'>
              <DetailList heading='What you’ll do' items={opening.duties} />
              <DetailList heading='What we’re looking for' items={opening.requirements} />
              {opening.schedule && (
                <>
                  <h2 className='mt-8 text-xl font-semibold'>Schedule</h2>
                  <p className='mt-3 leading-7 text-[#4f4857]'>{opening.schedule}</p>
                </>
              )}
            </div>

            <div className={`${styles.shine} relative mt-9 overflow-hidden rounded-2xl bg-[#200b38] p-6 text-white`}>
              <p className='text-sm text-white/70'>Questions about the role?</p>
              <a
                href={company.phoneHref}
                className='mt-2 inline-block rounded-sm text-2xl font-semibold tracking-tight text-[#efb52b] hover:text-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
                {company.phone}
              </a>
              <p className='mt-1 text-sm text-white/70'>Call or text and ask for Niels.</p>
            </div>
          </aside>

          <div className={styles.rise} style={{ '--delay': '300ms' } as React.CSSProperties}>
            <ApplicationForm
              role={opening.slug}
              roleTitle={opening.title}
              phone={company.phone}
              phoneHref={company.phoneHref}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
