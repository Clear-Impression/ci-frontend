type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  id?: string;
  // Optional art for the right side, like the Locations route map.
  // With art, the intro moves under the heading on the left.
  media?: React.ReactNode;
  children?: React.ReactNode;
};

// Split a title into two lines: the first in ink, the second in violet.
// A line break in the title wins; otherwise break after a comma, or halfway.
function splitTitle(title: string): [string, string] {
  const lines = title.split('\n');
  if (lines.length > 1) return [lines[0], lines.slice(1).join(' ')];
  const comma = title.indexOf(', ');
  if (comma > 0 && comma < title.length - 2) return [title.slice(0, comma + 1), title.slice(comma + 2)];
  const words = title.split(' ');
  if (words.length < 2) return [title, ''];
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(' '), words.slice(half).join(' ')];
}

// The light page header used across the site: a small label, a big
// two-tone heading on the left, and a short intro on the right.
// The dark purple bar above it is the only purple at the top of the page.
export default function PageHeader({ eyebrow, title, subtitle, id, media, children }: PageHeaderProps) {
  const [first, second] = splitTitle(title);
  return (
    <section
      aria-labelledby={id}
      className='page-header relative isolate overflow-hidden bg-cream text-ink'>
      {/* Faint window panes that fade in behind the heading. */}
      <div aria-hidden='true' className='page-header-panes absolute inset-0 -z-10' />
      <div className='mx-auto grid max-w-7xl gap-8 px-6 pb-14 pt-16 sm:px-8 sm:pb-16 sm:pt-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-end lg:gap-16'>
        <div>
          <p className='page-header-rise inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-violet'>
            <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4 text-gold' fill='currentColor'>
              <path d='M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z' />
            </svg>
            {eyebrow}
          </p>
          <h1
            id={id}
            className='mt-5 text-5xl leading-[0.98] sm:text-6xl lg:text-7xl'>
            <span className='page-header-line block'>
              <span style={{ '--i': 0 } as React.CSSProperties}>{first}</span>
            </span>
            {second && (
              <span className='page-header-line block text-violet'>
                <span style={{ '--i': 1 } as React.CSSProperties}>{second}</span>
              </span>
            )}
          </h1>
          {media && subtitle && (
            <p
              className='page-header-rise mt-6 max-w-xl text-lg leading-relaxed text-ink/70'
              style={{ '--i': 2 } as React.CSSProperties}>
              {subtitle}
            </p>
          )}
        </div>
        {media ? (
          <div className='page-header-rise' style={{ '--i': 3 } as React.CSSProperties}>
            {media}
          </div>
        ) : (
          subtitle && (
            <p
              className='page-header-rise max-w-md text-lg leading-relaxed text-ink/70 lg:pb-2'
              style={{ '--i': 2 } as React.CSSProperties}>
              {subtitle}
            </p>
          )
        )}
      </div>
      {children}
      {/* A gold line draws across the bottom edge. */}
      <div aria-hidden='true' className='page-header-rule absolute inset-x-0 bottom-0 h-px' />
    </section>
  );
}
