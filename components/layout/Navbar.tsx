import Image from 'next/image';
import Link from 'next/link';
import { company, navigation } from '@/data/company';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  return (
    <header className='relative z-20 bg-[#200b38] text-white'>
      {/* Keep the service area and phone number easy to find. */}
      <div className='border-b border-white/15'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3 text-xs sm:px-8 sm:text-sm'>
          <span className='text-white/80'>Serving the Phoenix metro area</span>
          <a
            href={company.phoneHref}
            className='font-medium hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
            Call {company.phone}
          </a>
        </div>
      </div>
      <div className='mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3 sm:px-8'>
        {/* The company logo takes visitors back to the homepage. */}
        <Link
          href='/'
          aria-label={`${company.name} home`}
          className='shrink-0 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
          {/* Load the header logo early because it appears at the top. */}
          <Image
            src={company.logo}
            alt='Clear Impression Window Cleaning'
            width={375}
            height={375}
            priority
            sizes='96px'
            className='h-24 w-24 rounded-lg'
          />
        </Link>
        {/* Keep unfinished pages visible without linking to missing routes. */}
        <nav
          aria-label='Main navigation'
          className='hidden lg:block'>
          <ul className='flex items-center gap-6 text-sm font-medium'>
            {navigation.map((item) => (
              <li key={item.href}>
                {item.available ? (
                  <Link
                    href={item.href}
                    className='rounded-sm py-3 hover:text-[#efb52b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
                    {item.label}
                  </Link>
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
            ))}
          </ul>
        </nav>
        {/* Use phone calls for quotes until the quote page is ready. */}
        <a
          href={company.phoneHref}
          className='hidden min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white lg:inline-flex'>
          Call for a quote
        </a>
        {/* Show the mobile menu below the desktop breakpoint. */}
        <MobileMenu
          items={navigation}
          phoneHref={company.phoneHref}
          website={company.website}
        />
      </div>
    </header>
  );
}
