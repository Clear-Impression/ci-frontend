'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Service } from '@/data/services';
import Reveal from '@/components/services/Reveal';
import ServiceIcon from '@/components/services/ServiceIcon';

type ServiceIndexProps = {
  services: Service[];
};

// List every specialized service, with a detail pane that follows hover and focus.
export default function ServiceIndex({ services }: ServiceIndexProps) {
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug);
  const active =
    services.find((service) => service.slug === activeSlug) ?? services[0];

  return (
    <div className='grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-10'>
      <ul className='rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-200'>
        {services.map((service, index) => (
          <Reveal
            as='li'
            key={service.slug}
            delay={(index % 5) * 70}
            className='svc-row-wrap'>
            <Link
              href={`/services/${service.slug}`}
              onMouseEnter={() => setActiveSlug(service.slug)}
              onFocus={() => setActiveSlug(service.slug)}
              aria-current={service.slug === active.slug ? 'true' : undefined}
              className='svc-row relative flex items-center gap-4 overflow-hidden rounded-xl px-4 py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] sm:gap-5 sm:py-5'>
              <span className='svc-row-tile relative grid size-12 shrink-0 place-items-center rounded-lg bg-[#efb52b]/15'>
                <ServiceIcon
                  slug={service.slug}
                  className='svc-row-icon size-7 text-[#200b38]'
                />
              </span>
              <span className='relative min-w-0 flex-1'>
                <span className='svc-row-title block text-lg font-semibold leading-snug text-[#200b38]'>
                  {service.title}
                </span>
                <span className='svc-row-text mt-1 block text-sm leading-6 text-gray-600'>
                  {service.previewDescription}
                </span>
              </span>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='svc-row-arrow relative size-5 shrink-0 text-[#6c3fb8]'>
                <path
                  d='M5 12h14M13 6l6 6-6 6'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='1.75'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </Link>
          </Reveal>
        ))}
      </ul>

      {/* Desktop only: phones go straight to each service page from the list. */}
      <aside aria-label='Selected service' className='hidden lg:block'>
        <div className='sticky top-8 overflow-hidden rounded-2xl bg-[#200b38] text-white shadow-lg shadow-[#200b38]/20'>
          {/* Re-keying replays the squeegee wipe each time the service changes. */}
          <div key={active.slug} className='relative'>
            <div className='pane-wipe p-8 sm:p-10'>
              <span className='grid size-16 place-items-center rounded-lg bg-white/10'>
                <ServiceIcon
                  slug={active.slug}
                  draw='auto'
                  className='size-9 text-[#d9b65f]'
                />
              </span>
              <h3 className='mt-8 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl'>
                {active.title}
              </h3>
              <p className='mt-4 leading-relaxed text-white/80'>
                {active.largeDescription}
              </p>
              <Link
                href={`/services/${active.slug}`}
                className='mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
                View service details
              </Link>
            </div>
            <span aria-hidden='true' className='pane-blade' />
          </div>
        </div>
      </aside>
    </div>
  );
}
