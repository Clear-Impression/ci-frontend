'use client';

// A card that tilts toward the cursor, with a soft light that follows it.
export default function TiltCard({
  children,
  className = '',
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <li
      className={`tilt-card ${className}`}
      style={style}
      onPointerMove={(event) => {
        if (event.pointerType !== 'mouse') return;
        const card = event.currentTarget;
        const box = card.getBoundingClientRect();
        const x = (event.clientX - box.left) / box.width;
        const y = (event.clientY - box.top) / box.height;
        card.style.setProperty('--ry', `${(x - 0.5) * 10}deg`);
        card.style.setProperty('--rx', `${(0.5 - y) * 10}deg`);
        card.style.setProperty('--gx', `${x * 100}%`);
        card.style.setProperty('--gy', `${y * 100}%`);
      }}
      onPointerLeave={(event) => {
        const card = event.currentTarget;
        card.style.setProperty('--ry', '0deg');
        card.style.setProperty('--rx', '0deg');
      }}>
      {children}
    </li>
  );
}
