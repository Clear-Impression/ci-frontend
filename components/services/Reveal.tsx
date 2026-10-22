'use client';

import { useEffect, useRef } from 'react';

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  // Delay in milliseconds before this element animates in.
  delay?: number;
  as?: 'div' | 'li' | 'span';
};

// Mark the element as shown the first time it scrolls into view.
// The CSS in globals.css decides what animates when it is shown.
export default function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          element.dataset.shown = '';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      data-reveal=''
      className={className}
      style={{ '--d': `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
