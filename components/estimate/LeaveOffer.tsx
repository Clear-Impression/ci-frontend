'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { jakarta } from '@/app/fonts';
import { leaveOffers, packages } from '@/data/packages';
import { googleRating, googleReviews, googleReviewsUrl } from '@/data/reviews';
import './leave-offer.css';

// What Gold adds, straight from the package list.
const goldExtras = (packages.find((entry) => entry.id === 'gold')?.includes ?? [])
  .filter((item) => item.added)
  .map((item) => item.label);

// Three rows of reviews drifting behind the card, each starting at a different review.
const riverRows = [0, 1, 2].map((row) => {
  const start = (row * Math.ceil(googleReviews.length / 3)) % googleReviews.length;
  return [...googleReviews.slice(start), ...googleReviews.slice(0, start)];
});

const shownKey = 'ci-leave-offer-shown';

type LeaveOfferProps = {
  // Off once the request is sent (or while it's sending).
  armed: boolean;
  price: string;
  canPickGold: boolean;
  onPickGold: () => void;
};

// Shown once per visit when someone looks like they're leaving the estimate
// (real reviews drifting behind a glass card with the $50 referral and Gold):
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
        className='lo-river'
        aria-hidden='true'>
        {riverRows.map((row, index) => (
          <div
            key={index}
            className='lo-river-row'>
            {[...row, ...row].map((review, position) => (
              <div
                key={`${review.id}-${position}`}
                className='lo-river-chip'>
                <span>{'★'.repeat(review.rating)}</span>
                <p>“{review.quote}”</p>
                <b>{review.name}</b>
              </div>
            ))}
          </div>
        ))}
      </div>

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

        <h2 id='lo-title'>
          Still not
          <br />
          <span>convinced?</span>
        </h2>
        <p className='lo-sub'>
          {googleRating.count} neighbors gave us five stars. Your estimate of <b>{price}</b> is still here, with
          nothing to pay today.
        </p>
        <a
          className='lo-rating'
          href={googleReviewsUrl}
          target='_blank'
          rel='noreferrer'>
          ★ {googleRating.score.toFixed(1)} on Google
        </a>

        <div className='lo-offers'>
          <div className='lo-offer lo-refer'>
            <span
              className='lo-badge'
              aria-hidden='true'>
              $50
            </span>
            <div>
              <b>{leaveOffers.referral.title}</b>
              <p>{leaveOffers.referral.text}</p>
              <button
                type='button'
                className='lo-mini'
                onClick={copyLink}>
                {copied ? 'Link copied ✓' : 'Copy our link for a friend'}
              </button>
            </div>
          </div>
          <div className='lo-offer lo-gold'>
            <span
              className='lo-badge'
              aria-hidden='true'>
              Gold
            </span>
            <div>
              <b>Gold gets you everything</b>
              <ul>
                <li>Inside and out, like Silver</li>
                {goldExtras.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
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
