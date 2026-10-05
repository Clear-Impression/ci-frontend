import Image from 'next/image';
import Link from 'next/link';
import { company, serviceAreas, services } from '@/data/company';

// Keep hover and keyboard focus styles the same for footer links.
const linkStyle =
  'rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]';

export default function Footer() {
  return (
    <footer className='bg-[#200b38] text-white'>
      <div className='h-1 bg-[#55ab68]' />
      <div className='mx-auto grid max-w-7xl gap-6 px-6 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]'>
        {/* Repeat the logo and short company description at the bottom. */}
        <div>
          <Link
            href='/'
            aria-label={`${company.name} home`}
            className={`inline-block ${linkStyle}`}>
            <Image
              src={company.logo}
              alt='Clear Impression Window Cleaning'
              width={375}
              height={375}
              sizes='64px'
              className='h-16 w-16 rounded-lg'
            />
          </Link>
          <p className='mt-3 max-w-xs text-sm leading-6 text-white/80'>
            {company.description}
          </p>
        </div>
        {/* Show services and areas as text until their pages are ready. */}
        <div>
          <h2 className='text-base font-semibold'>Our services</h2>
          <ul className='mt-3 space-y-1 text-sm leading-6 text-white/80'>
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className='text-base font-semibold'>Service areas</h2>
          <ul className='mt-3 space-y-1 text-sm leading-6 text-white/80'>
            {serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
        </div>
        {/* Phone and email links open the visitor's calling or email app. */}
        <div>
          <h2 className='text-base font-semibold'>Get in touch</h2>
          <address className='mt-3 space-y-1 text-sm leading-6 not-italic text-white/80'>
            <p>
              <a
                href={company.phoneHref}
                className={linkStyle}>
                {company.phone}
              </a>
            </p>
            <p>
              <a
                href={company.emailHref}
                className={`wrap-break-word ${linkStyle}`}>
                {company.email}
              </a>
            </p>
          </address>
          {/* Link to the live site without replacing this page. */}
          <a
            href={company.website}
            target='_blank'
            rel='noopener noreferrer'
            className={`mt-2 inline-block min-h-11 py-2 text-sm font-medium text-[#efb52b] ${linkStyle}`}>
            Visit our live website <span aria-hidden='true'>↗</span>
            <span className='sr-only'> (opens in a new tab)</span>
          </a>
        </div>
      </div>
      {/* Use the year when the page is rendered for the copyright text. */}
      <div className='border-t border-white/15'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-xs text-white/70 sm:px-8'>
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <Link
            href='/'
            className={linkStyle}>
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}
