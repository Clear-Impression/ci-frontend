'use client';

import { useEffect, useState } from 'react';
import QuoteButton from '@/components/quote/QuoteButton';

const icons = {
  home: (
    <>
      <path d='M3.5 10.5 12 3.5l8.5 7' />
      <path d='M5.5 9v11h4.5v-6h4v6h4.5V9' />
    </>
  ),
  sparkles: (
    <>
      <path d='M11 3.5 12.7 8.3 17.5 10l-4.8 1.7L11 16.5l-1.7-4.8L4.5 10l4.8-1.7z' />
      <path d='m18 14.5.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z' />
    </>
  ),
  pin: (
    <>
      <path d='M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z' />
      <circle cx='12' cy='10' r='2.4' />
    </>
  ),
  grid: (
    <>
      <rect x='4' y='4' width='6.5' height='6.5' rx='1.6' />
      <rect x='13.5' y='4' width='6.5' height='6.5' rx='1.6' />
      <rect x='4' y='13.5' width='6.5' height='6.5' rx='1.6' />
      <rect x='13.5' y='13.5' width='6.5' height='6.5' rx='1.6' />
    </>
  ),
  droplet: (
    <>
      <path d='M12 3.5s6 6.3 6 10.8a6 6 0 0 1-12 0c0-4.5 6-10.8 6-10.8z' />
      <path d='M9.4 14.6a2.6 2.6 0 0 0 2.6 2.6' />
    </>
  ),
  review: (
    <>
      <path d='M4 5.5h16v10.5H10l-6 4.5z' />
      <path d='m12 7.6 1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z' />
    </>
  ),
  send: (
    <>
      <path d='M20.5 3.5 3.5 10.6l6.8 2.6 2.6 6.8z' />
      <path d='m20.5 3.5-10.2 9.7' />
    </>
  ),
};

export type RailIcon = keyof typeof icons;

export type RailSection = {
  id: string;
  label: string;
  icon: RailIcon;
};

type SectionRailProps = {
  sections: readonly RailSection[];
};

const ITEM = 44; // px per row (40px item + 4px gap), so the highlight lines up
const STORAGE_KEY = 'ci-home-rail-collapsed';

function Icon({ name, className = 'size-[18px]' }: { name: RailIcon | 'collapse' | 'calendar'; className?: string }) {
  const paths =
    name === 'collapse' ? (
      <>
        <rect x='3.5' y='4' width='17' height='16' rx='3' />
        <path d='M9.5 4v16M15.5 10l-2 2 2 2' />
      </>
    ) : name === 'calendar' ? (
      <>
        <rect x='3.5' y='5' width='17' height='15' rx='2.5' />
        <path d='M8 3v4M16 3v4M3.5 10h17' />
      </>
    ) : (
      icons[name]
    );
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`shrink-0 ${className}`}>
      {paths}
    </svg>
  );
}

// A small floating sidebar on the homepage: one row per section, a white
// highlight on the one you're reading, and a quote button at the bottom.
// Collapse it to an icon-only rail (names show on hover). It appears after
// the hero and steps aside before the footer.
export default function SectionRail({ sections }: SectionRailProps) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Remember the collapsed choice for next time, if the browser allows it.
  useEffect(() => {
    try {
      // Storage only exists in the browser, so this has to wait until after the first render.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (window.localStorage.getItem(STORAGE_KEY) === '1') setCollapsed(true);
    } catch {
      // Storage blocked: start expanded.
    }
  }, []);

  // Let the page content make room for whichever width the sidebar is.
  useEffect(() => {
    document.documentElement.toggleAttribute('data-rail-collapsed', collapsed);
    return () => document.documentElement.removeAttribute('data-rail-collapsed');
  }, [collapsed]);

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

      const hero = document.getElementById(sections[0]?.id ?? '');
      const footer = document.querySelector('footer');
      const pastHero = hero ? hero.getBoundingClientRect().bottom < window.innerHeight * 0.55 : true;
      const beforeFooter = footer ? footer.getBoundingClientRect().top > window.innerHeight * 0.75 : true;
      setShown(pastHero && beforeFooter);
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

  function toggle() {
    setCollapsed((value) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, value ? '0' : '1');
      } catch {
        // Not saved; it still toggles for this visit.
      }
      return !value;
    });
  }

  return (
    <aside
      data-shown={shown || undefined}
      data-collapsed={collapsed || undefined}
      inert={!shown}
      className='home-rail fixed left-4 z-40 hidden min-[1280px]:block'>
      <div className='home-rail-card'>
        <div className='home-rail-head'>
          <span className='home-rail-title'>On this page</span>
          <button
            type='button'
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand section menu' : 'Collapse section menu'}
            className='home-rail-toggle'>
            <Icon name='collapse' className='size-[18px]' />
          </button>
        </div>

        <nav aria-label='Homepage sections' className='relative'>
          <span
            aria-hidden='true'
            className='home-rail-active'
            style={{ transform: `translateY(${active * ITEM}px)` }}
          />
          <ol className='relative flex flex-col gap-1'>
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={index === active ? 'location' : undefined}
                  className='home-rail-link'>
                  <Icon name={section.icon} />
                  <span className='home-rail-label'>{section.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className='home-rail-foot'>
          <QuoteButton className='home-rail-quote'>
            <Icon name='calendar' className='size-[18px]' />
            <span className='home-rail-label'>Get a quote</span>
          </QuoteButton>
        </div>
      </div>
    </aside>
  );
}
