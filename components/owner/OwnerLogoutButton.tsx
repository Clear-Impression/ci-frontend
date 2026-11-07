'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OwnerLogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function signOut() {
    setPending(true);
    setError('');
    try {
      const response = await fetch('/api/owner/logout', { method: 'POST', credentials: 'same-origin' });
      if (!response.ok) throw new Error('Unable to sign out. Please try again.');
      router.replace('/owner/login');
      router.refresh();
    } catch {
      setError('Unable to sign out. Please try again.');
      setPending(false);
    }
  }
  return (
    <div className='mt-6'>
      <button type='button' onClick={signOut} disabled={pending}
        className='min-h-11 rounded-lg border border-[#200b38]/20 px-5 py-3 font-semibold text-[#200b38] hover:bg-white disabled:opacity-60'>
        {pending ? 'Signing out…' : 'Sign out'}
      </button>
      {error && <p role='alert' className='mt-2 text-sm text-red-700'>{error}</p>}
    </div>
  );
}
