'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Bubbles from '@/components/home/Bubbles';
import HxIcon from '@/components/home/HxIcon';
import type { PureWaterStep } from '@/data/home';

type HomePureWaterProps = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: readonly PureWaterStep[];
  result: string;
  image: string;
  imageAlt: string;
  caption: string;
};

export default function HomePureWater({
  eyebrow,
  title,
  lead,
  steps,
  result,
  image,
  imageAlt,
  caption,
}: HomePureWaterProps) {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (selected || hovered || focused || steps.length < 2) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;

    // Stop the timer too if reduced motion is enabled while the page is open.
    const updateTimer = () => {
      window.clearInterval(timer);
      if (motion.matches) return;
      timer = window.setInterval(() => {
        setActive((current) => (current + 1) % steps.length);
      }, 3200);
    };

    updateTimer();
    motion.addEventListener('change', updateTimer);
    return () => {
      window.clearInterval(timer);
      motion.removeEventListener('change', updateTimer);
    };
  }, [selected, hovered, focused, steps.length]);

  // "Easy as 1, 2, 3." -> the numbers in gold.
  const split = title.indexOf(' as ');
  const titleStart = split >= 0 ? title.slice(0, split + 4) : title;
  const titleEnd = split >= 0 ? title.slice(split + 4) : '';
  const stepIcons = ['grid', 'drop', 'sparkle'] as const;

  return (
    <section
      aria-labelledby='pure-water-heading'
      className='hx-section hx-tech'>
      <Bubbles count={5} />
      <div className='hx-container hx-tech-grid'>
        <figure className='hx-tech-image hx-reveal'>
          <div>
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes='(min-width: 760px) 50vw, 100vw'
            />
          </div>
          <figcaption className='sr-only'>{caption}</figcaption>
          <span
            aria-hidden='true'
            className='hx-tech-sticker'>
            <HxIcon name='drop' />
            <strong>100%</strong>
            <small>PURE WATER</small>
          </span>
        </figure>

        <div className='hx-tech-copy'>
          <p className='hx-eyebrow hx-reveal'>{eyebrow}</p>
          <h2
            id='pure-water-heading'
            className='hx-h2'>
            <span className='line-mask'>
              <span className='line-rise'>
                {titleStart}
                {titleEnd && <em>{titleEnd}</em>}
              </span>
            </span>
          </h2>
          <p className='hx-lead hx-reveal'>{lead}</p>

          {/* The three filter stages light up in turn. Pick one to stop on it. */}
          <ol
            className='hx-steps'
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              // Moving between stage buttons keeps keyboard focus inside.
              if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
            }}>
            {steps.map((step, index) => (
              <li key={step.label}>
                <button
                  type='button'
                  aria-pressed={index === active}
                  data-done={index < active || undefined}
                  onClick={() => {
                    setActive(index);
                    // Keep a chosen stage lit while the visitor reads it.
                    setSelected(true);
                  }}
                  className='hx-step'>
                  <b>{String(index + 1).padStart(2, '0')}</b>
                  <span className='hx-step-icon'>
                    <HxIcon name={stepIcons[index % stepIcons.length]} />
                  </span>
                  <span>
                    <span className='hx-step-title'>{step.label}</span>
                    <span className='hx-step-detail'>{step.detail}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className='hx-spotfree hx-reveal'>
            <HxIcon name='check' />
            <p>{result}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
