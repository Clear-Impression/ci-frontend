'use client';

import { useEffect, useRef, useState } from 'react';

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

  const itemStyle = 'bg-white px-6 py-6 sm:px-8 sm:py-7';
  const numberStyle =
    'text-3xl font-semibold tracking-tight text-[#200b38] tabular-nums sm:text-4xl';
  const labelStyle = 'mt-2 text-sm leading-6 text-[#686170]';

  return (
    <section
      aria-label='Why customers choose us'
      className='relative z-10 mx-auto -mt-16 max-w-7xl px-6 sm:px-8'>
      <ul
        ref={listRef}
        className='grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#ebe6f2] shadow-xl shadow-[#200b38]/10 ring-1 ring-[#200b38]/10 lg:grid-cols-4'>
        <li className={itemStyle}>
          {/* Announce the final rating once instead of every animation frame. */}
          <p className='sr-only'>
            Rated {score.toFixed(1)} out of 5 from {count} Google reviews.
          </p>
          <div aria-hidden='true'>
            <p className={`${numberStyle} flex flex-wrap items-baseline gap-x-2`}>
              {(score * progress).toFixed(1)}
              <span className='text-base tracking-widest text-[#efb52b]'>
                ★★★★★
              </span>
            </p>
            <p className={labelStyle}>
              {Math.round(count * progress)} Google reviews
            </p>
          </div>
        </li>
        <li className={itemStyle}>
          <p className={numberStyle}>{since}</p>
          <p className={labelStyle}>Serving the Valley since</p>
        </li>
        <li className={itemStyle}>
          <p className={numberStyle}>100%</p>
          <p className={labelStyle}>Pure, deionized water outside</p>
        </li>
        <li className={itemStyle}>
          <p className={numberStyle}>{cityCount}</p>
          <p className={labelStyle}>Cities across the Phoenix metro</p>
        </li>
      </ul>
    </section>
  );
}
