'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import QuoteButton from '@/components/quote/QuoteButton';
import { company } from '@/data/company';
import { clearerViewCta } from '@/data/about';
import './clearer-view.css';

type Point = { x: number; y: number };

const photo = '/images/home/clearer-view-window.jpg';
// Coarse grid used to tell how much of the glass has been wiped.
const GRID_X = 24;
const GRID_Y = 14;
// Once this much is wiped, the rest of the dust fades away on its own.
const DONE_AT = 0.5;

// Small seeded random numbers, so the dust looks the same on every visit.
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return value / 2147483647;
  };
}

// The closing "Let's make your windows shine." card. The words rise in when it
// scrolls into view and a soft light follows the mouse. The photo starts
// behind dusty glass: a squeegee wipes one stripe to show the idea, mouse users
// wipe the rest themselves, and on phones the squeegee cleans it on its own so
// scrolling works normally. Once it's clean, sparkles pop and the quote button
// glows.
export default function ClearerViewCta() {
  const cardRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bladeRef = useRef<HTMLSpanElement>(null);
  const wipeRef = useRef<((from: Point, to: Point) => void) | null>(null);
  const last = useRef<Point | null>(null);
  const busy = useRef(false);
  const [seen, setSeen] = useState(false);
  const [phase, setPhase] = useState<'still' | 'dirty' | 'clean'>('still');
  const [hint, setHint] = useState(false);
  const [mouseOnPhoto, setMouseOnPhoto] = useState(false);
  const [autoWiping, setAutoWiping] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const frame = frameRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!card || !frame || !canvas || !ctx) return;

    // Reduced motion: the CSS shows everything straight away, with no wiping.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const wiped = new Set<number>();
    const image = new window.Image();
    let raf = 0;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    const size = () => ({ w: frame.clientWidth, h: frame.clientHeight });
    const brush = () => Math.max(48, size().h * 0.24);

    const paintDust = () => {
      const { w, h } = size();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = 'source-over';

      // The same photo, blurred and dull, as if seen through dirty glass.
      const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
      const dw = image.naturalWidth * scale;
      const dh = image.naturalHeight * scale;
      ctx.filter = 'blur(6px) saturate(0.45) brightness(0.85)';
      ctx.drawImage(image, (w - dw) / 2, (h - dh) / 2, dw, dh);
      ctx.filter = 'none';

      ctx.fillStyle = 'rgba(160, 138, 112, 0.38)';
      ctx.fillRect(0, 0, w, h);

      // Water spots and specks of dust.
      const random = seeded(11);
      for (let i = 0; i < (w * h) / 700; i++) {
        ctx.fillStyle = random() > 0.5 ? 'rgba(255, 250, 238, 0.42)' : 'rgba(80, 64, 48, 0.3)';
        ctx.beginPath();
        ctx.arc(random() * w, random() * h, 0.6 + random() * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      // Old drips running down the glass.
      ctx.strokeStyle = 'rgba(255, 250, 238, 0.14)';
      ctx.lineCap = 'round';
      for (let i = 0; i < 12; i++) {
        const x = random() * w;
        ctx.lineWidth = 5 + random() * 12;
        ctx.beginPath();
        ctx.moveTo(x, random() * h * 0.4);
        ctx.lineTo(x + (random() - 0.5) * 40, h * (0.5 + random() * 0.5));
        ctx.stroke();
      }
    };

    // Clear a stroke of glass, like one pass of a squeegee.
    const wipe = (from: Point, to: Point) => {
      const { w, h } = size();
      const width = brush();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineCap = 'round';
      ctx.lineWidth = width;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'black';
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
      ctx.shadowBlur = 0;

      const cellW = w / GRID_X;
      const cellH = h / GRID_Y;
      const r = width * 0.4;
      const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y) / 10));
      for (let i = 0; i <= steps; i++) {
        const x = from.x + ((to.x - from.x) * i) / steps;
        const y = from.y + ((to.y - from.y) * i) / steps;
        for (let gx = Math.floor((x - r) / cellW); gx <= Math.floor((x + r) / cellW); gx++) {
          for (let gy = Math.floor((y - r) / cellH); gy <= Math.floor((y + r) / cellH); gy++) {
            if (gx >= 0 && gx < GRID_X && gy >= 0 && gy < GRID_Y) wiped.add(gy * GRID_X + gx);
          }
        }
      }
      if (wiped.size / (GRID_X * GRID_Y) >= DONE_AT) setPhase('clean');
    };
    wipeRef.current = wipe;

    const moveBlade = (p: Point) => {
      bladeRef.current?.style.setProperty('transform', `translate3d(${p.x}px, ${p.y}px, 0)`);
    };

    // Run the squeegee along a path on its own.
    const autoWipe = (path: Point[], duration: number) =>
      new Promise<void>((resolve) => {
        busy.current = true;
        setAutoWiping(true);
        const start = performance.now();
        let previous = path[0];
        const step = (now: number) => {
          if (cancelled) return resolve();
          const t = Math.min(1, Math.max(0, (now - start) / duration));
          const along = t * (path.length - 1);
          const leg = Math.min(path.length - 2, Math.floor(along));
          const local = along - leg;
          const point = {
            x: path[leg].x + (path[leg + 1].x - path[leg].x) * local,
            y: path[leg].y + (path[leg + 1].y - path[leg].y) * local,
          };
          wipe(previous, point);
          moveBlade(point);
          previous = point;
          if (t < 1) raf = requestAnimationFrame(step);
          else {
            busy.current = false;
            setAutoWiping(false);
            resolve();
          }
        };
        raf = requestAnimationFrame(step);
      });

    const start = async () => {
      setSeen(true);
      if (!image.complete || !image.naturalWidth) return;
      // Give the words a moment to rise in, then show the teaser stripe.
      await new Promise((resolve) => setTimeout(resolve, 700));
      if (cancelled) return;
      const { w, h } = size();
      await autoWipe(
        [
          { x: w * 0.22, y: -20 },
          { x: w * 0.3, y: h * 0.5 },
          { x: w * 0.24, y: h + 20 },
        ],
        1300,
      );
      if (cancelled) return;
      if (finePointer) {
        setHint(true);
        return;
      }
      // Touch screens: clean the rest in a few sweeping passes.
      const passes: Point[] = [];
      for (let row = 0; row <= 4; row++) {
        const y = (h * row) / 4;
        passes.push({ x: row % 2 ? w + 20 : -20, y }, { x: row % 2 ? -20 : w + 20, y });
      }
      await autoWipe(passes, 2400);
    };

    image.onload = () => {
      if (cancelled) return;
      paintDust();
      setPhase('dirty');
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          observer?.disconnect();
          start();
        },
        { threshold: 0.45 },
      );
      observer.observe(card);
    };
    // If the photo can't load, still show the card.
    image.onerror = () => setSeen(true);
    image.src = photo;

    const onResize = () => {
      if (!busy.current && wiped.size / (GRID_X * GRID_Y) < DONE_AT && image.complete) {
        wiped.clear();
        paintDust();
      }
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // A soft light follows the mouse across the card, and the photo tilts toward it.
  function onCardMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType !== 'mouse') return;
    const box = cardRef.current?.getBoundingClientRect();
    if (!box) return;
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    cardRef.current?.style.setProperty('--mx', `${x * 100}%`);
    cardRef.current?.style.setProperty('--my', `${y * 100}%`);
    cardRef.current?.style.setProperty('--tilt-x', `${(0.5 - y) * 5}deg`);
    cardRef.current?.style.setProperty('--tilt-y', `${(x - 0.6) * 7}deg`);
  }

  // Mouse wiping: the squeegee follows the pointer and cleans as it goes.
  function onPhotoMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse' || phase !== 'dirty' || busy.current) return;
    const frame = frameRef.current;
    const box = frame?.getBoundingClientRect();
    if (!frame || !box) return;
    // Map from the tilted on-screen box back to the photo's own size.
    const point = {
      x: ((event.clientX - box.left) / box.width) * frame.clientWidth,
      y: ((event.clientY - box.top) / box.height) * frame.clientHeight,
    };
    bladeRef.current?.style.setProperty('transform', `translate3d(${point.x}px, ${point.y}px, 0)`);
    if (last.current) {
      wipeRef.current?.(last.current, point);
      setHint(false);
    }
    last.current = point;
  }

  const showBlade = phase === 'dirty' && (autoWiping || mouseOnPhoto);
  const { eyebrow, headingLines, highlight, text } = clearerViewCta;

  return (
    <section
      ref={cardRef}
      aria-labelledby='clearer-view-heading'
      data-in={seen || undefined}
      data-phase={phase}
      onPointerMove={onCardMove}
      className='cv'>
      <span
        aria-hidden='true'
        className='cv-light'
      />
      <span
        aria-hidden='true'
        className='cv-bubbles'>
        <i />
        <i />
        <i />
        <i />
        <i />
      </span>

      <div className='cv-copy'>
        <p className='cv-eyebrow'>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'>
            <path
              d='M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z'
              fill='currentColor'
            />
          </svg>
          {eyebrow}
        </p>
        <h2
          id='clearer-view-heading'
          className='cv-title'>
          {headingLines.map((line, index) => (
            <span
              key={line}
              className='cv-line'>
              <span style={{ '--i': index } as React.CSSProperties}>
                {line}
                {index === headingLines.length - 1 && (
                  <>
                    {' '}
                    <em>{highlight}</em>
                  </>
                )}
              </span>
            </span>
          ))}
        </h2>
        <p className='cv-text'>{text}</p>
        <div className='cv-actions'>
          <QuoteButton className='cv-quote'>
            Get a free quote
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2.2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M5 12h14M13 6l6 6-6 6' />
            </svg>
          </QuoteButton>
          <a
            href={company.phoneHref}
            className='cv-call'>
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <path d='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2' />
            </svg>
            <span>Call {company.phone}</span>
          </a>
        </div>
        <p
          aria-live='polite'
          className='cv-done'>
          {phase === 'clean' ? 'Sparkling ✨ That’s the Clear Impression difference.' : ''}
        </p>
      </div>

      <div className='cv-visual'>
        <div
          ref={frameRef}
          onPointerMove={onPhotoMove}
          onPointerEnter={(event) => event.pointerType === 'mouse' && setMouseOnPhoto(true)}
          onPointerLeave={() => {
            setMouseOnPhoto(false);
            last.current = null;
          }}
          className='cv-photo'>
          <Image
            src={photo}
            alt='Spotless windows on a stucco home with palm trees reflected in the glass.'
            fill
            sizes='(min-width: 1024px) 560px, 100vw'
          />
          {/* The dusty glass, wiped away stroke by stroke. */}
          <canvas
            ref={canvasRef}
            aria-hidden='true'
            className='cv-dust'
          />
          <span
            aria-hidden='true'
            className='cv-glare'
          />
          <span
            ref={bladeRef}
            aria-hidden='true'
            data-shown={showBlade || undefined}
            className='cv-blade'>
            <i />
          </span>
          {hint && phase === 'dirty' && (
            <span
              aria-hidden='true'
              className='cv-hint'>
              Move your mouse to wipe the glass ✨
            </span>
          )}
          {phase === 'clean' && (
            <span
              aria-hidden='true'
              className='cv-sparkles'>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <svg
                  key={i}
                  viewBox='0 0 24 24'
                  style={{ '--i': i } as React.CSSProperties}>
                  <path
                    d='M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z'
                    fill='currentColor'
                  />
                </svg>
              ))}
            </span>
          )}
        </div>
        <span
          aria-hidden='true'
          className='cv-chip'>
          <i />
          Pure water · Spot-free finish
        </span>
      </div>
    </section>
  );
}
