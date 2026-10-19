import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { aboutClosing } from '@/data/about';
import { company } from '@/data/company';
import { getServiceBySlug, services } from '@/data/services';

type ServicePageProps = {
  params: Promise<{ service: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ service: service.slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return {
    title: `${service.title} | ${company.name}`,
    description: service.largeDescription,
  };
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

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
          <p className='mt-10 text-5xl' aria-hidden='true'>{service.icon}</p>
          <p className='mt-6 text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            Clear Impression Services
          </p>
          <h1 className='mt-4 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            {service.title}
          </h1>
          <p className='mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg'>
            {service.largeDescription}
          </p>
        </div>
      </section>
      
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <div className='rounded-2xl bg-[#200b38] px-8 py-12 text-white sm:px-12'>
          <h2 className='text-2xl font-semibold sm:text-3xl'>
            {aboutClosing.heading}
          </h2>
          <p className='mt-4 max-w-2xl text-white/80'>{aboutClosing.text}</p>
          <a
            href={company.phoneHref}
            className='mt-8 inline-flex min-h-11 items-center rounded-lg bg-[#efb52b] px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#f6c95b] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
            Call {company.phone} for a quote
          </a>
        </div>
      </section>
    </main>
  );
}
