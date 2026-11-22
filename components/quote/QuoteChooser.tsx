'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { company } from '@/data/company';
import { openQuoteChooserEvent } from './QuoteButton';
import styles from './QuoteChooser.module.css';

const seenKey = 'ci-quote-chooser-seen';

type Kind = 'instant' | 'detailed';

// The two ways to get a price. Both list the same rows in the same order, so
// flipping the switch shows exactly what changes.
const options: Record<
  Kind,
  { label: string; big: string; note: string; rows: [string, string][]; cta: string; href: string }
> = {
  instant: {
    label: 'Instant estimate',
    big: '2 min',
    note: 'to see your price',
    rows: [
      ['Price', 'A range for your home'],
      ['Best for', 'Most homes'],
      ['Then', 'Pick a package and request a day'],
    ],
    cta: 'Start instant estimate',
    href: '/estimate#estimate',
  },
  detailed: {
    label: 'Detailed quote',
    big: 'Exact',
    note: 'price from our team',
    rows: [
      ['Price', 'One exact price'],
      ['Best for', 'Big, commercial or unusual jobs'],
      ['Then', 'We contact you with your quote'],
    ],
    cta: 'Request a detailed quote',
    href: company.quoteFormUrl,
  },
};

const kinds: Kind[] = ['instant', 'detailed'];

// A popup that explains the two ways to get a price, one at a time: a
// sliding switch flips between the instant estimate and the detailed quote.
// The first time it opens, it starts as a foggy pane of glass and a gold
// squeegee wipes it clean to reveal the options, like unwrapping a gift.
export default function QuoteChooser() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [stage, setStage] = useState<'closed' | 'fogged' | 'wiping' | 'open'>('closed');
  const [kind, setKind] = useState<Kind>('instant');

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(seenKey) === '1';
      window.sessionStorage.setItem(seenKey, '1');
    } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setKind('instant');
    dialog.showModal();
    if (seen || reduce) {
      setStage('open');
      return;
    }
    setStage('fogged');
  }, []);

  const close = () => dialogRef.current?.close();

  // Mounting the chooser handles the first click. Listen for later clicks too.
  useEffect(() => {
    open();
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
            How do you want your price?
          </h2>

          {/* The switch. Instant is picked first. */}
          <div
            className={styles.switch}
            data-on={kind}
            role='tablist'
            aria-label='Ways to get your price'>
            <span
              aria-hidden='true'
              className={styles.knob}
            />
            {kinds.map((entry) => (
              <button
                key={entry}
                id={`quote-tab-${entry}`}
                type='button'
                role='tab'
                aria-selected={kind === entry}
                aria-controls='quote-panel'
                tabIndex={kind === entry ? 0 : -1}
                onClick={() => setKind(entry)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    const next = kind === 'instant' ? 'detailed' : 'instant';
                    setKind(next);
                    document.getElementById(`quote-tab-${next}`)?.focus();
                  }
                }}>
                {options[entry].label}
              </button>
            ))}
          </div>

          <div
            key={kind}
            id='quote-panel'
            role='tabpanel'
            aria-labelledby={`quote-tab-${kind}`}
            className={styles.panel}
            data-kind={kind}>
            <p className={styles.big}>
              <b>{options[kind].big}</b>
              <span>{options[kind].note}</span>
            </p>
            <dl className={styles.rows}>
              {options[kind].rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <Link
              href={options[kind].href}
              onClick={close}
              className={styles.go}>
              {options[kind].cta}
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />
              </svg>
            </Link>
          </div>

          <p className={styles.phone}>
            Stuck? Call or text <a href={company.phoneHref}>{company.phone}</a>
          </p>
        </div>
      </div>
    </dialog>
  );
}
