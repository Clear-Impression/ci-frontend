'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import OfferIcon from '@/components/layout/OfferIcon';
import type { OfferPopup as OfferPopupContent } from '@/lib/seasonal-offers';
import styles from './OfferPopup.module.css';

const closedKey = 'ci-offer-popup-closed';
// Give visitors a moment to see the page before the offer pops up.
const openDelay = 2500;

// The seasonal offer popup on the homepage. Once a visitor closes it (the X,
// "Maybe later", Escape, clicking outside, or the button), it stays closed on
// later visits until the offer changes in Sanity.
export default function OfferPopup({ offer }: { offer: OfferPopupContent }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(closedKey) === offer.id) return;
    } catch {}

    const wait = window.setTimeout(() => {
      const dialog = dialogRef.current;
      // Don't cover another popup, like the quote chooser.
      if (!dialog || dialog.open || document.querySelector('dialog[open]')) return;
      dialog.showModal();
    }, openDelay);
    return () => window.clearTimeout(wait);
  }, [offer.id]);

  const close = () => dialogRef.current?.close();

  // Every way of closing it ends up here.
  const remember = () => {
    try {
      window.localStorage.setItem(closedKey, offer.id);
    } catch {}
  };

  const external = /^(https?:|tel:|mailto:)/.test(offer.href);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby='offer-popup-title'
      onClose={remember}
      // Clicking the dark area outside the card closes it.
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className={styles.dialog}>
      <div
        data-offer-theme={offer.theme}
        style={(offer.colors ?? undefined) as React.CSSProperties | undefined}
        className={styles.card}>
        <button
          type='button'
          onClick={close}
          className={styles.close}>
          <span aria-hidden='true'>✕</span>
          <span className='sr-only'>Close</span>
        </button>

        {offer.image && (
          <div className={styles.photo}>
            <Image
              src={offer.image.url}
              alt={offer.image.alt}
              width={offer.image.width}
              height={offer.image.height}
              sizes='(min-width: 640px) 30rem, 100vw'
              style={{ objectPosition: offer.image.position }}
            />
          </div>
        )}

        <div className={styles.body}>
          <p className={styles.eyebrow}>
            <OfferIcon icon={offer.icon} />
            {offer.label}
          </p>
          <h2
            id='offer-popup-title'
            className={styles.title}>
            {offer.title}
          </h2>
          <p className={styles.text}>{offer.text}</p>
          <div className={styles.actions}>
            {external ? (
              <a
                href={offer.href}
                onClick={close}
                className={styles.go}>
                {offer.buttonLabel}
              </a>
            ) : (
              <Link
                href={offer.href}
                onClick={close}
                className={styles.go}>
                {offer.buttonLabel}
              </Link>
            )}
            <button
              type='button'
              onClick={close}
              className={styles.later}>
              Maybe later
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
}
