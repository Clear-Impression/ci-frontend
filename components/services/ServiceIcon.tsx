// Thin line icons for services and the About page, drawn with the current text color.
// Each stroke is its own path so the icon can draw itself line by line.
const icons: Record<string, string[]> = {
  'window-washing-traditional-tools': [
    'M12 4v8',
    'M10 4h4',
    'M4 12h16v3H4z',
    'M5 19c2.3-1.6 4.7-1.6 7 0s4.7 1.6 7 0',
  ],
  'window-washing-100-percent-pure-water': [
    'M12 3.5c3.5 4.2 6 7.4 6 10.5a6 6 0 0 1-12 0c0-3.1 2.5-6.3 6-10.5z',
    'M9.2 14.2a2.8 2.8 0 0 0 2.8 2.8',
  ],
  'hard-water-stain-removal': [
    'M4 4h16v16H4z',
    'M7.5 8.5a1 1 0 1 0 2 0a1 1 0 1 0-2 0',
    'M11 12a.8.8 0 1 0 1.6 0a.8.8 0 1 0-1.6 0',
    'M7 14.5a.7.7 0 1 0 1.4 0a.7.7 0 1 0-1.4 0',
    'M13 17.5l4-4',
  ],
  'screen-deep-cleaning': [
    'M4 4h16v16H4z',
    'M4 9.3h16',
    'M4 14.7h16',
    'M9.3 4v16',
    'M14.7 4v16',
  ],
  'post-construction-cleanup': [
    'M3 20h18',
    'M4.5 17h15',
    'M6 17v-3a6 6 0 0 1 12 0v3',
    'M10 8.4V6h4v2.4',
  ],
  'graffiti-removal-service': [
    'M8 10h8v10H8z',
    'M10 7h4v3h-4z',
    'M14 8h2',
    'M18.5 5l.6-.6',
    'M19.5 8h.8',
    'M18.5 11l.6.6',
  ],
  'french-storm-windows': [
    'M4 3h16v18H4z',
    'M12 3v18',
    'M4 9h16',
    'M4 15h16',
  ],
  'glass-door-mirror-polishing': [
    'M6 11a6 8 0 1 0 12 0a6 8 0 1 0-12 0',
    'M12 19v2',
    'M9 21h6',
    'M9.2 9l2.3-2.3',
    'M9.6 12.4l3.6-3.6',
  ],
  'chandelier-cleaning': [
    'M12 2v4',
    'M8 6h8',
    'M5 9.5c0 3 3 4.5 7 4.5s7-1.5 7-4.5',
    'M12 14v4',
    'M5 12.5v2.5',
    'M19 12.5v2.5',
  ],
  'awning-sunroom-cleaning': [
    'M3 8h18l-2 5H5z',
    'M5 13a1.75 1.75 0 0 0 3.5 0a1.75 1.75 0 0 0 3.5 0a1.75 1.75 0 0 0 3.5 0a1.75 1.75 0 0 0 3.5 0',
    'M6 16h12v5H6z',
    'M12 16v5',
  ],
  'move-in-move-out-servicing': [
    'M3 7.5L12 3l9 4.5v9L12 21l-9-4.5z',
    'M3 7.5l9 4.5 9-4.5',
    'M12 12v9',
  ],
  'skylight-rooftop-glass': [
    'M3 12l9-8 9 8',
    'M5 10.5V20h14v-9.5',
    'M12.6 7.4l3.3 2.9-1.4 1.6-3.3-2.9z',
  ],
  'general-property-maintenance': [
    'M3 11l9-7 9 7',
    'M5 9.5V20h14V9.5',
    'M10 20v-5h4v5',
  ],
  // Icons for the About page value cards.
  'value-honesty': [
    'M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z',
    'M9 12l2 2 4-4',
  ],
  'value-satisfaction': [
    'M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0',
    'M8.5 14c.9 1.2 2.1 1.8 3.5 1.8s2.6-.6 3.5-1.8',
    'M9 9.5v.5',
    'M15 9.5v.5',
  ],
  'value-detail': [
    'M4 10.5a6.5 6.5 0 1 0 13 0a6.5 6.5 0 1 0-13 0',
    'M15.5 15.5L20 20',
    'M10.5 8v5',
    'M8 10.5h5',
  ],
};

const fallback = ['M4 4h16v16H4z', 'M12 4v16', 'M4 12h16'];

type ServiceIconProps = {
  slug: string;
  className?: string;
  // Draw on mount, wait for a parent marked as shown, or appear without drawing.
  draw?: 'auto' | 'reveal' | 'none';
};

export default function ServiceIcon({
  slug,
  className = '',
  draw = 'reveal',
}: ServiceIconProps) {
  const paths = icons[slug] ?? fallback;
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.25'
      strokeLinecap='round'
      strokeLinejoin='round'
      data-auto={draw === 'auto' ? '' : undefined}
      className={`${draw === 'none' ? '' : 'icon-draw'} ${className}`}>
      {paths.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          style={{ '--p': index } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
