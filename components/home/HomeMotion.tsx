'use client';

import { useEffect } from 'react';

// Fades and slides homepage content up as it scrolls into view, and runs a
// light shimmer across each section. Anything marked "hx-reveal" or
// "hx-section" gets a data-in attribute the first time it appears.
export default function HomeMotion() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('.hx-reveal, .hx-section'));
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.setAttribute('data-in', ''));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute('data-in', '');
          observer.unobserve(entry.target);
        }),
      { threshold: 0.12, rootMargin: '0px 0px -35px' },
    );
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return null;
}
