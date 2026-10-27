import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Check access on every request instead of generating a public dashboard.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Owner Dashboard | Clear Impression Services',
  robots: { index: false, follow: false },
};

// links to just the local sanity server for now
const studioUrl = process.env.NEXT_PUBLIC_SANITY_STUDIO_URL || 'http://localhost:3333';

// sections of the dashboard
const sections = [
  {
    title: 'FAQs',
    description: 'Add questions, update answers, and publish changes in Sanity Studio.',
    label: 'Edit FAQs',
    href: studioUrl,
    available: true,
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
  const token = (await cookies()).get('owner_session')?.value;

  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    redirect('/owner/login');
  }

  let status = 503;

  try {
    const backend = process.env.OWNER_API_URL || process.env.API_BASE_URL || 'http://127.0.0.1:8000';
    const response = await fetch(new URL('/auth/me', backend), {
      headers: { Cookie: `owner_session=${token}` },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
    });
    status = response.status;
  } catch {
    // Keep dashboard content hidden if verification is unavailable.
    status = 503;
  }

  if (status === 401 || status === 403) {
    redirect('/owner/login');
  }

  if (status !== 200) {
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
        <p className='text-sm font-semibold text-[#6c3fb8]'>Clear Impression Services</p>
        <h1 className='mt-3 text-3xl font-semibold text-[#200b38]'>Owner dashboard</h1>
        <p className='mt-4 max-w-2xl leading-7 text-[#686170]'>
          Manage your website content and access your business tools.
        </p>

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
                {section.available ? 'Opens Sanity Studio' : 'Coming soon'}
              </p>
              {/* no keyboard navigation yet. */}
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
