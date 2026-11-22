import type { Metadata } from 'next';
import Link from 'next/link';
import { verifyOwnerSession } from '@/lib/ownerSession';
import { getApplication, getApplications, type ApplicationSummary } from '@/lib/ownerApplications';

// Verify the session and load fresh applications on every request.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Applications | Owner Dashboard | Clear Impression',
  robots: { index: false, follow: false },
};

type ApplicationsPageProps = {
  searchParams: Promise<{ role?: string; id?: string }>;
};

const focusRing = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]';

function appliedOn(iso: string, withYear = false) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
    timeZone: 'America/Phoenix',
  }).format(new Date(iso));
}

function fileLabel(application: ApplicationSummary) {
  const type = application.resume_filename.split('.').pop()?.toUpperCase() ?? 'File';
  const size = application.resume_size_bytes;
  return `${type}, ${size < 1024 * 1024 ? `${Math.max(1, Math.round(size / 1024))} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`}`;
}

// Keep the role filter when picking someone, and the selection when filtering.
function pageHref(role: string | undefined, id: string | undefined) {
  const params = new URLSearchParams();
  if (role) params.set('role', role);
  if (id) params.set('id', id);
  const query = params.toString();
  return `/owner/applications${query ? `?${query}` : ''}`;
}

function Unavailable({ title, text }: { title: string; text: string }) {
  return (
    <main className='flex-1 bg-[#faf8fd] px-6 py-16 sm:px-8'>
      <div className='mx-auto max-w-lg rounded-2xl border border-[#200b38]/10 bg-white p-6 sm:p-8'>
        <h1 className='text-2xl font-semibold text-[#200b38]'>{title}</h1>
        <p className='mt-4 leading-7 text-[#686170]'>{text}</p>
        <form action='/owner/applications' method='get' className='mt-6'>
          <button type='submit' className={`min-h-12 rounded-lg bg-[#200b38] px-5 py-3 font-semibold text-white hover:bg-[#432462] ${focusRing}`}>
            Try again
          </button>
        </form>
      </div>
    </main>
  );
}

export default async function OwnerApplicationsPage({ searchParams }: ApplicationsPageProps) {
  if (!(await verifyOwnerSession())) {
    return <Unavailable title='Unable to verify your sign-in' text='Please try again to open your applications.' />;
  }

  const applications = await getApplications();
  if (!applications) {
    return <Unavailable title='Applications are unavailable' text='We couldn’t load applications right now. Please try again in a moment.' />;
  }

  const { role, id } = await searchParams;

  // One filter per role that has applications, in the order they first appear.
  const roles = [...new Map(applications.map((item) => [item.role_slug, item.role_title])).entries()];
  const activeRole = roles.some(([slug]) => slug === role) ? role : undefined;
  const shown = applications.filter((item) => !activeRole || item.role_slug === activeRole);
  const selectedId = shown.some((item) => item.id === id) ? id : shown[0]?.id;
  const selected = selectedId ? await getApplication(selectedId) : null;

  const filters = [
    { slug: undefined, title: 'All', count: applications.length },
    ...roles.map(([slug, title]) => ({
      slug,
      title,
      count: applications.filter((item) => item.role_slug === slug).length,
    })),
  ];

  return (
    <main className='flex-1 bg-[#faf8fd] px-6 py-12 sm:px-8 sm:py-16'>
      <div className='mx-auto max-w-7xl text-[#200b38]'>
        <Link href='/owner' className={`inline-flex min-h-12 items-center font-semibold text-[#6c3fb8] hover:underline ${focusRing}`}>
          ← Back to owner dashboard
        </Link>
        <h1 className='mt-4 text-3xl font-semibold'>Applications</h1>
        <p className='mt-3 leading-7 text-[#686170]'>Newest first. Pick someone to see their answers and resume.</p>

        {applications.length === 0 ? (
          <div className='mt-8 rounded-2xl border border-dashed border-[#200b38]/20 bg-white p-10 text-center'>
            <h2 className='text-xl font-semibold'>No applications yet</h2>
            <p className='mx-auto mt-2 max-w-md leading-7 text-[#686170]'>
              Applications from the Careers page will show up here and in your email.
            </p>
          </div>
        ) : (
          <>
            {roles.length > 1 && (
              <nav aria-label='Filter by role' className='mt-6 flex flex-wrap gap-2'>
                {filters.map((filter) => {
                  const active = filter.slug === activeRole;
                  return (
                    <Link
                      key={filter.slug ?? 'all'}
                      href={pageHref(filter.slug, undefined)}
                      aria-current={active ? 'page' : undefined}
                      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 text-sm font-medium transition ${focusRing} ${
                        active
                          ? 'border-[#200b38] bg-[#200b38] text-white'
                          : 'border-[#200b38]/15 bg-white text-[#200b38] hover:border-[#200b38]/30'
                      }`}>
                      {filter.title}
                      <span className='opacity-70'>{filter.count}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            <div className='mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]'>
              {/* The list. Each row is a link, so it works with a keyboard and the back button. */}
              <div className='overflow-hidden rounded-2xl border border-[#200b38]/10 bg-white'>
                <div className='hidden grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_7rem] gap-4 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#686170] sm:grid'>
                  <span>Applicant</span>
                  <span>Role</span>
                  <span>Applied</span>
                  <span>Resume</span>
                </div>
                <ul>
                  {shown.map((item) => {
                    const current = item.id === selectedId;
                    return (
                      <li key={item.id} className='border-t border-[#f0edf3] first:border-t-0 sm:first:border-t'>
                        <Link
                          href={pageHref(activeRole, item.id)}
                          aria-current={current ? 'true' : undefined}
                          scroll={false}
                          className={`grid gap-x-4 gap-y-1 px-5 py-4 transition sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1.4fr)_minmax(0,0.8fr)_7rem] sm:items-center ${focusRing} ${
                            current ? 'bg-[#f3eefa] shadow-[inset_3px_0_0_#6c3fb8]' : 'hover:bg-[#faf8fd]'
                          }`}>
                          <span className='min-w-0'>
                            <span className='block truncate font-semibold'>{item.name}</span>
                            {item.city && <span className='block text-[13px] text-[#686170]'>{item.city}</span>}
                          </span>
                          <span className='text-sm text-[#4f4857]'>{item.role_title}</span>
                          <span className='text-sm text-[#4f4857]'>{appliedOn(item.created_at)}</span>
                          <span className='text-[13px] text-[#686170]'>{fileLabel(item)}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* The selected applicant. */}
              <aside aria-label='Applicant details' className='rounded-2xl border border-[#200b38]/10 bg-white p-6 sm:p-7 lg:sticky lg:top-32'>
                {selected ? (
                  <>
                    <p className='text-[13px] text-[#686170]'>
                      {selected.role_title} · applied {appliedOn(selected.created_at, true)}
                    </p>
                    <h2 className='mt-1.5 text-2xl font-semibold'>{selected.name}</h2>

                    <div className='mt-4 flex flex-wrap gap-2'>
                      <a
                        href={`tel:${selected.phone.replace(/[^\d+]/g, '')}`}
                        className={`inline-flex min-h-11 items-center gap-2 rounded-lg bg-[#200b38] px-4 text-sm font-semibold text-white hover:bg-[#432462] ${focusRing}`}>
                        <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                          <path d='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z' />
                        </svg>
                        {selected.phone}
                      </a>
                      <a
                        href={`mailto:${selected.email}`}
                        className={`inline-flex min-h-11 items-center rounded-lg border border-[#200b38]/15 bg-white px-4 text-sm font-semibold hover:bg-[#faf8fd] ${focusRing}`}>
                        Email
                      </a>
                    </div>

                    <dl className='mt-6 grid grid-cols-[8rem_minmax(0,1fr)] gap-x-4 gap-y-3 text-sm leading-6'>
                      <dt className='text-[#686170]'>Email</dt>
                      <dd className='break-words'>{selected.email}</dd>
                      <dt className='text-[#686170]'>City</dt>
                      <dd>{selected.city ?? 'Not given'}</dd>
                      <dt className='text-[#686170]'>License &amp; car</dt>
                      <dd>{selected.has_license ? 'Yes' : 'No'}</dd>
                      <dt className='text-[#686170]'>Days</dt>
                      <dd>{selected.available_days.join(', ')}</dd>
                      <dt className='text-[#686170]'>Can start</dt>
                      <dd>
                        {selected.start_date
                          ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
                            .format(new Date(`${selected.start_date}T00:00:00Z`))
                          : 'Not given'}
                      </dd>
                      <dt className='text-[#686170]'>Experience</dt>
                      <dd className='whitespace-pre-line'>{selected.experience ?? 'Not given'}</dd>
                    </dl>

                    {/* Goes through the website, which adds the owner's sign-in. */}
                    <a
                      href={`/owner/applications/${selected.id}/resume`}
                      className={`mt-6 flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[#200b38]/10 bg-[#f7f4fb] px-4 text-sm font-semibold hover:bg-[#efe8f8] ${focusRing}`}>
                      <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4.5' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M12 4v12M7 11l5 5 5-5M4 20h16' />
                      </svg>
                      Download resume ({fileLabel(selected)})
                    </a>
                  </>
                ) : (
                  <p className='leading-7 text-[#686170]'>We couldn’t load this application. Please try again.</p>
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
