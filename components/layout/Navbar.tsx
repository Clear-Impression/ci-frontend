import Image from 'next/image';
import Link from 'next/link';
import { company, navigation, type NavigationItem } from '@/data/company';
import BackButton from './BackButton';
import MobileMenu from './MobileMenu';
import NavDropdown from './NavDropdown';
import NavLink from './NavLink';
import QuoteButton from '@/components/quote/QuoteButton';
import QuoteChooser from '@/components/quote/QuoteChooser';
import ReadingProgress from './ReadingProgress';
import { AboutPreview, HelpPreview, LocationsPreview, ServicesPreview } from './NavPreviews';
import SiteSearch from './SiteSearch';
import StickyHeader from './StickyHeader';

// The panel each menu tab opens.
function Preview({ kind }: { kind: NonNullable<NavigationItem['preview']> }) {
  if (kind === 'services') return <ServicesPreview />;
  if (kind === 'locations') return <LocationsPreview />;
  if (kind === 'help') return <HelpPreview />;
  return <AboutPreview />;
}

// A phone in a green circle, for the call buttons.
function PhoneIcon({ className }: { className: string }) {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      className={`shrink-0 rounded-full bg-[#72c587] text-[#200b38] ${className}`}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z' />
    </svg>
  );
}

export default function Navbar() {
  return (
    // Pinned to the top of the screen. The top strip tucks away and the logo
    // shrinks after scrolling, then both come back at the top of the page.
    <StickyHeader className='site-header sticky top-0 z-50 bg-[#200b38] text-white'>
      {/* Keep the service area and phone number easy to find. The header runs a bit
          wider than the page so big screens don't leave a wide gap on each side. */}
      <div className='header-strip border-b border-white/15'>
        <div className='mx-auto flex max-w-[96rem] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-2.5 text-xs sm:px-8 sm:text-sm xl:py-1.5'>
          <span className='flex items-center gap-2 text-white/80'>
            <span
              aria-hidden='true'
              className='size-2 rounded-full bg-[#72c587]'
            />
            Serving the Phoenix metro area
          </span>
          {/* Wide screens get the call button here, kept to one line so the strip stays thin. */}
          <a
            href={company.phoneHref}
            className='hidden items-center gap-2 rounded-full py-0.5 pl-0.5 pr-3.5 ring-1 ring-[#72c587]/55 hover:bg-[#72c587]/12 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b] xl:flex'>
            <PhoneIcon className='size-6 p-1' />
            <span className='text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#72c587]'>Call or text</span>
            <span className='text-base font-bold tracking-tight text-white'>{company.phone}</span>
          </a>
          {/* Smaller screens get a simpler version. */}
          <a
            href={company.phoneHref}
            className='flex min-h-9 items-center gap-2 rounded-full bg-[#72c587]/12 py-1 pl-1 pr-3.5 font-semibold text-white ring-1 ring-[#72c587]/50 hover:bg-[#72c587]/22 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b] sm:text-base xl:hidden'>
            <PhoneIcon className='size-7 p-1.5' />
            Call or text {company.phone}
          </a>
        </div>
      </div>
      <div className='header-row relative mx-auto flex max-w-[96rem] items-center justify-between gap-6 px-6 py-3 sm:px-8'>
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
        {/* At the top of the page a search box sits under the menu. After scrolling
            it folds into the search icon at the end of the menu. */}
        <SiteSearch>
          {/* Keep unfinished pages visible without linking to missing routes. */}
          <nav
            aria-label='Main navigation'
            className='hidden lg:block'>
            {/* A little tighter on laptops so the search icon fits next to the quote button. */}
            <ul className='flex items-center gap-5 text-sm font-medium xl:gap-6'>
              {navigation.map((item) =>
                item.available && item.preview ? (
                  // Services, Locations, Help, and About show their related pages.
                  <NavDropdown
                    key={item.href}
                    label={item.label}
                    href={item.href}
                    match={item.links?.map((link) => link.href)}>
                    <Preview kind={item.preview} />
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
        </SiteSearch>
        {/* Opens a popup explaining the instant estimate and the detailed quote. */}
        <QuoteButton className='hidden min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:inline-flex'>
          Get a free quote
        </QuoteButton>
        {/* Show the mobile menu below the desktop breakpoint. */}
        <MobileMenu items={navigation} />
      </div>
      {/* A green line along the bottom of the header on long pages. */}
      <ReadingProgress />
      {/* Floats just under the header on every page except the homepage. */}
      <BackButton />
      <QuoteChooser />
    </StickyHeader>
  );
}
