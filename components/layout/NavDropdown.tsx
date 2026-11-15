'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { getCurrent } from '@/lib/navigation';

type NavDropdownProps = {
  label: string;
  href: string;
  children: React.ReactNode;
  // Line up the panel under the tab, or keep it from running off the right edge.
  align?: 'center' | 'start';
  // Other pages that live under this tab, like Feedback under Help.
  match?: readonly string[];
};

// How long the mouse has to rest on a tab before its panel opens.
// Switching from one open panel to another waits longer, so passing over a
// tab on the way into the open panel does not swap them.
const OPEN_DELAY = 120;
const SWITCH_DELAY = 300;
// How long a panel stays open after the mouse leaves it.
const CLOSE_DELAY = 350;

// Only one panel is open at a time. This closes whichever one is open now.
let openPanel: { id: string; close: () => void } | null = null;

// A main menu tab that shows a preview panel on hover or keyboard focus.
// The tab itself still links to the full page.
export default function NavDropdown({ label, href, children, align = 'center', match = [] }: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const closeTimer = useRef(0);
  const openTimer = useRef(0);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  // Set while Escape moves focus back to the tab, so that focus does not reopen it.
  const skipFocusOpen = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  // How far to nudge the panel so it never runs off either side of the screen.
  const [shift, setShift] = useState(0);
  // Keep the tab gold on its own page and the pages under it.
  const pathname = usePathname();
  const current = getCurrent(pathname, href) ?? (match.some((page) => getCurrent(pathname, page)) ? 'true' : undefined);

  const close = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    setOpen(false);
    if (openPanel?.id === panelId) openPanel = null;
  };

  // Open right away, closing any other panel first.
  const show = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    if (openPanel && openPanel.id !== panelId) openPanel.close();
    openPanel = { id: panelId, close };
    setOpen(true);
  };

  // Mouse: wait until the pointer rests on the tab before opening.
  const showSoon = () => {
    window.clearTimeout(closeTimer.current);
    if (open) return;
    const switching = openPanel !== null && openPanel.id !== panelId;
    window.clearTimeout(openTimer.current);
    openTimer.current = window.setTimeout(show, switching ? SWITCH_DELAY : OPEN_DELAY);
  };

  // Mouse: leave a little time to move between the tab and its panel.
  const hideSoon = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(close, CLOSE_DELAY);
  };

  useEffect(
    () => () => {
      window.clearTimeout(openTimer.current);
      window.clearTimeout(closeTimer.current);
    },
    [],
  );

  useLayoutEffect(() => {
    if (!open || !boxRef.current) return;
    const edge = 16;
    const box = boxRef.current.getBoundingClientRect();
    const left = box.left - shift;
    const right = box.right - shift;
    const width = document.documentElement.clientWidth;
    let next = 0;
    if (left < edge) next = edge - left;
    else if (right > width - edge) next = width - edge - right;
    if (next !== shift) setShift(next);
  }, [open, shift]);

  return (
    <li
      className='relative'
      onMouseEnter={showSoon}
      onMouseLeave={hideSoon}
      onFocus={() => {
        if (skipFocusOpen.current) {
          skipFocusOpen.current = false;
          return;
        }
        show();
      }}
      onBlur={(event) => {
        // Close once keyboard focus moves outside the tab and its panel.
        if (!event.currentTarget.contains(event.relatedTarget)) close();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          close();
          skipFocusOpen.current = true;
          triggerRef.current?.focus();
          skipFocusOpen.current = false;
        }
      }}>
      <Link
        ref={triggerRef}
        href={href}
        aria-expanded={open}
        aria-controls={panelId}
        aria-current={current}
        data-open={open ? '' : undefined}
        data-active={current ? '' : undefined}
        className='nav-tab inline-flex items-center gap-1 rounded-sm py-3 hover:text-[#efb52b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
        {/* The current-page bar goes under the name only, not the arrow. */}
        <span className='nav-label'>{label}</span>
        <svg
          aria-hidden='true'
          viewBox='0 0 24 24'
          className='nav-caret size-4'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d='M6 9l6 6 6-6' />
        </svg>
      </Link>
      {/* Hidden panels stay out of the tab order and away from screen readers. */}
      {/* The outer box places the panel; the inner one fades and slides.
          The outer box ignores the mouse, so a closed panel can't be hovered. */}
      <div
        ref={boxRef}
        style={{ marginLeft: shift }}
        className={`pointer-events-none absolute top-full ${open ? 'z-50' : 'z-40'} ${align === 'center' ? 'left-1/2 -translate-x-1/2' : '-left-6'}`}>
        <div
          id={panelId}
          inert={!open}
          data-open={open ? '' : undefined}
          onClick={close}
          className='nav-panel pt-3'>
          <div className='overflow-hidden rounded-2xl bg-white text-[#200b38] shadow-2xl shadow-[#200b38]/25 ring-1 ring-[#200b38]/10'>
            {children}
          </div>
        </div>
      </div>
    </li>
  );
}
