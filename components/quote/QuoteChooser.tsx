'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { company } from '@/data/company';
import styles from './QuoteChooser.module.css';

// Any "Get a free quote" button can open the chooser by sending this event.
export const openQuoteChooserEvent = 'ci:open-quote-chooser';

export function openQuoteChooser() {
  window.dispatchEvent(new Event(openQuoteChooserEvent));
}

const seenKey = 'ci-quote-chooser-seen';

// A popup that explains the two ways to get a price.
// The first time it opens, it starts as a foggy pane of glass and a gold
// squeegee wipes it clean to reveal the options, like unwrapping a gift.
export default function QuoteChooser() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [stage, setStage] = useState<'closed' | 'fogged' | 'wiping' | 'open'>('closed');

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(seenKey) === '1';
      window.sessionStorage.setItem(seenKey, '1');
    } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    dialog.showModal();
    if (seen || reduce) {
      setStage('open');
      return;
    }
    setStage('fogged');
  }, []);

  const close = () => dialogRef.current?.close();

  // Listen for any button on the site asking to open the chooser.
  useEffect(() => {
    window.addEventListener(openQuoteChooserEvent, open);
    return () => window.removeEventListener(openQuoteChooserEvent, open);
  }, [open]);

  // Unwrap: pause on the fog for a moment, then wipe, then show the options.
  useEffect(() => {
    if (stage === 'fogged') {
      const wait = window.setTimeout(() => setStage('wiping'), 650);
      return () => window.clearTimeout(wait);
    }
    if (stage === 'wiping') {
      const wait = window.setTimeout(() => setStage('open'), 1100);
      return () => window.clearTimeout(wait);
    }
  }, [stage]);

  const unwrapped = stage === 'wiping' || stage === 'open';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby='quote-chooser-title'
      onClose={() => setStage('closed')}
      // Clicking the dark area outside the card closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className={styles.dialog}>
      <div
        className={styles.card}
        data-stage={stage}>
        <button
          type='button'
          onClick={close}
          className={styles.close}>
          <span aria-hidden='true'>✕</span>
          <span className='sr-only'>Close</span>
        </button>

        {/* The foggy glass that gets wiped away. Skippable with a click. */}
        {stage !== 'open' && stage !== 'closed' && (
          <button
            type='button'
            onClick={() => setStage('open')}
            className={styles.fog}
            data-wiping={unwrapped ? '' : undefined}>
            <span className={styles.fogText}>
              <span className={styles.fogTitle}>Your free quote</span>
              <span className={styles.fogHint}>Wiping the glass…</span>
            </span>
            <span aria-hidden='true' className={styles.blade} />
            <span className='sr-only'>Skip to the options</span>
          </button>
        )}

        <div
          className={styles.inner}
          data-shown={unwrapped ? '' : undefined}
          inert={!unwrapped}>
          <h2
            id='quote-chooser-title'
            className={styles.title}>
            Two ways to get your price
          </h2>
          <p className={styles.lead}>Not sure which? Start with the instant estimate. You can always ask for a detailed quote after.</p>

          <div className={styles.options}>
            {/* Option 1: instant estimate, with a tiny live preview. */}
            <Link
              href='/estimate?start=1'
              onClick={close}
              className={`${styles.option} ${styles.optionDark}`}
              style={{ '--n': 0 } as React.CSSProperties}>
              <span className={styles.badgeGold}>About 2 minutes</span>
              <span className={styles.optionTitle}>Instant estimate</span>
              <span
                aria-hidden='true'
                className={styles.demo}>
                <span className={styles.demoRow}>
                  <span>Home size</span>
                  <span className={styles.demoSize}>
                    <span>1,400 sq ft</span>
                    <span>2,000 sq ft</span>
                    <span>2,600 sq ft</span>
                  </span>
                </span>
                <span className={styles.demoTrack}>
                  <span className={styles.demoFill} />
                </span>
                <span className={styles.demoPrice}>
                  <span>Your estimate</span>
                  <span className={styles.demoTicker}>
                    <span>$180</span>
                    <span>$215</span>
                    <span>$245</span>
                  </span>
                </span>
              </span>
              <span className={styles.points}>
                <span>Pick your services and size</span>
                <span>See a ballpark price right away</span>
                <span>Download a PDF summary</span>
              </span>
              <span className={styles.ctaGold}>
                Start instant estimate
              </span>
            </Link>

            {/* Option 2: detailed quote from the team. */}
            <Link
              href={company.quoteFormUrl}
              onClick={close}
              className={`${styles.option} ${styles.optionLight}`}
              style={{ '--n': 1 } as React.CSSProperties}>
              <span className={styles.badgeViolet}>Exact price</span>
              <span className={styles.optionTitle}>Detailed quote</span>
              <span
                aria-hidden='true'
                className={`${styles.demo} ${styles.demoLight}`}>
                <span className={styles.check}>Tell us about your property</span>
                <span className={styles.check}>Our team reviews it</span>
                <span className={styles.check}>You get an exact price</span>
              </span>
              <span className={styles.points}>
                <span>Best for big or unusual jobs</span>
                <span>A real person prices it for you</span>
                <span>Free, with no obligation</span>
              </span>
              <span className={styles.ctaDark}>
                Request a detailed quote
              </span>
            </Link>
          </div>

          {/* Talk to a person instead. */}
          <a
            href={company.phoneHref}
            className={styles.live}>
            <span
              aria-hidden='true'
              className={styles.liveIcon}>
              <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2' />
              </svg>
            </span>
            <span className={styles.liveText}>
              <span className={styles.liveTitle}>Stuck? Speak to a live person</span>
              <span className={styles.liveSub}>Call or text {company.phone}</span>
            </span>
          </a>
        </div>
      </div>
    </dialog>
  );
}
