'use client';

import { useState } from 'react';
import type { EstimateMeasure } from '@/data/estimate';
import styles from '@/app/estimate/estimate.module.css';

type SizeInputProps = {
  id: string;
  measure: EstimateMeasure;
  value: number;
  onChange: (value: number) => void;
};

// A big number box next to the slider, so people can type an exact size.
// Typing updates the price as soon as the number is in range; leaving the
// box (or pressing Enter) snaps anything too small or too big into range.
export default function SizeInput({ id, measure, value, onChange }: SizeInputProps) {
  // While typing, show exactly what was typed, even half-finished numbers.
  const [draft, setDraft] = useState<string | null>(null);

  const clamp = (amount: number) => Math.min(measure.max, Math.max(measure.min, Math.round(amount)));

  const commit = () => {
    const typed = Number((draft ?? '').replace(/[^\d.]/g, ''));
    if (draft !== null && typed > 0) onChange(clamp(typed));
    setDraft(null);
  };

  return (
    <span className={`${styles.sizeBox} inline-flex items-baseline gap-1.5 rounded-xl px-3 py-1`}>
      <input
        id={id}
        type='text'
        inputMode='numeric'
        autoComplete='off'
        aria-describedby={`${id}-range`}
        value={draft ?? value.toLocaleString('en-US')}
        onFocus={(event) => {
          // Keep the text as shown and select it, so typing replaces it.
          setDraft(value.toLocaleString('en-US'));
          event.target.select();
        }}
        onChange={(event) => {
          const text = event.target.value.replace(/[^\d,]/g, '');
          setDraft(text);
          const typed = Number(text.replace(/,/g, ''));
          if (typed >= measure.min && typed <= measure.max) onChange(Math.round(typed));
        }}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.currentTarget.blur();
          }
        }}
        style={{ width: `${Math.max(3, (draft ?? value.toLocaleString('en-US')).length) + 0.5}ch` }}
        className='bg-transparent text-right text-3xl font-semibold tracking-tight text-[#200b38] tabular-nums outline-none'
      />
      <span className='text-sm font-medium text-gray-500'>{measure.unit}</span>
      <span id={`${id}-range`} className='sr-only'>
        Type a number from {measure.min.toLocaleString('en-US')} to {measure.max.toLocaleString('en-US')}, or use the slider.
      </span>
    </span>
  );
}
