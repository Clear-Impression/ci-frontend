// Small line icons used across the redesigned homepage.
const paths = {
  arrow: <path d='M5 12h14M13 6l6 6-6 6' />,
  sparkle: (
    <>
      <path d='M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9z' />
      <path d='M19 16.5l.6 1.6 1.6.6-1.6.6-.6 1.6-.6-1.6-1.6-.6 1.6-.6z' />
    </>
  ),
  pin: (
    <>
      <path d='M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z' />
      <circle cx='12' cy='10' r='2.4' />
    </>
  ),
  phone: <path d='M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2z' />,
  drop: <path d='M12 3.5s6 6.3 6 10.8a6 6 0 0 1-12 0c0-4.5 6-10.8 6-10.8z' />,
  check: <path d='m5 12.5 4.5 4.5L19 7.5' />,
  grid: (
    <>
      <rect x='4' y='4' width='16' height='16' rx='2' />
      <path d='M4 9.3h16M4 14.7h16M9.3 4v16M14.7 4v16' />
    </>
  ),
  chevronLeft: <path d='m15 6-6 6 6 6' />,
  chevronRight: <path d='m9 6 6 6-6 6' />,
};

export type HxIconName = keyof typeof paths;

export default function HxIcon({ name, size = 20, className = '' }: { name: HxIconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      width={size}
      height={size}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.8'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={`shrink-0 ${className}`}>
      {paths[name]}
    </svg>
  );
}
