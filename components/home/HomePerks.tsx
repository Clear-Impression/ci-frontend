import HxIcon from '@/components/home/HxIcon';
import type { PerkIcon } from '@/data/homePerks';
import styles from './HomePerks.module.css';

type HomePerksProps = {
  eyebrow: string;
  title: string;
  highlight: string;
  lead: string;
  perks: readonly { icon: PerkIcon; title: string; text: string }[];
  consent: string;
};

// Line icons for each perk.
const icons: Record<PerkIcon, string[]> = {
  bell: ['M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15z', 'M10 20a2 2 0 0 0 4 0'],
  van: ['M3 7h11v9H3zM14 10h4l3 3v3h-7z', 'M5 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0M15 18a2 2 0 1 0 4 0a2 2 0 1 0-4 0'],
  calendar: ['M4 6h16v14H4zM4 10h16M8 3v4M16 3v4', 'm9 15 2 2 4-4'],
  star: ['M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z'],
  tag: ['M3 12V4h8l10 10-8 8z', 'M7.5 8.5h.01'],
  gift: ['M4 10h16v10H4zM3 7h18v3H3zM12 7v13', 'M12 7c-1.5-3-5-3-5-1s3 1 5 1zM12 7c1.5-3 5-3 5-1s-3 1-5 1z'],
};

// "What booking with us is like": what customers can count on, and a short
// form that starts a quote and can sign them up for texts.
export default function HomePerks({ eyebrow, title, highlight, lead, perks, consent }: HomePerksProps) {
  return (
    <section
      aria-labelledby='home-perks-heading'
      className={`hx-section ${styles.section}`}>
      <div className='hx-container'>
        <div className='hx-heading-row'>
          <div>
            <p className='hx-eyebrow hx-reveal'>{eyebrow}</p>
            <h2
              id='home-perks-heading'
              className='hx-h2'>
              <span className='line-mask'>
                <span className='line-rise'>
                  {title} <em>{highlight}</em>
                </span>
              </span>
            </h2>
          </div>
          <p className='hx-reveal'>{lead}</p>
        </div>

        <ul className={styles.perks}>
          {perks.map((perk, index) => (
            <li
              key={perk.title}
              className={`hx-reveal ${styles.perk}`}
              style={{ '--d': `${index * 60}ms` } as React.CSSProperties}>
              <span className={styles.perkIcon}>
                <svg
                  aria-hidden='true'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.8'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  {icons[perk.icon].map((path) => (
                    <path
                      key={path}
                      d={path}
                    />
                  ))}
                </svg>
              </span>
              <span>
                <strong>{perk.title}</strong>
                <small>{perk.text}</small>
              </span>
            </li>
          ))}
        </ul>

        {/* Starts the detailed quote with these details filled in. */}
        <form
          action='/quote'
          method='get'
          aria-label='Start your free quote'
          className={`hx-reveal ${styles.form}`}>
          <div className={styles.fields}>
            <label>
              Your name
              <input
                name='name'
                type='text'
                autoComplete='name'
                required
                maxLength={100}
                placeholder='Jane Smith'
              />
            </label>
            <label>
              {/* One line, so "(optional)" stays next to "Phone". */}
              <span className={styles.labelText}>
                Phone <span className={styles.optional}>(optional)</span>
              </span>
              <input
                name='phone'
                type='tel'
                autoComplete='tel'
                maxLength={30}
                placeholder='(480) 555-0123'
              />
            </label>
            <label>
              Email
              <input
                name='email'
                type='email'
                autoComplete='email'
                required
                maxLength={254}
                placeholder='jane@example.com'
              />
            </label>
            <button
              type='submit'
              className='hx-btn'>
              Get my quote <HxIcon name='arrow' />
            </button>
          </div>
          <label className={styles.consent}>
            <input
              name='texts'
              type='checkbox'
              value='yes'
            />
            <span>{consent}</span>
          </label>
        </form>
      </div>
    </section>
  );
}
