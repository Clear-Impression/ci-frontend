'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { company } from '@/data/company';
import styles from '@/app/estimate/estimate.module.css';

type HelpBubbleProps = {
  // Sit higher when the progress bar is showing at the bottom.
  raised?: boolean;
};

// A floating help button in the bottom corner. It opens a small card with
// the phone number so stuck visitors can reach a real person.
export default function HelpBubble({ raised = false }: HelpBubbleProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape or a click anywhere else.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`fixed right-4 z-40 flex flex-col items-end gap-3 transition-[bottom] duration-300 sm:right-6 ${raised ? 'bottom-28 lg:bottom-6' : 'bottom-6'}`}>
      {open && (
        <div
          id='help-card'
          role='dialog'
          aria-labelledby='help-title'
          className={`${styles.helpCard} w-72 rounded-2xl bg-white p-5 shadow-2xl shadow-[#200b38]/25 ring-1 ring-[#200b38]/10`}>
          <p
            id='help-title'
            className='text-lg font-semibold text-[#200b38]'>
            Stuck? Speak to a live agent
          </p>
          <p className='mt-1 text-sm leading-6 text-gray-600'>
            A real person from our team can help you pick services or answer questions.
          </p>
          <a
            href={company.phoneHref}
            className='mt-4 flex min-h-12 items-center justify-center gap-2 rounded-lg bg-[#200b38] px-4 py-3 font-semibold text-white hover:bg-[#33195a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
            <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
              <path d='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2' />
            </svg>
            Call {company.phone}
          </a>
          <a
            href='sms:+14806220622'
            className='mt-2 flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-[#6c3fb8] hover:bg-[#f7f4fb] focus-visible:outline-2 focus-visible:outline-[#6c3fb8]'>
            Or send us a text
          </a>
        </div>
      )}

      <button
        ref={buttonRef}
        type='button'
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls='help-card'
        className={`${styles.helpButton} group flex items-center gap-3 rounded-full bg-[#200b38] py-1.5 pl-1.5 text-white shadow-xl shadow-[#200b38]/30 ring-2 ring-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] ${open || raised ? 'pr-1.5' : 'pr-1.5 sm:pr-5'}`}>
        <span className='relative grid size-12 place-items-center overflow-hidden rounded-full bg-[#200b38]'>
          <Image
            src={company.logo}
            alt=''
            width={48}
            height={48}
            className='size-12'
          />
          <span
            aria-hidden='true'
            className='absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-[#efb52b] text-xs font-bold text-[#200b38] ring-2 ring-[#200b38]'>
            ?
          </span>
        </span>
        <span className={`text-sm font-semibold ${open || raised ? 'sr-only' : 'sr-only sm:not-sr-only'}`}>
          {open ? 'Close help' : 'Stuck? Talk to us'}
        </span>
      </button>
    </div>
  );
}
