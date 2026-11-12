'use client';

import { useState, type CSSProperties } from 'react';

// Soap bubbles that drift up the section. Click one and it pops.
export default function Bubbles({ count = 7 }: { count?: number }) {
  const [popped, setPopped] = useState<number[]>([]);

  return (
    <div aria-hidden='true' className='hx-bubbles'>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type='button'
          tabIndex={-1}
          data-popped={popped.includes(i) || undefined}
          onClick={() => setPopped((items) => [...items, i])}
          className='hx-bubble'
          style={
            {
              '--i': i,
              '--x': `${8 + ((i * 17) % 88)}%`,
              '--size': `${12 + ((i * 9) % 34)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
