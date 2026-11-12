'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { BeforeAfterPair } from '@/data/beforeAfter';

type HomeBeforeAfterProps = {
  eyebrow: string;
  title: readonly string[];
  intro: string;
  pairs: readonly BeforeAfterPair[];
};

const clamp = (value: number) => Math.min(100, Math.max(0, value));
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

// One photo with a draggable divider: "before" on the left, "after" on the right.
function Slider({ pair, index }: { pair: BeforeAfterPair; index: number }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const touched = useRef(false);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  // The first time it scrolls into view, the handle sweeps across once to
  // show that it can be dragged. Skipped for reduced motion or once touched.
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let timer = 0;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          const stops = [50, 94, 6, 50];
          const start = performance.now();
          const duration = 2200;
          const step = (now: number) => {
            if (touched.current) return;
            // The first frame's timestamp can land just before `start`, so clamp at 0.
            const t = Math.min(1, Math.max(0, (now - start) / duration));
            const leg = Math.min(stops.length - 2, Math.floor(t * (stops.length - 1)));
            const local = t * (stops.length - 1) - leg;
            setPosition(stops[leg] + (stops[leg + 1] - stops[leg]) * easeInOut(local));
            if (t < 1) raf = requestAnimationFrame(step);
          };
          raf = requestAnimationFrame(step);
        }, 350 + index * 280);
      },
      { threshold: 0.6 },
    );
    observer.observe(frame);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [index]);

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

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (dragging) moveTo(event.clientX);
  }

  function stopDragging() {
    setDragging(false);
  }

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      data-dragging={dragging || undefined}
      className='hx-compare-frame'
      style={{ '--pos': `${position}%` } as CSSProperties}>
      {/* After: the full photo underneath. */}
      <Image
        src={pair.after}
        alt={`${pair.alt}, after cleaning`}
        fill
        sizes='(min-width: 1100px) 380px, (min-width: 760px) 50vw, 100vw'
        draggable={false}
        style={{ objectPosition: pair.focus }}
      />

      {/* Before: the same frame on top, cut off at the handle. */}
      <div className='hx-before'>
        <Image
          src={pair.before}
          alt={`${pair.alt}, before cleaning`}
          fill
          sizes='(min-width: 1100px) 380px, (min-width: 760px) 50vw, 100vw'
          draggable={false}
          className={pair.simulated ? 'ba-dull' : ''}
          style={{ objectPosition: pair.focus }}
        />
        {pair.simulated && (
          <span
            aria-hidden='true'
            className='ba-grime'
          />
        )}
      </div>

      <span
        className='hx-compare-label'
        data-side='before'>
        BEFORE
      </span>
      <span
        className='hx-compare-label'
        data-side='after'>
        AFTER
      </span>

      {/* The divider and its round handle. */}
      <span
        aria-hidden='true'
        className='hx-compare-line'
      />
      <span
        aria-hidden='true'
        className='hx-compare-handle'>
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
        aria-label={`Compare before and after: ${pair.title.replace(/\.$/, '')}`}
        aria-valuetext={`${Math.round(position)}% before`}
      />
    </div>
  );
}

// "Drag the handle" section: before-and-after photos people can slide across.
export default function HomeBeforeAfter({ eyebrow, title, intro, pairs }: HomeBeforeAfterProps) {
  const lastLine = title.length - 1;
  return (
    <section
      aria-labelledby='results-heading'
      className='hx-section hx-results'>
      <div className='hx-container'>
        <p className='hx-eyebrow hx-reveal'>{eyebrow}</p>
        <div className='hx-heading-row'>
          <h2
            id='results-heading'
            className='hx-h2'>
            {title.map((line, index) => (
              <span
                key={line}
                className='line-mask'>
                <span
                  className='line-rise'
                  style={{ '--i': index } as CSSProperties}>
                  {index === lastLine && lastLine > 0 ? <em>{line}</em> : line}
                </span>{' '}
              </span>
            ))}
          </h2>
          <p className='hx-reveal'>{intro}</p>
        </div>

        <ul
          data-count={pairs.length}
          className='hx-compare-grid'>
          {pairs.map((pair, index) => (
            <li
              key={pair.title}
              className='hx-compare-card hx-reveal'
              style={{ '--d': `${index * 90}ms` } as CSSProperties}>
              <Slider
                pair={pair}
                index={index}
              />
              <h3>{pair.title}</h3>
              <p>{pair.caption}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
