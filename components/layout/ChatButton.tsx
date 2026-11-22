'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useRef, useState } from 'react';
import { company } from '@/data/company';
import './chat-button.css';

const smsHref = `sms:${company.phoneHref.replace(/^tel:/, '')}`;

// A chat bubble icon, shared by the button and the card.
function ChatIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={className}>
      <path d='M4.5 5.5h15v10h-9l-5 4v-4h-1z' />
    </svg>
  );
}

// The "Ask a question" button in the bottom right corner. The chat itself is
// coming soon, so for now it opens a small card that says so and points people
// to a text, a call, or the FAQ. It moves up out of the way when the estimate
// bar shows on smaller screens.
export default function ChatButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardId = useId();

  // Close the card when you go to another page.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Close it with Escape or a click anywhere else.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  // The estimate page has its own bar at the bottom, and the owner pages don't need this.
  if (pathname?.startsWith('/estimate') || pathname?.startsWith('/owner')) return null;

  return (
    <div ref={wrapRef} className='chat-button fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6'>
      {open && (
        <div
          id={cardId}
          role='dialog'
          aria-labelledby={`${cardId}-title`}
          className='chat-card w-[min(22rem,calc(100vw-2rem))] rounded-3xl bg-[#200b38]/90 p-5 text-white shadow-2xl shadow-black/40 ring-1 ring-white/15 backdrop-blur-xl'>
          <div className='flex items-start gap-3'>
            <span className='grid size-10 shrink-0 place-items-center rounded-full bg-white/10 text-[#efb52b] ring-1 ring-white/15'>
              <ChatIcon className='size-5' />
            </span>
            <div className='min-w-0 flex-1'>
              <p id={`${cardId}-title`} className='font-semibold'>
                AI Chatbot is coming soon
              </p>
              <p className='mt-1 text-sm leading-6 text-white/75'>
                Soon you can ask your questions right here. Until then, we&apos;re happy to help by text or phone.
              </p>
            </div>
            <button
              type='button'
              onClick={() => {
                setOpen(false);
                buttonRef.current?.focus();
              }}
              aria-label='Close'
              className='-mr-2 -mt-2 grid size-9 shrink-0 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b]'>
              <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className='size-4'>
                <path d='M6 6l12 12M18 6 6 18' />
              </svg>
            </button>
          </div>

          <div className='mt-4 grid grid-cols-2 gap-2'>
            <a
              href={smsHref}
              className='inline-flex min-h-11 items-center justify-center rounded-full bg-[#efb52b] px-4 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
              Text us
            </a>
            <a
              href={company.phoneHref}
              className='inline-flex min-h-11 items-center justify-center rounded-full px-4 text-sm font-semibold ring-1 ring-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b]'>
              Call us
            </a>
          </div>
          <Link
            href='/faq'
            className='mt-3 inline-flex min-h-11 w-full items-center justify-center rounded-full text-sm font-semibold text-[#72c587] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b]'>
            Browse our FAQ
          </Link>
        </div>
      )}

      <button
        ref={buttonRef}
        type='button'
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
        aria-label={open ? 'Close' : 'Ask a question'}
        className='inline-flex size-14 items-center justify-center gap-2.5 rounded-full bg-[#200b38]/90 font-semibold text-white shadow-2xl shadow-black/40 ring-1 ring-white/15 backdrop-blur-xl hover:bg-[#2a1048] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b] lg:w-auto lg:px-5'>
        {open ? (
          <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className='size-5'>
            <path d='M6 6l12 12M18 6 6 18' />
          </svg>
        ) : (
          <>
            <ChatIcon className='size-6 text-[#efb52b]' />
            {/* Wide screens have room for the words. Smaller ones get just the bubble. */}
            <span aria-hidden='true' className='hidden lg:inline'>
              Ask a question
            </span>
          </>
        )}
      </button>
    </div>
  );
}
