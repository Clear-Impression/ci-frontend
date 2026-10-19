//"use client";

import FlipCard from "./flip";
import type {Metadata} from 'next';
import {company} from '@/data/company';
import {aboutClosing} from '@/data/about';
import {coreServices, specializedServices, type Service} from '@/data/services';

//For SEO and seach engines
export const metadata: Metadata = {
  title: 'Services | Clear Impression Services',
  description:
    'Explore our services at Clear Impresions',
};

function ServiceSection({
  title,
  description,
  services,
}: {
  title: string;
  description: string;
  services: Service[];
}) {
  return (
    <section className="px-8 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-semibold text-[#200b38] sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-gray-600">{description}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <FlipCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Services() {
  return (
    <main className="flex-1">
      <section className="bg-[#200b38] px-8 pb-20 pt-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className='text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
            What we do
          </p>
          <h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
            Services
          </h1>
          <p className='mt-6 max-w-2xl text-lg text-white/80'>
            Professional exterior cleaning solutions serving the Phoenix metro.
          </p>
        </div>
      </section>
      <ServiceSection
        title="Core Services"
        description="Choose a card to learn more about our two primary window-washing methods."
        services={coreServices}
      />
      <ServiceSection
        title="Specialized Services"
        description="Tap or click any card to explore additional cleaning and maintenance solutions."
        services={specializedServices}
      />



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
