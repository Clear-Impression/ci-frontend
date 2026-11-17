import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import { getServices } from '@/lib/services';
import Link from 'next/link';
import Reveal from '@/components/services/Reveal';
import ServiceIndex from './ServiceIndex';
import CoreServiceCards from './CoreServiceCards';
import CountUp from './CountUp';
import ClearerViewCta from '@/components/ui/ClearerViewCta';
import HeroVideo from '@/components/ui/HeroVideo';
import QuoteButton from '@/components/quote/QuoteButton';
import { jakarta } from '../fonts';
import './services-page.css';

// Describe the page for search engines and link previews.
export const metadata = createPageMetadata({
  path: '/services',
  title: 'Services | Clear Impression',
  description:
    'Window cleaning with traditional tools or 100% pure water, plus hard water stain removal, screen cleaning, and more across Mesa and the Phoenix metro.',
});

// Photos for the core service cards, one per service, showing our cleaner in
// the brand purple at work. They're illustrations, not photos of real jobs.
const cardPhotos: Record<string, { url: string; alt: string; position?: string }> = {
  'residential-window-washing': {
    url: '/images/services/residential.jpg',
    alt: 'A window cleaner in a purple polo on a step ladder, squeegeeing a large window on a stucco home.',
  },
  'commercial-office-glass': {
    url: '/images/services/commercial.jpg',
    alt: 'A window cleaner washing the glass front of an office building with a water-fed pole.',
  },
  'solar-panel-cleaning': {
    url: '/images/services/solar.jpg',
    alt: 'A window cleaner scrubbing rooftop solar panels with a soft brush on a long pole.',
    position: 'center 30%',
  },
  'gutter-roof-care': {
    url: '/images/services/gutter.jpg',
    alt: 'A window cleaner on a ladder clearing leaves from a gutter into a bucket.',
  },
  'track-detailing': {
    url: '/images/services/tracks.jpg',
    alt: 'A window cleaner brushing dirt out of a sliding door track.',
  },
};
const defaultPhoto = {
  url: '/images/home/clearer-view-window.jpg',
  alt: 'A clear view through a clean window.',
};

export default async function Services() {
  const header = await getPageHeader('services');
  const heroLines = header.title.split('\n');
  const lastLine = heroLines.length - 1;
  const services = await getServices();
  const core = services.filter((service) => service.category === 'core');
  const specialized = services.filter((service) => service.category === 'specialized');
  const [traditional, pureWater] = services.filter((service) => service.category === 'method');

  const cards = core.map((service) => {
    const image =
      cardPhotos[service.slug] ??
      (service.image?.url ? { url: service.image.url, alt: service.image.alt } : defaultPhoto);
    return {
      slug: service.slug,
      title: service.title,
      previewDescription: service.previewDescription,
      largeDescription: service.largeDescription,
      image,
    };
  });

  // The strip along the bottom of the hero: real counts that jump down the page.
  const strip = [
    { href: '#core-services', figure: core.length, suffix: '', label: 'Core services', note: 'Homes, businesses, solar and roofs' },
    { href: '#specialized-services', figure: specialized.length, suffix: '', label: 'Specialized services', note: 'The finishing touches' },
    ...(pureWater
      ? [{ href: `/services/${pureWater.slug}`, figure: 100, suffix: '%', label: 'Pure water', note: 'See how our filtered water works' }]
      : []),
  ];

  return (
    <main className={`${jakarta.variable} sp flex-1 bg-white text-[#200b38]`}>
      {/* The hero: the solar video under a purple shade, a big white headline,
          then the intro and buttons, with a glass strip along the bottom. */}
      <section
        aria-labelledby='services-heading'
        className='sp-hero'>
        {/* Solar panels being scrubbed with pure water, mountains behind. */}
        <HeroVideo
          webm='/videos/services-hero.webm'
          mp4='/videos/services-hero.mp4'
          poster='/videos/services-hero-poster.jpg'
          className='sp-hero-video'
        />
        <span
          aria-hidden='true'
          className='sp-hero-shade'
        />

        <div className='sp-wrap sp-hero-copy'>
          <p className='sp-eyebrow'>What we do</p>
          <h1
            id='services-heading'
            className='sp-h1'>
            {heroLines.map((line, index) => (
              <span
                key={line}
                className='line-mask'>
                <span
                  className='line-rise'
                  style={{ '--i': index } as React.CSSProperties}>
                  {index === lastLine && lastLine > 0 ? <em>{line}</em> : line}
                </span>
              </span>
            ))}
          </h1>
          <div className='sp-hero-bottom'>
            {header.subtitle && <p>{header.subtitle}</p>}
            <div className='sp-buttons'>
              <QuoteButton className='sp-btn'>
                Get a free quote
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
              </QuoteButton>
              <a
                href='#core-services'
                className='sp-btn-ghost'>
                Browse services
              </a>
            </div>
          </div>
        </div>

        <nav
          aria-label='Jump to'
          className='sp-strip'>
          <ul className='sp-wrap'>
            {strip.map((item) => (
              <li key={item.label}>
                <a href={item.href}>
                  <b>
                    <CountUp
                      to={item.figure}
                      suffix={item.suffix}
                    />
                  </b>
                  <span>
                    <strong>
                      {item.label}
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
                    </strong>
                    <small>{item.note}</small>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      {/* Core services: tall photo cards, set a little up and down. */}
      <section
        id='core-services'
        aria-labelledby='core-services-heading'
        className='sp-section sp-core'>
        <div className='sp-wrap'>
          <Reveal className='sp-head'>
            <div>
              <p className='sp-eyebrow sp-eyebrow-dark'>Core services</p>
              <h2
                id='core-services-heading'
                className='sp-h2 sp-grow'>
                <span className='line-mask'>
                  <span className='line-rise'>Core</span>
                </span>{' '}
                <span className='line-mask'>
                  <span
                    className='line-rise'
                    style={{ '--i': 1 } as React.CSSProperties}>
                    <em>Services.</em>
                  </span>
                </span>
              </h2>
            </div>
            <div>
              <p className='fade-up sp-lead'>
                Reliable property care for homes, businesses, and outdoor surfaces across the Phoenix Valley.
              </p>
              {/* These links keep both method pages one click from Services
                  for visitors and search engines. */}
              {traditional && pureWater && (
                <p className='fade-up sp-methods'>
                  We clean with{' '}
                  <Link href={`/services/${traditional.slug}`}>traditional tools</Link>,{' '}
                  <Link href={`/services/${pureWater.slug}`}>100% pure water</Link>, or both, chosen for your glass.
                </p>
              )}
            </div>
          </Reveal>
          <Reveal>
            <CoreServiceCards cards={cards} />
          </Reveal>
        </div>
      </section>

      {/* Specialized services as a list with a detail pane on wide screens. */}
      <section
        id='specialized-services'
        aria-labelledby='specialized-heading'
        className='sp-section sp-specialized'>
        <div className='sp-wrap'>
          <Reveal className='sp-head'>
            <div>
              <p className='sp-eyebrow sp-eyebrow-dark'>Specialized services</p>
              <h2
                id='specialized-heading'
                className='sp-h2 sp-grow'>
                <span className='line-mask'>
                  <span className='line-rise'>Specialized</span>
                </span>{' '}
                <span className='line-mask'>
                  <span
                    className='line-rise'
                    style={{ '--i': 1 } as React.CSSProperties}>
                    <em>Services.</em>
                  </span>
                </span>
              </h2>
            </div>
            <p className='fade-up sp-lead'>For all your needs to make a Clear Impression.</p>
          </Reveal>
          <div className='mt-12'>
            <ServiceIndex services={specialized} />
          </div>
        </div>
      </section>

      {/* End with the same wipe-the-window call to action as the other pages. */}
      <section className='sp-wrap py-16 sm:py-20'>
        <ClearerViewCta />
      </section>
    </main>
  );
}
