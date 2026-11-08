'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

// The homepage has nothing to go back to, city and service pages already
// have their own back link in the same corner, and the owner sign-in page
// and dashboard are the owner's tools, not part of browsing the website.
const hiddenOn = [/^\/$/, /^\/locations\/[^/]+$/, /^\/services\/[^/]+$/, /^\/owner(\/login)?$/];

// A small "Back" button that floats just under the header. It sits over the
// page instead of in it, so the layout underneath never moves. It returns to
// the page the visitor came from, or to the homepage if they arrived from
// another website.
export default function BackButton() {
  const pathname = usePathname();
  const router = useRouter();
  const firstPath = useRef(pathname);
  const movedWithinSite = useRef(false);

  // Once the visitor opens another page here, Back can use their history.
  useEffect(() => {
    if (pathname !== firstPath.current) movedWithinSite.current = true;
  }, [pathname]);

  if (hiddenOn.some((pattern) => pattern.test(pathname))) return null;

  const goBack = () => {
    const cameFromSite =
      movedWithinSite.current || document.referrer.startsWith(window.location.origin);
    if (cameFromSite) router.back();
    else router.push('/');
  };

  return (
    // Sits below the header's menus, so open menus always cover it.
    <div className='pointer-events-none absolute inset-x-0 top-full -z-10'>
      <div className='mx-auto max-w-7xl px-6 sm:px-8'>
        <button
          type='button'
          onClick={goBack}
          className='pointer-events-auto mt-2.5 inline-flex min-h-7.5 items-center gap-1.5 rounded-full border border-white/15 bg-[#200b38]/70 pl-2.5 pr-3 text-[13px] text-white backdrop-blur-sm transition-colors hover:bg-[#200b38] focus-visible:bg-[#200b38] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b]'>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='size-3.5'>
            <path d='M19 12H5' />
            <path d='M11 18l-6-6 6-6' />
          </svg>
          Back
        </button>
      </div>
    </div>
  );
}
