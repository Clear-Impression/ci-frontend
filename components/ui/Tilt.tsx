'use client';

import { useRef, type CSSProperties, type ReactNode } from 'react';

type TiltProps = {
  children: ReactNode;
  className?: string;
  // How far it can lean, in degrees.
  max?: number;
  // Add a soft light that follows the pointer across the surface.
  glare?: boolean;
};

// Leans its content toward the pointer in 3D, like tilting a card in your hand.
// Only on devices with a real mouse, and never when reduced motion is on.
export default function Tilt({ children, className = '', max = 6, glare = true }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  function canTilt() {
    return (
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const element = ref.current;
    if (!element || event.pointerType !== 'mouse' || !canTilt()) return;
    const box = element.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      element.style.setProperty('--tilt-x', `${(0.5 - y) * max * 2}deg`);
      element.style.setProperty('--tilt-y', `${(x - 0.5) * max * 2}deg`);
      element.style.setProperty('--glare-x', `${x * 100}%`);
      element.style.setProperty('--glare-y', `${y * 100}%`);
      element.dataset.tilting = '';
    });
  }

  function onPointerLeave() {
    const element = ref.current;
    if (!element) return;
    cancelAnimationFrame(frame.current);
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
    delete element.dataset.tilting;
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`tilt ${className}`}
      style={{ '--tilt-x': '0deg', '--tilt-y': '0deg' } as CSSProperties}>
      {children}
      {glare && <span aria-hidden='true' className='tilt-glare' />}
    </div>
  );
}
