import type { Metadata } from 'next';

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

export default function OwnerDashboardPage() {
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
