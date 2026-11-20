'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

type StickyHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

const collapseAfter = 112;
const expandAt = 1;

// The header stays pinned to the top. Once the page is scrolled,
// it gets more compact so it covers less of the content.
// On the homepage it turns to frosted glass over the video at the top of the
// page (data-glass), and saves its full height in --hdr-top so the video can
// start under it.
export default function StickyHeader({ children, className = '' }: StickyHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  const glass = usePathname() === '/';

  // Keep --hdr-top up to date with the header's full (not scrolled) height.
  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    const measure = () => {
      if (header.hasAttribute('data-scrolled')) return;
      document.documentElement.style.setProperty('--hdr-top', `${header.offsetHeight}px`);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      // Leave room for the header to resize without crossing both thresholds.
      const compact = header.hasAttribute('data-scrolled');
      const threshold = compact ? expandAt : collapseAfter;
      header.toggleAttribute('data-scrolled', window.scrollY > threshold);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <header
      ref={ref}
      data-glass={glass ? '' : undefined}
      className={className}>
      {children}
    </header>
  );
}
