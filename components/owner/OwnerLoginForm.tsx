'use client';

import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';

type FieldErrors = { email?: string; password?: string };

const inputClass = 'mt-2 w-full rounded-lg border border-[#200b38]/20 bg-white px-4 py-3 text-base text-[#200b38] outline-none transition focus:border-[#6c3fb8] focus:ring-2 focus:ring-[#6c3fb8]/20 aria-invalid:border-red-600 aria-invalid:focus:ring-red-600/20 disabled:bg-gray-50';

export default function OwnerLoginForm() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const submitting = useRef(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function clearError(field: keyof FieldErrors) {
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage('');
  }

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;

    const email = emailRef.current?.value.trim() ?? '';
    const password = passwordRef.current?.value ?? '';
    const nextErrors: FieldErrors = {};

    if (!email) {
      nextErrors.email = 'Enter your email address.';
    } else if (!emailRef.current?.validity.valid) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!password) nextErrors.password = 'Enter your password.';

    setErrors(nextErrors);
    setMessage('');
    if (nextErrors.email || nextErrors.password) {
      (nextErrors.email ? emailRef : passwordRef).current?.focus();
      return;
    }

    submitting.current = true;
    setIsLoading(true);

    try {
      // Keep the session cookie on this website; the server talks to FastAPI.
      const response = await fetch('/api/owner/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store',
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (!response.ok) {
        setMessage(typeof result.message === 'string' ? result.message : 'Unable to sign in. Please try again.');
        if (response.status === 401 && passwordRef.current) {
          passwordRef.current.value = '';
          passwordRef.current.focus();
        }
        return;
      }

      if (passwordRef.current) passwordRef.current.value = '';
      setIsSignedIn(true);
      router.replace('/owner');
      router.refresh();
    } catch {
      setMessage('Unable to connect. Please try again.');
    } finally {
      submitting.current = false;
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={signIn} noValidate aria-busy={isLoading} className='mt-8 space-y-5'>
      <div>
        <label htmlFor='owner-email' className='block text-sm font-medium text-[#200b38]'>Email address</label>
        <input
          ref={emailRef}
          id='owner-email'
          name='email'
          type='email'
          autoComplete='username'
          autoCapitalize='none'
          spellCheck={false}
          required
          maxLength={254}
          readOnly={isLoading || isSignedIn}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? 'owner-email-error' : undefined}
          onChange={() => clearError('email')}
          className={inputClass}
        />
        {errors.email && <p id='owner-email-error' className='mt-2 text-sm text-red-700'>{errors.email}</p>}
      </div>

      <div>
        <div className='flex items-center justify-between gap-3'>
          <label htmlFor='owner-password' className='block text-sm font-medium text-[#200b38]'>Password</label>
          <button
            type='button'
            onClick={() => setShowPassword((current) => !current)}
            aria-controls='owner-password'
            aria-pressed={showPassword}
            disabled={isLoading || isSignedIn}
            className='inline-flex min-h-11 items-center rounded-sm px-1 text-sm font-medium text-[#542d90] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] disabled:opacity-60'>
            {showPassword ? 'Hide password' : 'Show password'}
          </button>
        </div>
        <input
          ref={passwordRef}
          id='owner-password'
          name='password'
          type={showPassword ? 'text' : 'password'}
          autoComplete='current-password'
          required
          maxLength={128}
          readOnly={isLoading || isSignedIn}
          aria-invalid={Boolean(errors.password)}
          aria-describedby={errors.password ? 'owner-password-error' : undefined}
          onChange={() => clearError('password')}
          className={inputClass}
        />
        {errors.password && <p id='owner-password-error' className='mt-2 text-sm text-red-700'>{errors.password}</p>}
      </div>

      {message && <p role='alert' className='rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800'>{message}</p>}

      <button
        type='submit'
        disabled={isLoading || isSignedIn}
        className='inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#200b38] px-5 py-3 text-base font-semibold text-white transition hover:bg-[#432462] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] disabled:cursor-wait disabled:opacity-70'>
        {isLoading && <span aria-hidden='true' className='size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none' />}
        {isSignedIn ? 'Opening dashboard…' : isLoading ? 'Signing in…' : 'Sign in'}
      </button>
      <p role='status' aria-live='polite' className='sr-only'>
        {isSignedIn ? 'Signed in. Opening dashboard.' : isLoading ? 'Signing in. Please wait.' : ''}
      </p>
    </form>
  );
}
