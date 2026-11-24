'use client';

import { useEffect, useRef, useState } from 'react';
import { manrope } from '@/app/fonts';
import QuoteButton from '@/components/quote/QuoteButton';
import './page-guide.css';

export type GuideGroup = {
  title: string;
  items: readonly { id: string; label: string }[];
};

type PageGuideProps = {
  // The page's sections, grouped under numbered headings.
  groups: readonly GuideGroup[];
  // What screen readers call the menu, e.g. "Homepage sections".
  label: string;
};

// When the menu pops out after the page opens, and how long it stays.
const SHOW_AFTER_MS = 700;
const STAY_MS = 4500;

// The "On this page" menu: a see-through purple folder on the left of the
// screen with a tab on its right edge. The page's parts are folded under
// numbered headings ("1. Get to know us") and unstack when you hover or
// click one, with "you're here" next to the section you're reading.
//
// It pops out once when the page opens, then tucks away (it waits while the
// pointer is on it), leaving a thin edge and the tab, which opens it again.
export default function PageGuide({ groups, label }: PageGuideProps) {
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(-1);
  const guideRef = useRef<HTMLElement>(null);
  const hovering = useRef(false);
  const autoTimer = useRef<number | undefined>(undefined);

  // Centre the folded menu top to bottom, then keep its top still so it
  // grows downward when a part unstacks (the heading under the pointer
  // doesn't move).
  useEffect(() => {
    const guide = guideRef.current;
    if (!guide) return;
    const place = () => {
      if (guide.querySelector('.pg-group[data-expanded], .pg-group:hover, .pg-group:focus-within')) return;
      const height = guide.offsetHeight;
      guide.style.setProperty('--pg-top', `${Math.max(16, Math.round((window.innerHeight - height) / 2))}px`);
      guide.style.setProperty('--pg-tab-top', `${Math.round(height / 2)}px`);
    };
    place();
    document.fonts?.ready.then(place);
    window.addEventListener('resize', place);
    return () => window.removeEventListener('resize', place);
  }, [groups]);

  // Pop out once, then tuck away.
  useEffect(() => {
    const hide = () => {
      if (hovering.current) autoTimer.current = window.setTimeout(hide, 1200);
      else setOpen(false);
    };
    const show = window.setTimeout(() => {
      setOpen(true);
      autoTimer.current = window.setTimeout(hide, STAY_MS);
    }, SHOW_AFTER_MS);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(autoTimer.current);
    };
  }, []);

  // Track the section you're reading.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.4;
      let current = -1;
      groups
        .flatMap((group) => group.items)
        .forEach((section, index) => {
          const element = document.getElementById(section.id);
          if (element && element.getBoundingClientRect().top <= line) current = index;
        });
      setActive(current);
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

  // Escape puts it away.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // Once someone opens or closes it themselves, stop the automatic close.
  const setByHand = (next: boolean) => {
    window.clearTimeout(autoTimer.current);
    setOpen(next);
    if (!next) setExpanded(-1);
  };

  // Where each group starts in the full list of sections.
  const starts = groups.map((_, groupIndex) =>
    groups.slice(0, groupIndex).reduce((total, group) => total + group.items.length, 0),
  );
  let order = 0;

  return (
    <nav
      ref={guideRef}
      aria-label={label}
      data-open={open || undefined}
      className={`pg ${manrope.variable}`}
      onPointerEnter={() => (hovering.current = true)}
      onPointerLeave={() => {
        hovering.current = false;
        setExpanded(-1);
      }}
    >
      <div
        id='page-guide'
        className='pg-body'
        inert={!open}
      >
        <p className='pg-label'>On this page</p>
        <div className='pg-groups'>
          {groups.map((group, groupIndex) => {
            const here = active >= starts[groupIndex] && active < starts[groupIndex] + group.items.length;
            const isExpanded = expanded === groupIndex;
            return (
              <div
                key={group.title}
                className='pg-group'
                data-here={here || undefined}
                data-expanded={isExpanded || undefined}
              >
                <button
                  type='button'
                  className='pg-title'
                  aria-expanded={isExpanded}
                  style={{ '--i': order++ } as React.CSSProperties}
                  onClick={() => setExpanded(isExpanded ? -1 : groupIndex)}
                >
                  <span>
                    <b>{groupIndex + 1}.</b> {group.title}
                  </span>
                </button>
                <div className='pg-items'>
                  <ul>
                    {group.items.map((item, itemIndex) => {
                      const current = starts[groupIndex] + itemIndex === active;
                      return (
                        <li
                          key={item.id}
                          style={{ '--k': itemIndex } as React.CSSProperties}
                        >
                          <a
                            href={`#${item.id}`}
                            aria-current={current ? 'location' : undefined}
                            onClick={() => setByHand(false)}
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
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <QuoteButton className='pg-quote'>Get a free quote</QuoteButton>
      </div>

      <button
        type='button'
        className='pg-tab'
        aria-expanded={open}
        aria-controls='page-guide'
        aria-label={open ? 'Hide the list of sections on this page' : 'Show the list of sections on this page'}
        onClick={() => setByHand(!open)}
      >
        <span
          className='pg-tab-dot'
          aria-hidden='true'
        />
        <span
          className='pg-tab-label'
          aria-hidden='true'
        >
          On this page
        </span>
      </button>
    </nav>
  );
}
