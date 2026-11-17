'use client';

import { useEffect, useRef, useState } from 'react';
import QuoteButton from '@/components/quote/QuoteButton';

export type RailSection = {
  id: string;
  label: string;
};

type SectionRailProps = {
  sections: readonly RailSection[];
};

// How long the page has to sit still before the guide slides out on its own.
const IDLE_MS = 3000;

// A small line icon for each homepage section, by section id.
const icons: Record<string, React.ReactNode> = {
  top: <path d='M4 11l8-6.5 8 6.5v8.5a.5.5 0 0 1-.5.5H15v-6H9v6H4.5a.5.5 0 0 1-.5-.5z' />,
  'why-us': <path d='M12 3.5l2.2 5.8 5.8 2.2-5.8 2.2L12 19.5l-2.2-5.8L4 11.5l5.8-2.2z' />,
  booking: (
    <>
      <rect x='4' y='5.5' width='16' height='14' rx='2' />
      <path d='M4 10h16M8.5 3.5v4M15.5 3.5v4' />
    </>
  ),
  'service-area': (
    <>
      <path d='M12 20.5s-6.5-5.6-6.5-10.5a6.5 6.5 0 0 1 13 0c0 4.9-6.5 10.5-6.5 10.5z' />
      <circle cx='12' cy='10' r='2.3' />
    </>
  ),
  services: <path d='M12 4l8.5 4.5L12 13 3.5 8.5zM3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5' />,
  results: (
    <>
      <rect x='4' y='4' width='16' height='16' rx='2' />
      <path d='M12 4v16' />
    </>
  ),
  'pure-water': <path d='M12 3.5s6 6.4 6 10.8a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z' />,
  promise: <path d='M12 3.5l7 2.8v5.6c0 4.3-2.9 7.3-7 8.6-4.1-1.3-7-4.3-7-8.6V6.3zM9 12l2 2 4-4' />,
  reviews: <path d='M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-5 4v-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z' />,
  'get-started': <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />,
};

// A frosted-glass "On this page" guide on the left of the homepage: one row
// per section, with a small icon and number. The section you're reading is
// marked in green; click any row to jump there.
//
// It stays tucked away while you scroll. When the page sits still for three
// seconds it slides in, and it slides away again as soon as you scroll. The
// three-line button at the top left pulls it out (or puts it away) any time;
// opened that way it stays until you close it.
export default function SectionRail({ sections }: SectionRailProps) {
  const [active, setActive] = useState(0);
  const [nearFooter, setNearFooter] = useState(false);
  const [idleOpen, setIdleOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [top, setTop] = useState(0);
  const idleTimer = useRef<number | undefined>(undefined);

  // Which section you're in, where the header ends, and whether the footer is up.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = 0;
      sections.forEach((section, index) => {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= line) current = index;
      });
      setActive(current);

      const header = document.querySelector('.site-header');
      setTop(Math.max(0, header ? header.getBoundingClientRect().bottom : 0));

      const footer = document.querySelector('footer');
      setNearFooter(footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.75 : false);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [sections]);

  // Slide in after the page sits still; slide away the moment you scroll.
  useEffect(() => {
    const restart = () => {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setIdleOpen(true), IDLE_MS);
    };
    const onScroll = () => {
      setIdleOpen(false);
      restart();
    };

    restart();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  // Escape puts a pulled-out guide away.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPinned(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinned]);

  const open = !nearFooter && (pinned || idleOpen);

  return (
    <div
      className='hx-sidenav-wrap'
      style={{ '--rail-top': `${top}px` } as React.CSSProperties}>
      <button
        type='button'
        aria-expanded={open}
        aria-controls='hx-sidenav'
        aria-label={open ? 'Hide the list of homepage sections' : 'Show the list of homepage sections'}
        data-open={open || undefined}
        data-hidden={nearFooter || undefined}
        onClick={() => {
          setPinned(!open);
          setIdleOpen(false);
        }}
        className='hx-sidenav-toggle'>
        <span aria-hidden='true' />
        <span aria-hidden='true' />
        <span aria-hidden='true' />
      </button>

      <nav
        id='hx-sidenav'
        aria-label='Homepage sections'
        data-shown={open || undefined}
        inert={!open}
        className='hx-sidenav'>
        <p
          aria-hidden='true'
          className='hx-sidenav-title'>
          On this page
        </p>
        <ol>
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={index === active ? 'location' : undefined}>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.6'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  {icons[section.id] ?? <circle cx='12' cy='12' r='3' />}
                </svg>
                <span>{section.label}</span>
                <small aria-hidden='true'>{String(index + 1).padStart(2, '0')}</small>
              </a>
            </li>
          ))}
        </ol>
        <QuoteButton className='hx-sidenav-quote'>
          Get a free quote
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />
          </svg>
        </QuoteButton>
      </nav>
    </div>
  );
}
