'use client';

import { useEffect, useRef } from 'react';

type StickyHeaderProps = {
  children: React.ReactNode;
  className?: string;
};

// The header stays pinned to the top. Once the page is scrolled,
// it gets more compact so it covers less of the content.
export default function StickyHeader({ children, className = '' }: StickyHeaderProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const header = ref.current;
    if (!header) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      header.toggleAttribute('data-scrolled', window.scrollY > 24);
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
      className={className}>
      {children}
    </header>
  );
}
