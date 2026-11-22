'use client';

import { useEffect, useRef, useState } from 'react';
import { leaveOffers } from '@/data/packages';

const shownKey = 'ci-leave-offer-shown';

type LeaveOfferProps = {
  // Off once the request is sent (or while it's sending).
  armed: boolean;
  price: string;
  canPickGold: boolean;
  onPickGold: () => void;
};

// Shown once per visit when someone looks like they're leaving the estimate:
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
    keepRef.current?.focus();
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

  return (
    <div
      className='lo-backdrop'
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
        <h2 id='lo-title'>
          Your estimate is still here: <em>{price}</em>
        </h2>
        <p className='lo-sub'>No email needed, no payment now. Two things worth knowing:</p>

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
    </div>
  );
}
