import Image from 'next/image';
import Bubbles from '@/components/home/Bubbles';
import HxIcon from '@/components/home/HxIcon';
import QuoteButton from '@/components/quote/QuoteButton';
import { company } from '@/data/company';
import type { HomeStep } from '@/data/home';

type HomeClosingProps = {
  heading: string;
  text: string;
  quoteHref: string;
  stepsLabel: string;
  steps: readonly HomeStep[];
  image: string;
  imageAlt: string;
};

// The last call to action on the homepage. A golden-hour photo of the Valley
// starts out dusty; when the section scrolls into view a squeegee wipes
// across it to reveal the clear view, then the photo slowly drifts.
export default function HomeClosing({ heading, text, stepsLabel, steps, image, imageAlt }: HomeClosingProps) {
  // "Unlock the beauty beyond the glass." -> the second half in gold.
  const split = heading.indexOf(' beyond ');
  const first = split >= 0 ? heading.slice(0, split) : heading;
  const second = split >= 0 ? heading.slice(split + 1) : '';

  return (
    <section
      aria-labelledby='home-closing-heading'
      className='hx-closing hx-section hx-on-dark'>
      <div className='hx-closing-photo'>
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes='100vw'
        />
      </div>
      {/* The same photo, dusty. The big squeegee wipes it away. */}
      <div
        aria-hidden='true'
        className='hx-closing-photo hx-closing-dirty'>
        <Image
          src={image}
          alt=''
          fill
          sizes='100vw'
        />
      </div>
      <div
        aria-hidden='true'
        className='hx-closing-squeegee'>
        <span />
      </div>
      <div
        aria-hidden='true'
        className='hx-closing-overlay'
      />
      <span
        aria-hidden='true'
        className='hx-closing-sun'
      />
      <div
        aria-hidden='true'
        className='hx-closing-sparkles'>
        {[0, 1, 2, 3].map((i) => (
          <svg
            key={i}
            viewBox='0 0 24 24'
            style={{ '--i': i } as React.CSSProperties}>
            <path
              d='M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z'
              fill='currentColor'
            />
          </svg>
        ))}
      </div>
      <Bubbles count={8} />
      <div className='hx-container hx-closing-content'>
        <p className='hx-eyebrow hx-eyebrow-light hx-reveal'>Ready when you are</p>
        <h2
          id='home-closing-heading'
          className='hx-h2'>
          <span className='line-mask'>
            <span className='line-rise'>{first}</span>
          </span>{' '}
          {second && (
            <span className='line-mask'>
              <span
                className='line-rise'
                style={{ '--i': 1 } as React.CSSProperties}>
                <em>{second}</em>
              </span>
            </span>
          )}
        </h2>
        <p className='hx-closing-text hx-reveal'>{text}</p>
        <div className='hx-button-row hx-reveal'>
          <QuoteButton className='hx-btn'>
            Get my free quote <HxIcon name='arrow' />
          </QuoteButton>
          <a
            href={company.phoneHref}
            className='hx-call'>
            <HxIcon name='phone' /> {company.phone}
          </a>
        </div>

        {/* What happens after someone asks for a quote. */}
        <div className='hx-next hx-reveal'>
          <strong>{stepsLabel.toUpperCase()}</strong>
          <ol className='contents'>
            {steps.map((step, index) => (
              <li
                key={step.title}
                title={step.text}>
                <b aria-hidden='true'>{index + 1}</b>
                {step.title}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
