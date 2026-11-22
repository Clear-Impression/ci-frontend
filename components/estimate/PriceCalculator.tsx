'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import ServiceIcon from '@/components/services/ServiceIcon';
import { company } from '@/data/company';
import {
  describeValues,
  estimateNote,
  formatAmount,
  formatRange,
  getEstimateTab,
  rangeFor,
  startingValues,
  totalRange,
  type EstimateQuestion,
  type EstimateTab,
  type EstimateValues,
} from '@/data/estimate';
import { loadEstimate, saveEstimate, type EstimateDetails } from '@/lib/estimateStore';
import { submitInstantQuote } from '@/app/estimate/actions';
import { contactError } from '@/data/estimate-request';
import { WINDOW_SERVICE, GUTTER_SERVICE, SOLAR_SERVICE, PHOTO_SERVICE, quoteServices, quoteTabs, quoteSteps, restoreQuoteFlow, updateQuoteAnswer, selectQuoteService, incompleteQuoteServices, canFinalizeQuote, quoteLines } from '@/data/estimate-flow';
import EstimateSummary from './EstimateSummary';
import { downloadEstimatePdf } from './estimatePdf';
import styles from '@/app/estimate/calculator.module.css';

const smsNumber = company.phoneHref.replace(/^tel:/, '');
const sms = (body: string) => `sms:${smsNumber}?&body=${encodeURIComponent(body)}`;

function Check() {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.4'
      strokeLinecap='round'
      strokeLinejoin='round'
      className='size-4 shrink-0'>
      <path d='M5 12.5l4.5 4.5L19 7.5' />
    </svg>
  );
}

function StepLabel({ number, label }: { number: number; label: string }) {
  return (
    <span className='flex items-center gap-3 font-semibold text-[#200b38]'>
      <span
        aria-hidden='true'
        className={styles.stepNumber}>
        {number}
      </span>
      {label}
    </span>
  );
}

// The big number next to a slider. Click or tap it to type an exact amount
// instead of dragging. It updates the price as you type and tidies up when
// you leave the field.
function AmountField({
  id,
  label,
  amount,
  min,
  limit,
  unit,
  onChange,
}: {
  id: string;
  label: string;
  amount: number;
  min: number;
  limit: number;
  unit: string;
  onChange: (value: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const justFocused = useRef(false);
  const shown = draft ?? amount.toLocaleString('en-US');
  const parse = (text: string) => Number(text.replace(/[^0-9]/g, ''));

  return (
    <span className='flex items-baseline whitespace-nowrap text-[#200b38]'>
      <label
        htmlFor={id}
        className='sr-only'>
        Type the {label}
      </label>
      <input
        id={id}
        type='text'
        inputMode='numeric'
        autoComplete='off'
        value={shown}
        // Select the whole number on focus, so typing replaces it. The click
        // that focused the field would otherwise drop a cursor in instead.
        onFocus={(event) => {
          justFocused.current = true;
          event.currentTarget.select();
        }}
        onMouseUp={(event) => {
          if (justFocused.current) event.preventDefault();
          justFocused.current = false;
        }}
        onChange={(event) => {
          const text = event.target.value.replace(/[^0-9,]/g, '');
          setDraft(text);
          const typed = parse(text);
          if (typed >= min && typed <= limit) onChange(typed);
        }}
        onBlur={() => {
          const typed = parse(draft ?? '');
          if (typed) onChange(Math.min(limit, Math.max(min, typed)));
          setDraft(null);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
        }}
        className={styles.amountInput}
        style={{ width: `${Math.max(2, shown.length) + 0.6}ch` }}
      />
      <span className='ml-1.5 text-sm text-gray-500'>{unit}</span>
      <svg
        aria-hidden='true'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
        className='ml-2 size-4 self-center text-[#6c3fb8]'>
        <path d='M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4' />
      </svg>
    </span>
  );
}

// One question: a slider, a set of options, or a list of add-ons.
function Question({
  question,
  number,
  value,
  onChange,
}: {
  question: EstimateQuestion;
  number: number;
  value: EstimateValues[string];
  onChange: (value: EstimateValues[string]) => void;
}) {
  if (question.kind === 'slider') {
    const amount = Number(value);
    // Typed amounts can go past the end of the slider; the slider just stays full.
    const fill = Math.min(100, ((amount - question.min) / (question.max - question.min)) * 100);
    const id = `est-${question.id}`;
    return (
      <div>
        <div className='flex items-end justify-between gap-4'>
          <label htmlFor={id}>
            <StepLabel
              number={number}
              label={question.label}
            />
          </label>
          <AmountField
            id={`${id}-typed`}
            label={`${question.label} (${question.unit})`}
            amount={amount}
            min={question.min}
            limit={question.max * 4}
            unit={question.unit}
            onChange={onChange}
          />
        </div>
        <input
          id={id}
          type='range'
          min={question.min}
          max={question.max}
          step={question.step}
          value={Math.min(amount, question.max)}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-valuetext={formatAmount(amount, question.unit)}
          className={`${styles.range} mt-5 w-full`}
          style={{ '--fill': `${fill}%` } as React.CSSProperties}
        />
        <div className='mt-2 flex justify-between text-xs text-gray-500'>
          <span>{question.min.toLocaleString('en-US')}</span>
          <span>{question.max.toLocaleString('en-US')}+</span>
        </div>
        {question.help && <p className='mt-3 text-sm leading-relaxed text-gray-600'>{question.help}</p>}
      </div>
    );
  }

  if (question.kind === 'choice') {
    const index = Math.max(
      0,
      question.options.findIndex((option) => option.id === value),
    );
    const count = question.options.length;
    // Arrow keys move between options, like native radio buttons.
    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step =
        event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1 : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1 : 0;
      if (!step) return;
      event.preventDefault();
      const next = (index + step + count) % count;
      onChange(question.options[next].id);
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
    };
    const labelId = `est-${question.id}-label`;
    return (
      <div>
        <p id={labelId}>
          <StepLabel
            number={number}
            label={question.label}
          />
        </p>
        <div
          role='radiogroup'
          aria-labelledby={labelId}
          onKeyDown={onKeyDown}
          className={question.cards ? styles.cards : styles.segmented}
          style={{ '--count': count, '--index': index } as React.CSSProperties}>
          {!question.cards && (
            <span
              aria-hidden='true'
              className={styles.segmentedPill}
            />
          )}
          {question.options.map((option, optionIndex) => {
            const picked = option.id === value;
            return (
              <button
                key={option.id}
                type='button'
                role='radio'
                aria-checked={picked}
                tabIndex={picked ? 0 : -1}
                onClick={() => onChange(option.id)}
                className={question.cards ? styles.card : styles.segment}
                style={{ '--o': optionIndex } as React.CSSProperties}>
                {question.cards ? (
                  <>
                    <span className='font-semibold text-[#200b38]'>{option.label}</span>
                    {option.hint && <span className='mt-1.5 block text-sm leading-snug text-gray-600'>{option.hint}</span>}
                    <span
                      aria-hidden='true'
                      className={styles.cardDot}
                    />
                  </>
                ) : (
                  option.label
                )}
              </button>
            );
          })}
        </div>
        {question.help && <p className='mt-3 text-sm leading-relaxed text-gray-600'>{question.help}</p>}
      </div>
    );
  }

  const ticked = (value as readonly string[]) ?? [];
  return (
    <fieldset>
      <legend>
        <StepLabel
          number={number}
          label={question.label}
        />
      </legend>
      <div className='mt-4 grid gap-3 sm:grid-cols-2'>
        {question.options.map((addon) => {
          const on = ticked.includes(addon.id);
          return (
            <label
              key={addon.id}
              data-on={on || undefined}
              className={styles.addon}>
              <input
                type='checkbox'
                checked={on}
                onChange={() => onChange(on ? ticked.filter((id) => id !== addon.id) : [...ticked, addon.id])}
                className='sr-only'
              />
              <span
                aria-hidden='true'
                className={styles.addonBox}>
                <Check />
              </span>
              {addon.label}
            </label>
          );
        })}
      </div>
      {question.help && <p className='mt-3 text-sm leading-relaxed text-gray-600'>{question.help}</p>}
    </fieldset>
  );
}

// The right panel describes the service and uses the Sanity-priced tab.
function PricePanel({ tab, values }: { tab: EstimateTab; values: EstimateValues }) {
  const range = rangeFor(tab, values);
  return (
    <>
      <p className={styles.panelEyebrow}>{tab.mode === 'photo' ? 'Photo quote' : 'Likely lands between'}</p>
      <p aria-live='polite' className={`${styles.panelBig} ${styles.pop}`} key={range ? formatRange(range) : 'photo'}>
        {tab.mode === 'photo' ? 'A real price' : range ? formatRange(range) : 'Pick an option'}
      </p>
      <p className='mt-4 leading-relaxed text-white/80'>{tab.panel.text}</p>
      <p className='mt-6 flex items-center gap-2 text-sm text-[#efb52b]'><Check /> Included in your quote</p>
      <a
        href={tab.mode === 'photo'
          ? sms(`Hi! I'd like a ${tab.name.toLowerCase()} quote. Here are photos of my windows:`)
          : sms(`Hi! I'd like a quote for ${tab.name}${range ? ` (${formatRange(range)}; ${describeValues(tab, values)})` : ''}.`)}
        className={styles.panelSecondary}>
        {tab.panel.textCta}
      </a>
      {tab.mode === 'photo' ? (
        <a href={`${company.emailHref}?subject=${encodeURIComponent(`${tab.name} quote`)}`} className={styles.panelSecondary}>
          Email the photos instead
        </a>
      ) : (
        <p className='mt-4 text-sm text-white/70'>Or call <a className='font-semibold underline' href={company.phoneHref}>{company.phone}</a></p>
      )}
      <p className='mt-6 text-sm leading-relaxed text-white/65'>{estimateNote}</p>
      <Link href={`/services/${tab.slug}`} className='mt-4 inline-block text-sm font-semibold text-white underline decoration-[#efb52b] underline-offset-4'>
        {tab.panel.learnMore} →
      </Link>
    </>
  );
}

const emptyDetails: EstimateDetails = { name: '', email: '', phone: '', address: '', city: '' };
const stepLabel = (id: string) => id === 'select-services' ? 'Select services' : id === 'summary' ? 'Summary' :
  id === 'finalize' ? 'Finalize' : quoteServices.find((service) => service.slug === id)?.label ?? id;

function progressFor(added: number, details: EstimateDetails, downloaded: boolean) {
  return (added ? 35 : 0) + (details.email.trim() ? 10 : 0) + (details.phone.trim() ? 10 : 0) + (details.city ? 20 : 0) +
    (details.address.trim() ? 5 : 0) + (downloaded ? 20 : 0);
}

export default function PriceCalculator({ cities, tabs }: { cities: readonly string[]; tabs: readonly EstimateTab[] }) {
  const [updatedPrices, setUpdatedPrices] = useState<readonly EstimateTab[] | null>(null);
  const services = useMemo(() => quoteTabs(updatedPrices ?? tabs), [updatedPrices, tabs]);
  const pricingVersion = JSON.stringify(services);
  const [flow, setFlow] = useState(() => restoreQuoteFlow(services));
  const [details, setDetails] = useState<EstimateDetails>(emptyDetails);
  const [downloaded, setDownloaded] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [reference, setReference] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [submission, setSubmission] = useState<{ fingerprint: string; key: string; id?: string } | null>(null);
  const lastSubmission = useRef<typeof submission>(null);
  const inFlight = useRef(false);
  const [wipe, setWipe] = useState(0);
  const [burst, setBurst] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const started = useRef(false);
  const steps = quoteSteps(flow);
  const stepIndex = steps.indexOf(flow.step);
  const tab = getEstimateTab(flow.step, services);
  const tabValues = tab ? flow.values[tab.slug] ?? startingValues(tab) : {};
  const lines = quoteLines(flow, services);
  const total = totalRange(lines);
  const incomplete = incompleteQuoteServices(flow, services);
  const canFinalize = canFinalizeQuote(flow, services);
  const hasPhotoQuote = lines.some((line) => line.slug === PHOTO_SERVICE);
  const contactReady = !contactError(details);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const saved = loadEstimate();
    const params = new URLSearchParams(window.location.search);
    const restored = restoreQuoteFlow(services, saved, params.get('service'));
    /* eslint-disable react-hooks/set-state-in-effect -- restore browser-only answers once after hydration */
    setFlow(restored);
    if (saved?.details) {
      setDetails({ name: typeof saved.details.name === 'string' ? saved.details.name : '',
        email: typeof saved.details.email === 'string' ? saved.details.email : '',
        phone: typeof saved.details.phone === 'string' ? saved.details.phone : '',
        address: typeof saved.details.address === 'string' ? saved.details.address : '',
        city: typeof saved.details.city === 'string' ? saved.details.city : '' });
    }
    if (saved?.submission && typeof saved.submission.fingerprint === 'string' &&
      /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(saved.submission.key)) {
      lastSubmission.current = saved.submission;
      setSubmission(saved.submission);
    }
    setDownloaded(Boolean(saved?.downloaded && saved.submission?.id && saved.pricingVersion === pricingVersion));
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (params.has('service') || params.has('start')) {
      window.history.replaceState(null, '', window.location.pathname);
      rootRef.current?.scrollIntoView({ block: 'start' });
    }
  }, [services, pricingVersion]);

  useEffect(() => {
    if (!loaded) return;
    const currentLines = quoteLines(flow, services);
    const currentTotal = totalRange(currentLines);
    saveEstimate({
      tab: getEstimateTab(flow.step, services)?.slug ?? flow.selected[0] ?? 'select-services',
      step: flow.step, propertyType: flow.propertyType, photoSent: flow.photoSent,
      finalizeUnlocked: flow.finalizeUnlocked, values: flow.values, added: flow.selected,
      details, downloaded, pricingVersion,
      submission: submission ?? undefined,
      summary: currentTotal ? { service: currentLines.filter((line) => line.range).map((line) => line.name).join(', '), range: formatRange(currentTotal) } : null,
    });
  }, [loaded, flow, details, downloaded, pricingVersion, services, submission]);

  const clearDownload = () => { setDownloaded(false); setReference(''); setDownloadError(''); };
  const focusStep = () => window.requestAnimationFrame(() => {
    document.getElementById('wizard-step-heading')?.focus({ preventScroll: true });
    rootRef.current?.scrollIntoView({ block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  const goTo = (step: string, focus = true) => {
    if (!steps.includes(step) || step !== 'select-services' && !flow.selected.length || step === 'finalize' && !canFinalize) return;
    setFlow((current) => ({ ...current, step }));
    if (focus) focusStep();
  };
  const selectService = (slug: string, checked: boolean, jump = false) => {
    setFlow((current) => selectQuoteService(current, slug, checked, jump));
    clearDownload();
    if (checked) setWipe((count) => count + 1);
    if (jump) focusStep();
  };
  const setAnswer = (id: string, answer: EstimateValues[string]) => {
    if (!tab) return;
    setFlow((current) => updateQuoteAnswer(current, tab.slug, id, answer));
    clearDownload();
  };
  const setDetail = (field: keyof EstimateDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    clearDownload();
  };
  const completeQuote = () => {
    if (!canFinalize) return;
    setFlow((current) => ({ ...current, finalizeUnlocked: true, step: 'finalize' }));
    focusStep();
  };
  const sendRequest = async (withPdf: boolean) => {
    if (inFlight.current || !canFinalize || flow.step !== 'finalize') return;
    const invalid = contactError(details);
    if (invalid) {
      setDownloadError(invalid.message);
      document.getElementById(`est-${invalid.field}`)?.focus();
      return;
    }
    inFlight.current = true;
    setSaving(true);
    setDownloadError('');
    try {
      const fingerprint = JSON.stringify({ details, selected: flow.selected,
        values: Object.fromEntries(flow.selected.map((slug) => [slug, flow.values[slug]])),
        photoSent: flow.selected.includes(PHOTO_SERVICE) && flow.photoSent, pricingVersion });
      if (lastSubmission.current?.fingerprint !== fingerprint) {
        lastSubmission.current = { fingerprint, key: crypto.randomUUID() };
      }
      const attempt = lastSubmission.current;
      setSubmission(attempt);
      const data = new FormData();
      for (const [key, value] of Object.entries(details)) data.set(key, value);
      flow.selected.forEach((slug) => data.append('services', slug));
      data.set('values', JSON.stringify(flow.values));
      data.set('photoSent', String(flow.photoSent));
      data.set('pricingVersion', pricingVersion);
      data.set('submissionKey', attempt.key);
      const result = await submitInstantQuote(data);
      if (result.status === 'pricing_changed') {
        setUpdatedPrices(result.tabs);
        setDownloaded(false);
        setReference('');
        setFlow((current) => ({ ...current, step: 'summary', finalizeUnlocked: false }));
        setDownloadError('Prices have been updated. Review your refreshed quote and complete it again before sending.');
        focusStep();
        return;
      }
      if (result.status !== 'saved') {
        setDownloadError('message' in result ? result.message : result.status === 'conflict'
          ? 'This reference was already used with different details. Please call us to check your request.'
          : 'We couldn’t confirm your request. Please try again; your details are still here.');
        return;
      }
      const received = { ...attempt, id: result.id };
      lastSubmission.current = received;
      setSubmission(received);
      setReference(result.id);
      if (withPdf) {
        try {
          await downloadEstimatePdf(details, lines, result.id);
          setBurst((count) => count + 1);
          setDownloaded(true);
        } catch {
          setDownloadError('Your request was received, but the PDF could not be created. Try the download button again; the same request reference will be reused.');
        }
      }
    } catch {
      setDownloadError('We couldn’t confirm your request. Please try again; your details are still here.');
    } finally { inFlight.current = false; setSaving(false); }
  };
  const startOver = () => {
    setFlow(restoreQuoteFlow(services)); setDetails(emptyDetails); clearDownload();
    lastSubmission.current = null; setSubmission(null); focusStep();
  };
  const onTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const available = steps.filter((step) => step === 'select-services' || flow.selected.length > 0 && (step !== 'finalize' || canFinalize));
    const next = event.key === 'Home' ? available[0] : event.key === 'End' ? available.at(-1)! :
      available[(available.indexOf(flow.step) + direction + available.length) % available.length];
    goTo(next, false);
    document.getElementById(`quote-tab-${next}`)?.focus();
    document.getElementById(`quote-tab-${next}`)?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  };
  const nextDisabled = flow.step === 'select-services' ? !flow.selected.length :
    flow.step === 'summary' ? !canFinalize : tab?.mode === 'range' && !rangeFor(tab, tabValues);

  return (
    <section ref={rootRef} aria-labelledby='price-heading' className='mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-8 sm:py-16'>
      <div className={styles.shell}>
        <div className={styles.top}>
          <div className='flex flex-wrap items-center gap-3'>
            <h2 id='price-heading' className='text-2xl font-semibold tracking-tight text-[#200b38] sm:text-3xl'>Get your price</h2>
            <span className={styles.badge}><Check /> No email needed to estimate</span>
          </div>
          <div role='tablist' aria-label='Quote steps' onKeyDown={onTabsKeyDown} className={`${styles.tabs} ${styles.flowTabs}`}>
            {steps.map((step, index) => {
              const service = quoteServices.find((entry) => entry.slug === step);
              const disabled = step !== 'select-services' && !flow.selected.length || step === 'finalize' && !canFinalize;
              return (
                <button key={step} id={`quote-tab-${step}`} type='button' role='tab' aria-selected={step === flow.step}
                  aria-controls='quote-step-panel' tabIndex={step === flow.step ? 0 : -1} disabled={disabled || saving}
                  onClick={() => goTo(step, false)} className={styles.tab}>
                  {service ? <ServiceIcon slug={service.slug} draw='none' className='size-5 shrink-0' /> : <span className={styles.navNumber} aria-hidden='true'>{index + 1}</span>}
                  <span className='text-left'>
                    <span className='block text-sm font-semibold leading-tight'>{stepLabel(step)}</span>
                    <span className={styles.tabNote}>{service?.note ?? (step === 'select-services' ? 'Choose what you need' : step === 'summary' ? 'Additional services' : 'Where should we come?')}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div id='quote-step-panel' role='tabpanel' aria-labelledby={`quote-tab-${flow.step}`}>
          <div className={styles.stepHeader}>
            <p className='text-xs font-semibold uppercase tracking-widest text-[#6c3fb8]'>Step {stepIndex + 1} of {steps.length} · Home / single building</p>
            <h3 id='wizard-step-heading' tabIndex={-1} className='mt-2 text-2xl font-semibold text-[#200b38]'>{stepLabel(flow.step)}</h3>
          </div>

          {flow.step === 'select-services' && (
            <div className={styles.flowPage}>
              <p className='text-gray-600'>Choose all the services you need. Each one becomes a step in your quote.</p>
              <fieldset className={styles.serviceChoices}>
                <legend className='sr-only'>Select services</legend>
                {quoteServices.map((service) => {
                  const selected = flow.selected.includes(service.slug);
                  return (
                    <label key={service.slug} className={styles.serviceChoice} data-on={selected || undefined}>
                      <input type='checkbox' checked={selected} onChange={(event) => selectService(service.slug, event.target.checked)} className='sr-only' />
                      <ServiceIcon slug={service.slug} draw='none' className='size-7 shrink-0 text-[#6c3fb8]' />
                      <span className='flex-1'><span className='block font-semibold'>{service.label}</span><span className='mt-1 block text-sm text-gray-500'>{service.note}</span></span>
                      <span aria-hidden='true' className={styles.addonBox}><Check /></span>
                    </label>
                  );
                })}
              </fieldset>
              <p role='status' className='mt-6 text-sm text-[#6c3fb8]'>{flow.selected.length ? `${flow.selected.length} service${flow.selected.length === 1 ? '' : 's'} selected. Continue to customize your quote.` : 'Select at least one service to continue.'}</p>
            </div>
          )}

          {tab && (
            <div className={styles.body}>
              <div className={styles.questions}>
                {(tab.slug === GUTTER_SERVICE || tab.slug === WINDOW_SERVICE) && (
                  <p className={styles.linkedNotice}>Home size is shared between window cleaning and gutters. Height is shared across window cleaning, gutters, and solar. Changes here update the linked answers.</p>
                )}
                {tab.slug === SOLAR_SERVICE && (
                  <p className={styles.linkedNotice}>Height is shared with window cleaning and gutters. Changing it here updates all three services.</p>
                )}
                {tab.mode === 'photo' && tab.photo ? (
                  <>
                    <div className={styles.why}><p className='font-semibold'>A photo helps us give you a real price</p><p className='mt-3 leading-relaxed text-gray-700'>{tab.photo.why}</p></div>
                    <ol className='space-y-3'>{tab.photo.steps.map((step, index) => (
                      <li key={step.title} className={styles.photoStep}><span aria-hidden='true' className={styles.photoNumber}>{index + 1}</span><span><span className='block font-semibold'>{step.title}</span><span className='block text-sm text-gray-600'>{step.text}</span></span></li>
                    ))}</ol>
                    <p className='text-sm text-gray-600'>{tab.photo.scope}</p>
                    <label className={styles.addon} data-on={flow.photoSent || undefined}>
                      <input type='checkbox' checked={flow.photoSent} onChange={(event) => { setFlow((current) => ({ ...current, photoSent: event.target.checked })); clearDownload(); }} className='sr-only' />
                      <span aria-hidden='true' className={styles.addonBox}><Check /></span>I’ve sent my photos
                    </label>
                    <p className='text-sm leading-relaxed text-gray-600'>Send your photos using the text or email buttons. You can finish this estimate now and send photos later; hard water removal is priced separately after review.</p>
                  </>
                ) : tab.questions.map((question, index) => (
                  <div key={question.id} className={styles.questionRise} style={{ '--o': index } as React.CSSProperties}>
                    <Question question={question} number={index + 1} value={tabValues[question.id]} onChange={(answer) => setAnswer(question.id, answer)} />
                  </div>
                ))}
                {tab.mode === 'range' && !rangeFor(tab, tabValues) && <p role='status' className='text-sm font-semibold text-[#6c3fb8]'>Choose at least one cleaning option to continue.</p>}
              </div>
              <aside aria-label={`${stepLabel(tab.slug)} price`} className={styles.panel}><PricePanel tab={tab} values={tabValues} /></aside>
            </div>
          )}

          {flow.step === 'summary' && (
            <div className={styles.flowPage}>
              <p className='text-gray-600'>Review each part of your quote. You can edit a service or add anything you missed.</p>
              <ul className={styles.reviewList}>
                {lines.map((line) => (
                  <li key={line.slug} className={styles.reviewLine}>
                    <div className='min-w-0 flex-1'><h4 className='font-semibold text-[#200b38]'>{stepLabel(line.slug)}</h4><p className='mt-1 text-sm text-gray-600'>{line.details}</p></div>
                    <strong className='whitespace-nowrap text-[#200b38]'>{line.range ? formatRange(line.range) : line.slug === PHOTO_SERVICE ? 'Photo quote' : 'Choose options'}</strong>
                    <div className='flex gap-4 text-sm font-semibold text-[#6c3fb8]'>
                      <button type='button' onClick={() => goTo(line.slug)} className={styles.textButton}>Edit<span className='sr-only'> {stepLabel(line.slug)}</span></button>
                      <button type='button' onClick={() => selectService(line.slug, false)} className={styles.textButton}>Remove<span className='sr-only'> {stepLabel(line.slug)}</span></button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.reviewTotal}><span className='font-semibold'>Estimated total{hasPhotoQuote && total ? ' for priced services' : ''}</span><strong className='text-3xl font-semibold'>{total ? formatRange(total) : 'Photo quote'}</strong></div>
              {hasPhotoQuote && <p className='mt-3 text-sm text-gray-600'>Hard water removal is quoted separately after photo review and is not included in the priced total.</p>}
              {incomplete.length > 0 && <p role='alert' className='mt-4 font-semibold text-[#6c3fb8]'>Choose cleaning options for {incomplete.map((entry) => stepLabel(entry.slug)).join(', ')} before completing your quote.</p>}
              <div className={styles.additionalServices}>
                <h4 className='text-xl font-semibold text-[#200b38]'>Forgot any services?</h4>
                <p className='mt-2 text-sm text-gray-600'>Add a service and jump straight to its questions.</p>
                <div className='mt-5 flex flex-wrap gap-3'>
                  {quoteServices.filter((service) => !flow.selected.includes(service.slug)).map((service) => (
                    <button key={service.slug} type='button' onClick={() => selectService(service.slug, true, true)} className={styles.addService}>+ Add {service.label.toLowerCase()}</button>
                  ))}
                  {flow.selected.length === quoteServices.length && <p className='text-sm text-[#6c3fb8]'>You’ve included all available services.</p>}
                </div>
              </div>
            </div>
          )}

          {flow.step === 'finalize' && canFinalize && (
            <div className={styles.finalize}>
              <EstimateSummary lines={lines} details={details} cities={cities}
                progress={progressFor(flow.selected.length, details, downloaded)} wipe={wipe} burst={burst} saving={saving} downloaded={downloaded} reference={reference}
                onDetail={setDetail} onRemove={(slug) => selectService(slug, false)} onRequest={sendRequest} onStartOver={startOver} />
            </div>
          )}
        </div>

        <div className={styles.flowFooter}>
          <button type='button' onClick={() => goTo(steps[stepIndex - 1])} disabled={stepIndex === 0 || saving} className={styles.backButton}>← Back</button>
          <span className='text-center text-xs text-gray-500'>{flow.selected.length} service{flow.selected.length === 1 ? '' : 's'} selected</span>
          {flow.step !== 'finalize' ? (
            <button type='button' disabled={Boolean(nextDisabled)} onClick={() => flow.step === 'summary' ? completeQuote() : goTo(steps[stepIndex + 1])} className={styles.nextButton}>
              {flow.step === 'summary' ? 'Complete quote' : 'Next'} →
            </button>
          ) : <button type='submit' form='instant-quote-contact' name='intent' value='send' disabled={saving || !contactReady} className={styles.nextButton}>
            {saving ? 'Sending request…' : 'Send quote to Clear Impressions'}
          </button>}
        </div>
        {downloadError && <p role='alert' className='px-6 pb-6 text-center text-red-700'>{downloadError}</p>}
      </div>
      <div className={styles.strip}>
        <p><span className='block font-semibold text-[#200b38]'>Rather talk it through?</span><a className='text-sm font-semibold text-[#6c3fb8] underline-offset-4 hover:underline' href={company.phoneHref}>Call or text {company.phone}</a></p>
        <p className='text-sm text-gray-600'>Free quotes · No sign-up needed · Serving the Phoenix metro</p>
      </div>
    </section>
  );
}
