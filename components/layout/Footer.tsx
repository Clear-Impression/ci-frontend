import Image from 'next/image';
import Link from 'next/link';
import { company } from '@/data/company';
import { services as servicePages } from '@/data/services';
import { getLocations } from '@/lib/locations';
import { link } from 'fs';

// Keep hover and keyboard focus styles the same for footer links.
const linkStyle =
  'rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]';

export default async function Footer() {
  const { cities } = await getLocations();

  return (
    <footer className='bg-[#200b38] pb-24 text-white'>
      <div className='h-1 bg-[#55ab68]' />
      {/* Four columns on wide screens. Below that, two by two, so the city list has room for its two columns. */}
      <div className='mx-auto grid max-w-7xl gap-6 px-6 py-6 sm:grid-cols-2 sm:px-8 xl:grid-cols-[1.5fr_1fr_1.25fr_1.25fr]'>
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
        <div>
          <h2 className='text-base font-semibold'>Our services</h2>
          <ul className='mt-3 space-y-1 text-sm leading-6 text-white/80'>
            {/* 0, 1 are "how the windows are cleaned" thus 2 thru 6 have more relavant links */}
            {servicePages.slice(2, 6).map((service) => (
              <li key={service.slug}>
                <Link href={`/services/${service.slug}`} className={linkStyle}>
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className='text-base font-semibold'>Service areas</h2>
          {/* Two columns instead of one long list. The rows grow as cities are added. */}
          <ul
            className='mt-3 grid auto-cols-max grid-flow-col gap-x-10 gap-y-1 text-sm leading-6 text-white/80'
            style={{ gridTemplateRows: `repeat(${Math.ceil(cities.length / 2)}, auto)` }}>
            {cities.map((location) => (
              <li key={location.slug}>
                <Link href={location.href} className={linkStyle}>
                  {location.name}
                </Link>
              </li>
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
            {/* Begin social elements */}
            <div className='flex flex-row mt-3'>
              {/* Google */}
              <p className='mr-3'>
                <a href={company.googleHref} className={`wrap-break-word ${linkStyle}`} target='_blank'>
                  <Image src='/icons/googleMonochrome.svg' alt='Google business link' width={28} height={28} style={{filter:'invert(1)'}}/>
                </a>
              </p>
              {/* Instagram */}
              <p className='mr-3'>
                <a
                  href={company.instagramHref}
                  className={`wrap-break-word ${linkStyle}`} 
                  target='_blank'>
                  <Image
                    src='/icons/instagramMonochrome.png'
                    alt='Instagram link'
                    width={28}
                    height={28}
                    style={{filter:'invert(1)'}}/>
                </a>
              </p>
              {/* Facebook */}
              <p className='mr-3'>
                <a
                  href={company.facebookHref}
                  className={`wrap-break-word ${linkStyle}`}
                  target='_blank'>
                  <Image
                    src='/icons/facebookMonochrome.png'
                    alt='Facebook link'
                    width={28}
                    height={28}
                    style={{filter:'invert(1)'}}/>
                </a>
              </p>
              {/* HomeAdvisor */}
              <p className='mr-3'>
                <a href={company.homeAdvisorHref} className={`wrap-break-word ${linkStyle}`} target='_blank'>
                  <Image src='/icons/homeAdvisorMonochrome.svg' alt='HomeAdvisor link' width={28} height={28} style={{filter:'invert(1)'}}/>
                </a>
              </p>
            </div>
            {/* End social elements, begin BBB accredited */}
            <div className='flex flex-row items-center mt-3'>
              <p className='mr-3'>
                <a 
                    href={company.bbbHref}
                    className={`wrap-break-word ${linkStyle}`}
                    target='_blank'>
                    <Image
                      src='/icons/bbbAccredited.png'
                      alt='BBB accrediation link'
                      width={150}
                      height={150}
                      />
                </a>
              </p>
              <p className='mr-3'>
                <a 
                    href={company.homeAdvisorHref}
                    className={`wrap-break-word ${linkStyle}`}
                    target='_blank'>
                    <Image
                      src='/icons/angiApproved.png'
                      alt='Angi approved logo and link'
                      width={150}
                      height={150}
                      />
                </a>
              </p>
            </div>
          </address>
        </div>
      </div>
      {/* Use the year when the page is rendered for the copyright text. */}
      <div className='border-t border-white/15'>
        <div className='mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-6 py-4 text-sm font-medium text-white sm:px-8'>
          <p>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          {/* Keep the full service terms available from every page. */}
          <nav aria-label='Footer links' className='flex flex-wrap items-center gap-x-5 gap-y-2'>
            <Link href='/' className={`inline-flex min-h-11 items-center ${linkStyle}`}>
              Home
            </Link>
            <Link href='/terms-and-conditions' className={`inline-flex min-h-11 items-center ${linkStyle}`}>
              Service terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
