import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ServiceIcon from '@/components/services/ServiceIcon';
import { company } from '@/data/company';
import { getServices } from '@/lib/services';
import { createPageMetadata } from '@/lib/seo';
import ClearerViewCta from '@/components/ui/ClearerViewCta';

const serviceSearchTitles = new Map([
  ['residential-window-washing', 'Residential Window Cleaning in Phoenix Metro'],
  ['commercial-office-glass', 'Commercial Window Cleaning in Phoenix Metro'],
  ['window-washing-traditional-tools', 'Traditional Window Cleaning'],
  ['window-washing-100-percent-pure-water', 'Pure Water Window Cleaning'],
]);

type ServicePageProps = {
  params: Promise<{ service: string }>;
};

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  if (!service) notFound();

  const searchTitle = serviceSearchTitles.get(service.slug) ?? service.title;
  return createPageMetadata({
    path: '/services/' + service.slug,
    title: `${searchTitle} | ${company.name}`,
    description: service.largeDescription,
  });
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  if (!service) notFound();

  const imageOnLeft = service.layout === 'image-left';
  const detailHeading = service.detailHeading?.trim() || 'Service details';
  const glanceHeading = service.glanceHeading?.trim() || 'At a glance';
  const bestForHeading = service.bestForLabel?.trim() || 'Best for';
  const benefitsHeading = service.benefitsLabel?.trim() || 'Benefits';

  return (
    <main className='flex-1 border-0 bg-white text-[#200b38]'>
      <section className='page-hero overflow-hidden bg-[#200b38] text-white'>
        <div className='mx-auto max-w-7xl px-6 pb-12 pt-6 sm:px-8 sm:pb-16 sm:pt-8'>
          <Link
            href='/services'
            className='group inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-semibold text-white hover:text-[#efb52b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
            <svg
              aria-hidden='true'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              className='size-4 shrink-0'>
              <path d='M19 12H5m6 6-6-6 6-6' />
            </svg>
            <span className='underline-offset-4 group-hover:underline group-focus-visible:underline'>
              Back to services
            </span>
          </Link>

          <div className='mt-1 grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.72fr)] lg:gap-14'>
            <div className={imageOnLeft ? 'lg:order-2' : ''}>
              <div className='grid size-14 place-items-center rounded-xl border border-white/15 bg-white/5'>
                <ServiceIcon
                  slug={service.slug}
                  draw='auto'
                  className='size-8 text-[#d9b65f]'
                />
              </div>
              <h1 className='mt-6 max-w-3xl text-2xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl'>
                {service.title}
              </h1>
              <p className='mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg'>
                {service.largeDescription}
              </p>
            </div>

            <figure className={imageOnLeft ? 'lg:order-1' : ''}>
              <div className='relative aspect-4/3 overflow-hidden rounded-3xl bg-[#33195a] ring-1 ring-white/10'>
                {service.image?.url ? (
                  <Image
                    src={service.image.url}
                    alt={service.image.alt}
                    fill
                    sizes='(min-width: 1024px) 38vw, 100vw'
                    className='object-cover'
                  />
                ) : (
                  <div className='grid size-full place-items-center'>
                    <ServiceIcon
                      slug={service.slug}
                      draw='none'
                      className='size-20 text-[#d9b65f]'
                    />
                  </div>
                )}
              </div>
              {service.image?.caption && (
                <figcaption className='mt-3 text-sm text-white/60'>
                  {service.image.caption}
                </figcaption>
              )}
            </figure>
          </div>
        </div>
      </section>

      <section
        aria-labelledby='service-details-heading'
        className='flex-1 border-0 bg-[#f7f4fb]'>
        <div className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
          <div className='grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(20rem,1fr)] lg:items-start lg:gap-12'>
            <article className='max-w-3xl'>
              <h2
                id='service-details-heading'
                className='text-3xl font-semibold tracking-tight text-[#200b38] sm:text-4xl'>
                {detailHeading}
              </h2>
              <div className='mt-8 divide-y divide-[#200b38]/10 border-y border-[#200b38]/10'>
                {service.detailParagraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className='py-7 leading-8 text-[#686170] first:pt-0 last:pb-0'>
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>

            {Boolean(service.bestFor || service.benefits?.length) && (
              <aside className='rounded-3xl bg-[#200b38] p-7 text-white shadow-lg shadow-[#200b38]/10 sm:p-8 lg:sticky lg:top-32'>
                <h2 className='text-xl font-semibold'>{glanceHeading}</h2>
                {service.bestFor && (
                  <div className='mt-7 border-t border-white/15 pt-6'>
                    <h3 className='text-sm font-semibold text-[#efb52b]'>
                      {bestForHeading}
                    </h3>
                    <p className='mt-3 leading-7 text-white/80'>
                      {service.bestFor}
                    </p>
                  </div>
                )}
                {service.benefits?.length ? (
                  <div className='mt-7 border-t border-white/15 pt-6'>
                    <h3 className='text-sm font-semibold text-[#efb52b]'>
                      {benefitsHeading}
                    </h3>
                    <ul className='mt-4 space-y-3 leading-6 text-white/85'>
                      {service.benefits.map((benefit) => (
                        <li key={benefit} className='flex gap-3'>
                          <span
                            aria-hidden='true'
                            className='mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-[#72c587] text-[#200b38]'>
                            <svg
                              viewBox='0 0 24 24'
                              className='size-3'
                              fill='none'
                              stroke='currentColor'
                              strokeWidth='3.5'
                              strokeLinecap='round'
                              strokeLinejoin='round'>
                              <path d='m5 12.5 4.5 4.5L19 7.5' />
                            </svg>
                          </span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </aside>
            )}
          </div>
        </div>
      </section>
      {/* Footer found in other pages */}
      <section
        id='get-started'
        className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <ClearerViewCta />
      </section>

    </main>
  );
}
