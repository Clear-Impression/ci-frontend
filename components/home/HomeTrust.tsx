'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import HxIcon from '@/components/home/HxIcon';

type HomeTrustProps = {
  score: number;
  count: number;
  since: number;
  cityCount: number;
};

export default function HomeTrust({
  score,
  count,
  since,
  cityCount,
}: HomeTrustProps) {
  // Render the real figures first, even if the animation never starts.
  const [progress, setProgress] = useState(1);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list || !('IntersectionObserver' in window)) return;
    const motion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    let frame = 0;

    const finish = () => {
      if (!motion.matches) return;
      cancelAnimationFrame(frame);
      setProgress(1);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        if (motion.matches) return;
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / 1400, 1);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    observer.observe(list);
    motion.addEventListener('change', finish);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      motion.removeEventListener('change', finish);
    };
  }, []);

  const stats = [
    {
      href: '/reviews',
      label: `Rated ${score.toFixed(1)} out of 5 from ${count} Google reviews. Read our reviews`,
      value: (score * progress).toFixed(1),
      title: 'Google rating',
      note: `${Math.round(count * progress)} Google reviews`,
    },
    {
      href: '/about',
      label: `Serving the Valley since ${since}. About us`,
      // Count the year up from a little earlier, so it reads as a year.
      value: String(Math.round(since - 8 + 8 * progress)),
      title: 'Serving since',
      note: 'Proudly local to the Valley',
    },
    {
      href: '/locations',
      label: `${cityCount} cities served across the Phoenix metro. See our locations`,
      value: String(Math.round(cityCount * progress)),
      title: 'Cities served',
      note: 'Across the Phoenix metro',
    },
  ];

  return (
    <section
      aria-label='Why customers choose us'
      className='hx-stats-strip'>
      {/* Each figure links to the page that backs it up. */}
      <ul
        ref={listRef}
        className='hx-container hx-stats'>
        {stats.map((stat) => (
          <li key={stat.href}>
            <Link
              href={stat.href}
              aria-label={stat.label}
              className='hx-stat'>
              <b aria-hidden='true'>{stat.value}</b>
              <span aria-hidden='true'>
                <strong>
                  {stat.title}
                  <HxIcon
                    name='arrow'
                    size={14}
                  />
                </strong>
                <small>{stat.note}</small>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
