'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { submitFeedback } from '@/app/feedback/actions';
import styles from '@/app/feedback/feedback.module.css';
import {
  feedbackLimits,
  type FeedbackField,
  type FeedbackState,
} from '@/data/feedback';

type FeedbackFormProps = {
  phone: string;
  phoneHref: string;
};

const initialState: FeedbackState = { status: 'idle' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Same rules as the server, so people see problems before they press send.
function checkField(field: FeedbackField, value: string) {
  const text = value.trim();
  if (field === 'name') return text ? '' : 'Please enter your name.';
  if (field === 'email') {
    if (!text) return 'Please enter your email address.';
    return emailPattern.test(text) ? '' : 'Please enter a valid email address, like name@example.com.';
  }
  return text.length >= 10 ? '' : 'Please share a little more detail (at least 10 characters).';
}

const icons: Record<'name' | 'email', string> = {
  name: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c.8-3.5 4-5.5 8-5.5s7.2 2 8 5.5',
  email: 'M3 6.5h18v11H3zM3.5 7l8.5 6.5L20.5 7',
};

const fieldClass =
  'peer w-full rounded-xl border border-gray-300 bg-white text-base text-[#200b38] shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-[#6c3fb8] focus:ring-4 focus:ring-[#6c3fb8]/15 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/15';

type InputProps = {
  field: 'name' | 'email';
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  defaultValue?: string;
  error?: string;
  onBlur: (field: FeedbackField, value: string) => void;
};

// A labelled input with a leading icon and an error message underneath.
function IconInput({ field, label, type, autoComplete, placeholder, defaultValue, error, onBlur }: InputProps) {
  return (
    <div>
      <label htmlFor={field} className='block text-sm font-medium text-[#200b38]'>
        {label}
      </label>
      <div className='relative mt-2'>
        <input
          id={field}
          name={field}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          required
          maxLength={feedbackLimits[field]}
          defaultValue={defaultValue}
          onBlur={(event) => onBlur(field, event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${field}-error` : undefined}
          className={`${fieldClass} py-3.5 pl-12 pr-4`}
        />
        {/* After the input so it can turn purple when the input is focused. */}
        <svg
          aria-hidden='true'
          viewBox='0 0 24 24'
          className='pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-gray-400 transition peer-focus:text-[#6c3fb8]'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.6'
          strokeLinecap='round'
          strokeLinejoin='round'>
          <path d={icons[field]} />
        </svg>
      </div>
      {error && (
        <p id={`${field}-error`} className='mt-2 flex items-start gap-1.5 text-sm text-red-600'>
          <span aria-hidden='true'>!</span>
          {error}
        </p>
      )}
    </div>
  );
}

export default function FeedbackForm({ phone, phoneHref }: FeedbackFormProps) {
  const [state, formAction, pending] = useActionState(submitFeedback, initialState);
  const [clientErrors, setClientErrors] = useState<Partial<Record<FeedbackField, string>>>({});
  const [messageLength, setMessageLength] = useState(state.values?.message?.length ?? 0);
  const resultRef = useRef<HTMLDivElement>(null);
  const values = state.values ?? {};

  // Server errors win right after a submit, then live checks take over.
  const errors = { ...state.errors, ...clientErrors };

  // Move focus to the result so keyboard and screen reader users hear it.
  useEffect(() => {
    if (state.status === 'success' || state.status === 'unavailable' || state.status === 'error') {
      resultRef.current?.focus();
    }
  }, [state]);

  // Check a field when someone leaves it, and clear the error once it is fixed.
  function validate(field: FeedbackField, value: string) {
    setClientErrors((current) => ({ ...current, [field]: checkField(field, value) || undefined }));
  }

  // Stop the send and point to the first problem if anything is still wrong.
  function checkBeforeSend(event: FormEvent<HTMLFormElement>) {
    const data = new FormData(event.currentTarget);
    const found: Partial<Record<FeedbackField, string>> = {};
    (['name', 'email', 'message'] as const).forEach((field) => {
      const problem = checkField(field, String(data.get(field) ?? ''));
      if (problem) found[field] = problem;
    });
    setClientErrors(found);
    if (Object.keys(found).length > 0) {
      event.preventDefault();
      event.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(found)[0]}"]`)?.focus();
    }
  }

  if (state.status === 'success') {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role='status'
        className={`${styles.success} flex flex-col items-center justify-center rounded-3xl bg-white px-8 py-14 text-center shadow-xl shadow-[#200b38]/5 ring-1 ring-gray-200 outline-none sm:px-12 sm:py-20`}>
        <span className='grid size-16 place-items-center rounded-full bg-[#efb52b]/15'>
          <svg aria-hidden='true' viewBox='0 0 24 24' className='size-8 text-[#200b38]' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path className={styles.check} d='M5 12.5l4.5 4.5L19 7.5' pathLength={1} />
          </svg>
        </span>
        <h2 className='mt-6 text-2xl font-semibold tracking-tight text-[#200b38] sm:text-3xl'>
          Thank you for your feedback
        </h2>
        <p className='mt-3 max-w-sm leading-relaxed text-gray-600'>
          We appreciate you taking the time to help us improve.
        </p>
      </div>
    );
  }

  const nearLimit = messageLength > feedbackLimits.message * 0.9;

  return (
    <section
      aria-labelledby='feedback-form-heading'
      className='overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#200b38]/5 ring-1 ring-gray-200'>
      {/* A thin brand stripe across the top of the card. */}
      <div aria-hidden='true' className={`${styles.stripe} h-1.5 bg-linear-to-r from-[#200b38] via-[#6c3fb8] to-[#efb52b]`} />
      <div className='p-6 sm:p-10'>
        <h2 id='feedback-form-heading' className='text-2xl font-semibold tracking-tight text-[#200b38]'>
          Share your feedback
        </h2>
        <p className='mt-2 text-sm text-gray-600'>Takes about a minute. All fields are required.</p>

        <form
          key={JSON.stringify(values)}
          action={formAction}
          data-settled={state.status === 'idle' ? undefined : ''}
          onSubmit={checkBeforeSend}
          noValidate
          className='mt-8 space-y-6'>
          <div
            className={`${styles.field} grid gap-6 sm:grid-cols-2`}
            style={{ '--delay': '520ms' } as React.CSSProperties}>
            <IconInput field='name' label='Full name' type='text' autoComplete='name' placeholder='Jane Smith' defaultValue={values.name} error={errors.name} onBlur={validate} />
            <IconInput field='email' label='Email address' type='email' autoComplete='email' placeholder='jane@example.com' defaultValue={values.email} error={errors.email} onBlur={validate} />
          </div>

          <div
            className={styles.field}
            style={{ '--delay': '620ms' } as React.CSSProperties}>
            <div className='flex items-baseline justify-between'>
              <label htmlFor='message' className='block text-sm font-medium text-[#200b38]'>
                Your feedback
              </label>
              <span
                id='message-count'
                aria-live='polite'
                className={`text-xs tabular-nums ${nearLimit ? 'font-semibold text-[#b07a00]' : 'text-gray-500'}`}>
                {messageLength.toLocaleString()} / {feedbackLimits.message.toLocaleString()}
              </span>
            </div>
            <textarea
              id='message'
              name='message'
              rows={6}
              required
              maxLength={feedbackLimits.message}
              defaultValue={values.message}
              onChange={(event) => {
                setMessageLength(event.target.value.length);
                if (errors.message) validate('message', event.target.value);
              }}
              onBlur={(event) => validate('message', event.target.value)}
              placeholder='Tell us what went well and what we could do better.'
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? 'message-error message-count' : 'message-count'}
              className={`${fieldClass} mt-2 resize-y px-4 py-3.5 leading-relaxed`}
            />
            {errors.message && (
              <p id='message-error' className='mt-2 flex items-start gap-1.5 text-sm text-red-600'>
                <span aria-hidden='true'>!</span>
                {errors.message}
              </p>
            )}
          </div>

          {/* Hidden from people. Bots that fill it in are ignored. */}
          <div aria-hidden='true' className='absolute -left-[9999px] h-px w-px overflow-hidden'>
            <label>
              Leave this empty
              <input name='website' type='text' tabIndex={-1} autoComplete='off' />
            </label>
          </div>

          {(state.status === 'unavailable' || state.status === 'error') && (
            <div
              ref={resultRef}
              tabIndex={-1}
              role='alert'
              className='flex gap-3 rounded-xl border border-[#efb52b]/50 bg-[#fffaf0] p-4 text-sm leading-6 text-[#59441c] outline-none'>
              <span aria-hidden='true' className='mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#efb52b] text-xs font-bold text-[#200b38]'>
                !
              </span>
              <p>
                {state.status === 'unavailable'
                  ? 'Feedback can’t be sent online just yet. Your message is still here, so you can try again later, or '
                  : 'Something went wrong while sending your feedback. Please try again, or '}
                <a href={phoneHref} className='font-semibold underline underline-offset-4'>
                  call {phone}
                </a>
                .
              </p>
            </div>
          )}

          <div
            className={`${styles.field} flex flex-col-reverse gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between`}
            style={{ '--delay': '720ms' } as React.CSSProperties}>
            <p className='text-xs leading-5 text-gray-500'>
              We only use your email to follow up on your feedback.
            </p>
            <button
              type='submit'
              disabled={pending}
              className='inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#200b38] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#33195a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] active:scale-[0.98] disabled:cursor-wait disabled:opacity-80'>
              {pending && (
                <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4 animate-spin' fill='none'>
                  <circle cx='12' cy='12' r='9' stroke='currentColor' strokeOpacity='0.3' strokeWidth='3' />
                  <path d='M21 12a9 9 0 0 0-9-9' stroke='currentColor' strokeWidth='3' strokeLinecap='round' />
                </svg>
              )}
              {pending ? 'Sending…' : 'Send feedback'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
