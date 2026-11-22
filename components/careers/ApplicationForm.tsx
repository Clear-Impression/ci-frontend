'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, DragEvent, FormEvent } from 'react';
import { submitApplication } from '@/app/careers/actions';
import styles from '@/app/feedback/feedback.module.css';
import {
  applicationLimits,
  checkApplication,
  resumeAccept,
  resumeLimit,
  workDays,
  type ApplicationField,
  type ApplicationState,
  type ApplicationValues,
} from '@/data/careers';

type ApplicationFormProps = {
  role: string;
  roleTitle: string;
  phone: string;
  phoneHref: string;
};

const initialState: ApplicationState = { status: 'idle' };

const fieldClass =
  'w-full rounded-xl border border-gray-300 bg-white text-base text-[#200b38] shadow-sm outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-[#6c3fb8] focus:ring-4 focus:ring-[#6c3fb8]/15 aria-invalid:border-red-500 aria-invalid:focus:ring-red-500/15';

// Selectable pills for yes/no and the days. The real input stays focusable.
const pillClass =
  'relative inline-flex min-h-11 cursor-pointer items-center rounded-full border border-gray-300 bg-white px-4 text-[15px] font-medium text-[#200b38] transition select-none hover:border-gray-400 has-checked:border-[#200b38] has-checked:bg-[#200b38] has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#6c3fb8]';

function formatSize(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Read the typed answers back out of the form, without the file.
function readValues(form: HTMLFormElement): ApplicationValues {
  const data = new FormData(form);
  const text = (field: string) => String(data.get(field) ?? '').trim();
  return {
    name: text('name'),
    email: text('email'),
    phone: text('phone'),
    city: text('city'),
    license: text('license'),
    days: data.getAll('days').map(String),
    startDate: text('startDate'),
    experience: String(data.get('experience') ?? ''),
  };
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className='mt-2 flex items-start gap-1.5 text-sm text-red-600'>
      <span aria-hidden='true'>!</span>
      {message}
    </p>
  );
}

type TextFieldProps = {
  field: 'name' | 'email' | 'phone' | 'city';
  label: string;
  type: string;
  autoComplete: string;
  placeholder: string;
  required?: boolean;
  defaultValue?: string;
  error?: string;
  onBlur: () => void;
};

function TextField({ field, label, type, autoComplete, placeholder, required, defaultValue, error, onBlur }: TextFieldProps) {
  return (
    <div>
      <label htmlFor={`apply-${field}`} className='block text-sm font-medium text-[#200b38]'>
        {label}
        {required && <span aria-hidden='true'> *</span>}
      </label>
      <input
        id={`apply-${field}`}
        name={field}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required={required}
        maxLength={applicationLimits[field]}
        defaultValue={defaultValue}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `apply-${field}-error` : undefined}
        className={`${fieldClass} mt-2 px-4 py-3.5`}
      />
      <FieldError id={`apply-${field}-error`} message={error} />
    </div>
  );
}

export default function ApplicationForm({ role, roleTitle, phone, phoneHref }: ApplicationFormProps) {
  const [state, formAction, pending] = useActionState(submitApplication, initialState);
  // The chosen file lives here, so it survives the form refilling after a failed send.
  const [resume, setResume] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  // One key per application. Sending the same answers and file again reuses it,
  // so a retry after a dropped connection never saves the application twice.
  const lastSubmission = useRef<{ fingerprint: string; key: string } | null>(null);
  const [clientErrors, setClientErrors] = useState<Partial<Record<ApplicationField, string>>>({});
  const [experienceLength, setExperienceLength] = useState(state.values?.experience?.length ?? 0);
  const formRef = useRef<HTMLFormElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const values = state.values ?? {};
  const touched = useRef<Set<ApplicationField>>(new Set());

  // Server errors win right after a submit, then live checks take over.
  const errors = { ...state.errors, ...clientErrors };

  // Move focus to the result so keyboard and screen reader users hear it.
  useEffect(() => {
    if (['success', 'unavailable', 'error', 'closed'].includes(state.status)) {
      resultRef.current?.focus();
    }
  }, [state]);

  // Re-check the fields someone has already visited, and clear errors once fixed.
  function recheck(field?: ApplicationField, file: File | null = resume) {
    if (field) touched.current.add(field);
    if (!formRef.current) return;
    const found = checkApplication(readValues(formRef.current), file);
    setClientErrors(
      Object.fromEntries([...touched.current].map((name) => [name, found[name]])),
    );
  }

  function pickFile(file: File | undefined) {
    if (!file) return;
    setResume(file);
    recheck('resume', file);
  }

  function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    pickFile(event.target.files?.[0]);
    // Clear the input so choosing the same file again still counts as a change.
    event.target.value = '';
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setDragging(false);
    pickFile(event.dataTransfer.files?.[0]);
  }

  function removeFile() {
    setResume(null);
    recheck('resume', null);
    // The drop zone comes back on the next render, so focus it then.
    setTimeout(() => fileRef.current?.focus());
  }

  function send(formData: FormData) {
    if (resume) formData.set('resume', resume);
    const fingerprint = JSON.stringify([
      ...(['name', 'email', 'phone', 'city', 'license', 'startDate', 'experience'] as const).map((field) =>
        String(formData.get(field) ?? '').trim(),
      ),
      formData.getAll('days'),
      resume ? [resume.name, resume.size, resume.lastModified] : null,
    ]);
    if (lastSubmission.current?.fingerprint !== fingerprint) {
      lastSubmission.current = { fingerprint, key: crypto.randomUUID() };
    }
    formData.set('submissionKey', lastSubmission.current.key);
    return formAction(formData);
  }

  // Stop the send and point to the first problem if anything is still wrong.
  function checkBeforeSend(event: FormEvent<HTMLFormElement>) {
    const found = checkApplication(readValues(event.currentTarget), resume);
    (Object.keys(found) as ApplicationField[]).forEach((field) => touched.current.add(field));
    setClientErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.preventDefault();
      const target = first === 'resume' ? fileRef.current : event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`);
      target?.focus();
      return;
    }
    // Sending now, so let the server's answer show until the visitor edits again.
    touched.current.clear();
    setClientErrors({});
  }

  if (state.status === 'success') {
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role='status'
        className={`${styles.success} flex flex-col items-center justify-center rounded-3xl bg-white px-8 py-14 text-center shadow-xl shadow-[#200b38]/5 ring-1 ring-gray-200 outline-none sm:px-12 sm:py-20`}>
        <span className='grid size-16 place-items-center rounded-full bg-[#55ab68] ring-8 ring-[#eaf6ed]'>
          <svg aria-hidden='true' viewBox='0 0 24 24' className='size-8 text-white' fill='none' stroke='currentColor' strokeWidth='2.6' strokeLinecap='round' strokeLinejoin='round'>
            <path className={styles.check} d='M5 12.5l4.5 4.5L19 7.5' pathLength={1} />
          </svg>
        </span>
        <h2 className='mt-6 text-2xl font-semibold tracking-tight text-[#200b38] sm:text-3xl'>
          Application sent
        </h2>
        <p className='mt-3 max-w-sm leading-relaxed text-gray-600'>
          Thanks{state.firstName ? `, ${state.firstName}` : ''}. Niels reads every application and will reach out by phone or email.
        </p>
        <Link
          href='/careers'
          className='mt-8 inline-flex min-h-12 items-center rounded-xl bg-[#200b38] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#33195a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
          Back to careers
        </Link>
      </div>
    );
  }

  const nearLimit = experienceLength > applicationLimits.experience * 0.9;
  const days = values.days ?? [];

  return (
    <section
      aria-labelledby='apply-heading'
      className='overflow-hidden rounded-3xl bg-white shadow-xl shadow-[#200b38]/5 ring-1 ring-gray-200'>
      {/* A thin brand stripe across the top of the card. */}
      <div aria-hidden='true' className={`${styles.stripe} h-1.5 bg-linear-to-r from-[#200b38] via-[#6c3fb8] to-[#efb52b]`} />
      <div className='p-6 sm:p-10'>
        <h2 id='apply-heading' className='text-2xl font-semibold tracking-tight text-[#200b38]'>
          Apply for this role
        </h2>
        <p className='mt-2 text-sm text-gray-600'>About five minutes. Fields marked * are required.</p>

        <form
          ref={formRef}
          key={JSON.stringify(values)}
          action={send}
          aria-busy={pending || undefined}
          data-settled={state.status === 'idle' ? undefined : ''}
          onSubmit={checkBeforeSend}
          noValidate
          className='mt-8 space-y-6'>
          <input type='hidden' name='role' value={role} />

          <div
            className={`${styles.field} grid gap-6 sm:grid-cols-2`}
            style={{ '--delay': '520ms' } as React.CSSProperties}>
            <TextField field='name' label='Full name' type='text' autoComplete='name' placeholder='Jane Smith' required defaultValue={values.name} error={errors.name} onBlur={() => recheck('name')} />
            <TextField field='email' label='Email' type='email' autoComplete='email' placeholder='jane@example.com' required defaultValue={values.email} error={errors.email} onBlur={() => recheck('email')} />
            <TextField field='phone' label='Phone' type='tel' autoComplete='tel' placeholder='(480) 555-0123' required defaultValue={values.phone} error={errors.phone} onBlur={() => recheck('phone')} />
            <TextField field='city' label='City you live in' type='text' autoComplete='address-level2' placeholder='Mesa' defaultValue={values.city} error={errors.city} onBlur={() => recheck('city')} />
          </div>

          <fieldset
            className={styles.field}
            style={{ '--delay': '600ms' } as React.CSSProperties}
            aria-describedby={errors.license ? 'apply-license-error' : undefined}>
            <legend className='text-sm font-medium text-[#200b38]'>
              Do you have a valid driver’s license and reliable transportation?<span aria-hidden='true'> *</span>
            </legend>
            <div className='mt-2.5 flex flex-wrap gap-2.5'>
              {(['yes', 'no'] as const).map((answer) => (
                <label key={answer} className={pillClass}>
                  <input
                    type='radio'
                    name='license'
                    value={answer}
                    defaultChecked={values.license === answer}
                    onChange={() => recheck('license')}
                    className='absolute size-px opacity-0'
                  />
                  {answer === 'yes' ? 'Yes' : 'No'}
                </label>
              ))}
            </div>
            <FieldError id='apply-license-error' message={errors.license} />
          </fieldset>

          <fieldset
            className={styles.field}
            style={{ '--delay': '660ms' } as React.CSSProperties}
            aria-describedby={errors.days ? 'apply-days-error' : undefined}>
            <legend className='text-sm font-medium text-[#200b38]'>
              Which days can you work?<span aria-hidden='true'> *</span>
            </legend>
            <div className='mt-2.5 flex flex-wrap gap-2'>
              {workDays.map((day) => (
                <label key={day} className={pillClass}>
                  <input
                    type='checkbox'
                    name='days'
                    value={day}
                    defaultChecked={days.includes(day)}
                    onChange={() => recheck('days')}
                    className='absolute size-px opacity-0'
                  />
                  {day}
                </label>
              ))}
            </div>
            <FieldError id='apply-days-error' message={errors.days} />
          </fieldset>

          <div
            className={`${styles.field} max-w-72`}
            style={{ '--delay': '720ms' } as React.CSSProperties}>
            <label htmlFor='apply-startDate' className='block text-sm font-medium text-[#200b38]'>
              Earliest start date
            </label>
            <input
              id='apply-startDate'
              name='startDate'
              type='date'
              defaultValue={values.startDate}
              aria-invalid={errors.startDate ? true : undefined}
              aria-describedby={errors.startDate ? 'apply-startDate-error' : undefined}
              className={`${fieldClass} mt-2 px-4 py-3.5`}
            />
            <FieldError id='apply-startDate-error' message={errors.startDate} />
          </div>

          <div
            className={styles.field}
            style={{ '--delay': '780ms' } as React.CSSProperties}>
            <div className='flex items-baseline justify-between gap-3'>
              <label htmlFor='apply-experience' className='block text-sm font-medium text-[#200b38]'>
                Relevant experience
              </label>
              <span
                id='apply-experience-count'
                aria-live='polite'
                className={`text-xs tabular-nums ${nearLimit ? 'font-semibold text-[#b07a00]' : 'text-gray-500'}`}>
                {experienceLength.toLocaleString()} / {applicationLimits.experience.toLocaleString()}
              </span>
            </div>
            <textarea
              id='apply-experience'
              name='experience'
              rows={5}
              maxLength={applicationLimits.experience}
              defaultValue={values.experience}
              onChange={(event) => setExperienceLength(event.target.value.length)}
              placeholder='Cleaning, ladder work, customer service, or anything else you’d like us to know.'
              aria-describedby='apply-experience-count'
              className={`${fieldClass} mt-2 resize-y px-4 py-3.5 leading-relaxed`}
            />
          </div>

          {/* The resume. The chosen file is kept in state and added when sending. */}
          <div
            className={styles.field}
            style={{ '--delay': '840ms' } as React.CSSProperties}>
            <p id='apply-resume-label' className='text-sm font-medium text-[#200b38]'>
              Resume<span aria-hidden='true'> *</span>
            </p>
            {resume ? (
              <div className='mt-2 flex flex-wrap items-center gap-3.5 rounded-2xl bg-[#eef8f1] px-4 py-3.5 ring-1 ring-[#bfe3c9]'>
                <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-[#55ab68] text-white'>
                  <svg aria-hidden='true' viewBox='0 0 24 24' className='size-5' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5' />
                  </svg>
                </span>
                <span className='min-w-0 flex-1 basis-48'>
                  <span className='block truncate font-semibold text-[#200b38]'>{resume.name}</span>
                  <span className='block text-sm text-[#3c6e48]'>
                    {formatSize(resume.size)}{errors.resume ? '' : ' · ready to send'}
                  </span>
                </span>
                <button
                  type='button'
                  onClick={removeFile}
                  className='inline-flex min-h-11 items-center rounded-xl bg-white px-4 text-sm font-semibold text-[#200b38] ring-1 ring-gray-300 transition hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8]'>
                  Remove<span className='sr-only'> {resume.name}</span>
                </button>
              </div>
            ) : (
              <label
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                className={`mt-2 flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-5 py-7 text-center transition has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#6c3fb8] ${
                  errors.resume
                    ? 'border-red-500 bg-red-50/40'
                    : dragging
                      ? 'border-[#6c3fb8] bg-[#f3eefa]'
                      : 'border-[#c9bde0] bg-[#faf8fd] hover:bg-[#f3eefa]'
                }`}>
                <input
                  ref={fileRef}
                  type='file'
                  accept={resumeAccept}
                  onChange={onFileChange}
                  aria-labelledby='apply-resume-label'
                  aria-describedby={errors.resume ? 'apply-resume-hint apply-resume-error' : 'apply-resume-hint'}
                  aria-invalid={errors.resume ? true : undefined}
                  className='sr-only'
                />
                <span className='grid size-12 place-items-center rounded-full bg-white text-[#6c3fb8] ring-1 ring-gray-200'>
                  <svg aria-hidden='true' viewBox='0 0 24 24' className='size-5' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                    <path d='M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3' />
                  </svg>
                </span>
                <span className='font-semibold text-[#200b38]'>
                  Choose a file <span className='font-normal text-gray-600'>or drag it here</span>
                </span>
                <span id='apply-resume-hint' className='text-sm text-gray-600'>
                  PDF, DOC, or DOCX, up to {resumeLimit.label}
                </span>
              </label>
            )}
            <FieldError id='apply-resume-error' message={errors.resume} />
          </div>

          {/* Hidden from people. Bots that fill it in are ignored. */}
          <div aria-hidden='true' className='absolute -left-[9999px] h-px w-px overflow-hidden'>
            <label>
              Leave this empty
              <input name='website' type='text' tabIndex={-1} autoComplete='off' />
            </label>
          </div>

          {['unavailable', 'error', 'closed'].includes(state.status) && (
            <div
              ref={resultRef}
              tabIndex={-1}
              role='alert'
              className='flex gap-3 rounded-xl border border-[#efb52b]/50 bg-[#fffaf0] p-4 text-sm leading-6 text-[#59441c] outline-none'>
              <span aria-hidden='true' className='mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#efb52b] text-xs font-bold text-[#200b38]'>
                !
              </span>
              <p>
                {state.status === 'closed'
                  ? `We’re no longer taking applications for ${roleTitle}. `
                  : state.status === 'unavailable'
                    ? 'Applications can’t be sent online just yet. Your answers are still here, so you can try again later, or '
                    : 'Something went wrong while sending your application. Please try again, or '}
                {state.status === 'closed' ? (
                  <Link href='/careers' className='font-semibold underline underline-offset-4'>
                    See other open roles
                  </Link>
                ) : (
                  <a href={phoneHref} className='font-semibold underline underline-offset-4'>
                    call {phone}
                  </a>
                )}
                .
              </p>
            </div>
          )}

          <div
            className={`${styles.field} flex flex-col-reverse gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between`}
            style={{ '--delay': '900ms' } as React.CSSProperties}>
            <p className='max-w-xs text-xs leading-5 text-gray-500'>
              We only use your information to review your application.
            </p>
            <button
              type='submit'
              disabled={pending}
              className='inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#200b38] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#33195a] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70'>
              {pending && <span aria-hidden='true' className='spinner' />}
              {pending ? 'Sending…' : 'Send application'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
