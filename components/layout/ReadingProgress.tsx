'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Long pages where it helps to see how far you've read: the service terms,
// each service page, and blog posts.
const longPages = /^\/(terms-and-conditions|services\/[^/]+|blog\/[^/]+)\/?$/;

// A thin green line along the bottom of the header that fills as the page
// scrolls. It only shows on long pages.
export default function ReadingProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLSpanElement>(null);
  const show = longPages.test(pathname ?? '');

  useEffect(() => {
    const bar = barRef.current;
    if (!show || !bar) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const room = document.documentElement.scrollHeight - window.innerHeight;
      const read = room > 0 ? Math.min(1, Math.max(0, window.scrollY / room)) : 0;
      bar.style.setProperty('--read', read.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [show, pathname]);

  if (!show) return null;
  return (
    <div
      aria-hidden='true'
      className='reading-progress'>
      <span ref={barRef} />
    </div>
  );
}
