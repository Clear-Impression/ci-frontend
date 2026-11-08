import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import QuoteActions from '@/components/ui/QuoteActions';
import { aboutClosing } from '@/data/about';
import { company } from '@/data/company';
import { getServices } from '@/lib/services';
import ServiceIcon from '@/components/services/ServiceIcon';

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

  return {
    title: `${service.title} | ${company.name}`,
    description: service.largeDescription,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug } = await params;
  const service = (await getServices()).find((item) => item.slug === slug);
  if (!service) notFound();

  const [firstParagraph, ...moreParagraphs] = service.detailParagraphs;

  return (
    <main className='flex-1 border-0 bg-white text-[#200b38]'>
      <section className='bg-[#200b38] text-white'>
        <div className='mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20'>
          <Link
            href='/services'
            className='inline-flex items-center gap-2 text-sm font-semibold text-white/80 hover:text-[#efb52b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#efb52b]'>
            <span aria-hidden='true'>←</span>
            <span>Back to services</span>
          </Link>
          <ServiceIcon
            slug={service.slug}
            draw='auto'
            className='mt-10 size-14 text-[#d9b65f]'
          />
          <p className='mt-6 text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            what we do
          </p>
          <h1 className='mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            {service.title}
          </h1>
          <p className='mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg'>
            {service.largeDescription}
          </p>
        </div>
      </section>
      
      <section
        aria-labelledby='service-details-heading'
        className='flex-1 border-0 bg-[#f7f4fb]'>
        <div className='mx-auto max-w-7xl px-6 pb-14 pt-6 sm:px-8 sm:pb-20 sm:pt-8'>
          <div className='grid gap-16 lg:grid-cols-2 lg:items-start'>
            <div className='space-y-6 text-lg leading-8 text-gray-700'>
              <p>{firstParagraph}</p>
              {moreParagraphs.length > 0 && (
                <details className='group mt-6'>
                  <summary className='inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm font-semibold text-[#6c3fb8] hover:text-[#200b38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] [&::-webkit-details-marker]:hidden'>
                    <span className='group-open:hidden'>Read more about {service.title.toLowerCase()}</span>
                    <span className='hidden group-open:inline'>Show less</span>
                    <svg
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      className='size-5 motion-safe:transition-transform group-open:rotate-180'>
                      <path d='M6 9l6 6 6-6' />
                    </svg>
                  </summary>
                  <div className='mt-4 space-y-6'>
                    {moreParagraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </details>
              )}
            </div>
            <div className='flex aspect-[4/3] items-center justify-center rounded-2xl bg-[#eee6f9] text-[#6c3fb8]'>
              Service image coming soon
            </div>
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <div className='rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {aboutClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{aboutClosing.text}</p>
          <QuoteActions />
        </div>
      </section>
    </main>
  );
}
