import Link from 'next/link';
import type { OfferBar } from '@/lib/seasonal-offers';
import OfferIcon from './OfferIcon';

type OfferTickerProps = {
  bar: OfferBar;
  className?: string;
};

// The seasonal offers from Sanity, scrolling slowly from right to left, with
// the theme's icon between them. The messages are written out twice so the
// loop has no gap; screen readers only hear the first set. It pauses on hover,
// and holds still for people who prefer less motion.
export default function OfferTicker({ bar, className = '' }: OfferTickerProps) {
  // Longer messages scroll for longer, so they move at about the same speed.
  const seconds = Math.max(20, Math.round(bar.messages.join(' ').length * 0.25));

  const messages = (copy?: boolean) => (
    <span
      className='offer-ticker-set'
      aria-hidden={copy || undefined}>
      {bar.messages.map((message, index) => (
        <span
          key={index}
          className='offer-ticker-item'>
          <span>{message}</span>
          <OfferIcon icon={bar.icon} />
        </span>
      ))}
    </span>
  );

  const track = (
    <span
      className='offer-ticker-track'
      style={{ '--offer-seconds': `${seconds}s` } as React.CSSProperties}>
      {messages()}
      {messages(true)}
    </span>
  );

  const classes = `offer-ticker ${className}`;
  return bar.href ? (
    <Link
      href={bar.href}
      data-offer-theme={bar.theme}
      style={(bar.colors ?? undefined) as React.CSSProperties | undefined}
      className={classes}>
      {track}
    </Link>
  ) : (
    <div
      data-offer-theme={bar.theme}
      style={(bar.colors ?? undefined) as React.CSSProperties | undefined}
      className={classes}>
      {track}
    </div>
  );
}
