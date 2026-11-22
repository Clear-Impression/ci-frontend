import type { Metadata } from 'next';
import { verifyOwnerSession } from '@/lib/ownerSession';
import OwnerLogoutButton from '@/components/owner/OwnerLogoutButton';

// Verify the session on every dashboard request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Owner Dashboard | Clear Impression',
  robots: { index: false, follow: false },
};

const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333';

const sections = [
  {
    title: 'Website content',
    description: 'Edit FAQs, services, locations, blog posts, and page headers, then publish changes to your website.',
    label: 'Edit website content',
    href: studioUrl,
    available: true,
    note: 'Opens Sanity Studio',
  },
  {
    title: 'Master quote page',
    description: 'Open your private quote workspace.',
    label: 'Master quote page',
    href: '/owner/master-quote-page',
    available: true,
    note: 'Owner access only',
  },
  {
    title: 'Leads',
    description: 'View quote requests and customer inquiries.',
    label: 'View leads',
    href: '#',
    available: false,
  },
  {
    title: 'Jobs and statuses',
    description: 'View jobs and keep track of their progress.',
    label: 'View jobs and statuses',
    href: '#',
    available: false,
  },
];

export default async function OwnerDashboardPage() {
  if (!(await verifyOwnerSession())) {
    return (
      <main className='flex-1 bg-[#faf8fd] px-6 py-16 sm:px-8'>
        <div className='mx-auto max-w-lg rounded-2xl border border-[#200b38]/10 bg-white p-6 sm:p-8'>
          <h1 className='text-2xl font-semibold text-[#200b38]'>
            Unable to open your dashboard
          </h1>
          <p className='mt-4 leading-7 text-[#686170]'>
            We couldn’t verify your sign-in. Please try again.
          </p>
          <form action='/owner' method='get' className='mt-6'>
            <button
              type='submit'
              className='min-h-12 rounded-lg bg-[#200b38] px-5 py-3 font-semibold text-white hover:bg-[#432462] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
              Try again
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className='flex-1 bg-[#faf8fd] px-6 py-16 sm:px-8'>
      <div className='mx-auto max-w-7xl'>
        <p className='text-sm font-semibold text-[#6c3fb8]'>Clear Impression</p>
        <h1 className='mt-3 text-3xl font-semibold text-[#200b38]'>Owner dashboard</h1>
        <p className='mt-4 max-w-2xl leading-7 text-[#686170]'>
          Manage your website content and access your business tools.
        </p>
        <OwnerLogoutButton />

        <div className='mt-10 grid gap-6 md:grid-cols-3'>
          {sections.map((section) => (
            <section
              key={section.title}
              className='flex flex-col rounded-2xl border border-[#200b38]/10 bg-white p-6 sm:p-8'>
              <h2 className='text-xl font-semibold text-[#200b38]'>{section.title}</h2>
              <p className='mt-3 flex-1 text-sm leading-7 text-[#686170]'>
                {section.description}
              </p>
              <p className='mt-6 text-xs font-medium text-[#686170]'>
                {section.note ?? 'Coming soon'}
              </p>
              <a
                href={section.href}
                aria-disabled={section.available ? undefined : true}
                tabIndex={section.available ? undefined : -1}
                className={`mt-3 inline-flex min-h-12 items-center justify-center rounded-lg px-5 py-3 text-center text-sm font-semibold ${
                  section.available
                    ? 'bg-[#200b38] text-white hover:bg-[#432462] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'
                    : 'pointer-events-none border border-[#200b38]/10 bg-[#f5f0fb] text-[#686170]'
                }`}>
                {section.label}
              </a>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
