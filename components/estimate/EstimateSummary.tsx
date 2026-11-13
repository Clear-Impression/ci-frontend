'use client';

import Image from 'next/image';
import { company } from '@/data/company';
import { estimateNote, formatRange, totalRange, type EstimateLine } from '@/data/estimate';
import type { EstimateDetails } from '@/lib/estimateStore';
import styles from '@/app/estimate/calculator.module.css';

type EstimateSummaryProps = {
  lines: readonly EstimateLine[];
  details: EstimateDetails;
  cities: readonly string[];
  progress: number;
  // Goes up each time a service is added, to run the squeegee again.
  wipe: number;
  // Goes up after each download, for the gold sparks.
  burst: number;
  saving: boolean;
  downloaded: boolean;
  reference: string;
  onDetail: (field: keyof EstimateDetails, value: string) => void;
  onRemove: (slug: string) => void;
  onDownload: () => void;
  onStartOver: () => void;
};

// "Your estimate": who and where on the left, and on the right a dark card
// with every added service, the total, and a PDF summary to download. The
// window at the top of the card clears as the estimate fills in.
export default function EstimateSummary({
  lines,
  details,
  cities,
  progress,
  wipe,
  burst,
  saving,
  downloaded,
  reference,
  onDetail,
  onRemove,
  onDownload,
  onStartOver,
}: EstimateSummaryProps) {
  const total = totalRange(lines);
  const ready = lines.length > 0 && Boolean(details.name.trim() && details.city);
  const cityChoices = [...cities, 'Other'];

  return (
    <section
      id='your-estimate'
      aria-labelledby='summary-heading'
      className='mt-14 grid scroll-mt-28 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_25rem] lg:gap-14'>
      <div>
        <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>Your estimate</p>
        <h2
          id='summary-heading'
          className='mt-2 text-3xl font-semibold tracking-tight text-[#200b38] sm:text-4xl'>
          Where should we come?
        </h2>
        <p className='mt-3 max-w-lg leading-relaxed text-gray-600'>
          Add the services you want from the tabs above, then your name and city, and download a summary to share with us.
        </p>

        <div className='mt-8 grid gap-8 sm:grid-cols-2'>
          <div className={styles.lineField}>
            <input
              id='est-name'
              autoComplete='name'
              placeholder=' '
              value={details.name}
              onChange={(event) => onDetail('name', event.target.value)}
            />
            <label htmlFor='est-name'>Your name</label>
          </div>
          <div className={styles.lineField}>
            <input
              id='est-address'
              autoComplete='street-address'
              placeholder=' '
              value={details.address}
              onChange={(event) => onDetail('address', event.target.value)}
            />
            <label htmlFor='est-address'>Street address (optional)</label>
          </div>
        </div>

        <fieldset className='mt-8 min-w-0'>
          <legend className='text-sm font-medium text-[#200b38]'>City</legend>
          <div className='mt-3 flex flex-wrap gap-2'>
            {cityChoices.map((city) => {
              const picked = details.city === city;
              return (
                <label
                  key={city}
                  data-on={picked || undefined}
                  className={styles.cityChip}>
                  <input
                    type='radio'
                    name='est-city'
                    value={city}
                    checked={picked}
                    onChange={() => onDetail('city', city)}
                    className='sr-only'
                  />
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    className='size-4'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='1.8'
                    strokeLinecap='round'
                    strokeLinejoin='round'>
                    <path d='M12 21s-6-5.6-6-11a6 6 0 0 1 12 0c0 5.4-6 11-6 11z' />
                    <path d='M10 10a2 2 0 1 0 4 0a2 2 0 1 0-4 0' />
                  </svg>
                  {city === 'Other' ? 'Somewhere else' : city}
                </label>
              );
            })}
          </div>
          {details.city === 'Other' && (
            <p className='mt-3 text-sm text-gray-600'>We may still reach you. Call {company.phone} to check.</p>
          )}
        </fieldset>
      </div>

      <aside
        aria-label='Your estimate summary'
        className={styles.summary}>
        <div className={styles.summaryWindow}>
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
          <span
            aria-hidden='true'
            className='absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-[#200b38]'
          />
          <span
            aria-hidden='true'
            className='absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-[#200b38] to-transparent'
          />
          <span className='absolute bottom-3 left-6 text-xs font-semibold uppercase tracking-[0.25em] text-white/80'>
            {progress < 100 ? `${progress}% clear` : 'Crystal clear'}
          </span>
        </div>

        <div className='px-6 pb-7 pt-2 sm:px-7'>
          <p className='text-xs font-semibold uppercase tracking-[0.25em] text-[#efb52b]'>Your estimate</p>
          <p
            key={total ? formatRange(total) : 'none'}
            aria-live='polite'
            className={`${styles.pop} mt-1 text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl`}>
            {total ? formatRange(total) : lines.length > 0 ? 'Photo quote' : '$0'}
          </p>
          <p className='mt-1 text-sm text-white/60'>
            {lines.length === 0
              ? 'Add a service from the tabs above.'
              : `${lines.length} service${lines.length === 1 ? '' : 's'} · likely range`}
          </p>

          {lines.length > 0 && (
            <ul className='mt-6 space-y-3'>
              {lines.map((line) => (
                <li
                  key={line.slug}
                  className={styles.receiptLine}>
                  <div className='flex items-baseline gap-2 text-sm'>
                    <span className='font-medium'>{line.name}</span>
                    <span
                      aria-hidden='true'
                      className={`${styles.leader} flex-1`}
                    />
                    <span className='whitespace-nowrap font-semibold tabular-nums'>
                      {line.range ? formatRange(line.range) : 'From a photo'}
                    </span>
                  </div>
                  <div className='mt-0.5 flex items-start justify-between gap-3'>
                    <p className='text-xs text-white/50'>{line.details}</p>
                    <button
                      type='button'
                      onClick={() => onRemove(line.slug)}
                      className='shrink-0 text-xs font-semibold text-white/50 underline-offset-4 hover:text-white hover:underline'>
                      Remove<span className='sr-only'> {line.name}</span>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <div className='relative mt-7'>
            <button
              type='button'
              onClick={onDownload}
              disabled={saving || lines.length === 0}
              className={styles.goldButton}>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className='size-4'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M12 4v11M7 10.5l5 5 5-5M5 20h14' />
              </svg>
              {saving ? 'Preparing your PDF…' : downloaded ? 'Download again' : 'Download PDF summary'}
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
          {lines.length > 0 && !ready && (
            <p className='mt-3 text-center text-xs text-white/60'>Add your name and city to download.</p>
          )}
          {downloaded && (
            <p
              role='status'
              className='mt-3 text-center text-sm text-[#efb52b]'>
              Saved{reference ? ` · reference ${reference}` : ''}
            </p>
          )}
          <a
            href={company.phoneHref}
            className={styles.panelSecondary}>
            Call or text {company.phone}
          </a>

          <ul className='mt-6 space-y-2 text-sm text-white/70'>
            <li className='flex gap-2'>
              <span
                aria-hidden='true'
                className='text-[#efb52b]'>
                ✓
              </span>
              No email or sign-up needed
            </li>
            <li className='flex gap-2'>
              <span
                aria-hidden='true'
                className='text-[#efb52b]'>
                ✓
              </span>
              {estimateNote}
            </li>
          </ul>
          {(lines.length > 0 || details.name) && (
            <button
              type='button'
              onClick={onStartOver}
              className='mt-5 text-xs font-semibold text-white/50 underline-offset-4 hover:text-white hover:underline'>
              Start over
            </button>
          )}
        </div>
      </aside>
    </section>
  );
}
