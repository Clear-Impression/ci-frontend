'use client';

import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
  to: number;
  suffix?: string;
};

// A number that counts up from zero the first time it scrolls into view.
// Screen readers and reduced-motion visitors get the final number straight away.
export default function CountUp({ to, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setValue(0);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1300);
          setValue(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref}>
      <span aria-hidden='true'>
        {value}
        {suffix}
      </span>
      <span className='sr-only'>
        {to}
        {suffix}
      </span>
    </span>
  );
}
