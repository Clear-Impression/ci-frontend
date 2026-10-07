import Image from 'next/image';
import type { HomeService } from '@/data/home';

type HomeServicesProps = {
  services: readonly HomeService[];
};

export default function HomeServices({ services }: HomeServicesProps) {
  return (
    <section
      id='home-services'
      aria-labelledby='services-heading'
      className='scroll-mt-6 bg-white'>
      <div className='mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16'>
        <div className='mb-10 text-center'>
          <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
            We help you shine!
          </p>
          <h2
            id='services-heading'
            className='mt-3 text-3xl font-semibold tracking-tight text-[#200b38] sm:text-4xl'>
            Our services
          </h2>
        </div>
        {/* Keep both service explanations together, stacking them on phones. */}
        <div className='grid gap-6 lg:grid-cols-2'>
          {services.map((service) => {
            const List = service.ordered ? 'ol' : 'ul';
            return (
              <article
                key={service.id}
                aria-labelledby={`${service.id}-heading`}
                className='flex flex-col overflow-hidden rounded-2xl border border-[#200b38]/10 bg-[#faf8fd]'>
                <div className='flex flex-1 flex-col p-6 sm:p-8'>
                  <p className='text-sm font-semibold leading-6 text-[#6c3fb8]'>
                    {service.name}
                  </p>
                  <h3
                    id={`${service.id}-heading`}
                    className='mt-3 text-2xl font-semibold leading-tight tracking-tight text-[#200b38] sm:text-3xl'>
                    {service.title}
                  </h3>
                  {/* Use numbers for the filtration steps and bullets for hand cleaning. */}
                  <List
                    className={`mt-6 space-y-3 pl-5 text-sm leading-7 text-[#686170] ${service.ordered ? 'list-decimal' : 'list-disc'}`}>
                    {service.steps.map((step) => (
                      <li key={step.label}>
                        <strong className='font-semibold text-[#200b38]'>
                          {step.label}:{' '}
                        </strong>
                        {step.description}
                      </li>
                    ))}
                  </List>
                  <p className='mt-6 border-t border-[#200b38]/10 pt-5 text-sm font-medium leading-7 text-[#542d90]'>
                    {service.result}
                  </p>
                </div>
                {/* Reserve image space and let Next.js serve the right size. */}
                <div className='relative aspect-16/10'>
                  <Image
                    src={service.image}
                    alt={service.imageAlt}
                    fill
                    sizes='(min-width: 1280px) 592px, (min-width: 1024px) 46vw, 100vw'
                    className='object-cover'
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
