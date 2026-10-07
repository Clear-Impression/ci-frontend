import { company } from '@/data/company';

export default function HomeContact() {
  return (
    <section
      aria-labelledby='home-contact-heading'
      className='bg-[#f5f0fb]'>
      <div className='mx-auto flex max-w-7xl flex-col gap-8 px-6 py-10 sm:px-8 lg:flex-row lg:items-center lg:justify-between'>
        <div>
          <h2
            id='home-contact-heading'
            className='text-2xl font-semibold tracking-tight text-[#200b38] sm:text-3xl'>
            Ready for a clearer view?
          </h2>
          <p className='mt-3 text-sm leading-7 text-[#686170]'>
            Call or text {company.phone}, or request a free quote on our live
            website.
          </p>
        </div>
        {/* Use working contact options while the new site's forms are being built. */}
        <div className='flex flex-wrap gap-3'>
          <a
            href={`${company.website}get-a-quote`}
            className='inline-flex min-h-12 items-center justify-center rounded-lg bg-[#200b38] px-5 py-3 text-sm font-semibold text-white hover:bg-[#432462] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
            Get a free quote
          </a>
          <a
            href='sms:+14806220622'
            className='inline-flex min-h-12 items-center justify-center rounded-lg border border-[#200b38]/20 px-5 py-3 text-sm font-semibold text-[#200b38] hover:bg-[#eee6f7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
            Send a text
          </a>
        </div>
      </div>
    </section>
  );
}
