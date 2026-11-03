import Link from 'next/link';
import ServiceIcon from '@/components/services/ServiceIcon';
import { serviceAreas } from '@/data/company';
import { cityRegions, locationPages } from '@/data/locations';
import { coreServices, specializedServices } from '@/data/services';

const pin = [
  'M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z',
  'M10 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0',
];

const itemClass =
  'nav-item flex items-start gap-3 rounded-xl p-3 hover:bg-[#f7f4fb] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6c3fb8]';

// The footer strip shared by both previews.
function PanelFooter({ note, href, label }: { note: string; href: string; label: string }) {
  return (
    <div className='flex items-center justify-between gap-6 border-t border-[#200b38]/8 bg-[#faf8fd] px-6 py-4 text-sm'>
      <p className='text-gray-600'>{note}</p>
      <Link
        href={href}
        className='nav-all inline-flex shrink-0 items-center gap-1.5 rounded-sm font-semibold text-[#6c3fb8] hover:text-[#200b38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
        {label}
        <span aria-hidden='true' className='nav-arrow'>→</span>
      </Link>
    </div>
  );
}

// Every service: the core ones with icons, the specialized ones as a quick list.
export function ServicesPreview() {
  return (
    <div className='w-[min(48rem,calc(100vw-3rem))]'>
      <div className='grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-2 p-3'>
        <div>
          <p className='px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-widest text-[#6c3fb8]'>
            Core services
          </p>
          <ul>
            {coreServices.map((service, index) => (
              <li
                key={service.slug}
                className='nav-stagger'
                style={{ '--n': index } as React.CSSProperties}>
                <Link
                  href={`/services/${service.slug}`}
                  className={itemClass}>
                  <span className='nav-icon grid size-10 shrink-0 place-items-center rounded-lg bg-[#efb52b]/15'>
                    <ServiceIcon
                      slug={service.slug}
                      draw='none'
                      className='size-5 text-[#200b38]'
                    />
                  </span>
                  <span>
                    <span className='block font-semibold leading-snug'>{service.title}</span>
                    <span className='mt-0.5 block text-sm leading-5 text-gray-600'>
                      {service.previewDescription}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='rounded-xl bg-[#f7f4fb] p-3'>
          <p className='px-2 pb-2 pt-2 text-xs font-semibold uppercase tracking-widest text-[#6c3fb8]'>
            Specialized
          </p>
          <ul className='space-y-0.5'>
            {specializedServices.map((service, index) => (
              <li
                key={service.slug}
                className='nav-stagger'
                style={{ '--n': index + 2 } as React.CSSProperties}>
                <Link
                  href={`/services/${service.slug}`}
                  className='nav-item flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#6c3fb8]'>
                  <ServiceIcon
                    slug={service.slug}
                    draw='none'
                    className='nav-icon size-4 shrink-0 text-[#6c3fb8]'
                  />
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <PanelFooter
        note='Hand-detailed inside, pure water outside.'
        href='/services'
        label='All services'
      />
    </div>
  );
}

// Every city we serve, with the part of the Valley it is in.
export function LocationsPreview() {
  return (
    <div className='w-[min(36rem,calc(100vw-3rem))]'>
      <ul className='grid grid-cols-2 gap-1 p-3'>
        {locationPages.map((city, index) => (
          <li
            key={city.slug}
            className='nav-stagger'
            style={{ '--n': index } as React.CSSProperties}>
            <Link
              href={city.href}
              className={itemClass}>
              <span className='nav-icon grid size-10 shrink-0 place-items-center rounded-lg bg-[#6c3fb8]/10'>
                <ServiceIcon
                  slug='pin'
                  paths={pin}
                  draw='none'
                  className='size-5 text-[#6c3fb8]'
                />
              </span>
              <span>
                <span className='block font-semibold leading-snug'>{city.name}</span>
                <span className='mt-0.5 block text-sm leading-5 text-gray-600'>
                  {cityRegions[city.name] ?? 'Phoenix metro'}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <PanelFooter
        note={`${serviceAreas.length} cities across the Phoenix metro`}
        href='/locations'
        label='All locations'
      />
    </div>
  );
}
