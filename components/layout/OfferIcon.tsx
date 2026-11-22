// A relative path so the Sanity Studio can show these icons too.
import type { OfferIconId } from '../../data/offer-themes';

type OfferIconProps = {
  icon: OfferIconId;
  className?: string;
};

const outline = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

// The small icons for the seasonal offers. They sit between the scrolling
// offers and next to the popup's label, and take the color around them.
const shapes: Record<OfferIconId, React.ReactNode> = {
  // Like freshly cleaned glass.
  sparkle: (
    <path
      fill='currentColor'
      d='M12 2.5l2 6.2 6.5 2.3-6.5 2.3-2 6.2-2-6.2L3.5 11l6.5-2.3z'
    />
  ),
  tag: (
    <g {...outline}>
      <path d='M3 3h8.6l9.6 9.6-8.6 8.6L3 11.6z' />
      <circle cx='7.5' cy='8' r='1.5' />
    </g>
  ),
  percent: (
    <g {...outline}>
      <path d='M19 5L5 19' />
      <circle cx='7' cy='7' r='2.5' />
      <circle cx='17' cy='17' r='2.5' />
    </g>
  ),
  gift: (
    <g {...outline}>
      <path d='M4.5 11h15v9.5h-15zM3 7.5h18V11H3zM12 7.5v13' />
      <path d='M12 7.5C10.5 4.5 7 4 7 6s3 1.5 5 1.5zm0 0c1.5-3 5-3.5 5-1.5s-3 1.5-5 1.5z' />
    </g>
  ),
  home: (
    <g {...outline}>
      <path d='M3.5 11 12 3.8l8.5 7.2' />
      <path d='M5.5 9.5v11h13v-11M10 20.5v-5.5h4v5.5' />
    </g>
  ),
  sun: (
    <g {...outline}>
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4' />
    </g>
  ),
  heart: (
    <path
      fill='currentColor'
      d='M12 20.5s-8-4.9-8-11A4.5 4.5 0 0 1 12 6.6a4.5 4.5 0 0 1 8 2.9c0 6.1-8 11-8 11z'
    />
  ),
  // A crescent moon and a star.
  crescent: (
    <g fill='currentColor'>
      <path d='M10.61 4.01A8.5 8.5 0 1 0 18.82 15.83A7.2 7.2 0 0 1 10.61 4.01z' />
      <path d='M18.8 3.2l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z' />
    </g>
  ),
  // A flower with four petals.
  flower: (
    <g {...outline}>
      <circle cx='12' cy='6.5' r='3' />
      <circle cx='17.5' cy='12' r='3' />
      <circle cx='12' cy='17.5' r='3' />
      <circle cx='6.5' cy='12' r='3' />
      <circle cx='12' cy='12' r='1.6' fill='currentColor' />
    </g>
  ),
  // An egg with a zigzag stripe.
  egg: (
    <g {...outline}>
      <path d='M12 3c-3.6 0-6.5 6.1-6.5 10.5a6.5 6.5 0 0 0 13 0C18.5 9.1 15.6 3 12 3z' />
      <path d='M6 12.5l2.5-1.8 2.3 1.8 2.4-1.8 2.3 1.8 2.5-1.8' />
    </g>
  ),
  star: (
    <path
      fill='currentColor'
      d='M12 2.8l2.7 6 6.5.6-4.9 4.4 1.4 6.4L12 16.9l-5.7 3.3 1.4-6.4-4.9-4.4 6.5-.6z'
    />
  ),
  // A storm cloud with lightning, for monsoon and haboob season.
  storm: (
    <>
      <path
        {...outline}
        d='M7 14h10.5a3.8 3.8 0 0 0 .5-7.55A5.3 5.3 0 0 0 7.8 5.7 4.15 4.15 0 0 0 7 14z'
      />
      <path
        fill='currentColor'
        d='M13.4 15.4 9.8 19.8h2.9l-1.1 3 3.8-4.7h-2.9l1.1-2.7z'
      />
    </>
  ),
  // A jack-o'-lantern shape with a stem.
  pumpkin: (
    <g {...outline}>
      <path d='M12 7.5c-4.6 0-8 2.8-8 6.3S7.4 20 12 20s8-2.7 8-6.2-3.4-6.3-8-6.3z' />
      <path d='M12 7.5c-1.8 2.2-1.8 10.3 0 12.5M12 7.5c1.8 2.2 1.8 10.3 0 12.5' />
      <path d='M12 7.5V4.8l2.2-1.3' />
    </g>
  ),
  // A diya: a small clay lamp, with the flame on its spout.
  diya: (
    <g fill='currentColor'>
      <path d='M1.8 13.2c3 .7 6.4 1 10 1 3.1 0 5.8-.3 8-.9l2.4-2.8c-.4 4.9-4.8 8.5-10.4 8.5-5.1 0-9.3-2.5-10-5.8z' />
      <path d='M19.6 1.6c2 2.4 2.9 4.2 2.9 5.6a2.9 2.9 0 0 1-5.8 0c0-1.4.9-3.2 2.9-5.6z' />
    </g>
  ),
  // A fall leaf.
  leaf: (
    <g {...outline}>
      <path d='M5 19C5 10 10 5 19.5 4.5 19 14 14 19 5 19z' />
      <path d='M5 19l8.5-8.5' />
    </g>
  ),
  snowflake: (
    <g {...outline}>
      <path d='M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9' />
      <path d='M9.6 4.6L12 6l2.4-1.4M9.6 19.4L12 18l2.4 1.4' />
    </g>
  ),
};

export default function OfferIcon({ icon, className = '' }: OfferIconProps) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={`offer-icon ${className}`}>
      {shapes[icon]}
    </svg>
  );
}
