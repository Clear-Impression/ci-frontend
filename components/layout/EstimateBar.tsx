'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { company } from '@/data/company';
import { formatMoney } from '@/data/estimate';
import { estimateChangeEvent, readEstimate, type EstimateSummary } from '@/lib/estimateStore';

const dismissKey = 'ci-estimate-bar-hidden';
const smsNumber = company.phoneHref.replace(/^tel:/, '');

function smsLink(estimate: EstimateSummary | null) {
  const body = estimate
    ? `Hi! I'd like to book. My instant estimate was ${formatMoney(estimate.total)} for ${estimate.services.join(', ')}.`
    : `Hi! I'd like a quote for window cleaning.`;
  return `sms:${smsNumber}?&body=${encodeURIComponent(body)}`;
}

// A small bar that floats at the bottom of every page. Once someone builds an
// instant estimate it shows their total, with buttons to adjust it or text us
// to book. Before that, it invites them to get one. It stays out of the way
// on the estimate page itself, which has its own total bar.
export default function EstimateBar() {
  const pathname = usePathname();
  const [estimate, setEstimate] = useState<EstimateSummary | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const sync = () => setEstimate(readEstimate());
    const onScroll = () => setScrolled(window.scrollY > 240);
    try {
      // Storage only exists in the browser, so this waits until after the first render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHidden(window.sessionStorage.getItem(dismissKey) === '1');
    } catch {
      setHidden(false);
    }
    sync();
    onScroll();
    window.addEventListener(estimateChangeEvent, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener(estimateChangeEvent, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('scroll', onScroll);
    };
  }, [pathname]);

  function dismiss() {
    setHidden(true);
    try {
      window.sessionStorage.setItem(dismissKey, '1');
    } catch {
      // Not saved; it stays hidden until the page reloads.
    }
  }

  if (pathname?.startsWith('/estimate')) return null;
  const shown = scrolled && !hidden;

  return (
    <div
      data-shown={shown || undefined}
      inert={!shown}
      className='estimate-bar pointer-events-none fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 sm:bottom-6'>
      <div
        role='region'
        aria-label='Your estimate'
        className='pointer-events-auto flex w-full max-w-xl items-center gap-1.5 rounded-full bg-[#2a1048] py-2 pl-5 pr-2 text-white shadow-2xl shadow-black/30 ring-1 ring-white/15 backdrop-blur-md sm:gap-2 sm:pl-6'>
        <div className='min-w-0 flex-1'>
          <p className='whitespace-nowrap text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55'>
            {estimate ? (
              <>
                <span className='sm:hidden'>Estimate</span>
                <span className='hidden sm:inline'>Your estimate</span>
              </>
            ) : (
              'Instant estimate'
            )}
          </p>
          {estimate ? (
            <p key={estimate.total} className='estimate-bar-total text-xl font-semibold tabular-nums leading-tight'>
              {formatMoney(estimate.total)}
            </p>
          ) : (
            <p className='truncate text-[15px] font-semibold leading-tight'>See your price in a minute</p>
          )}
        </div>

        <Link
          href={estimate ? '/estimate' : '/estimate?start=1'}
          className='inline-flex min-h-11 shrink-0 items-center rounded-full px-3 text-sm sm:px-4 font-semibold ring-1 ring-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b]'>
          {estimate ? 'Adjust' : 'Start'}
        </Link>
        <a
          href={smsLink(estimate)}
          className='inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-[#efb52b] px-3.5 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5'>
          <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round' className='size-4'>
            <path d='M4.5 5.5h15v10h-9l-5 4v-4h-1z' />
          </svg>
          {estimate ? 'Text & book' : 'Text us'}
        </a>
        <button
          type='button'
          onClick={dismiss}
          aria-label='Hide the estimate bar'
          className='grid size-9 shrink-0 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#efb52b]'>
          <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' className='size-4'>
            <path d='M6 6l12 12M18 6 6 18' />
          </svg>
        </button>
      </div>
    </div>
  );
}
