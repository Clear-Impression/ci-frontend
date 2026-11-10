'use client';

import { useEffect, useRef } from 'react';

type StickyHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

// Compact after scrolling past this point, and expand again near the top.
const collapseAfter = 80;
const expandBelow = 8;

// The header is pinned to the top of the screen. Once the page is scrolled,
// it gets more compact so it covers less of the content.
//
// The header floats above the page, and an empty spacer underneath keeps the
// page content in place. That way the header can shrink and grow without
// moving the page, which is what used to make it twitch while scrolling.
export default function StickyHeader({ children, className = '' }: StickyHeaderProps) {
  const ref = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const header = ref.current;
    const spacer = spacerRef.current;
    if (!header || !spacer) return;
    let frame = 0;

    // The spacer matches the full-size header. Measure only when the header is
    // full size and nothing in it is animating, so the page never moves.
    const measure = () => {
      if (header.hasAttribute('data-scrolled')) return;
      if (header.getAnimations({ subtree: true }).length > 0) return;
      spacer.style.height = `${header.offsetHeight}px`;
    };
    const onTransitionEnd = () => requestAnimationFrame(measure);

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const compact = header.hasAttribute('data-scrolled');
      if (!compact && y > collapseAfter) header.setAttribute('data-scrolled', '');
      else if (compact && y < expandBelow) header.removeAttribute('data-scrolled');
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measure);
    header.addEventListener('transitionend', onTransitionEnd);
    // Fonts and the logo can change the height just after loading.
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measure);
      header.removeEventListener('transitionend', onTransitionEnd);
    };
  }, []);

  return (
    <>
      <div
        ref={spacerRef}
        aria-hidden='true'
        className='site-header-spacer'
      />
      <header
        ref={ref}
        className={className}>
        {children}
      </header>
    </>
  );
}
