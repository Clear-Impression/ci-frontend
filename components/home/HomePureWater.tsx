'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import HxIcon from '@/components/home/HxIcon';
import type { PureWaterStep } from '@/data/home';

type HomePureWaterProps = {
  eyebrow: string;
  title: string;
  lead: string;
  steps: readonly PureWaterStep[];
  result: string;
  caption: string;
};

export default function HomePureWater({
  eyebrow,
  title,
  lead,
  steps,
  result,
  caption,
}: HomePureWaterProps) {
  const [activeTab, setActiveTab] = useState<'traditional' | 'pure-water'>('traditional');
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  const traditionalSteps: readonly PureWaterStep[] = [
    {
      label: 'Wet & Agitate',
      detail: 'We apply a professional window-cleaning solution and loosen dirt, fingerprints, and everyday buildup with a soft applicator.',
      image: '/images/home/traditional-tools-step-1.png',
      imageAlt: 'Traditional window cleaning with a professional applicator.',
    },
    {
      label: 'Squeegee Clean',
      detail: 'A rubber-edged squeegee removes the solution in smooth passes, lifting grime away without streaking.',
      image: '/images/home/traditional-tools-step-2.png',
      imageAlt: 'A squeegee removing cleaning solution from a window.',
    },
    {
      label: 'Detail & Inspect',
      detail: 'We wipe the edges and frame, clear leftover moisture, and inspect every pane for a polished finish.',
      image: '/images/home/traditional-tools-step-3.png',
      imageAlt: 'Detailing the edges and frame of a freshly cleaned window.',
    },
  ];

  const activeSteps = activeTab === 'traditional' ? traditionalSteps : steps;
  const activeLead =
    activeTab === 'traditional'
      ? 'Professional applicators and squeegees give us a controlled, detailed clean for accessible windows.'
      : lead;
  const activeResult =
    activeTab === 'traditional'
      ? 'Clean glass, neatly detailed edges, and a careful inspection of every pane.'
      : result;
  const activeCaption =
    activeTab === 'traditional'
      ? 'Traditional tools cleaning process.'
      : caption;

  useEffect(() => {
    if (selected || hovered || focused || activeSteps.length < 2) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer = 0;

    // Stop the timer too if reduced motion is enabled while the page is open.
    const updateTimer = () => {
      window.clearInterval(timer);
      if (motion.matches) return;
      timer = window.setInterval(() => {
        setActive((current) => (current + 1) % activeSteps.length);
      }, 3200);
    };

    updateTimer();
    motion.addEventListener('change', updateTimer);
    return () => {
      window.clearInterval(timer);
      motion.removeEventListener('change', updateTimer);
    };
  }, [selected, hovered, focused, activeSteps.length]);

  const selectTab = (tab: 'traditional' | 'pure-water') => {
    setActiveTab(tab);
    setActive(0);
    setSelected(true);
  };

  // "Easy as 1, 2, 3." -> the numbers in gold.
  const split = title.indexOf(' as ');
  const titleStart = split >= 0 ? title.slice(0, split + 4) : title;
  const titleEnd = split >= 0 ? title.slice(split + 4) : '';
  const stepIcons = ['grid', 'drop', 'sparkle'] as const;

  return (
    <section
      aria-labelledby='pure-water-heading'
      className='hx-section hx-tech'>
      <div className='hx-container hx-tech-grid'>
        <figure className='hx-tech-image hx-reveal'>
          {/* One photo per stage. The photo for the lit stage fades in. */}
          <div
            key={activeTab}
            className='hx-method-photo'>
            {activeSteps.map((step, index) => (
              <Image
                key={`${step.image}-${index}`}
                src={step.image}
                alt={step.imageAlt}
                aria-hidden={index !== active || undefined}
                data-shown={index === active || undefined}
                fill
                sizes='(min-width: 760px) 50vw, 100vw'
                className='hx-tech-photo'
              />
            ))}
          </div>
          <figcaption className='sr-only'>{activeCaption}</figcaption>
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
          <div
            key={activeTab}
            className='hx-method-panel'>
            <p className='hx-lead hx-reveal'>{activeLead}</p>

            <div
              className='hx-method-tabs'
              role='tablist'
              aria-label='Window cleaning method'>
              <button
                type='button'
                role='tab'
                id='traditional-tools-tab'
                aria-controls='traditional-tools-panel'
                aria-selected={activeTab === 'traditional'}
                tabIndex={activeTab === 'traditional' ? 0 : -1}
                onClick={() => selectTab('traditional')}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    selectTab('pure-water');
                    document.getElementById('water-fed-pole-tab')?.focus();
                  }
                }}
                className='hx-method-tab'>
                Traditional Tools
              </button>
              <button
                type='button'
                role='tab'
                id='water-fed-pole-tab'
                aria-controls='water-fed-pole-panel'
                aria-selected={activeTab === 'pure-water'}
                tabIndex={activeTab === 'pure-water' ? 0 : -1}
                onClick={() => selectTab('pure-water')}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
                    event.preventDefault();
                    selectTab('traditional');
                    document.getElementById('traditional-tools-tab')?.focus();
                  }
                }}
                className='hx-method-tab'>
                Water-fed Pole
              </button>
            </div>

            {/* The three filter stages light up in turn. Pick one to stop on it. */}
            <ol
              id={activeTab === 'traditional' ? 'traditional-tools-panel' : 'water-fed-pole-panel'}
              role='tabpanel'
              aria-labelledby={
                activeTab === 'traditional'
                  ? 'traditional-tools-tab'
                  : 'water-fed-pole-tab'
              }
              className='hx-steps'
              onPointerEnter={() => setHovered(true)}
              onPointerLeave={() => setHovered(false)}
              onFocus={() => setFocused(true)}
              onBlur={(event) => {
                // Moving between stage buttons keeps keyboard focus inside.
                if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
              }}>
              {activeSteps.map((step, index) => (
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
              <p>{activeResult}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
