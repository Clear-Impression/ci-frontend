'use client';

import { useEffect, useState } from 'react';

export type RailSection = {
  id: string;
  label: string;
};

type SectionRailProps = {
  sections: readonly RailSection[];
};

// A slim "On this page" guide on the left of the homepage: a numbered pill for
// each section. The section you're reading turns gold and shows its name;
// hover any pill to see its name too, and click to jump there.
export default function SectionRail({ sections }: SectionRailProps) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(true);

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

      // Step aside once the footer comes up.
      const footer = document.querySelector('footer');
      setShown(footer ? footer.getBoundingClientRect().top > window.innerHeight * 0.75 : true);
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

  return (
    <nav
      aria-label='Homepage sections'
      data-shown={shown || undefined}
      inert={!shown}
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
  );
}
