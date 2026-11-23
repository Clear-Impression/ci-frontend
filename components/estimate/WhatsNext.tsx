'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { jakarta } from '@/app/fonts';
import { homePerks, type PerkIcon } from '@/data/homePerks';
import './whats-next.css';

// Line icons for each point.
const icons: Record<PerkIcon, string[]> = {
  bell: ['M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z', 'M10 20a2 2 0 0 0 4 0'],
  van: ['M3 7h11v9H3zM14 10h4l3 3v3h-7z', 'M5 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0M15 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  calendar: ['M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', 'm9 15 2 2 4-4'],
  star: ['M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z'],
  tag: ['M3 12V4h8l10 10-8 8z', 'M7.5 8.5h.01'],
  gift: ['M4 10h16v10H4zM3 7h18v3H3zM12 7v13', 'M12 7c-1.5-3-5-3-5-1s3 1 5 1zM12 7c1.5-3 5-3 5-1s-3 1-5 1z'],
};

type WhatsNextProps = {
  open: boolean;
  firstName: string;
  day: string;
  onClose: () => void;
};

// Pops up right after someone sends their request: what happens between now
// and cleaning day. No form here; we already have their details.
export default function WhatsNext({ open, firstName, day, onClose }: WhatsNextProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Focus the button once when it opens; Escape closes it.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className={`wn-backdrop ${jakarta.variable}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}>
      <div
        className='wn'
        role='dialog'
        aria-modal='true'
        aria-labelledby='wn-title'>
        <button
          type='button'
          className='wn-x'
          aria-label='Close'
          onClick={onClose}>
          ×
        </button>
        <span
          className='wn-mark'
          aria-hidden='true'>
          ✓
        </span>
        <p className='wn-eyebrow'>
          Request sent{firstName ? `, ${firstName}` : ''}
          {day ? ` · ${day}` : ''}
        </p>
        <h2 id='wn-title'>
          {homePerks.title} <em>{homePerks.highlight}</em>
        </h2>
        <p className='wn-lead'>{homePerks.lead}</p>
        <ul className='wn-list'>
          {homePerks.perks.map((perk, index) => (
            <li
              key={perk.title}
              style={{ '--d': `${200 + index * 80}ms` } as React.CSSProperties}>
              <span className='wn-icon'>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  {icons[perk.icon].map((path) => (
                    <path
                      key={path}
                      d={path}
                    />
                  ))}
                </svg>
              </span>
              <span>
                <b>{perk.title}</b>
                <small>{perk.text}</small>
              </span>
            </li>
          ))}
        </ul>
        <button
          ref={closeRef}
          type='button'
          className='wn-ok'
          onClick={onClose}>
          Sounds good
        </button>
      </div>
    </div>,
    document.body,
  );
}
