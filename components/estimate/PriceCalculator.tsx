'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ServiceIcon from '@/components/services/ServiceIcon';
import { company } from '@/data/company';
import {
  describeValues,
  estimateNote,
  estimateTabs,
  formatAmount,
  formatRange,
  getEstimateTab,
  rangeFor,
  startingValues,
  type EstimateQuestion,
  type EstimateTab,
  type EstimateValues,
} from '@/data/estimate';
import { loadEstimate, saveEstimate } from '@/lib/estimateStore';
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
    const fill = ((amount - question.min) / (question.max - question.min)) * 100;
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
          <p className='whitespace-nowrap text-[#200b38]'>
            <span className='text-4xl font-semibold tabular-nums tracking-tight'>{amount.toLocaleString('en-US')}</span>
            <span className='ml-1.5 text-sm text-gray-500'>{question.unit}</span>
          </p>
        </div>
        <input
          id={id}
          type='range'
          min={question.min}
          max={question.max}
          step={question.step}
          value={amount}
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

// The dark panel on the right: the price range (or the photo promise), the
// service's own explanation, and ways to book.
function PricePanel({ tab, values }: { tab: EstimateTab; values: EstimateValues }) {
  const range = rangeFor(tab, values);
  const learnMore = (
    <Link
      href={`/services/${tab.slug}`}
      className='font-semibold text-white underline decoration-[#efb52b] underline-offset-4 hover:text-[#efb52b]'>
      {tab.panel.learnMore} →
    </Link>
  );

  if (tab.mode === 'photo') {
    return (
      <>
        <p className={styles.panelEyebrow}>What you get back</p>
        <p className={styles.panelBig}>A real price</p>
        <p className='mt-4 leading-relaxed text-white/80'>{tab.panel.text}</p>
        <a
          href={sms(`Hi! I'd like a ${tab.name.toLowerCase()} quote. Here are photos of my windows:`)}
          className={styles.panelPrimary}>
          <svg
            aria-hidden='true'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1.8'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='size-5'>
            <path d='M4 8h3l1.5-2h7L17 8h3v11H4z' />
            <circle
              cx='12'
              cy='13'
              r='3.5'
            />
          </svg>
          {tab.panel.textCta}
        </a>
        <a
          href={`${company.emailHref}?subject=${encodeURIComponent(`${tab.name} quote`)}`}
          className={styles.panelSecondary}>
          Email the photos instead
        </a>
        <p className='mt-6 text-sm text-white/65'>No charge for the quote. {learnMore}</p>
      </>
    );
  }

  return (
    <>
      <p className={styles.panelEyebrow}>Likely lands between</p>
      <p
        key={range ? formatRange(range) : 'none'}
        aria-live='polite'
        className={`${styles.panelBig} ${styles.pop}`}>
        {range ? formatRange(range) : 'Pick an option'}
      </p>
      <p className='mt-4 leading-relaxed text-white/80'>{tab.panel.text}</p>
      <a
        href={
          range
            ? sms(`Hi! I'd like to book ${tab.name}. My instant estimate was ${formatRange(range)} (${describeValues(tab, values)}).`)
            : sms(`Hi! I'd like a quote for ${tab.name}.`)
        }
        className={styles.panelPrimary}>
        <svg
          aria-hidden='true'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='size-5'>
          <path d='M4.5 5.5h15v10h-9l-5 4v-4h-1z' />
        </svg>
        {tab.panel.textCta}
      </a>
      <a
        href={company.phoneHref}
        className={styles.panelSecondary}>
        Call {company.phone}
      </a>
      <ul className='mt-6 space-y-2 text-sm text-white/80'>
        <li className='flex items-center gap-2'>
          <span className='text-[#efb52b]'>
            <Check />
          </span>
          No email or sign-up needed
        </li>
        <li className='flex items-center gap-2'>
          <span className='text-[#efb52b]'>
            <Check />
          </span>
          Free on-site or photo quote to confirm
        </li>
      </ul>
      <p className='mt-6 text-sm leading-relaxed text-white/65'>
        {estimateNote} {learnMore}
      </p>
    </>
  );
}

// "Get your price": a tab for each service. Each tab asks its own questions
// with its own hints, and the dark panel explains that service and prices it
// as a range. Stain removal is quoted from a photo instead.
export default function PriceCalculator() {
  const [active, setActive] = useState(estimateTabs[0].slug);
  const [values, setValues] = useState<Record<string, EstimateValues>>({});
  const [loaded, setLoaded] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const started = useRef(false);
  const tab = getEstimateTab(active) ?? estimateTabs[0];
  const tabValues = values[tab.slug] ?? startingValues(tab);

  // Pick up where they left off, or open the tab a link asked for.
  useEffect(() => {
    // Only once, even when React runs effects twice in development.
    if (started.current) return;
    started.current = true;
    const saved = loadEstimate();
    const params = new URLSearchParams(window.location.search);
    const asked = params.get('service');
    /* eslint-disable react-hooks/set-state-in-effect -- restoring saved answers once on load */
    if (saved) {
      setValues(saved.values ?? {});
      if (getEstimateTab(saved.tab)) setActive(saved.tab);
    }
    if (asked && getEstimateTab(asked)) setActive(asked);
    setLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    if (asked || params.has('start')) {
      window.history.replaceState(null, '', window.location.pathname);
      window.setTimeout(() => rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const current = getEstimateTab(active) ?? estimateTabs[0];
    saveEstimate({ tab: active, values: { ...values, [current.slug]: values[current.slug] ?? startingValues(current) } });
  }, [loaded, active, values]);

  const setAnswer = (id: string, answer: EstimateValues[string]) =>
    setValues((current) => ({ ...current, [tab.slug]: { ...(current[tab.slug] ?? startingValues(tab)), [id]: answer } }));

  // Arrow keys move between tabs.
  const onTabsKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const index = estimateTabs.findIndex((entry) => entry.slug === active);
    const next = estimateTabs[(index + step + estimateTabs.length) % estimateTabs.length];
    setActive(next.slug);
    document.getElementById(`tab-${next.slug}`)?.focus();
  };

  return (
    <section
      ref={rootRef}
      aria-labelledby='price-heading'
      className='mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-8 sm:py-16'>
      <div className={styles.shell}>
        <div className={styles.top}>
          <div className='flex flex-wrap items-center gap-3'>
            <h2
              id='price-heading'
              className='text-2xl font-semibold tracking-tight text-[#200b38] sm:text-3xl'>
              Get your price
            </h2>
            <span className={styles.badge}>
              <Check /> No email needed
            </span>
          </div>
          <div
            role='tablist'
            aria-label='Services'
            onKeyDown={onTabsKeyDown}
            className={styles.tabs}>
            {estimateTabs.map((entry) => {
              const on = entry.slug === active;
              return (
                <button
                  key={entry.slug}
                  id={`tab-${entry.slug}`}
                  type='button'
                  role='tab'
                  aria-selected={on}
                  aria-controls='price-panel'
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(entry.slug)}
                  className={styles.tab}>
                  <ServiceIcon
                    slug={entry.slug}
                    draw='none'
                    className='size-5 shrink-0'
                  />
                  <span className='text-left'>
                    <span className='block text-sm font-semibold leading-tight'>{entry.tab}</span>
                    <span className={styles.tabNote}>{entry.tabNote}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div
          id='price-panel'
          role='tabpanel'
          aria-labelledby={`tab-${tab.slug}`}
          key={tab.slug}
          className={styles.body}>
          <div className={styles.questions}>
            {tab.mode === 'photo' && tab.photo ? (
              <>
                <div className={styles.why}>
                  <p className='text-xs font-semibold uppercase tracking-[0.16em] text-[#6c3fb8]'>Why there’s no slider here</p>
                  <p className='mt-3 leading-relaxed text-gray-700'>{tab.photo.why}</p>
                </div>
                <ol className='space-y-3'>
                  {tab.photo.steps.map((step, index) => (
                    <li
                      key={step.title}
                      className={styles.photoStep}
                      style={{ '--o': index } as React.CSSProperties}>
                      <span
                        aria-hidden='true'
                        className={styles.photoNumber}>
                        {index + 1}
                      </span>
                      <span>
                        <span className='block font-semibold text-[#200b38]'>{step.title}</span>
                        <span className='block text-sm text-gray-600'>{step.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
                <p className='text-sm leading-relaxed text-gray-600'>{tab.photo.scope}</p>
              </>
            ) : (
              tab.questions.map((question, index) => (
                <div
                  key={question.id}
                  className={styles.questionRise}
                  style={{ '--o': index } as React.CSSProperties}>
                  <Question
                    question={question}
                    number={index + 1}
                    value={tabValues[question.id]}
                    onChange={(answer) => setAnswer(question.id, answer)}
                  />
                </div>
              ))
            )}
          </div>

          <aside
            aria-label={`${tab.name} price`}
            className={styles.panel}>
            <PricePanel
              tab={tab}
              values={tabValues}
            />
          </aside>
        </div>
      </div>

      <div className={styles.strip}>
        <p className='text-[#200b38]'>
          <span className='block font-semibold'>Rather talk it through?</span>
          <span className='text-gray-600'>
            Call or text{' '}
            <a
              href={company.phoneHref}
              className='font-semibold text-[#6c3fb8] underline underline-offset-4'>
              {company.phone}
            </a>
          </span>
        </p>
        <ul className='flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#200b38]'>
          {['Free quotes', 'No email needed', 'Serving the Phoenix metro'].map((item) => (
            <li
              key={item}
              className='flex items-center gap-2'>
              <span className='text-[#6c3fb8]'>
                <Check />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
