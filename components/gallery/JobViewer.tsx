'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import QuoteButton from '@/components/quote/QuoteButton';
import type { GalleryJob } from '@/data/gallery';
import styles from '@/app/gallery/gallery.module.css';

function Chevron({ direction }: { direction: 'previous' | 'next' }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='size-5'>
      <path d={direction === 'previous' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  );
}

// A job opened up over the page: its photos and videos one at a time, with
// what we did, a link to the service, and the quote button. Esc or the close
// button puts it away, and the arrow keys step through the photos.
export default function JobViewer({ job, onClose }: { job: GalleryJob; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [slide, setSlide] = useState(0);
  const count = job.media.length;
  const media = job.media[slide];

  // Open as a modal so focus stays inside, and stop the page behind from scrolling.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      if (dialog.open) dialog.close();
    };
  }, []);

  const step = (by: number) => setSlide((current) => (current + by + count) % count);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby='job-viewer-title'
      onClose={onClose}
      onKeyDown={(event) => {
        if (count < 2) return;
        if (event.key === 'ArrowLeft') step(-1);
        if (event.key === 'ArrowRight') step(1);
      }}
      // Tapping the dark area around the photo closes it too.
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
      className={styles.viewer}>
      <div className={styles.viewerInner}>
        <div className='flex items-center justify-between gap-4 text-sm text-white/80'>
          <span>{count > 1 ? `Photo ${slide + 1} of ${count}` : job.city}</span>
          <button
            type='button'
            onClick={() => dialogRef.current?.close()}
            aria-label='Close'
            className={styles.viewerButton}>
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              className='size-5'>
              <path d='M6 6l12 12M18 6 6 18' />
            </svg>
          </button>
        </div>

        <div className={styles.viewerStage}>
          {count > 1 && (
            <button
              type='button'
              onClick={() => step(-1)}
              aria-label='Previous photo'
              className={`${styles.viewerButton} ${styles.viewerSide}`}>
              <Chevron direction='previous' />
            </button>
          )}
          <div className={styles.viewerMedia}>
            {media.video ? (
              // Plays silently on a loop, like the videos on the city pages.
              // It starts paused for visitors who have turned off motion.
              <video
                key={media.video.url}
                src={media.video.url}
                poster={media.photo ? `${media.photo.url}?w=1600&auto=format` : undefined}
                aria-label={media.alt || undefined}
                autoPlay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
                muted
                loop
                playsInline
                controls
              />
            ) : media.photo ? (
              <Image
                key={media.photo.url}
                src={media.photo.url}
                alt={media.alt}
                fill
                sizes='100vw'
              />
            ) : null}
          </div>
          {count > 1 && (
            <button
              type='button'
              onClick={() => step(1)}
              aria-label='Next photo'
              className={`${styles.viewerButton} ${styles.viewerSide}`}>
              <Chevron direction='next' />
            </button>
          )}
        </div>

        <div className={styles.viewerFooter}>
          <div className='min-w-0'>
            <h2
              id='job-viewer-title'
              className='text-lg font-semibold'>
              {job.title} · {job.city}
            </h2>
            {job.caption && <p className='mt-1 leading-7 text-white/75'>{job.caption}</p>}
          </div>
          <div className='flex flex-wrap items-center gap-4'>
            {job.service && (
              <Link
                href={job.service.href}
                className='inline-flex min-h-11 items-center font-semibold text-[#efb52b] hover:text-white'>
                {job.service.title} &gt;
              </Link>
            )}
            {/* Close this first, so the quote popup isn't stuck behind it. */}
            <QuoteButton
              onOpen={() => dialogRef.current?.close()}
              className='inline-flex min-h-12 items-center rounded-full bg-[#55ab68] px-6 font-semibold text-white hover:bg-[#4b9d5e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
              Get a free quote
            </QuoteButton>
          </div>
        </div>

        {/* On phones the side arrows move under the photo. */}
        {count > 1 && (
          <div className={styles.viewerPhoneArrows}>
            <button
              type='button'
              onClick={() => step(-1)}
              aria-label='Previous photo'
              className={styles.viewerButton}>
              <Chevron direction='previous' />
            </button>
            <button
              type='button'
              onClick={() => step(1)}
              aria-label='Next photo'
              className={styles.viewerButton}>
              <Chevron direction='next' />
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}
