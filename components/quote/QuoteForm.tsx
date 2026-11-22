'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent, HTMLInputTypeAttribute } from 'react';
import { submitQuote } from '@/app/quote/actions';
import type { QuoteOptions } from '@/data/quote';
import styles from './QuoteForm.module.css';

// Details the visitor already typed on the homepage, if they came from there.
export type QuoteStart = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // They checked the box to get texts about seasonal offers.
  texts: boolean;
};

type QuoteFormProps = {
  options: QuoteOptions;
  phoneHref: string;
  phone: string;
  start?: QuoteStart;
};

type FieldProps = {
  name: string;
  label: string;
  autoComplete: string;
  type?: HTMLInputTypeAttribute;
  fullWidth?: boolean;
  maxLength?: number;
  pattern?: string;
  title?: string;
  defaultValue?: string;
};

const inputClass =
  'mt-2 w-full rounded-lg border border-[#200b38]/20 bg-white px-4 py-3 text-base text-[#200b38] outline-none transition focus:border-[#6c3fb8] focus:ring-2 focus:ring-[#6c3fb8]/20';
const choiceClass =
  'flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-[#200b38]/15 bg-white px-4 py-3 text-sm text-[#200b38] transition hover:border-[#55ab68] has-checked:border-[#55ab68] has-checked:bg-[#eaf6ed] has-focus-visible:ring-2 has-focus-visible:ring-[#6c3fb8]';
const phonePattern = String.raw`\+?(?:[\(\). \-]*[0-9]){7,15}[\(\). \-]*`;
const steps = [
  { label: 'Contact', title: 'Your contact details', hint: 'We’ll use these details to follow up about your quote.' },
  { label: 'Address', title: 'Service address', hint: 'Where do you need cleaning?' },
  { label: 'Details', title: 'What needs cleaning?', hint: 'Tell us about the property and choose the services you need.' },
] as const;
const lastStep = steps.length - 1;
const subscribeToHydration = () => () => {};

// Use the same labels, spacing, and browser autofill support for contact fields.
function QuoteField({
  name,
  label,
  autoComplete,
  type = 'text',
  fullWidth,
  maxLength = 100,
  pattern,
  title,
  defaultValue,
}: FieldProps) {
  return (
    <label
      className={`block min-w-0 text-sm font-medium text-[#200b38] ${fullWidth ? 'col-span-2' : ''}`}>
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
        maxLength={maxLength}
        pattern={pattern}
        title={title}
        defaultValue={defaultValue}
        className={inputClass}
      />
    </label>
  );
}

export default function QuoteForm({
  options,
  phoneHref,
  phone,
  start,
}: QuoteFormProps) {
  const [result, setResult] = useState<Awaited<ReturnType<typeof submitQuote>> | null>(null);
  const [pending, setPending] = useState(false);
  const [serviceError, setServiceError] = useState(false);
  const [step, setStep] = useState(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const receiptRef = useRef<HTMLHeadingElement>(null);
  const nextFocus = useRef<HTMLInputElement | HTMLHeadingElement | null>(null);
  const inFlight = useRef(false);
  const lastSubmission = useRef<{ fingerprint: string; key: string } | null>(null);
  const saved = result?.status === 'saved';
  const current = steps[step];
  // The form needs its step handler before the browser can submit it.
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);

  // Focus the new heading, or the field that needs fixing if we returned to an earlier step.
  useEffect(() => {
    const target = nextFocus.current;
    nextFocus.current = null;
    if (target instanceof HTMLInputElement) target.reportValidity();
    else if (target) {
      target.focus({ preventScroll: true });
      const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
      const titleTop = target.getBoundingClientRect().top;
      if (titleTop < headerBottom + 12 || titleTop > window.innerHeight - 80) {
        target.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    }
  }, [step]);

  useEffect(() => {
    if (saved) receiptRef.current?.focus();
  }, [saved]);

  function goToStep(next: number, field?: HTMLInputElement) {
    nextFocus.current = field ?? headingRef.current;
    setStep(next);
  }

  async function sendRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = event.currentTarget;
    // Keep hidden fields mounted so Back preserves values and the final request includes every step.
    const scope = step === lastStep ? '[data-quote-step]' : '[data-quote-step]:not([hidden])';
    const invalid = Array.from(form.querySelectorAll<HTMLInputElement>(`${scope} input`))
      .find((input) => input.willValidate && !input.validity.valid);
    if (invalid) {
      const fieldStep = Number(invalid.closest<HTMLElement>('[data-quote-step]')?.dataset.quoteStep);
      if (fieldStep === step) invalid.reportValidity();
      else goToStep(fieldStep, invalid);
      return;
    }

    if (step < lastStep) {
      goToStep(step + 1);
      return;
    }

    const values = new FormData(form);

    // A group of checkboxes needs its own check for at least one selection.
    if (values.getAll('services').length === 0) {
      setServiceError(true);
      form.querySelector<HTMLInputElement>('input[name="services"]')?.focus();
      return;
    }

    setServiceError(false);
    inFlight.current = true;
    setPending(true);
    setResult(null);

    try {
      // Reuse the key when retrying the same details after a failed request.
      const fingerprint = JSON.stringify([...values.entries()]);
      if (lastSubmission.current?.fingerprint !== fingerprint) {
        lastSubmission.current = { fingerprint, key: crypto.randomUUID() };
      }
      values.set('submissionKey', lastSubmission.current.key);

      const outcome = await submitQuote(values);
      setResult(outcome);
      if (outcome.status === 'saved') {
        form.reset();
        lastSubmission.current = null;
      }
    } catch {
      setResult({ status: 'unavailable' });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }

  return (
    <section aria-labelledby='quote-form-heading' className={styles.shell}>
      <form
        method='post'
        noValidate
        onSubmit={sendRequest}
        onChange={() => setResult(null)}
        aria-busy={pending}>
        <h2 id='quote-form-heading' className='sr-only'>Quote request form</h2>
        <div hidden={saved}>
          <ol aria-label='Quote steps' className={styles.steps}>
            {steps.map(({ label }, index) => (
              <li
                key={label}
                aria-current={step === index ? 'step' : undefined}
                data-complete={step > index || undefined}>
                {step > index && <span className='sr-only'>Completed: </span>}
                {label}
              </li>
            ))}
          </ol>

          <div className='mb-5 text-center sm:mb-6'>
            <h3 ref={headingRef} tabIndex={-1} className={`${styles.stepHeading} text-2xl font-semibold tracking-tight sm:text-3xl`}>
              {current.title}
            </h3>
            <p className='mt-2 text-sm leading-6 text-[#625a6c]'>
              {current.hint}{' '}<span className='block text-xs sm:inline'>Fields marked * are required.</span>
            </p>
          </div>
        </div>

        {/* Keep the homepage opt-in with the rest of the prefilled contact data. */}
        {start?.texts && <input type='hidden' name='smsOptIn' value='yes' />}
        <fieldset data-quote-step='0' className={styles.stage} hidden={saved || step !== 0} disabled={pending}>
          <legend className='sr-only'>Contact details</legend>
          <div className='grid grid-cols-2 gap-4 sm:gap-5'>
            <QuoteField
              name='firstName'
              label='First name'
              autoComplete='given-name'
              defaultValue={start?.firstName}
            />
            <QuoteField
              name='lastName'
              label='Last name'
              autoComplete='family-name'
              defaultValue={start?.lastName}
            />
            <QuoteField
              name='email'
              label='Email'
              type='email'
              autoComplete='email'
              maxLength={254}
              defaultValue={start?.email}
            />
            <QuoteField
              name='phone'
              label='Phone'
              type='tel'
              autoComplete='tel'
              maxLength={32}
              pattern={phonePattern}
              title='Enter a phone number with 7 to 15 digits.'
              defaultValue={start?.phone}
            />
          </div>
        </fieldset>

        <fieldset data-quote-step='1' className={styles.stage} hidden={saved || step !== 1} disabled={pending}>
          <legend className='sr-only'>Address</legend>
          <div className='grid grid-cols-2 gap-4 sm:gap-5'>
            <QuoteField
              name='address'
              label='Street address'
              autoComplete='street-address'
              fullWidth
              maxLength={200}
            />
            <QuoteField
              name='city'
              label='City'
              autoComplete='address-level2'
            />
            <QuoteField
              name='postalCode'
              label='ZIP code'
              autoComplete='postal-code'
              maxLength={10}
              pattern='[0-9]{5}(-[0-9]{4})?'
              title='Enter a 5-digit ZIP code or ZIP+4.'
            />
          </div>
        </fieldset>

        <div data-quote-step='2' className={styles.stage} hidden={saved || step !== lastStep}>
          <fieldset disabled={pending}>
            <legend className='text-sm font-semibold text-[#200b38]'>
              Property type{' '}
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
                    className='h-4 w-4 shrink-0 accent-[#2a7340]'
                  />
                  {type}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset
            className='mt-6'
            disabled={pending}
            aria-describedby={
              serviceError ? 'service-help service-error' : 'service-help'
            }>
            <legend className='text-sm font-semibold text-[#200b38]'>
              Services{' '}
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
                  key={service.id}
                  className={choiceClass}>
                  <input
                    type='checkbox'
                    name='services'
                    value={service.id}
                    aria-invalid={serviceError || undefined}
                    aria-describedby={serviceError ? 'service-error' : undefined}
                    onChange={() => setServiceError(false)}
                    className='h-4 w-4 shrink-0 accent-[#2a7340]'
                  />
                  {service.label}
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

          <label className='mt-6 block text-sm font-medium text-[#200b38]'>
            Anything else?{' '}
            <span className='font-normal text-[#686170]'>(optional)</span>
            <textarea
              name='details'
              rows={3}
              maxLength={2000}
              disabled={pending}
              placeholder='Number of windows, stories, or anything you would like us to know.'
              className={`${inputClass} resize-y`}
            />
          </label>
        </div>

        {!saved && (
          <div className='mt-6 flex gap-3'>
            {step > 0 && (
              <button type='button' disabled={pending} className={styles.back} onClick={() => goToStep(step - 1)}>
                Previous step
              </button>
            )}
            <button type='submit' disabled={!hydrated || pending} className={styles.next}>
              {pending && <span aria-hidden='true' className='spinner' />}
              {step < lastStep ? 'Continue' : pending ? 'Sending request…' : 'Send quote request'}
            </button>
          </div>
        )}
        <div
          role='status'
          aria-live='polite'>
          {result?.status === 'saved' && (
            <div className='mt-4 flex gap-3 rounded-lg bg-[#eaf6ed] p-4 text-sm leading-6 text-[#1f5a31]'>
              <svg aria-hidden='true' viewBox='0 0 24 24' className='mt-0.5 size-5 shrink-0' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <path d='m5 12.5 4.5 4.5L19 7.5' />
              </svg>
              <div>
                <h3 ref={receiptRef} tabIndex={-1} className='font-semibold'>Your quote request was received.</h3>
                <p className='break-all'>Reference: {result.id}</p>
              </div>
            </div>
          )}
        </div>
        {saved && (
          <button type='button' className={`${styles.back} mt-4`} onClick={() => {
            setResult(null);
            goToStep(0);
          }}>
            Start another request
          </button>
        )}
        {result && result.status !== 'saved' && (
          <p role='alert' className='mt-4 rounded-lg bg-[#fffaf0] p-4 text-sm leading-6 text-[#59441c]'>
            {result.status === 'invalid'
              ? 'Check your contact details, address, and selected services, then try again.'
              : result.status === 'conflict'
                ? 'This request reference was already used. Call us to check your request.'
                : 'We couldn’t confirm your request. Try sending the same details again, or call us.'}{' '}
            <a href={phoneHref} className='font-semibold underline underline-offset-4'>{phone}</a>
          </p>
        )}
      </form>
    </section>
  );
}
