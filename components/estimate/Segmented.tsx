'use client';

import { useId } from 'react';
import type { EstimateChoice } from '@/data/estimate';
import styles from '@/app/estimate/estimate.module.css';

type SegmentedProps = {
  choice: EstimateChoice;
  value: string;
  onChange: (value: string) => void;
};

// A row of options with a dark pill that slides to the picked one.
// Choices marked as cards show a short hint under each option instead.
export default function Segmented({ choice, value, onChange }: SegmentedProps) {
  const labelId = useId();
  const index = Math.max(0, choice.options.findIndex((option) => option.id === value));
  const count = choice.options.length;

  // Arrow keys move between options, like native radio buttons.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = choice.options[(index + step + count) % count];
    onChange(next.id);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons[(index + step + count) % count]?.focus();
  };

  return (
    <div>
      <p
        id={labelId}
        className='text-sm font-medium text-[#200b38]'>
        {choice.label}
      </p>
      {choice.cards ? (
        <div
          role='radiogroup'
          aria-labelledby={labelId}
          onKeyDown={onKeyDown}
          className='mt-3 grid gap-2 sm:grid-cols-3'>
          {choice.options.map((option) => {
            const picked = option.id === value;
            return (
              <button
                key={option.id}
                type='button'
                role='radio'
                aria-checked={picked}
                tabIndex={picked ? 0 : -1}
                onClick={() => onChange(option.id)}
                className={`${styles.optionCard} relative flex flex-col justify-start rounded-2xl p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] ${picked ? styles.optionCardOn : ''}`}>
                <span className='flex items-center justify-between gap-2'>
                  <span className='font-semibold'>{option.label}</span>
                  <span
                    aria-hidden='true'
                    className={`${styles.radioDot} grid size-4 place-items-center rounded-full`}
                  />
                </span>
                {option.hint && <span className='mt-1 block text-sm leading-5 opacity-75'>{option.hint}</span>}
              </button>
            );
          })}
        </div>
      ) : (
        <div
          role='radiogroup'
          aria-labelledby={labelId}
          onKeyDown={onKeyDown}
          className={`${styles.segmented} relative mt-3 grid rounded-full p-1`}
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` } as React.CSSProperties}>
          <span
            aria-hidden='true'
            className={`${styles.segmentThumb} absolute inset-y-1 left-1 rounded-full`}
            style={{ width: `calc((100% - 0.5rem) / ${count})`, transform: `translateX(${index * 100}%)` }}
          />
          {choice.options.map((option) => {
            const picked = option.id === value;
            return (
              <button
                key={option.id}
                type='button'
                role='radio'
                aria-checked={picked}
                tabIndex={picked ? 0 : -1}
                onClick={() => onChange(option.id)}
                className={`relative z-10 min-h-11 rounded-full px-3 text-sm font-semibold transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] ${picked ? 'text-white' : 'text-[#200b38]/70 hover:text-[#200b38]'}`}>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
