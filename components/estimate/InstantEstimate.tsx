'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import ServiceIcon from '@/components/services/ServiceIcon';
import { company } from '@/data/company';
import {
  describeItem,
  estimateCities,
  estimateNote,
  estimateServices,
  formatAmount,
  formatMoney,
  getEstimateService,
  priceFor,
  startingItem,
  totalFor,
  type CartItem,
} from '@/data/estimate';
import { downloadEstimatePdf, type EstimateDetails } from './estimatePdf';
import HelpBubble from './HelpBubble';
import Odometer from './Odometer';
import Segmented from './Segmented';
import SizeInput from './SizeInput';
import styles from '@/app/estimate/estimate.module.css';

type Saved = {
  open: boolean;
  details: EstimateDetails;
  cart: CartItem[];
  downloaded: boolean;
};

const storageKey = 'ci-instant-estimate-v2';
const emptyState: Saved = {
  open: false,
  details: { name: '', address: '', city: '' },
  cart: [],
  downloaded: false,
};

// How far along the visitor is, from 0 to 100.
function progressFor(state: Saved) {
  let value = 0;
  if (state.cart.length > 0) value += 35;
  if (state.details.name.trim()) value += 20;
  if (state.details.city) value += 20;
  if (state.details.address.trim()) value += 5;
  if (state.downloaded) value += 20;
  return value;
}

// The one thing to do next, shown in the floating progress pill.
function nextStep(state: Saved) {
  if (state.cart.length === 0) return 'Pick a service to start';
  if (!state.details.name.trim()) return 'Add your name';
  if (!state.details.city) return 'Choose your city';
  if (!state.downloaded) return 'Download your summary';
  return 'All set. Call us to book!';
}

function StepTitle({ number, title, note }: { number: string; title: string; note?: string }) {
  return (
    <div className='flex items-end gap-4'>
      <span
        aria-hidden='true'
        className={`${styles.stepNumber} text-5xl font-semibold leading-none tracking-tight sm:text-6xl`}>
        {number}
      </span>
      <div className='pb-1'>
        <h3 className='text-2xl font-semibold tracking-tight text-[#200b38] sm:text-3xl'>{title}</h3>
        {note && <p className='mt-1 text-sm text-gray-600'>{note}</p>}
      </div>
    </div>
  );
}

export default function InstantEstimate() {
  const [state, setState] = useState<Saved>(emptyState);
  const [loaded, setLoaded] = useState(false);
  const [wipe, setWipe] = useState(0);
  const [saving, setSaving] = useState(false);
  const [reference, setReference] = useState('');
  const [burst, setBurst] = useState(0);
  const builderRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  // Keep progress if the page is refreshed. Storage can be blocked, so fail quietly.
  useEffect(() => {
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring saved progress once on load
      if (saved) setState({ ...emptyState, ...JSON.parse(saved) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.sessionStorage.setItem(storageKey, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  const total = totalFor(state.cart);
  const progress = progressFor(state);
  const ready = state.cart.length > 0 && Boolean(state.details.name.trim() && state.details.city);

  const patch = (next: Partial<Saved>) => setState((current) => ({ ...current, ...next }));

  const setDetail = (field: keyof EstimateDetails, value: string) =>
    setState((current) => ({ ...current, details: { ...current.details, [field]: value }, downloaded: false }));

  const open = () => {
    patch({ open: true });
    requestAnimationFrame(() =>
      builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    );
  };

  // Add or remove a service. Adding one runs a squeegee across the window.
  const toggleService = (slug: string) => {
    const service = getEstimateService(slug);
    if (!service) return;
    const has = state.cart.some((item) => item.slug === slug);
    setState((current) => ({
      ...current,
      cart: has ? current.cart.filter((item) => item.slug !== slug) : [...current.cart, startingItem(service)],
      downloaded: false,
    }));
    if (!has) setWipe((count) => count + 1);
  };

  const updateItem = (slug: string, change: Partial<CartItem>) =>
    setState((current) => ({
      ...current,
      cart: current.cart.map((item) => (item.slug === slug ? { ...item, ...change } : item)),
      downloaded: false,
    }));

  const download = async () => {
    if (!ready) {
      detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSaving(true);
    try {
      const ref = await downloadEstimatePdf(state.details, state.cart, total);
      setReference(ref);
      setBurst((count) => count + 1);
      patch({ downloaded: true });
    } finally {
      setSaving(false);
    }
  };

  const startOver = () => {
    setState({ ...emptyState, open: true });
    setReference('');
    builderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {/* Two ways to get a price. */}
      <section
        aria-labelledby='options-heading'
        className={`mx-auto max-w-7xl px-6 pt-14 sm:px-8 sm:pt-16 ${state.open ? '' : 'pb-20'}`}>
        <h2
          id='options-heading'
          className='sr-only'>
          Choose how to get your price
        </h2>
        <div className='grid gap-5 lg:grid-cols-[1.35fr_1fr]'>
          <button
            type='button'
            onClick={open}
            aria-expanded={state.open}
            className={`${styles.optionHero} group relative isolate overflow-hidden rounded-[2rem] p-8 text-left text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] sm:p-10`}>
            <span aria-hidden='true' className={`${styles.heroGlow} absolute inset-0 -z-10`} />
            {/* A little receipt that keeps adding lines, as a preview of what's inside. */}
            <span
              aria-hidden='true'
              className={`${styles.ticker} absolute right-8 top-8 hidden w-52 rounded-2xl p-4 text-xs sm:block`}>
              <span className='flex justify-between'><span>Windows</span><span>$215</span></span>
              <span className='mt-2 flex justify-between'><span>Solar panels</span><span>$140</span></span>
              <span className='mt-2 flex justify-between'><span>Screens</span><span>$70</span></span>
              <span className='mt-3 flex justify-between border-t border-white/15 pt-2 font-semibold text-[#efb52b]'><span>Total</span><span>$425</span></span>
            </span>
            <span className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#efb52b]'>
              <span className={`${styles.liveDot} size-1.5 rounded-full bg-[#efb52b]`} />
              Instant · about 2 minutes
            </span>
            <span className='mt-6 block max-w-sm text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl'>
              Get an instant estimate.
            </span>
            <span className='mt-4 block max-w-sm leading-relaxed text-white/75'>
              Pick your services, slide to your size, and watch the price build. No email needed.
            </span>
            <span className='mt-8 inline-flex items-center gap-3 rounded-full bg-[#efb52b] py-2 pl-5 pr-2 font-semibold text-[#200b38]'>
              {state.open ? 'Jump to my estimate' : 'Start my estimate'}
              <span className={`${styles.arrowBubble} grid size-8 place-items-center rounded-full bg-[#200b38] text-[#efb52b]`}>
                <span aria-hidden='true'>↓</span>
              </span>
            </span>
          </button>

          <Link
            href={company.quoteFormUrl}
            className={`${styles.optionSoft} group relative flex flex-col justify-between overflow-hidden rounded-[2rem] p-8 text-[#200b38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8] sm:p-10`}>
            <span>
              <span className='inline-flex rounded-full bg-[#6c3fb8]/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#6c3fb8]'>
                Exact price
              </span>
              <span className='mt-6 block text-3xl font-semibold leading-tight tracking-tight sm:text-4xl'>
                Request a free quote.
              </span>
              <span className='mt-4 block max-w-sm leading-relaxed text-gray-600'>
                Tell us about your property and we&rsquo;ll send an exact price, from photos or a quick visit.
              </span>
            </span>
            <span className='mt-8 inline-flex items-center gap-2 font-semibold text-[#6c3fb8]'>
              Open the quote form
              <span aria-hidden='true' className={styles.arrowSlide}>↗</span>
            </span>
          </Link>
        </div>
      </section>

      <div
        ref={builderRef}
        className='scroll-mt-24'>
        {state.open && (
          <section
            aria-label='Instant estimate'
            className={`${styles.builder} mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 px-6 pb-32 pt-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-14`}>
            <div className='min-w-0 space-y-16'>
              {/* 01: services */}
              <div>
                <StepTitle
                  number='01'
                  title='What needs cleaning?'
                  note='Pick as many as you like.'
                />
                <div className='mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3'>
                  {estimateServices.map((service, index) => {
                    const on = state.cart.some((item) => item.slug === service.slug);
                    return (
                      <button
                        key={service.slug}
                        type='button'
                        aria-pressed={on}
                        onClick={() => toggleService(service.slug)}
                        style={{ '--n': index } as React.CSSProperties}
                        className={`${styles.tile} ${on ? styles.tileOn : ''} group relative flex flex-col items-start rounded-3xl p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] sm:p-5`}>
                        <span className={`${styles.tileIcon} grid size-11 place-items-center rounded-2xl`}>
                          <ServiceIcon
                            slug={service.slug}
                            draw='none'
                            className='size-6'
                          />
                        </span>
                        <span className='mt-4 text-sm font-semibold leading-snug sm:text-base'>{service.name}</span>
                        <span className={`${styles.tileMeta} mt-1 text-xs`}>From {formatMoney(service.minimum)}</span>
                        <span
                          aria-hidden='true'
                          className={`${styles.tileCheck} absolute right-3 top-3 grid size-6 place-items-center rounded-full bg-[#efb52b] text-xs font-bold text-[#200b38]`}>
                          ✓
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 02: size and options for each picked service */}
              <div>
                <StepTitle
                  number='02'
                  title='Dial it in.'
                  note='Slide to your size. The price updates as you go.'
                />
                {state.cart.length === 0 ? (
                  <p className={`${styles.hint} mt-8 flex items-center gap-3 text-gray-500`}>
                    <span aria-hidden='true' className={styles.hintArrow}>↑</span>
                    Pick a service above and its options appear here.
                  </p>
                ) : (
                  <ul className='mt-8 space-y-5'>
                    {state.cart.map((item) => {
                      const service = getEstimateService(item.slug);
                      if (!service) return null;
                      const fill = ((item.amount - service.measure.min) / (service.measure.max - service.measure.min)) * 100;
                      const inputId = `size-${service.slug}`;
                      return (
                        <li
                          key={item.slug}
                          className={`${styles.editor} rounded-[1.75rem] bg-white p-6 shadow-[0_20px_50px_-30px_rgb(32_11_56/0.35)] sm:p-8`}>
                          <div className='flex items-start justify-between gap-4'>
                            <div className='flex min-w-0 items-center gap-3'>
                              <span className='grid size-11 shrink-0 place-items-center rounded-2xl bg-[#200b38] text-[#efb52b]'>
                                <ServiceIcon
                                  slug={service.slug}
                                  draw='none'
                                  className='size-6'
                                />
                              </span>
                              <div>
                                <h4 className='font-semibold leading-snug text-[#200b38]'>{service.name}</h4>
                                <p className='hidden text-sm text-gray-500 sm:block'>{service.summary}</p>
                              </div>
                            </div>
                            <div className='flex shrink-0 items-center gap-2'>
                              <Odometer
                                text={formatMoney(priceFor(item))}
                                className='text-xl font-semibold text-[#6c3fb8]'
                              />
                              <button
                                type='button'
                                onClick={() => toggleService(service.slug)}
                                className='grid size-8 place-items-center rounded-full text-gray-400 transition hover:rotate-90 hover:bg-[#f7f4fb] hover:text-[#200b38] focus-visible:outline-2 focus-visible:outline-[#6c3fb8]'>
                                <span aria-hidden='true'>✕</span>
                                <span className='sr-only'>Remove {service.name}</span>
                              </button>
                            </div>
                          </div>

                          <div className='mt-7'>
                            <div className='flex items-end justify-between gap-4'>
                              <label
                                htmlFor={`${inputId}-typed`}
                                className='text-sm font-medium text-[#200b38]'>
                                {service.measure.label}
                                <span className='block text-xs font-normal text-gray-500'>Type it in or use the slider</span>
                              </label>
                              <SizeInput
                                id={`${inputId}-typed`}
                                measure={service.measure}
                                value={item.amount}
                                onChange={(amount) => updateItem(item.slug, { amount })}
                              />
                            </div>
                            <input
                              id={inputId}
                              type='range'
                              aria-label={`${service.measure.label} slider`}
                              min={service.measure.min}
                              max={service.measure.max}
                              step={service.measure.step}
                              value={item.amount}
                              onChange={(event) => updateItem(item.slug, { amount: Number(event.target.value) })}
                              aria-valuetext={formatAmount(item.amount, service.measure.unit)}
                              className={`${styles.range} mt-4 w-full`}
                              style={{ '--fill': `${fill}%` } as React.CSSProperties}
                            />
                            <div className='mt-1 flex justify-between text-xs text-gray-400'>
                              <span>{service.measure.min.toLocaleString('en-US')}</span>
                              <span>{service.measure.max.toLocaleString('en-US')}+</span>
                            </div>
                          </div>

                          {service.choices && (
                            <div className='mt-7 grid gap-6 sm:grid-cols-2'>
                              {service.choices.map((choice) => (
                                <div
                                  key={choice.id}
                                  className={choice.cards ? 'sm:col-span-2' : ''}>
                                  <Segmented
                                    choice={choice}
                                    value={item.picks[choice.id]}
                                    onChange={(value) => updateItem(item.slug, { picks: { ...item.picks, [choice.id]: value } })}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* 03: who and where */}
              <div
                ref={detailsRef}
                className='scroll-mt-28'>
                <StepTitle
                  number='03'
                  title='Where should we come?'
                  note='So your summary is ready to share with us.'
                />
                <div className='mt-8 grid gap-8 sm:grid-cols-2'>
                  <div className={styles.lineField}>
                    <input
                      id='est-name'
                      autoComplete='name'
                      placeholder=' '
                      value={state.details.name}
                      onChange={(event) => setDetail('name', event.target.value)}
                      className='peer'
                    />
                    <label htmlFor='est-name'>Your name</label>
                  </div>
                  <div className={styles.lineField}>
                    <input
                      id='est-address'
                      autoComplete='street-address'
                      placeholder=' '
                      value={state.details.address}
                      onChange={(event) => setDetail('address', event.target.value)}
                      className='peer'
                    />
                    <label htmlFor='est-address'>Street address (optional)</label>
                  </div>
                </div>
                <fieldset className='mt-8 min-w-0'>
                  <legend className='text-sm font-medium text-[#200b38]'>City</legend>
                  <div className='mt-3 flex flex-wrap gap-2'>
                    {estimateCities.map((city, index) => {
                      const picked = state.details.city === city;
                      return (
                        <label
                          key={city}
                          style={{ '--n': index } as React.CSSProperties}
                          className={`${styles.cityChip} ${picked ? styles.cityChipOn : ''} inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-[#6c3fb8]`}>
                          <input
                            type='radio'
                            name='est-city'
                            value={city}
                            checked={picked}
                            onChange={() => setDetail('city', city)}
                            className='sr-only'
                          />
                          <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4' fill='none' stroke='currentColor' strokeWidth='1.8' strokeLinecap='round' strokeLinejoin='round'>
                            <path d='M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z' />
                            <path d='M10 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0' />
                          </svg>
                          {city === 'Other' ? 'Somewhere else' : city}
                        </label>
                      );
                    })}
                  </div>
                  {state.details.city === 'Other' && (
                    <p className='mt-3 text-sm text-gray-600'>We may still reach you. Call {company.phone} to check.</p>
                  )}
                </fieldset>
              </div>
            </div>

            {/* The live price, with a window that clears as the estimate fills in. */}
            <aside
              ref={panelRef}
              aria-label='Your estimate'
              className={`${styles.panel} scroll-mt-28 overflow-hidden rounded-[2rem] bg-[#200b38] text-white lg:sticky lg:top-28`}>
              <div className={`${styles.window} relative h-40 overflow-hidden`}>
                <Image
                  src='/images/home/window-cleaning.webp'
                  alt=''
                  fill
                  sizes='400px'
                  className='object-cover'
                />
                <span
                  aria-hidden='true'
                  className={styles.fog}
                  style={{ opacity: Math.max(0, 1 - progress / 100) }}
                />
                {wipe > 0 && (
                  <span
                    key={wipe}
                    aria-hidden='true'
                    className={styles.squeegee}
                  />
                )}
                <span aria-hidden='true' className='absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-[#200b38]' />
                <span aria-hidden='true' className='absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#200b38] to-transparent' />
                <span className='absolute bottom-3 left-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
                  {progress < 100 ? `${progress}% clear` : 'Crystal clear'}
                </span>
              </div>

              <div className='px-6 pb-6 pt-2 sm:px-7'>
                <p className='text-xs font-semibold uppercase tracking-[0.25em] text-[#efb52b]'>Your estimate</p>
                <p
                  aria-live='polite'
                  className='mt-1 text-6xl font-semibold tracking-tight'>
                  <Odometer text={formatMoney(total)} />
                </p>
                <p className='mt-1 text-sm text-white/60'>
                  {state.cart.length === 0
                    ? 'Pick a service to start.'
                    : `${state.cart.length} service${state.cart.length === 1 ? '' : 's'} · ballpark price`}
                </p>

                {state.cart.length > 0 && (
                  <ul className='mt-6 space-y-3'>
                    {state.cart.map((item) => {
                      const service = getEstimateService(item.slug);
                      if (!service) return null;
                      return (
                        <li
                          key={item.slug}
                          className={styles.receiptLine}>
                          <div className='flex items-baseline gap-2 text-sm'>
                            <span className='font-medium'>{service.name}</span>
                            <span aria-hidden='true' className={`${styles.leader} flex-1`} />
                            <span className='font-semibold tabular-nums'>{formatMoney(priceFor(item))}</span>
                          </div>
                          <p className='mt-0.5 text-xs text-white/50'>{describeItem(item)}</p>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className='relative mt-7'>
                  <button
                    type='button'
                    onClick={download}
                    disabled={saving || state.cart.length === 0}
                    className={`${styles.goldButton} relative flex min-h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#efb52b] px-6 font-semibold text-[#200b38] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-40`}>
                    <svg aria-hidden='true' viewBox='0 0 24 24' className='size-4' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                      <path d='M12 4v11M7 10.5l5 5 5-5M5 20h14' />
                    </svg>
                    {saving ? 'Preparing your PDF…' : state.downloaded ? 'Download again' : 'Download PDF summary'}
                  </button>
                  {burst > 0 && (
                    <span
                      key={burst}
                      aria-hidden='true'
                      className={styles.burst}>
                      {Array.from({ length: 10 }, (_, index) => (
                        <span
                          key={index}
                          style={{ '--a': `${index * 36}deg` } as React.CSSProperties}
                        />
                      ))}
                    </span>
                  )}
                </div>
                {state.cart.length > 0 && !ready && (
                  <p className='mt-3 text-center text-xs text-white/60'>Add your name and city in step 03 to download.</p>
                )}
                {state.downloaded && (
                  <p
                    role='status'
                    className='mt-3 text-center text-sm text-[#efb52b]'>
                    Saved{reference ? ` · reference ${reference}` : ''}
                  </p>
                )}
                <a
                  href={company.phoneHref}
                  className='mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 px-6 text-sm font-semibold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white'>
                  Call or text {company.phone}
                </a>

                <ul className='mt-6 space-y-2 text-sm text-white/70'>
                  <li className='flex gap-2'><span aria-hidden='true' className='text-[#efb52b]'>✓</span>No email or sign-up needed</li>
                  <li className='flex gap-2'><span aria-hidden='true' className='text-[#efb52b]'>✓</span>{estimateNote}</li>
                </ul>
                {(state.cart.length > 0 || state.details.name) && (
                  <button
                    type='button'
                    onClick={startOver}
                    className='mt-5 text-xs font-semibold text-white/50 underline-offset-4 hover:text-white hover:underline'>
                    Start over
                  </button>
                )}
              </div>
            </aside>
          </section>
        )}
      </div>

      {/* Floating progress pill while estimating. */}
      {state.open && (
        <div className='pointer-events-none sticky bottom-4 z-30 px-4 pb-2 sm:bottom-6'>
          <div className={`${styles.pill} pointer-events-auto relative mx-auto flex max-w-2xl items-center gap-4 overflow-hidden rounded-full bg-[#200b38]/95 py-2.5 pl-6 pr-2.5 text-white shadow-2xl shadow-[#200b38]/40 backdrop-blur`}>
            <div className='min-w-0 flex-1'>
              <p className='truncate text-xs text-white/60'>
                <span className='font-semibold text-white'>{progress}%</span> · {nextStep(state)}
              </p>
              <div
                role='progressbar'
                aria-label='Estimate progress'
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className='mt-1.5 h-1.5 overflow-hidden rounded-full bg-white/15'>
                <div
                  className={`${styles.pillFill} h-full rounded-full`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className='shrink-0 text-right'>
              <p className='text-[0.65rem] font-semibold uppercase tracking-widest text-white/50'>Estimate</p>
              <p className='text-lg font-semibold leading-tight text-[#efb52b]'>
                <Odometer text={formatMoney(total)} />
              </p>
            </div>
            <button
              type='button'
              onClick={() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className='shrink-0 rounded-full bg-white/10 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'>
              Review
            </button>
          </div>
        </div>
      )}

      <HelpBubble raised={state.open} />
    </>
  );
}
