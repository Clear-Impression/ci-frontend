'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Review } from '@/data/reviews';

type ReviewRolodexProps = {
  reviews: readonly Review[];
  googleUrl: string;
  // Opens a review in full.
  onOpen: (review: Review) => void;
};

// How long each card stays in front while the rolodex turns on its own.
const SPIN_MS = 4500;

// Real Google reviews on a spinning rolodex: index cards around a drum that
// flips forward to the next card every few seconds, like thumbing through a
// card file. It stops while you hover or focus it. The arrows, the up and
// down keys, or a swipe flip it by hand, and the pause button stops it for
// good. Only the card in front is read out to screen readers.
export default function ReviewRolodex({ reviews, googleUrl, onOpen }: ReviewRolodexProps) {
  const count = reviews.length;
  const step = 360 / count;
  // How far each card sits from the rod, so the cards meet edge to edge.
  const radius = Math.round(140 / Math.tan(Math.PI / count));
  // Keeps counting past the last card, so the drum always spins the same way.
  const [turn, setTurn] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [reduced, setReduced] = useState(false);
  const dragStart = useRef<number | null>(null);
  const active = ((turn % count) + count) % count;

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReduced(query.matches);
      if (query.matches) setPlaying(false);
    };
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  // Flip to the next card every few seconds, unless paused or held.
  useEffect(() => {
    if (!playing || held) return;
    const timer = window.setInterval(() => setTurn((value) => value + 1), SPIN_MS);
    return () => window.clearInterval(timer);
  }, [playing, held]);

  const flip = useCallback((by: number) => setTurn((value) => value + by), []);

  // Another part of the page can ask for one review (the themes below do).
  // Turn forward to it the short way and stop spinning so it stays in front.
  useEffect(() => {
    const onShow = (event: Event) => {
      const index = reviews.findIndex((review) => review.id === (event as CustomEvent<string>).detail);
      if (index < 0) return;
      setPlaying(false);
      setTurn((value) => {
        const current = ((value % count) + count) % count;
        let by = index - current;
        if (by > count / 2) by -= count;
        if (by < -count / 2) by += count;
        return value + by;
      });
    };
    window.addEventListener('rolodex:show', onShow);
    return () => window.removeEventListener('rolodex:show', onShow);
  }, [reviews, count]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      flip(1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      flip(-1);
    }
  };

  // A swipe or drag up or down flips one card.
  const onPointerDown = (event: React.PointerEvent) => {
    dragStart.current = event.clientY;
  };
  const onPointerUp = (event: React.PointerEvent) => {
    if (dragStart.current === null) return;
    const moved = event.clientY - dragStart.current;
    dragStart.current = null;
    if (Math.abs(moved) > 36) flip(moved < 0 ? 1 : -1);
  };

  return (
    <div
      id='review-rolodex'
      role='region'
      aria-roledescription='carousel'
      aria-label='Google reviews'
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false);
      }}
      onKeyDown={onKeyDown}
      className='rx'
      data-reduced={reduced || undefined}>
      <div
        className='rx-stage'
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (dragStart.current = null)}>
        <ul
          className='rx-drum'
          aria-live={playing && !held ? 'off' : 'polite'}
          style={{ '--turn': turn * step, '--r': `${radius}px` } as React.CSSProperties}>
          {reviews.map((review, index) => {
            // How far this card is from the front, either way round.
            const raw = Math.abs(index - active);
            const distance = Math.min(raw, count - raw);
            const front = index === active;
            return (
              <li
                key={review.id}
                aria-hidden={!front}
                inert={!front}
                data-front={front || undefined}
                className='rx-card'
                style={
                  {
                    '--angle': `${-index * step}deg`,
                    '--fade': distance === 0 ? 1 : distance === 1 ? 0.5 : 0,
                  } as React.CSSProperties
                }>
                {/* The tab on top, like the tab on a rolodex card. */}
                <span className='rx-tab'>
                  <span aria-hidden='true'>{review.name.charAt(0)}</span>
                  {review.name}
                </span>
                <span
                  aria-hidden='true'
                  className='rx-stars'>
                  {'★'.repeat(review.rating)}
                </span>
                <span className='sr-only'>{review.rating} out of 5 stars.</span>
                <blockquote className='rx-quote'>&ldquo;{review.quote}&rdquo;</blockquote>
                <span className='rx-foot'>
                  <button
                    type='button'
                    aria-haspopup='dialog'
                    onClick={() => onOpen(review)}
                    className='rx-read'>
                    Read in full
                  </button>
                  <a
                    href={review.url ?? googleUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='rx-google'>
                    See on Google
                    <svg
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <path d='M7 17L17 7M9 7h8v8' />
                    </svg>
                    <span className='sr-only'> (opens in a new tab)</span>
                  </a>
                </span>
                {/* The two slots at the bottom of every rolodex card. */}
                <span
                  aria-hidden='true'
                  className='rx-slots'>
                  <i />
                  <i />
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className='rx-controls'>
        <button
          type='button'
          aria-label='Previous review'
          onClick={() => flip(-1)}
          className='rx-btn'>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M6 15l6-6 6 6' />
          </svg>
        </button>
        <p
          aria-live='polite'
          className='rx-count'>
          <b>{String(active + 1).padStart(2, '0')}</b>
          <span aria-hidden='true'> / </span>
          <span className='sr-only'> of </span>
          {String(count).padStart(2, '0')}
        </p>
        <button
          type='button'
          aria-label='Next review'
          onClick={() => flip(1)}
          className='rx-btn'>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M6 9l6 6 6-6' />
          </svg>
        </button>
        {!reduced && (
          <button
            type='button'
            aria-label={playing ? 'Pause the spinning reviews' : 'Spin the reviews'}
            onClick={() => setPlaying(!playing)}
            className='rx-btn rx-play'>
            {playing ? (
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='currentColor'>
                <rect
                  x='7'
                  y='6'
                  width='3.5'
                  height='12'
                  rx='1'
                />
                <rect
                  x='13.5'
                  y='6'
                  width='3.5'
                  height='12'
                  rx='1'
                />
              </svg>
            ) : (
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='currentColor'>
                <path d='M8 6.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 8 6.5z' />
              </svg>
            )}
          </button>
        )}
        {/* A thin bar that fills while the current card waits its turn. */}
        {playing && !held && (
          <span
            key={turn}
            aria-hidden='true'
            className='rx-timer'
            style={{ '--spin': `${SPIN_MS}ms` } as React.CSSProperties}
          />
        )}
      </div>
    </div>
  );
}
