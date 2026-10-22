'use client';

// A pane of glass whose reflection follows the cursor.
export default function WindowPane({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`window-pane ${className}`}
      onPointerMove={(event) => {
        const box = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty('--x', `${event.clientX - box.left}px`);
        event.currentTarget.style.setProperty('--y', `${event.clientY - box.top}px`);
      }}>
      {children}
    </div>
  );
}
