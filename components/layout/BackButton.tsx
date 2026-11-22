'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { navigation } from '@/data/company';

// Main navigation pages skip the Back button. City and service details have
// their own links to the parent page, and the owner tools have their own navigation.
const mainPages = new Set(navigation.map(({ href }) => href));
const hiddenOn = [/^\/locations\/[^/]+$/, /^\/services\/[^/]+$/, /^\/owner(\/login)?$/];
const subscribeToHydration = () => () => {};

// A small "Back" button that floats just under the header. It sits over the
// page instead of in it, so the layout underneath never moves. It returns to
// the page the visitor came from, or to the homepage if they arrived from
// another website.
export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  // The server's route can differ from the browser URL on a cached response.
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const firstPath = useRef<string | null>(null);
  const movedWithinSite = useRef(false);

  // Once the visitor opens another page here, Back can use their history.
  useEffect(() => {
    if (!hydrated) return;
    if (firstPath.current === null) firstPath.current = pathname;
    else if (pathname !== firstPath.current) movedWithinSite.current = true;
  }, [hydrated, pathname]);

  if (!hydrated || mainPages.has(pathname) || hiddenOn.some((pattern) => pattern.test(pathname))) return null;

  const goBack = () => {
    const cameFromSite =
      movedWithinSite.current || document.referrer.startsWith(window.location.origin);
    if (cameFromSite) router.back();
    else router.push('/');
  };

  return (
    // Sits below the header's menus, so open menus always cover it.
    <div className='back-button pointer-events-none absolute inset-x-0 top-full -z-10'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8'>
        <button
          type='button'
          onClick={goBack}
          className='pointer-events-auto mt-2.5 inline-flex min-h-11 items-center gap-1.5 rounded-full border border-[#6c3fb8]/40 bg-[#f7f4fb] pl-3 pr-4 text-sm font-semibold text-[#200b38] transition-colors hover:bg-[#ede3f8] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]'>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='size-4 shrink-0'>
            <path d='m15 18-6-6 6-6' />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
