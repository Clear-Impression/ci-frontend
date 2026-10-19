'use client';

import { useState } from 'react';
import type { FormEvent, HTMLInputTypeAttribute } from 'react';
import type { QuoteOptions } from '@/data/quote';

type QuoteFormProps = {
  options: QuoteOptions;
  phoneHref: string;
  phone: string;
};

type FieldProps = {
  name: string;
  label: string;
  autoComplete: string;
  type?: HTMLInputTypeAttribute;
  fullWidth?: boolean;
};

const inputClass =
  'mt-2 w-full rounded-lg border border-[#200b38]/20 bg-white px-4 py-3 text-base text-[#200b38] outline-none transition focus:border-[#6c3fb8] focus:ring-2 focus:ring-[#6c3fb8]/20';
const choiceClass =
  'flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#200b38]/15 px-4 py-3 text-sm text-[#200b38] transition hover:border-[#6c3fb8] has-checked:border-[#6c3fb8] has-checked:bg-[#f5f0fb] has-focus-visible:ring-2 has-focus-visible:ring-[#6c3fb8]';

// Use the same labels, spacing, and browser autofill support for contact fields.
function QuoteField({
  name,
  label,
  autoComplete,
  type = 'text',
  fullWidth,
}: FieldProps) {
  return (
    <label
      className={`block text-sm font-medium text-[#200b38] ${fullWidth ? 'sm:col-span-2' : ''}`}>
      {label}{' '}
      <span
        aria-hidden='true'
        className='text-[#6c3fb8]'>
        *
      </span>
      <input
        name={name}
        type={type}
        autoComplete={autoComplete}
        required
        maxLength={name === 'address' ? 200 : 100}
        className={inputClass}
      />
    </label>
  );
}

export default function QuoteForm({
  options,
  phoneHref,
  phone,
}: QuoteFormProps) {
  const [checked, setChecked] = useState(false);
  const [serviceError, setServiceError] = useState(false);

  function reviewRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);

    // A group of checkboxes needs its own check for at least one selection.
    if (values.getAll('services').length === 0) {
      setServiceError(true);
      form.querySelector<HTMLInputElement>('input[name="services"]')?.focus();
      return;
    }

    setServiceError(false);
    // This is a local preview. Keep the fields filled and never send their values.
    setChecked(true);
  }

  return (
    <section
      aria-labelledby='quote-form-heading'
      className='rounded-2xl border border-[#200b38]/10 bg-white p-6 shadow-sm sm:p-8 lg:p-10'>
      <div className='mb-8 border-b border-[#200b38]/10 pb-6'>
        <h2
          id='quote-form-heading'
          className='text-2xl font-semibold tracking-tight text-[#200b38]'>
          Tell us what needs a little shine.
        </h2>
        <p className='mt-2 text-sm leading-6 text-[#686170]'>
          A few details to get started. Fields marked * are required.
        </p>
      </div>

      {/* Native validation handles missing fields and invalid email addresses. */}
      <form
        onSubmit={reviewRequest}
        onChange={() => setChecked(false)}
        aria-describedby='quote-preview-note'>
        <fieldset>
          <legend className='text-sm font-semibold text-[#200b38]'>
            01 <span className='ml-2'>Your details</span>
          </legend>
          <div className='mt-5 grid gap-5 sm:grid-cols-2'>
            <QuoteField
              name='firstName'
              label='First name'
              autoComplete='given-name'
            />
            <QuoteField
              name='lastName'
              label='Last name'
              autoComplete='family-name'
            />
            <QuoteField
              name='email'
              label='Email'
              type='email'
              autoComplete='email'
            />
            <QuoteField
              name='phone'
              label='Phone'
              type='tel'
              autoComplete='tel'
            />
            <QuoteField
              name='address'
              label='Street address'
              autoComplete='street-address'
              fullWidth
            />
            <QuoteField
              name='city'
              label='City'
              autoComplete='address-level2'
              fullWidth
            />
          </div>
        </fieldset>

        <fieldset className='mt-8'>
          <legend className='text-sm font-semibold text-[#200b38]'>
            02 <span className='ml-2'>Your property</span>{' '}
            <span
              aria-hidden='true'
              className='text-[#6c3fb8]'>
              *
            </span>
          </legend>
          <div className='mt-4 grid gap-3 sm:grid-cols-2'>
            {options.propertyTypes.map((type) => (
              <label
                key={type}
                className={choiceClass}>
                <input
                  type='radio'
                  name='propertyType'
                  value={type}
                  required
                  className='h-4 w-4 shrink-0 accent-[#6c3fb8]'
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset
          className='mt-8'
          aria-describedby={
            serviceError ? 'service-help service-error' : 'service-help'
          }>
          <legend className='text-sm font-semibold text-[#200b38]'>
            03 <span className='ml-2'>What can we help with?</span>{' '}
            <span
              aria-hidden='true'
              className='text-[#6c3fb8]'>
              *
            </span>
          </legend>
          <p
            id='service-help'
            className='mt-2 text-sm text-[#686170]'>
            Choose one or more services.
          </p>
          <div className='mt-4 grid gap-3'>
            {options.services.map((service) => (
              <label
                key={service}
                className={choiceClass}>
                <input
                  type='checkbox'
                  name='services'
                  value={service}
                  aria-invalid={serviceError || undefined}
                  aria-describedby={serviceError ? 'service-error' : undefined}
                  onChange={() => setServiceError(false)}
                  className='h-4 w-4 shrink-0 accent-[#6c3fb8]'
                />
                {service}
              </label>
            ))}
          </div>
          {serviceError && (
            <p
              id='service-error'
              role='alert'
              className='mt-3 text-sm text-red-700'>
              Please choose at least one service.
            </p>
          )}
        </fieldset>

        <label className='mt-8 block text-sm font-medium text-[#200b38]'>
          Anything else?{' '}
          <span className='font-normal text-[#686170]'>(optional)</span>
          <textarea
            name='details'
            rows={3}
            maxLength={2000}
            placeholder='Number of windows, stories, or anything you would like us to know.'
            className={`${inputClass} resize-y`}
          />
        </label>

        {/* Keep this notice next to the button so nobody expects a sent request. */}
        <div
          id='quote-preview-note'
          className='mt-6 rounded-lg border border-[#efb52b]/40 bg-[#fffaf0] px-4 py-3 text-sm leading-6 text-[#59441c]'>
          <strong className='font-semibold'>Form preview.</strong> Requests are
          not sent yet. To get a quote now,{' '}
          <a
            href={phoneHref}
            className='font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2'>
            call {phone}
          </a>{' '}
          or send us a text.
        </div>
        <button
          type='submit'
          className='mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#200b38] px-6 py-3 text-sm font-semibold cursor-pointer
                    text-white transition hover:bg-[#432462] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
          Review request <span aria-hidden='true'>→</span>
        </button>
        <div
          role='status'
          aria-live='polite'>
          {checked && (
            <p className='mt-4 rounded-lg bg-[#f5f0fb] p-4 text-sm leading-6 text-[#200b38]'>
              Your details have been checked. Nothing has been sent or saved.
              Please call or text us to request your quote.
            </p>
          )}
        </div>
      </form>
    </section>
  );
}
