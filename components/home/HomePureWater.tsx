'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import Reveal from '@/components/services/Reveal';
import type { PureWaterStep } from '@/data/home';
import styles from '@/app/home.module.css';

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

  const current = steps[active];

  return (
    <section
      aria-labelledby='pure-water-heading'
      className='mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24'>
      <Reveal className='max-w-2xl'>
        <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
          {eyebrow}
        </p>
        <h2
          id='pure-water-heading'
          className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
          <span className='line-mask'>
            <span className='line-rise'>{title}</span>
          </span>
        </h2>
        <p className='fade-up mt-4 text-lg leading-relaxed text-gray-600'>
          {lead}
        </p>
      </Reveal>

      <div className='mt-12 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16'>
        <Reveal className={styles.rise}>
          <div
            onPointerEnter={() => setHovered(true)}
            onPointerLeave={() => setHovered(false)}
            onFocus={() => setFocused(true)}
            onBlur={(event) => {
              // Moving between stage buttons keeps keyboard focus inside.
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setFocused(false);
              }
            }}>
            <div className='relative grid grid-cols-3 gap-4'>
              <span
                aria-hidden='true'
                className={`${styles.pipe} absolute left-[16.66%] right-[16.66%] top-[30px] h-1 sm:top-[42px]`}
              />
              {steps.map((step, index) => (
                <button
                  key={step.label}
                  type='button'
                  aria-pressed={index === active}
                  aria-controls='pure-water-step'
                  onClick={() => {
                    setActive(index);
                    // Keep a chosen stage visible while the visitor reads it.
                    setSelected(true);
                  }}
                  className='group relative flex flex-col items-center gap-3 rounded-xl pb-2 text-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
                  <span className='grid size-16 place-items-center rounded-full border-2 border-[#e2d8f0] bg-white text-xl font-semibold sm:size-[88px] sm:text-2xl text-[#6c3fb8] motion-safe:transition motion-safe:duration-300 group-hover:border-[#6c3fb8] motion-safe:group-aria-pressed:scale-105 group-aria-pressed:border-[#200b38] group-aria-pressed:bg-[#200b38] group-aria-pressed:text-[#efb52b] group-aria-pressed:shadow-lg group-aria-pressed:shadow-[#200b38]/30'>
                    {index + 1}
                  </span>
                  <span className='text-sm font-semibold text-[#200b38] sm:text-base'>
                    {step.label}
                  </span>
                </button>
              ))}
            </div>

            <div
              id='pure-water-step'
              className='mt-6 rounded-2xl bg-[#f7f4fb] px-7 py-6 sm:px-8'>
              {/* Changing the key restarts the fade for the selected stage. */}
              <div
                key={current.label}
                className={styles.stepIn}>
                <h3 className='text-xl font-semibold text-[#200b38]'>
                  {current.label}
                </h3>
                <p className='mt-2 leading-relaxed text-gray-700'>
                  {current.detail}
                </p>
              </div>
            </div>

            <p className='mt-5 flex items-start gap-3 leading-relaxed text-gray-700'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                fill='none'
                stroke='#6c3fb8'
                strokeWidth='1.6'
                strokeLinecap='round'
                strokeLinejoin='round'
                className='mt-0.5 size-6 shrink-0'>
                <path d='M12 3.5c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0c0-3.1 2.5-6.3 6-10.5z' />
                <path d='M9.5 14.3l1.8 1.8 3.2-3.6' />
              </svg>
              {result}
            </p>
          </div>
        </Reveal>

        <Reveal
          className={styles.rise}
          delay={150}>
          <figure className='relative h-96 overflow-hidden rounded-2xl sm:h-120'>
            <Image
              src={image}
              alt={imageAlt}
              fill
              sizes='(min-width: 1280px) 520px, (min-width: 1024px) 40vw, 100vw'
              className='object-cover'
            />
            <figcaption className='absolute inset-x-4 bottom-4 rounded-xl bg-white/90 px-4 py-3 text-sm text-gray-700 backdrop-blur-sm'>
              {caption}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
