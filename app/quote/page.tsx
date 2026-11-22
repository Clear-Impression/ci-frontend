import { getPageHeader } from '@/lib/page-headers';
import { createPageMetadata } from '@/lib/seo';
import QuoteForm, { type QuoteStart } from '@/components/quote/QuoteForm';
import { company } from '@/data/company';
import { quoteOptions } from '@/data/quote';
import { jakarta } from '../fonts';

const title = 'Request a Quote | Clear Impression';
const description = 'Plan your window, solar panel, or screen cleaning in the Phoenix metro area. Tell Clear Impression about your home or business.';

export const maxDuration = 75;

export const metadata = createPageMetadata({
  path: '/quote',
  title,
  description,
});

type QuotePageProps = {
  // Filled in by the quick form on the homepage.
  searchParams: Promise<{ name?: string | string[]; email?: string | string[]; phone?: string | string[]; texts?: string | string[] }>;
};

// One trimmed value from the address bar, kept to a sensible length.
function param(value: string | string[] | undefined, limit: number) {
  const text = Array.isArray(value) ? value[0] : value;
  return (text ?? '').trim().slice(0, limit);
}

export default async function QuotePage({ searchParams }: QuotePageProps) {
  const header = await getPageHeader('quote');
  const params = await searchParams;
  // "Jane Smith" from the homepage goes into First name and Last name.
  const [firstName = '', ...rest] = param(params.name, 200).split(/\s+/);
  const start: QuoteStart = {
    firstName: firstName.slice(0, 100),
    lastName: rest.join(' ').slice(0, 100),
    email: param(params.email, 254),
    phone: param(params.phone, 32),
    texts: param(params.texts, 3) === 'yes',
  };
  return (
    <main className='flex-1 bg-[#faf8fd] text-[#200b38]'>
      {/* Use the Estimate page's purple header, with room for the form in the first view. */}
      <section aria-labelledby='quote-heading' className='bg-[#200b38] px-6 pb-11 pt-14 text-center text-white sm:px-8 sm:pb-11 sm:pt-7'>
        <div className='mx-auto max-w-2xl'>
          <h1 id='quote-heading' className='text-4xl font-semibold tracking-tight sm:text-5xl'>
            {header.title}
          </h1>
          {header.subtitle && <p className='mt-3 text-base leading-relaxed text-white/80 sm:text-lg'>{header.subtitle}</p>}
        </div>
      </section>
      <div className={`${jakarta.variable} relative mx-auto -mt-7 max-w-2xl px-4 pb-12 sm:-mt-9 sm:px-6 sm:pb-16`}>
        <QuoteForm options={quoteOptions} phoneHref={company.phoneHref} phone={company.phone} start={start} />
        <p className='mt-5 flex flex-wrap items-center justify-center gap-x-2 text-center text-sm text-[#625a6c]'>
          <span>Rather talk it through?</span>
          <a href={company.phoneHref} className='inline-flex min-h-11 items-center font-semibold text-[#200b38] underline underline-offset-4 hover:text-[#6c3fb8]'>Call {company.phone}</a>
          <span>or</span>
          <a href={company.phoneHref.replace(/^tel:/, 'sms:')} className='inline-flex min-h-11 items-center font-semibold text-[#200b38] underline underline-offset-4 hover:text-[#6c3fb8]'>send a text</a>
        </p>
      </div>
    </main>
  );
}
