'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { GalleryPair } from '@/data/gallery';
import styles from '@/app/gallery/gallery.module.css';

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function Arrow({ direction }: { direction: 'previous' | 'next' }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='size-5'>
      <path d={direction === 'previous' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  );
}

// The Gallery header: the page's words on the left, and a before-and-after
// slider on the right. Visitors drag the handle to compare the two photos.
// With more than one pair, arrows on each side switch between them.
export default function GalleryCompare({
  pairs,
  children,
}: {
  pairs: readonly GalleryPair[];
  // The eyebrow, heading, and intro.
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const pair = pairs[index];
  const many = pairs.length > 1;

  // Once the page loads, the handle sweeps across to show that it can be
  // dragged, like on the homepage. Skipped for reduced motion or once touched.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const timer = window.setTimeout(() => {
      const stops = [50, 94, 6, 50];
      const start = performance.now();
      const duration = 2200;
      const step = (now: number) => {
        if (touched.current) return;
        const t = Math.min(1, Math.max(0, (now - start) / duration));
        const leg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)));
        const local = t * (stops.length - 1) - leg;
        setPosition(stops[leg] + (stops[leg + 1] - stops[leg]) * easeInOut(local));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, 700);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!pair) return <div>{children}</div>;

  function show(next: number) {
    touched.current = true;
    setIndex((next + pairs.length) % pairs.length);
    setPosition(50);
  }

  function moveTo(clientX: number) {
    const box = frameRef.current?.getBoundingClientRect();
    if (!box) return;
    setPosition(clamp(((clientX - box.left) / box.width) * 100));
  }

  function onPointerDown(event: React.PointerEvent<HTMLDivElement>) {
    touched.current = true;
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  }

  return (
    <div className={styles.heroRow}>
      <div>
        {children}
        {/* What this pair shows, with a dot for each pair. */}
        <div
          aria-live='polite'
          className={styles.pairText}>
          <p className='text-lg font-semibold'>{pair.title}</p>
          {pair.caption && <p className='mt-1 leading-7 text-white/70'>{pair.caption}</p>}
          {many && (
            <p className='sr-only'>
              Pair {index + 1} of {pairs.length}
            </p>
          )}
        </div>
        {many && (
          <div
            aria-hidden='true'
            className={styles.pairDots}>
            {pairs.map((_, dot) => (
              <span
                key={dot}
                data-on={dot === index || undefined}
              />
            ))}
          </div>
        )}
      </div>

      <div className={styles.compareRow}>
        {many && (
          <button
            type='button'
            onClick={() => show(index - 1)}
            aria-label='Previous before and after'
            className={styles.pairArrow}>
            <Arrow direction='previous' />
          </button>
        )}
        <div
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerMove={(event) => dragging && moveTo(event.clientX)}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          data-dragging={dragging || undefined}
          className={styles.compareFrame}
          style={{ '--pos': `${position}%` } as CSSProperties}>
          {/* After: the full photo underneath. */}
          <Image
            key={`${pair.after.url}-after`}
            src={pair.after.url}
            alt={`${pair.alt}, after cleaning`}
            fill
            priority={index === 0}
            sizes='(min-width: 1024px) 55vw, 100vw'
            draggable={false}
            style={{ objectPosition: pair.after.focus }}
          />
          {/* Before: the same frame on top, cut off at the handle. */}
          <div className={styles.compareBefore}>
            <Image
              key={`${pair.before.url}-before`}
              src={pair.before.url}
              alt={`${pair.alt}, before cleaning`}
              fill
              priority={index === 0}
              sizes='(min-width: 1024px) 55vw, 100vw'
              draggable={false}
              style={{ objectPosition: pair.before.focus }}
            />
          </div>
          <span
            className={styles.compareLabel}
            data-side='before'>
            Before
          </span>
          <span
            className={styles.compareLabel}
            data-side='after'>
            After
          </span>
          <span
            aria-hidden='true'
            className={styles.compareLine}
          />
          <span
            aria-hidden='true'
            className={styles.compareHandle}>
            <svg
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='size-5'>
              <path d='m9 7-5 5 5 5M15 7l5 5-5 5' />
            </svg>
          </span>
          {/* Keyboard and screen reader control: arrow keys move the divider. */}
          <input
            type='range'
            min={0}
            max={100}
            step={1}
            value={Math.round(position)}
            onChange={(event) => {
              touched.current = true;
              setPosition(Number(event.target.value));
            }}
            aria-label={`Compare before and after: ${pair.alt || pair.title}`}
            aria-valuetext={`${Math.round(position)}% before`}
          />
        </div>
        {many && (
          <button
            type='button'
            onClick={() => show(index + 1)}
            aria-label='Next before and after'
            className={styles.pairArrow}>
            <Arrow direction='next' />
          </button>
        )}
      </div>
    </div>
  );
}
