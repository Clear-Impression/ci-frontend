import type { Metadata } from 'next';
import Link from 'next/link';
import OwnerLoginForm from '@/components/owner/OwnerLoginForm';

export const metadata: Metadata = {
  title: 'Owner Sign In | Clear Impression Services',
  robots: { index: false, follow: false },
};

export default function OwnerLoginPage() {
  return (
    <main className='flex flex-1 items-center bg-[#faf8fd] px-6 py-12 sm:px-8 sm:py-20'>
      <section
        aria-labelledby='owner-login-heading'
        className='mx-auto w-full max-w-md rounded-2xl border border-[#200b38]/10 bg-white p-6 shadow-sm sm:p-10'>
        <div className='mb-7 flex size-11 items-center justify-center rounded-xl bg-[#f5f0fb] text-[#6c3fb8]'>
          <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.6' className='size-6'>
            <rect x='5' y='10' width='14' height='11' rx='2' />
            <path d='M8 10V7a4 4 0 0 1 8 0v3' />
            <path d='M12 14v3' />
          </svg>
        </div>
        <p className='text-xs font-semibold uppercase tracking-widest text-[#6c3fb8]'>
          Owner access
        </p>
        <h1 id='owner-login-heading' className='mt-3 text-3xl font-semibold tracking-tight text-[#200b38]'>
          Welcome back<span className='text-[#6c3fb8]'>.</span>
        </h1>
        <p className='mt-3 text-sm leading-6 text-[#686170]'>
          Sign in to manage your Clear Impression dashboard.
        </p>

        <OwnerLoginForm />

        <div className='mt-7 border-t border-[#200b38]/10 pt-5'>
          <Link href='/' className='inline-flex min-h-11 items-center gap-2 rounded-sm text-sm font-medium text-[#542d90] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
            <span aria-hidden='true'>←</span> Back to the website
          </Link>
        </div>
      </section>
    </main>
  );
}
