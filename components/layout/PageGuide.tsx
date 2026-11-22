'use client';

import { useEffect, useRef, useState } from 'react';
import QuoteButton from '@/components/quote/QuoteButton';
import './page-guide.css';

export type GuideGroup = {
  title: string;
  items: readonly { id: string; label: string }[];
};

type PageGuideProps = {
  // The page's sections, grouped under small headings.
  groups: readonly GuideGroup[];
  // What screen readers call the menu, e.g. "Homepage sections".
  label: string;
};

// How long the page has to sit still before the menu slides out.
const IDLE_MS = 2000;

// The "On this page" menu on the left of long pages: the page's sections
// grouped under small headings, on dark purple frosted glass, with
// "you're here" next to the section you're reading.
//
// It slides out once the page has been still for 2 seconds and slides away
// the moment you scroll, so it never covers what you're reading. It stays
// away at the very top of the page and near the footer. The three-line
// button pulls it out (or puts it away) at any time.
export default function PageGuide({ groups, label }: PageGuideProps) {
  const [active, setActive] = useState(0);
  const [away, setAway] = useState(true);
  const [idleOpen, setIdleOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const guideRef = useRef<HTMLDivElement>(null);
  const idleTimer = useRef<number | undefined>(undefined);

  // The header keeps resizing for a moment after you stop scrolling.
  useEffect(() => {
    const guide = guideRef.current;
    const header = document.querySelector('.site-header');
    if (!guide || !header) return;

    const measure = () => {
      const back = header.querySelector('.back-button button');
      const top = Math.max(0, header.getBoundingClientRect().bottom, back?.getBoundingClientRect().bottom ?? 0);
      guide.style.setProperty('--pg-top', `${top}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(header);
    measure();
    const firstFrame = requestAnimationFrame(measure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(firstFrame);
    };
  }, []);

  // Track the section you're reading and keep the guide tucked away near the ends of the page.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = 0;
      groups
        .flatMap((group) => group.items)
        .forEach((section, index) => {
          const element = document.getElementById(section.id);
          if (element && element.getBoundingClientRect().top <= line) current = index;
        });
      setActive(current);

      const footer = document.querySelector('footer');
      const nearFooter = footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.75 : false;
      const atTop = window.scrollY < window.innerHeight * 0.5;
      setAway(nearFooter || atTop);
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
  }, [groups]);

  // Slide out after 2 seconds of stillness; slide away as soon as you scroll.
  useEffect(() => {
    const restart = () => {
      window.clearTimeout(idleTimer.current);
      idleTimer.current = window.setTimeout(() => setIdleOpen(true), IDLE_MS);
    };
    const onScroll = () => {
      setIdleOpen(false);
      setPinned(false);
      restart();
    };
    restart();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.clearTimeout(idleTimer.current);
    };
  }, []);

  // Escape puts a pulled-out menu away.
  useEffect(() => {
    if (!pinned) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPinned(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pinned]);

  const open = pinned || (!away && idleOpen);
  // Where each group starts in the full list of sections.
  const starts = groups.map((_, groupIndex) =>
    groups.slice(0, groupIndex).reduce((total, group) => total + group.items.length, 0),
  );

  return (
    <div
      ref={guideRef}
      className='pg-wrap'
      style={{ '--pg-top': 'calc(var(--hdr-top) + 2.5rem)' } as React.CSSProperties}
    >
      <button
        type='button'
        aria-expanded={open}
        aria-controls='page-guide'
        aria-label={open ? 'Hide the list of sections on this page' : 'Show the list of sections on this page'}
        data-open={open || undefined}
        onClick={() => {
          setPinned(!open);
          setIdleOpen(false);
        }}
        className='pg-toggle'
      >
        <span aria-hidden='true' />
        <span aria-hidden='true' />
        <span aria-hidden='true' />
      </button>

      <nav
        id='page-guide'
        aria-label={label}
        data-shown={open || undefined}
        inert={!open}
        className='pg'
      >
        <div className='pg-groups'>
          {groups.map((group, groupIndex) => (
            <div
              key={group.title}
              className='pg-group'
            >
              <p
                aria-hidden='true'
                className='pg-title'
              >
                {group.title}
              </p>
              <ol>
                {group.items.map((item, itemIndex) => {
                  const current = starts[groupIndex] + itemIndex === active;
                  return (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        aria-current={current ? 'location' : undefined}
                      >
                        <span>{item.label}</span>
                        {current && (
                          <small aria-hidden='true'>
                            <span>←</span> you’re here
                          </small>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </div>
          ))}
        </div>
        <QuoteButton className='pg-quote'>Get a free quote</QuoteButton>
      </nav>
    </div>
  );
}
