import type { Metadata } from 'next';
import Link from 'next/link';
import { verifyOwnerSession } from '@/lib/ownerSession';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Master Quote Page | Clear Impression',
  robots: { index: false, follow: false },
};

export default async function MasterQuotePage() {
  if (!(await verifyOwnerSession())) {
    return (
      <main className='flex-1 bg-[#faf8fd] px-6 py-16 sm:px-8'>
        <div className='mx-auto max-w-lg rounded-2xl border border-[#200b38]/10 bg-white p-6 sm:p-8'>
          <h1 className='text-2xl font-semibold text-[#200b38]'>Unable to verify your sign-in</h1>
          <p className='mt-4 leading-7 text-[#686170]'>Please try again to open your quote workspace.</p>
          <form action='/owner/master-quote-page' method='get' className='mt-6'>
            <button type='submit' className='min-h-12 rounded-lg bg-[#200b38] px-5 py-3 font-semibold text-white hover:bg-[#432462] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
              Try again
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className='flex-1 bg-[#faf8fd] px-6 py-16 sm:px-8'>
      <div className='mx-auto max-w-7xl'>
        <Link href='/owner' className='inline-flex min-h-12 items-center font-semibold text-[#6c3fb8] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
          ← Back to owner dashboard
        </Link>
        <h1 className='mt-6 text-3xl font-semibold text-[#200b38]'>Master quote page</h1>
        <p className='mt-4 leading-7 text-[#686170]'>Your private quote workspace.</p>
      </div>
    </main>
  );
}
