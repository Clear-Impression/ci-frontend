'use client';

import { useEffect, useRef, useState } from 'react';

export type RailSection = {
  id: string;
  label: string;
};

type SectionRailProps = {
  sections: readonly RailSection[];
};

// How long the page has to sit still before the guide slides out on its own.
const IDLE_MS = 4000;

// A slim "On this page" guide on the left of the homepage: a numbered pill for
// each section. The section you're reading turns gold and shows its name;
// hover any pill to see its name too, and click to jump there.
//
// It stays tucked away while you scroll. If you stop for about four seconds it
// fades in, and it fades out again as soon as you scroll. The three-line
// button at the top left pulls it out (or puts it away) any time; opened that
// way it stays until you close it.
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

  // Fade in after the page sits still; fade out the moment you scroll.
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
        <span
          aria-hidden='true'
          className='hx-sidenav-title'>
          ON THIS PAGE
        </span>
        <ol>
          {sections.map((section, index) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={index === active ? 'location' : undefined}>
                <i aria-hidden='true'>{String(index + 1).padStart(2, '0')}</i>
                <span>{section.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
