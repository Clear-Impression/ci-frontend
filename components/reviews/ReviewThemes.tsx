'use client';

import type { Review } from '@/data/reviews';

type ReviewThemesProps = {
  reviews: readonly Review[];
  writeReviewUrl: string;
};

// The things customers bring up, and the words that count as bringing them up.
// Matched against the review text, so the names stay true as reviews change.
const themes = [
  { label: 'Professional', words: /professional/i, icon: 'badge' },
  { label: 'Spotless, clear windows', words: /spotless|very clear|shiny|look awesome|look nice/i, icon: 'sparkle' },
  { label: 'Friendly and kind', words: /friendly|kind\b|lovely|great guy/i, icon: 'smile' },
  { label: 'Fair prices', words: /price|value/i, icon: 'tag' },
  { label: 'Quick and on time', words: /prompt|quickly|efficient|perfect time|on the spot/i, icon: 'clock' },
  { label: 'Easy to work with', words: /communication|fulfilled all my requests|customer service/i, icon: 'chat' },
] as const;

const icons: Record<(typeof themes)[number]['icon'], React.ReactNode> = {
  badge: <path d='M12 3.5l7 2.8v5.6c0 4.3-2.9 7.3-7 8.6-4.1-1.3-7-4.3-7-8.6V6.3zM9 12l2 2 4-4' />,
  sparkle: <path d='M12 3.5l2.2 5.8 5.8 2.2-5.8 2.2L12 19.5l-2.2-5.8L4 11.5l5.8-2.2z' />,
  smile: (
    <>
      <circle
        cx='12'
        cy='12'
        r='8.5'
      />
      <path d='M8.5 14c.9 1.3 2.1 2 3.5 2s2.6-.7 3.5-2M9 9.5h.01M15 9.5h.01' />
    </>
  ),
  tag: <path d='M3.5 12.5l8-8h7.5a1 1 0 0 1 1 1V13l-8 8zM15.5 8.5h.01' />,
  clock: (
    <>
      <circle
        cx='12'
        cy='12'
        r='8.5'
      />
      <path d='M12 7.5V12l3 2' />
    </>
  ),
  chat: <path d='M5 5h14a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H10l-5 4v-4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z' />,
};

// Ask the rolodex at the top of the page to turn to one review.
const showOnRolodex = (id: string) => {
  window.dispatchEvent(new CustomEvent('rolodex:show', { detail: id }));
  document.getElementById('review-rolodex')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
};

// What customers mention most, worked out from the real reviews, beside a
// short "leave us a review" panel. Clicking a theme turns the rolodex to a
// review that mentions it.
export default function ReviewThemes({ reviews, writeReviewUrl }: ReviewThemesProps) {
  const found = themes
    .map((theme) => ({
      ...theme,
      matches: reviews.filter((review) => theme.words.test(review.quote)),
    }))
    .filter((theme) => theme.matches.length > 0)
    .sort((a, b) => b.matches.length - a.matches.length);

  return (
    <div className='rt'>
      <div className='rt-themes'>
        <p className='rt-eyebrow'>From our Google reviews</p>
        <h2
          id='themes-heading'
          className='rt-h2'>
          What customers <em>mention most.</em>
        </h2>
        <p className='rt-lead'>
          We read every review. These are the things people bring up again and again. Pick one to see a review that says it.
        </p>

        <ul className='rt-grid'>
          {found.map((theme, index) => (
            <li
              key={theme.label}
              style={{ '--n': index } as React.CSSProperties}>
              <button
                type='button'
                onClick={() => showOnRolodex(theme.matches[0].id)}
                className='rt-tile'>
                <span
                  aria-hidden='true'
                  className='rt-icon'>
                  <svg
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.7'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    {icons[theme.icon]}
                  </svg>
                </span>
                <span className='rt-label'>{theme.label}</span>
                <span className='rt-who'>
                  {theme.matches
                    .slice(0, 3)
                    .map((review) => review.name.split(' ')[0])
                    .join(', ')}
                  {theme.matches.length > 3 ? ' and more' : ''}
                </span>
                <span className='rt-see'>
                  See what they said
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />
                  </svg>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Asking happy customers to add theirs: five big stars that light up
          as you point at them, each opening our Google review page. */}
      <aside
        aria-labelledby='write-heading'
        className='rt-write'>
        <span
          aria-hidden='true'
          className='rt-g'>
          G
        </span>
        <h2
          id='write-heading'
          className='rt-write-title'>
          Had us clean your windows?
        </h2>
        <p>Tell your neighbors how it went. It only takes a minute.</p>
        <div className='rt-rate'>
          {[1, 2, 3, 4, 5].map((star) => (
            <a
              key={star}
              href={writeReviewUrl}
              target='_blank'
              rel='noopener noreferrer'
              aria-label={`Rate us ${star} out of 5 on Google (opens in a new tab)`}
              className='rt-star'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'>
                <path d='M12 2.8l2.8 5.7 6.3.9-4.55 4.43 1.07 6.27L12 17.15 6.38 20.1l1.07-6.27L2.9 9.4l6.3-.9z' />
              </svg>
            </a>
          ))}
        </div>
        <a
          href={writeReviewUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='rt-write-link'>
          Write a review on Google
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'>
            <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />
          </svg>
          <span className='sr-only'> (opens in a new tab)</span>
        </a>
      </aside>
    </div>
  );
}
