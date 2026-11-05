import Image from 'next/image';
import Link from 'next/link';
import { company, navigation } from '@/data/company';
import BackButton from './BackButton';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import NavLink from './NavLink';
import { LocationsPreview, ServicesPreview } from './NavPreviews';
import StickyHeader from './StickyHeader';

export default function Navbar() {
  return (
    // Pinned to the top of the screen. The top strip tucks away and the logo
    // shrinks after scrolling, then both come back at the top of the page.
    <StickyHeader className='site-header sticky top-0 z-50 bg-[#200b38] text-white'>
      {/* Keep the service area and phone number easy to find. */}
      <div className='header-strip border-b border-white/15'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3 text-xs sm:px-8 sm:text-sm'>
          <span className='text-white/80'>Serving the Phoenix metro area</span>
          <a
            href={company.phoneHref}
            className='font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
            Call {company.phone}
          </a>
        </div>
      </div>
      <div className='header-row mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 sm:px-8'>
        {/* The company logo takes visitors back to the homepage. */}
        <Link
          href='/'
          aria-label={`${company.name} home`}
          className='shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
          {/* Load the header logo early because it appears at the top. */}
          <Image
            src={company.logoHorizontal}
            alt='Clear Impression Window Cleaning'
            width={647}
            height={256}
            priority
            sizes='(min-width: 640px) 203px, 162px'
            className='header-logo h-16 w-auto sm:h-20'
          />
        </Link>
        {/* Keep unfinished pages visible without linking to missing routes. */}
        <nav
          aria-label='Main navigation'
          className='hidden lg:block'>
          <ul className='flex items-center gap-6 text-sm font-medium'>
            {navigation.map((item) =>
              item.available && item.preview ? (
                // Services and Locations show a preview of every page under them.
                <NavDropdown
                  key={item.href}
                  label={item.label}
                  href={item.href}>
                  {item.preview === 'services' ? <ServicesPreview /> : <LocationsPreview />}
                </NavDropdown>
              ) : (
                <li key={item.href}>
                  {item.available ? (
                    <NavLink
                      href={item.href}
                      className='rounded-sm py-3 hover:text-[#efb52b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
                      {item.label}
                    </NavLink>
                  ) : (
                    <span
                      aria-disabled='true'
                      title='Coming soon'
                      className='text-white/60'>
                      {item.label}
                      <span className='sr-only'> (coming soon)</span>
                    </span>
                  )}
                </li>
              ),
            )}
          </ul>
        </nav>
        {/* Open the quote form while keeping calls available in the top bar. */}
        <a
          href={company.quoteFormUrl}
          className='hidden min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:inline-flex'>
          Get a free quote
        </a>
        {/* Show the mobile menu below the desktop breakpoint. */}
        <MobileMenu
          items={navigation}
          quoteHref={company.quoteFormUrl}
        />
      </div>
      {/* Floats just under the header on every page except the homepage. */}
      <BackButton />
    </StickyHeader>
  );
}
