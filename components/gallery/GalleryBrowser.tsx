'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, type CSSProperties } from 'react';
import QuoteButton from '@/components/quote/QuoteButton';
import {
  galleryJobTypes,
  galleryPage,
  type GalleryJob,
  type GalleryJobType,
} from '@/data/gallery';
import JobViewer from './JobViewer';
import styles from '@/app/gallery/gallery.module.css';

// A city on the map: its pin as a percentage across and down, and its outline.
export type GalleryCity = {
  name: string;
  href: string;
  x: number;
  y: number;
  outline: string;
  labelSide: 'left' | 'right';
};

type GalleryBrowserProps = {
  jobs: readonly GalleryJob[];
  cities: readonly GalleryCity[];
  mapSize: { width: number; height: number };
};

const jobsText = (count: number) => (count === 1 ? '1 job' : `${count} jobs`);

// The jobs on the Gallery page. The map and filters sit in the first spot of
// the grid, so jobs fill in beside them and carry on underneath.
// Tapping a city's pin shows only its jobs, and tapping it again shows every
// city. The type buttons narrow it down further.
export default function GalleryBrowser({ jobs, cities, mapSize }: GalleryBrowserProps) {
  const [city, setCity] = useState<string | null>(null);
  const [type, setType] = useState<GalleryJobType | 'all'>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const picked = cities.find((item) => item.name === city);
  const ofType = type === 'all' ? jobs : jobs.filter((job) => job.type === type);
  const inCity = city === null ? jobs : jobs.filter((job) => job.city === city);
  const shown = ofType.filter((job) => city === null || job.city === city);
  const openJob = jobs.find((job) => job.id === openId);
  const typeLabel = galleryJobTypes.find((item) => item.value === type)?.label.toLowerCase();

  // Counts follow the picked city. A type with no jobs there is hidden, unless it's picked.
  const filters = [
    { value: 'all' as const, label: 'All', count: inCity.length },
    ...galleryJobTypes.map(({ value, label }) => ({
      value,
      label,
      count: inCity.filter((job) => job.type === value).length,
    })),
  ].filter((filter) => filter.value === 'all' || filter.count > 0 || filter.value === type);

  // The picked city goes last so its gold edge sits on top of its neighbors.
  const outlines = [...cities].sort((first, second) =>
    Number(first.name === city) - Number(second.name === city),
  );

  const summary = `${jobsText(shown.length)}${typeLabel ? ` (${typeLabel})` : ''} ${picked ? `from ${picked.name}` : 'from across the Valley'}.`;
  const emptyText = picked
    ? `No ${typeLabel ? `${typeLabel} ` : ''}jobs from ${picked.name} posted yet.`
    : `No ${typeLabel ? `${typeLabel} ` : ''}jobs posted yet.`;

  return (
    <>
      <div className={styles.grid}>
        <div className={styles.side}>
          <h2
            id='jobs-heading'
            className='text-3xl font-semibold tracking-tight'>
            {picked ? picked.name : galleryPage.jobsHeading}
          </h2>
          <p
            aria-live='polite'
            className='mt-1.5 text-gray-600'>
            {summary}
          </p>

          <div
            role='group'
            aria-label='Filter jobs by type'
            className='mt-4 flex flex-wrap gap-2'>
            {filters.map((filter) => (
              <button
                key={filter.value}
                type='button'
                aria-pressed={filter.value === type}
                onClick={() => setType(filter.value)}
                className={styles.chip}>
                {filter.label}
                <span className={styles.chipCount}>{filter.count}</span>
              </button>
            ))}
          </div>

          {/* The Valley from the Locations header, without the route. The city
              outlines fade out toward the edges instead of being cut off.
              Clicking anywhere inside a city works like its pin. The pins stay
              as buttons for keyboards and screen readers, so the shapes are
              left out of both. */}
          {cities.length > 0 && (
            <div
              role='group'
              aria-label='Choose a city'
              className={styles.valley}
              style={{ aspectRatio: `${mapSize.width} / ${mapSize.height}` }}>
              <svg
                aria-hidden='true'
                viewBox={`0 0 ${mapSize.width} ${mapSize.height}`}>
                <defs>
                  <radialGradient id='gallery-valley-fade'>
                    <stop
                      offset='0.62'
                      stopColor='white'
                    />
                    <stop
                      offset='1'
                      stopColor='black'
                    />
                  </radialGradient>
                  <mask id='gallery-valley-mask'>
                    <rect
                      width={mapSize.width}
                      height={mapSize.height}
                      fill='url(#gallery-valley-fade)'
                    />
                  </mask>
                </defs>
                <g mask='url(#gallery-valley-mask)'>
                  {outlines.map((item) => (
                    <path
                      key={item.name}
                      d={item.outline}
                      onClick={() => setCity(item.name === city ? null : item.name)}
                      data-on={item.name === city || undefined}
                      className={styles.cityShape}
                    />
                  ))}
                </g>
              </svg>
              {cities.map((item, index) => {
                const count = ofType.filter((job) => job.city === item.name).length;
                const on = item.name === city;
                return (
                  <button
                    key={item.name}
                    type='button'
                    aria-pressed={on}
                    aria-label={`${item.name}, ${jobsText(count)}`}
                    // Tapping the picked city again goes back to every city.
                    onClick={() => setCity(on ? null : item.name)}
                    data-side={item.labelSide}
                    data-empty={count === 0 || undefined}
                    className={styles.pin}
                    style={{ left: `${item.x}%`, top: `${item.y}%`, '--i': index } as CSSProperties}>
                    <span
                      aria-hidden='true'
                      className={styles.pinHalo}
                    />
                    <span
                      aria-hidden='true'
                      className={styles.pinDot}
                    />
                    <span
                      aria-hidden='true'
                      className={styles.pinName}>
                      {item.name} <span className={styles.pinCount}>{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          <div className='flex flex-wrap items-center gap-x-4 gap-y-2 pt-3'>
            {picked ? (
              <>
                <button
                  type='button'
                  onClick={() => setCity(null)}
                  className={styles.chip}>
                  Show every city
                </button>
                <Link
                  href={picked.href}
                  className='inline-flex min-h-11 items-center font-semibold text-[#6c3fb8] hover:text-[#200b38]'>
                  Window cleaning in {picked.name} &gt;
                </Link>
              </>
            ) : (
              <p className='text-sm text-gray-600'>{galleryPage.mapHint}</p>
            )}
          </div>
        </div>

        {shown.map((job, index) => {
          const cover = job.media[0].photo;
          return (
            <button
              key={job.id}
              type='button'
              onClick={() => setOpenId(job.id)}
              aria-label={`Open job: ${job.title} in ${job.city}${job.media.length > 1 ? `, ${job.media.length} photos` : ''}`}
              data-size={job.size}
              className={styles.tile}
              style={{ '--i': index } as CSSProperties}>
              {cover && (
                <Image
                  src={cover.url}
                  alt=''
                  fill
                  sizes={job.size === 'wide' ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw'}
                  // Keep the part chosen in Studio in view when the photo is cropped.
                  style={cover.hotspot
                    ? { objectPosition: `${cover.hotspot.x * 100}% ${cover.hotspot.y * 100}%` }
                    : undefined}
                />
              )}
              <span
                aria-hidden='true'
                className={styles.tileShade}
              />
              {job.media.some((item) => item.video) && (
                <span className={styles.tileBadge}>
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='size-3.5'>
                    <path d='M8 5v14l11-7z' />
                  </svg>
                  Video
                </span>
              )}
              {job.media.length > 1 && (
                <span className={styles.tileCount}>{job.media.length} photos</span>
              )}
              <span className={styles.tileText}>
                <span className='block text-base font-semibold leading-snug'>{job.title}</span>
                <span className='mt-1 block text-sm text-white/85'>
                  {job.service ? `${job.service.title} · ` : ''}
                  {job.city}
                </span>
              </span>
            </button>
          );
        })}

        {shown.length === 0 && (
          <div className={styles.emptyTile}>
            <p className='text-lg font-semibold'>{emptyText}</p>
            {picked && (
              <p className='mt-1.5 max-w-sm text-gray-600'>We still clean here. Yours could be the first.</p>
            )}
            <QuoteButton className='mt-4 inline-flex min-h-12 items-center rounded-full bg-[#55ab68] px-6 font-semibold text-white hover:bg-[#4b9d5e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6c3fb8]'>
              Get a free quote
            </QuoteButton>
          </div>
        )}
      </div>

      {openJob && (
        <JobViewer
          key={openJob.id}
          job={openJob}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  );
}
