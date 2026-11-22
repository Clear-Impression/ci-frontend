'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { jakarta } from '@/app/fonts';
import { clearPricePromise, leaveOffers } from '@/data/packages';
import { googleRating, googleReviews, googleReviewsUrl } from '@/data/reviews';

// Why it makes sense, in our own words from the rest of the site.
const reasons = [
  { title: 'Spot-free, pure water', text: 'Deionized water outside, so the glass dries clear with no streaks.' },
  { title: 'Your home stays clean', text: 'Drop cloths and shoe covers inside, every time.' },
  { title: 'No surprise charges', text: clearPricePromise.text.split('. ').slice(1, 2).join('') + '.' },
  { title: 'Fully insured', text: 'Local to the Phoenix metro area, and 100% honest.' },
];

const shownKey = 'ci-leave-offer-shown';

type LeaveOfferProps = {
  // Off once the request is sent (or while it's sending).
  armed: boolean;
  price: string;
  canPickGold: boolean;
  onPickGold: () => void;
};

// Shown once per visit when someone looks like they're leaving the estimate
// (why it makes sense, then what neighbors say):
// the Back button, the browser's back, or the mouse heading for the tabs.
// It never shows while they're answering, so the page stays smooth.
export default function LeaveOffer({ armed, price, canPickGold, onPickGold }: LeaveOfferProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [canLeave, setCanLeave] = useState(false);
  const shown = useRef(false);
  const armedRef = useRef(armed);
  const leave = useRef<(() => void) | null>(null);
  const keepRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    armedRef.current = armed;
  }, [armed]);

  useEffect(() => {
    try {
      shown.current = sessionStorage.getItem(shownKey) === '1';
    } catch {
      // Storage blocked: the offer can still show once on this page.
    }

    const startedAt = Date.now();

    // Returns true if the offer opened (so leaving should wait).
    const show = (onLeave: (() => void) | null) => {
      if (shown.current || !armedRef.current) return false;
      shown.current = true;
      try {
        sessionStorage.setItem(shownKey, '1');
      } catch {}
      leave.current = onLeave;
      setCanLeave(Boolean(onLeave));
      setOpen(true);
      return true;
    };

    // 1. The site's Back button.
    const onClick = (event: MouseEvent) => {
      const button = (event.target as Element | null)?.closest?.('.back-button button');
      if (!(button instanceof HTMLButtonElement)) return;
      if (show(() => button.click())) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    // 2. The browser's back button: after the first tap or click, one extra
    // history entry for this same page. Going back lands on it first.
    let guarded = false;
    const guard = () => {
      if (guarded || shown.current) return;
      guarded = true;
      window.history.pushState({ ...window.history.state, ciLeaveGuard: true }, '', window.location.href);
    };
    const onPopState = (event: PopStateEvent) => {
      if (!guarded || event.state?.ciLeaveGuard) return;
      guarded = false;
      if (!show(() => window.history.back())) window.history.back();
    };

    // 3. On a computer, the mouse leaving through the top of the window.
    const onMouseOut = (event: MouseEvent) => {
      if (event.relatedTarget || event.clientY > 0 || Date.now() - startedAt < 8000) return;
      show(null);
    };

    document.addEventListener('click', onClick, true);
    window.addEventListener('pointerdown', guard, { once: true });
    window.addEventListener('keydown', guard, { once: true });
    window.addEventListener('popstate', onPopState);
    document.addEventListener('mouseout', onMouseOut);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('pointerdown', guard);
      window.removeEventListener('keydown', guard);
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    keepRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  const stay = () => setOpen(false);
  const go = () => {
    setOpen(false);
    leave.current?.();
  };

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  // On the page body, so it sits above the site header.
  return createPortal(
    <div
      className={`lo-backdrop ${jakarta.variable}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) stay();
      }}>
      <div
        className='lo'
        role='dialog'
        aria-modal='true'
        aria-labelledby='lo-title'>
        <button
          type='button'
          className='lo-close'
          aria-label='Close'
          onClick={stay}>
          ×
        </button>
        <p className='lo-kicker'>Before you go</p>
        <h2 id='lo-title'>Why this makes sense</h2>
        <p className='lo-sub'>
          Your estimate is still here: <em>{price}</em>. No email needed, no payment now.
        </p>

        <ul className='lo-reasons'>
          {reasons.map((reason) => (
            <li key={reason.title}>
              <span aria-hidden='true'>✓</span>
              <div>
                <b>{reason.title}</b>
                <p>{reason.text}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className='lo-cards'>
          <div className='lo-card lo-refer'>
            <span
              className='lo-badge'
              aria-hidden='true'>
              $50
            </span>
            <b>{leaveOffers.referral.title}</b>
            <p>{leaveOffers.referral.text}</p>
            <button
              type='button'
              className='lo-mini'
              onClick={copyLink}>
              {copied ? 'Link copied ✓' : 'Copy our link for a friend'}
            </button>
          </div>
          <div className='lo-card lo-gold'>
            <span
              className='lo-badge'
              aria-hidden='true'>
              7
            </span>
            <b>{leaveOffers.guarantee.title}</b>
            <p>{leaveOffers.guarantee.text}</p>
            {canPickGold && (
              <button
                type='button'
                className='lo-mini'
                onClick={() => {
                  setOpen(false);
                  onPickGold();
                }}>
                Switch me to Gold
              </button>
            )}
          </div>
        </div>

        <div className='lo-neighbors'>
          <div className='lo-neighbors-head'>
            <div>
              <h3>Still not convinced?</h3>
              <p>See what your neighbors say.</p>
            </div>
            <a
              className='lo-rating'
              href={googleReviewsUrl}
              target='_blank'
              rel='noreferrer'>
              <b>{googleRating.score.toFixed(1)}</b>
              <span aria-hidden='true'>★★★★★</span>
              <small>{googleRating.count} Google reviews</small>
            </a>
          </div>
          <ul className='lo-reviews'>
            {googleReviews.map((review) => (
              <li key={review.id}>
                <span
                  className='lo-stars'
                  aria-label={`${review.rating} out of 5 stars`}>
                  {'★'.repeat(review.rating)}
                </span>
                <p>“{review.quote}”</p>
                <b>{review.name}</b>
              </li>
            ))}
          </ul>
        </div>

        <div className='lo-actions'>
          <button
            ref={keepRef}
            type='button'
            className='lo-keep'
            onClick={stay}>
            Keep my estimate
          </button>
          <button
            type='button'
            className='lo-leave'
            onClick={go}>
            {canLeave ? 'Leave anyway' : 'No thanks'}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
