import { serviceCities } from '@/data/home';
import { getValleyMap } from '@/lib/cityShapes';
import styles from '@/app/locations/locations.module.css';

// The order the route visits the cities, from the West Valley to the East.
const routeOrder = [
  'Glendale',
  'Phoenix',
  'Paradise Valley',
  'Scottsdale',
  'Tempe',
  'Mesa',
  'Chandler',
  'Gilbert',
  'Queen Creek',
];

// Which side of its pin each name sits on, so nearby cities don't overlap.
const labelsOnRight = new Set(['Scottsdale', 'Mesa', 'Gilbert']);

const width = 560;
const height = 340;

// A decorative map for the Locations header, built from the real city
// centers and boundaries. Screen readers skip it; the page lists every city.
export default function ValleyRoute({ className = '' }: { className?: string }) {
  const { pins, outlines, route } = getValleyMap(serviceCities, routeOrder, {
    width,
    height,
    padding: 56,
  });

  return (
    <svg
      aria-hidden='true'
      viewBox={`0 0 ${width} ${height}`}
      className={className}>
      <defs>
        {/* Fade the outlines out toward the edges instead of cutting them off. */}
        <radialGradient id='valley-fade'>
          <stop
            offset='0.6'
            stopColor='white'
          />
          <stop
            offset='1'
            stopColor='black'
          />
        </radialGradient>
        <mask id='valley-mask'>
          <rect
            width={width}
            height={height}
            fill='url(#valley-fade)'
          />
        </mask>
      </defs>
      <g mask='url(#valley-mask)'>
        {outlines.map((outline) => (
          <path
            key={outline.name}
            d={outline.path}
            className={styles.routeOutline}
          />
        ))}
      </g>
      <path
        d={route}
        className={styles.routeTrail}
      />
      <path
        d={route}
        pathLength={1}
        className={styles.routeLine}
      />
      {routeOrder.map((name, index) => {
        const pin = pins.find((item) => item.name === name);
        if (!pin) return null;
        const onRight = labelsOnRight.has(name);
        const isHome = name === 'Mesa';
        return (
          // The outer group places the pin; the inner one animates the drop.
          <g
            key={name}
            transform={`translate(${pin.x} ${pin.y})`}>
            <g
              className={styles.routePin}
              style={{ '--i': index } as React.CSSProperties}>
              {isHome && (
                <circle
                  r={7}
                  className={styles.pinHalo}
                />
              )}
              <circle
                r={isHome ? 6.5 : 5}
                className={styles.pinDot}
              />
              <text
                x={onRight ? 12 : -12}
                dy='0.35em'
                textAnchor={onRight ? 'start' : 'end'}
                className={`${styles.pinLabel} ${isHome ? styles.homeLabel : ''}`}>
                {name}
              </text>
            </g>
          </g>
        );
      })}
    </svg>
  );
}
