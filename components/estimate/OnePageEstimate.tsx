'use client';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { requestAppointment, type AppointmentResult } from '@/app/estimate/actions';
import LeaveOffer from '@/components/estimate/LeaveOffer';
import { company } from '@/data/company';
import { rangeFor, startingValues, type EstimateTab, type EstimateValues } from '@/data/estimate';
import {
  bonusOffer,
  clearClub,
  clearPricePromise,
  clubPlans,
  extras,
  formatDollars,
  formatRange,
  homeFromValues,
  packagePrice,
  packages,
  paymentNote,
  upgradeNotes,
  type ClubPlan,
  type ExtraId,
  type PackageId,
  type Range,
} from '@/data/packages';
import type { Availability } from '@/lib/availability';
import './one-page-estimate.css';

const windowsSlug = 'residential-window-washing';
const screensSlug = 'screen-deep-cleaning';
// The windows questions asked here; sides and screens come from the package.
const windowsQuestions = ['size', 'style', 'height', 'dirt'];

const times = [
  { id: 'Morning', hint: '8 am to 12 pm' },
  { id: 'Afternoon', hint: '12 to 4 pm' },
  { id: 'Either', hint: 'Whatever works' },
] as const;

const phonePattern = String.raw`\+?(?:[\(\). \-]*[0-9]){7,15}[\(\). \-]*`;

const longDay = (iso: string) =>
  new Date(`${iso}T12:00:00-07:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Phoenix',
  });

const shortDay = (iso: string) =>
  new Date(`${iso}T12:00:00-07:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    timeZone: 'America/Phoenix',
  });

const sum = (ranges: (Range | null)[]) =>
  ranges.reduce<Range>((total, range) => (range ? { low: total.low + range.low, high: total.high + range.high } : total), {
    low: 0,
    high: 0,
  });

// ---------- Service icons ----------

function ServiceIcon({ slug }: { slug: string }) {
  const paths: Record<string, ReactNode> = {
    'residential-window-washing': (
      <>
        <rect
          x='4'
          y='3'
          width='16'
          height='18'
          rx='2'
        />
        <path d='M12 3v18M4 12h16' />
      </>
    ),
    'commercial-office-glass': (
      <>
        <rect
          x='5'
          y='3'
          width='14'
          height='18'
          rx='1.5'
        />
        <path d='M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M11 21v-3h2v3' />
      </>
    ),
    'solar-panel-cleaning': (
      <>
        <path d='M4 15 6.5 5h11L20 15Z' />
        <path d='M12 5v10M5.3 10h13.4M9 15l-.5 5M15 15l.5 5M7 20h10' />
      </>
    ),
    'gutter-roof-care': (
      <>
        <path d='M3 11 12 4l9 7' />
        <path d='M5 10v10h14V10M3 11h18v2H3zM19 13v5' />
      </>
    ),
    'hard-water-stain-removal': <path d='M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11ZM9.5 14.5a2.5 2.5 0 0 0 2.5 2.5' />,
    special: (
      <>
        <rect
          x='4'
          y='4'
          width='7'
          height='7'
          rx='2'
        />
        <rect
          x='13'
          y='4'
          width='7'
          height='7'
          rx='2'
        />
        <rect
          x='4'
          y='13'
          width='7'
          height='7'
          rx='2'
        />
        <path d='M16.5 13v7M13 16.5h7' />
      </>
    ),
    'screen-deep-cleaning': (
      <>
        <rect
          x='4'
          y='3'
          width='16'
          height='18'
          rx='2'
        />
        <path d='M4 8h16M4 13h16M9 3v18M15 3v18' />
      </>
    ),
  };
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='1.7'
      strokeLinecap='round'
      strokeLinejoin='round'>
      {paths[slug] ?? (
        <circle
          cx='12'
          cy='12'
          r='8'
        />
      )}
    </svg>
  );
}

// ---------- Drawings for the packages ----------

function Window({ x, y, w, h, inside = true }: { x: number; y: number; w: number; h: number; inside?: boolean }) {
  return (
    <g>
      <rect
        className='oe-glass'
        x={x}
        y={y}
        width={w}
        height={h}
        rx='2'
      />
      {!inside && (
        <rect
          className='oe-glass-dim'
          x={x + w / 2}
          y={y}
          width={w / 2}
          height={h}
        />
      )}
      <path
        className='oe-shine'
        d={`M${x + 6} ${y + h - 6} L${x + 16} ${y + 6} L${x + 22} ${y + 6} L${x + 12} ${y + h - 6} Z`}
      />
      <rect
        className='oe-line'
        x={x}
        y={y}
        width={w}
        height={h}
        rx='2'
      />
      <line
        className='oe-line'
        x1={x + w / 2}
        y1={y}
        x2={x + w / 2}
        y2={y + h}
      />
    </g>
  );
}

function PackageArt({ id }: { id: PackageId }) {
  if (id === 'gold') {
    return (
      <svg
        viewBox='0 0 160 100'
        aria-hidden='true'>
        <path
          className='oe-wash'
          d='M22 46 L80 12 L138 46 V94 H22 Z'
        />
        <path
          className='oe-line'
          d='M18 46 L80 10 L142 46'
        />
        <rect
          className='oe-wall'
          x='28'
          y='42'
          width='104'
          height='50'
        />
        <Window
          x={40}
          y={52}
          w={44}
          h={28}
        />
        <g className='oe-mesh'>
          <line
            x1='40'
            y1='59'
            x2='84'
            y2='59'
          />
          <line
            x1='40'
            y1='66'
            x2='84'
            y2='66'
          />
          <line
            x1='40'
            y1='73'
            x2='84'
            y2='73'
          />
        </g>
        <rect
          className='oe-track'
          x='38'
          y='80'
          width='48'
          height='4'
          rx='2'
        />
        <rect
          className='oe-wall'
          x='100'
          y='60'
          width='18'
          height='32'
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox='0 0 160 100'
      aria-hidden='true'>
      {id === 'silver' ? (
        <>
          <Window
            x={34}
            y={12}
            w={92}
            h={68}
          />
          <text
            x='57'
            y='96'>
            inside
          </text>
          <text
            x='103'
            y='96'>
            outside
          </text>
        </>
      ) : (
        <>
          <Window
            x={50}
            y={12}
            w={60}
            h={68}
            inside={false}
          />
          <text
            x='80'
            y='96'>
            outside
          </text>
        </>
      )}
    </svg>
  );
}

function Arrow() {
  return (
    <svg
      aria-hidden='true'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2.2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M5 12h13M13 6.5l5.5 5.5-5.5 5.5' />
    </svg>
  );
}

function Section({
  id,
  number,
  title,
  note,
  state,
  children,
}: {
  id: string;
  number: number;
  title: ReactNode;
  note?: string;
  state: 'done' | 'now' | 'later';
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className='oe-sec'
      data-state={state}>
      <h2 id={`${id}-title`}>
        <i aria-hidden='true'>{state === 'done' ? '✓' : number}</i>
        {title}
        {note && <small>{note}</small>}
      </h2>
      {children}
    </section>
  );
}

// The questions for one service, straight from its settings.
function Questions({
  tab,
  values,
  only,
  onChange,
}: {
  tab: EstimateTab;
  values: EstimateValues;
  only?: readonly string[];
  onChange: (id: string, answer: EstimateValues[string]) => void;
}) {
  const list = only ? tab.questions.filter((question) => only.includes(question.id)) : tab.questions;
  return (
    <>
      {list.map((question, index) => {
        const fieldId = `oe-${tab.slug}-${question.id}`;
        const number = (
          <span
            className='oe-qn'
            aria-hidden='true'>
            {index + 1}
          </span>
        );
        if (question.kind === 'slider') {
          const amount = Number(values[question.id] ?? question.start);
          return (
            <div
              key={question.id}
              className='oe-q'>
              <div className='oe-size'>
                <label htmlFor={fieldId}>
                  {number}
                  {question.label}
                </label>
                <output htmlFor={fieldId}>
                  {amount.toLocaleString('en-US')}
                  <small>{question.unit}</small>
                </output>
              </div>
              <input
                id={fieldId}
                type='range'
                min={question.min}
                max={question.max}
                step={question.step}
                value={amount}
                style={{ '--fill': `${((amount - question.min) / (question.max - question.min)) * 100}%` } as CSSProperties}
                onChange={(event) => onChange(question.id, Number(event.target.value))}
              />
              <span className='oe-scale'>
                <span>{question.min.toLocaleString('en-US')}</span>
                <span>{question.max.toLocaleString('en-US')}+</span>
              </span>
              {question.help && <p className='oe-hint'>{question.help}</p>}
            </div>
          );
        }
        if (question.kind === 'choice') {
          return (
            <fieldset
              key={question.id}
              className='oe-q'>
              <legend>
                {number}
                {question.label}
              </legend>
              <div className={question.cards ? 'oe-chips' : 'oe-seg'}>
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    type='button'
                    aria-pressed={values[question.id] === option.id}
                    onClick={() => onChange(question.id, option.id)}>
                    {option.label}
                    {question.cards && option.hint && <small>{option.hint}</small>}
                  </button>
                ))}
              </div>
              {question.help && <p className='oe-hint'>{question.help}</p>}
            </fieldset>
          );
        }
        const ticked = (values[question.id] as readonly string[] | undefined) ?? [];
        return (
          <fieldset
            key={question.id}
            className='oe-q'>
            <legend>
              {number}
              {question.label}
            </legend>
            <div className='oe-chips oe-chips-two'>
              {question.options.map((option) => (
                <button
                  key={option.id}
                  type='button'
                  aria-pressed={ticked.includes(option.id)}
                  onClick={() =>
                    onChange(
                      question.id,
                      ticked.includes(option.id) ? ticked.filter((id) => id !== option.id) : [...ticked, option.id],
                    )
                  }>
                  {option.label}
                </button>
              ))}
            </div>
            {question.help && <p className='oe-hint'>{question.help}</p>}
          </fieldset>
        );
      })}
    </>
  );
}

// A photo-only service: why there's no slider, what to send, and what you get back.
function PhotoSteps({ tab }: { tab: EstimateTab }) {
  if (!tab.photo) return null;
  const smsHref = `sms:${company.phone.replace(/[^\d+]/g, '')}`;
  return (
    <div className='oe-photo'>
      <div className='oe-why'>
        <span className='oe-label'>Why there’s no slider here</span>
        <p>{tab.photo.why}</p>
      </div>
      <ol>
        {tab.photo.steps.map((entry) => (
          <li key={entry.title}>
            <b>{entry.title}</b>
            <span>{entry.text}</span>
          </li>
        ))}
      </ol>
      <p className='oe-hint'>{tab.photo.scope}</p>
      <div className='oe-svc-panel'>
        <span className='oe-label'>What you get back</span>
        <b>A fixed price</b>
        <p>{tab.panel.text}</p>
        <div className='oe-panel-actions'>
          <a
            className='oe-panel-main'
            href={smsHref}>
            Text us a photo
          </a>
          <a
            className='oe-panel-alt'
            href={`${company.emailHref}?subject=${encodeURIComponent(`Photo for a ${tab.name.toLowerCase()} quote`)}`}>
            Email the photo instead
          </a>
        </div>
        <small>No charge for the quote. Or send your request below and we’ll ask for the photos.</small>
      </div>
    </div>
  );
}

// The special services, picked like chips. A person prices these.
function SpecialPicker({
  options,
  picked,
  onToggle,
}: {
  options: typeof extras;
  picked: readonly string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className='oe-specials'>
      {options.map((extra) => (
        <button
          key={extra.id}
          type='button'
          aria-pressed={picked.includes(extra.id)}
          onClick={() => onToggle(extra.id)}>
          <span
            className='oe-box'
            aria-hidden='true'>
            ✓
          </span>
          <span>
            <b>{extra.name}</b>
            <small>{extra.note}</small>
          </span>
        </button>
      ))}
    </div>
  );
}

type OnePageEstimateProps = {
  // Instant prices, loaded from Sanity.
  tabs: readonly EstimateTab[];
  availability: Availability;
};

// The whole estimate on one page: the questions in the middle, a receipt of
// what you've picked on the left, and the live price with what's still to
// come on the right. Prices come from Sanity, so Niels can change them.
export default function OnePageEstimate({ tabs, availability }: OnePageEstimateProps) {
  const [selected, setSelected] = useState<string[]>(() =>
    tabs.some((tab) => tab.slug === windowsSlug) ? [windowsSlug] : tabs.slice(0, 1).map((tab) => tab.slug),
  );
  // Services added further down, in "Anything else?", keep their questions there.
  const [addedLater, setAddedLater] = useState<string[]>([]);
  const [values, setValues] = useState<Record<string, EstimateValues>>(() =>
    Object.fromEntries(tabs.map((tab) => [tab.slug, startingValues(tab)])),
  );
  const [packageId, setPackageId] = useState<PackageId>('silver');
  const [pickedExtras, setPickedExtras] = useState<ExtraId[]>([]);
  // Special services: picked at the top, further down, or not at all.
  const [special, setSpecial] = useState<'top' | 'later' | null>(null);
  const [plan, setPlan] = useState<ClubPlan>('once');
  const [day, setDay] = useState('');
  const [time, setTime] = useState<string>('Morning');
  const [current, setCurrent] = useState(0);
  const [reached, setReached] = useState(0);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AppointmentResult | null>(null);
  const [sentTo, setSentTo] = useState('');
  const submissionKey = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const done = result?.status === 'saved';

  const chosen = tabs.filter((tab) => selected.includes(tab.slug));
  const hasWindows = selected.includes(windowsSlug);
  const goldScreens = hasWindows && packageId === 'gold';

  // The parts of the page. The package part only shows with windows.
  const parts = [
    { id: 'oe-services', label: 'Pick services' },
    { id: 'oe-details', label: 'A few details' },
    ...(hasWindows ? [{ id: 'oe-package', label: 'Your package' }] : []),
    { id: 'oe-extras', label: 'Anything else' },
    { id: 'oe-day', label: 'Request a day' },
  ];
  const partIndex = (id: string) => parts.findIndex((part) => part.id === id);
  const partKey = parts.map((part) => part.id).join();

  // Which part is on screen. Parts above it count as done.
  useEffect(() => {
    const ids = partKey.split(',');
    const update = () => {
      const line = window.innerHeight * 0.45;
      let index = 0;
      ids.forEach((id, position) => {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= line) index = position;
      });
      setCurrent(index);
      setReached((value) => Math.max(value, index));
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [partKey]);

  // Choosing something in a part also counts as reaching it.
  const reach = (id: string) => setReached((value) => Math.max(value, partIndex(id)));

  // The price of one service, or null when a person prices it.
  function priceOf(tab: EstimateTab): Range | null {
    const answers = values[tab.slug] ?? startingValues(tab);
    if (tab.slug === windowsSlug) return packagePrice(packageId, homeFromValues(answers), tabs);
    if (tab.slug === screensSlug && goldScreens) return null;
    return rangeFor(tab, answers);
  }

  function priceLabel(tab: EstimateTab) {
    if (tab.slug === screensSlug && goldScreens) return 'In Gold';
    const price = priceOf(tab);
    return price ? formatRange(price) : 'From a photo';
  }

  const extrasOffered = extras.filter((extra) => !(hasWindows && extra.includedIn === packageId));
  const chosenExtras = special ? extrasOffered.filter((extra) => pickedExtras.includes(extra.id)) : [];
  const toggleExtra = (id: string) => {
    reach(special === 'top' ? 'oe-details' : 'oe-extras');
    setPickedExtras((list) => (list.includes(id) ? list.filter((entry) => entry !== id) : [...list, id]));
  };
  const total = sum(chosen.map(priceOf));
  const instantCount = chosen.filter((tab) => tab.mode === 'range').length;
  const needsReview =
    (hasWindows && packageId === 'gold') || chosen.some((tab) => tab.mode !== 'range') || chosenExtras.length > 0;
  const packageName = packages.find((entry) => entry.id === packageId)?.name ?? '';

  const stateOf = (id: string): 'done' | 'now' | 'later' => {
    const index = partIndex(id);
    return done || index < current ? 'done' : index === current ? 'now' : index <= reached ? 'done' : 'later';
  };

  // Progress ring: how many parts are done.
  const finished = done ? parts.length : Math.min(parts.length, Math.max(current, reached) + (day ? 1 : 0));
  const step = Math.min(parts.length, current + 1);
  const ringLength = 157;

  function toggleService(slug: string, later = false) {
    reach(later ? 'oe-extras' : 'oe-services');
    const on = selected.includes(slug);
    // Keep at least one thing picked.
    if (on && selected.length === 1 && special !== 'top') return;
    setSelected((list) => (on ? list.filter((entry) => entry !== slug) : [...list, slug]));
    setAddedLater((list) => (on || !later ? list.filter((entry) => entry !== slug) : [...list, slug]));
  }

  function answer(slug: string, id: string, value: EstimateValues[string]) {
    setValues((all) => ({ ...all, [slug]: { ...all[slug], [id]: value } }));
  }

  function goToDay() {
    document.getElementById('oe-day')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const read = (field: string) => String(form.get(field) ?? '').trim();
    submissionKey.current ??= crypto.randomUUID();
    setPending(true);
    setResult(null);
    try {
      const outcome = await requestAppointment({
        submissionKey: submissionKey.current,
        services: chosen.map((tab) => ({ slug: tab.slug, values: values[tab.slug] })),
        packageId: hasWindows ? packageId : null,
        extras: chosenExtras.map((extra) => extra.id),
        plan,
        day,
        time,
        contact: {
          firstName: read('firstName'),
          lastName: read('lastName'),
          email: read('email'),
          phone: read('phone'),
          address: read('address'),
          city: read('city'),
          postalCode: read('postalCode'),
        },
      });
      setResult(outcome);
      if (outcome.status === 'saved') {
        setSentTo(read('firstName'));
        submissionKey.current = null;
        requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      }
    } catch {
      setResult({ status: 'unavailable' });
    } finally {
      setPending(false);
    }
  }

  const leadingBlanks = availability.days.length
    ? new Date(`${availability.days[0].date}T12:00:00-07:00`).getUTCDay()
    : 0;

  const totalText = total.high
    ? formatRange(total)
    : chosen.some((tab) => tab.mode === 'photo')
      ? 'From a photo'
      : 'Custom quote';
  const planEntry = clubPlans.find((entry) => entry.id === plan) ?? clubPlans[0];

  // The receipt on the left: what's been picked so far.
  const receipt: { label: string; value: string; part: string }[] = [
    ...chosen.map((tab) => ({
      label: tab.slug === windowsSlug ? `${tab.tab} · ${packageName}` : tab.tab,
      value: priceLabel(tab),
      part: 'oe-services',
    })),
    {
      label: 'Special',
      value: chosenExtras.length ? chosenExtras.map((extra) => extra.name).join(', ') : 'None',
      part: special === 'top' ? 'oe-services' : 'oe-extras',
    },
    {
      label: 'Day',
      value: day ? `${shortDay(day)}, ${time === 'Either' ? 'any time' : time.toLowerCase()}` : '',
      part: 'oe-day',
    },
    { label: 'Clear Club', value: day ? planEntry.label : '', part: 'oe-day' },
  ];

  // Services not picked at the top, offered again in "Anything else?".
  const crossSell = tabs.filter((tab) => !selected.includes(tab.slug) || addedLater.includes(tab.slug));
  const topServices = chosen.filter((tab) => !addedLater.includes(tab.slug));

  function serviceBlock(tab: EstimateTab) {
    return (
      <div
        key={tab.slug}
        className='oe-svc'>
        <div className='oe-svc-head'>
          <span className='oe-svc-icon'>
            <ServiceIcon slug={tab.slug} />
          </span>
          <b>{tab.name}</b>
          <span className={`oe-chip ${tab.mode === 'range' ? 'oe-chip-auto' : 'oe-chip-review'}`}>{priceLabel(tab)}</span>
        </div>
        {tab.mode === 'photo' ? (
          <PhotoSteps tab={tab} />
        ) : tab.slug === screensSlug && goldScreens ? (
          <p className='oe-hint'>Screens and tracks are already part of your Gold package.</p>
        ) : (
          <>
            <Questions
              tab={tab}
              values={values[tab.slug]}
              only={tab.slug === windowsSlug ? windowsQuestions : undefined}
              onChange={(id, value) => {
                answer(tab.slug, id, value);
                reach(addedLater.includes(tab.slug) ? 'oe-extras' : 'oe-details');
              }}
            />
            <div className='oe-svc-panel'>
              <span className='oe-label'>
                {tab.slug === windowsSlug ? `${packageName} package lands between` : 'Likely lands between'}
              </span>
              <b>{priceLabel(tab)}</b>
              <p>{tab.panel.text}</p>
              {tab.slug === windowsSlug && <small>Change the package in the next step.</small>}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div
      ref={topRef}
      className='oe'>
      {/* Left: the receipt of what's been picked. */}
      <aside
        className='oe-side oe-left'
        aria-label='What you have picked'>
        <p className='oe-label'>Your receipt</p>
        <div className='oe-receipt'>
          {receipt.map((line) => {
            const waiting = !done && partIndex(line.part) > reached && !(line.part === 'oe-day' && day);
            return (
              <div
                key={line.label}
                className='oe-line-item'
                data-waiting={waiting || undefined}>
                <span>{line.label}</span>
                <span>{waiting || !line.value ? '—' : line.value}</span>
              </div>
            );
          })}
          <div className='oe-line-total'>
            <span>Today’s estimate</span>
            <span>{totalText}</span>
          </div>
        </div>
        <p className='oe-help'>
          Stuck? Call or text <a href={company.phoneHref}>{company.phone}</a>
        </p>
      </aside>

      {/* Middle: every question on one page. */}
      <div className='oe-form'>
        <div className='oe-top'>
          <h1>
            Get your <em>price.</em>
          </h1>
          <span className='oe-tag'>✓ No email needed to see it</span>
        </div>

        {done ? (
          <section
            className='oe-sec oe-done'
            role='status'>
            <span
              className='oe-done-mark'
              aria-hidden='true'>
              ✓
            </span>
            <h2>
              Request received{sentTo ? `, ${sentTo}` : ''}. <em>We’ll be in touch.</em>
            </h2>
            <p className='oe-sub'>We’ll call or text to confirm the time and your final price.</p>
            <ol className='oe-tracker'>
              <li data-state='done'>
                <i />
                <b>Received</b>
                <span>Just now</span>
              </li>
              <li data-state='now'>
                <i />
                <b>Being reviewed</b>
                <span>We check the details</span>
              </li>
              <li>
                <i />
                <b>Confirmed</b>
                <span>We call to set the time</span>
              </li>
              <li>
                <i />
                <b>Cleaning day</b>
                <span>{day && longDay(day)}</span>
              </li>
            </ol>
          </section>
        ) : (
          <>
            <Section
              id='oe-services'
              number={partIndex('oe-services') + 1}
              title='What can we clean for you?'
              note='Pick one or more'
              state={stateOf('oe-services')}>
              <div
                className='oe-services'
                role='group'
                aria-label='Services'>
                {tabs.map((tab) => (
                  <button
                    key={tab.slug}
                    type='button'
                    className='oe-service'
                    aria-pressed={selected.includes(tab.slug)}
                    onClick={() => toggleService(tab.slug)}>
                    <span className='oe-service-icon'>
                      <ServiceIcon slug={tab.slug} />
                    </span>
                    <span className='oe-service-text'>
                      <b>{tab.tab}</b>
                      <small>{tab.tabNote}</small>
                    </span>
                    <span
                      className='oe-service-tick'
                      aria-hidden='true'>
                      ✓
                    </span>
                  </button>
                ))}
                <button
                  type='button'
                  className='oe-service'
                  aria-pressed={special === 'top'}
                  onClick={() => {
                    reach('oe-services');
                    if (special === 'top' && selected.length === 0) return;
                    setSpecial(special === 'top' ? null : 'top');
                  }}>
                  <span className='oe-service-icon'>
                    <ServiceIcon slug='special' />
                  </span>
                  <span className='oe-service-text'>
                    <b>Special services</b>
                    <small>Custom quote</small>
                  </span>
                  <span
                    className='oe-service-tick'
                    aria-hidden='true'>
                    ✓
                  </span>
                </button>
              </div>
            </Section>

            <Section
              id='oe-details'
              number={partIndex('oe-details') + 1}
              title='A few details'
              note='A guess is fine'
              state={stateOf('oe-details')}>
              {topServices.map(serviceBlock)}
              {special === 'top' && (
                <div className='oe-svc'>
                  <div className='oe-svc-head'>
                    <span className='oe-svc-icon'>
                      <ServiceIcon slug='special' />
                    </span>
                    <b>Special services</b>
                    <span className='oe-chip oe-chip-review'>Custom quote</span>
                  </div>
                  <p className='oe-hint'>Pick any you’d like. We price these after a quick look or a photo.</p>
                  <SpecialPicker
                    options={extrasOffered}
                    picked={pickedExtras}
                    onToggle={toggleExtra}
                  />
                </div>
              )}
              {!topServices.length && special !== 'top' && (
                <p className='oe-hint'>Your services are below, in “Anything else?”.</p>
              )}
            </Section>

            {hasWindows && (
              <Section
                id='oe-package'
                number={partIndex('oe-package') + 1}
                title='Choose your window package'
                note='Most people pick Silver'
                state={stateOf('oe-package')}>
                <div
                  className='oe-pkgs'
                  role='radiogroup'
                  aria-label='Window cleaning package'>
                  {packages.map((entry) => (
                    <button
                      key={entry.id}
                      type='button'
                      role='radio'
                      aria-checked={packageId === entry.id}
                      className='oe-pkg'
                      data-tier={entry.id}
                      onClick={() => {
                        setPackageId(entry.id);
                        reach('oe-package');
                      }}>
                      {entry.recommended && <span className='oe-flag'>Recommended</span>}
                      <span className='oe-art'>
                        <PackageArt id={entry.id} />
                      </span>
                      <b>{entry.name}</b>
                      <span className='oe-pkg-note'>{entry.note}</span>
                      <span className='oe-pkg-price'>
                        {formatRange(packagePrice(entry.id, homeFromValues(values[windowsSlug]), tabs))}
                        <small>{entry.needsReview ?? 'Instant estimate'}</small>
                      </span>
                      <ul>
                        {entry.includes.map((item) => (
                          <li
                            key={item.label}
                            className={item.added ? 'added' : undefined}>
                            {item.label}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>
                <p className='oe-upgrade'>{upgradeNotes[packageId]}</p>
              </Section>
            )}

            <Section
              id='oe-extras'
              number={partIndex('oe-extras') + 1}
              title='Want to add anything else?'
              note='Optional'
              state={stateOf('oe-extras')}>
              <div className='oe-addons'>
                {crossSell.map((tab) => {
                  const on = selected.includes(tab.slug);
                  const preview = rangeFor(tab, values[tab.slug]);
                  return (
                    <div
                      key={tab.slug}
                      className='oe-addon-row'>
                      <button
                        type='button'
                        className='oe-addon'
                        aria-pressed={on}
                        onClick={() => toggleService(tab.slug, true)}>
                        <span
                          className='oe-box'
                          aria-hidden='true'>
                          ✓
                        </span>
                        <span className='oe-what'>
                          <b>{tab.name}</b>
                          <span>{tab.tabNote}</span>
                        </span>
                        <span className='oe-amt'>
                          {preview ? (
                            <>
                              {on ? formatRange(preview) : `from ${formatDollars(preview.low)}`}
                              <span className='oe-chip oe-chip-auto'>Instant</span>
                            </>
                          ) : (
                            <span className='oe-chip oe-chip-review'>From a photo</span>
                          )}
                        </span>
                      </button>
                      {on && <div className='oe-addon-more'>{serviceBlock(tab)}</div>}
                    </div>
                  );
                })}
                {special !== 'top' && (
                  <div className='oe-addon-row'>
                    <button
                      type='button'
                      className='oe-addon'
                      aria-pressed={special === 'later'}
                      onClick={() => {
                        reach('oe-extras');
                        setSpecial(special === 'later' ? null : 'later');
                      }}>
                      <span
                        className='oe-box'
                        aria-hidden='true'>
                        ✓
                      </span>
                      <span className='oe-what'>
                        <b>Special services</b>
                        <span>French panes, skylights, chandeliers, move-outs and more</span>
                      </span>
                      <span className='oe-amt'>
                        <span className='oe-chip oe-chip-review'>Custom quote</span>
                      </span>
                    </button>
                    {special === 'later' && (
                      <div className='oe-addon-more'>
                        <SpecialPicker
                          options={extrasOffered}
                          picked={pickedExtras}
                          onToggle={toggleExtra}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {bonusOffer.enabled && instantCount === 2 && <p className='oe-bonus'>{bonusOffer.text}</p>}
            </Section>

            <Section
              id='oe-day'
              number={partIndex('oe-day') + 1}
              title='Request a day'
              note='We call to confirm'
              state={stateOf('oe-day')}>
              <form
                onSubmit={send}
                aria-busy={pending}>
                <fieldset className='oe-q'>
                  <legend>Open days from our calendar</legend>
                  <div className='oe-cal'>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((name) => (
                      <span
                        key={name}
                        className='oe-dow'
                        aria-hidden='true'>
                        {name}
                      </span>
                    ))}
                    {Array.from({ length: leadingBlanks }, (_, blank) => (
                      <span key={`blank-${blank}`} />
                    ))}
                    {availability.days.map((entry) => (
                      <button
                        key={entry.date}
                        type='button'
                        className='oe-day'
                        disabled={!entry.open}
                        aria-pressed={day === entry.date}
                        aria-label={`${longDay(entry.date)}, ${entry.label.toLowerCase()}`}
                        onClick={() => {
                          setDay(entry.date);
                          reach('oe-day');
                        }}>
                        <b>{Number(entry.date.slice(8))}</b>
                        <small>{entry.label}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className='oe-q'>
                  <legend>Best time</legend>
                  <div className='oe-seg'>
                    {times.map((option) => (
                      <button
                        key={option.id}
                        type='button'
                        aria-pressed={time === option.id}
                        onClick={() => setTime(option.id)}>
                        {option.id}
                      </button>
                    ))}
                  </div>
                </fieldset>

                {/* Clear Club, right after picking a day. */}
                <fieldset className='oe-q oe-club-pick'>
                  <legend>{clearClub.title}</legend>
                  <p className='oe-hint'>{clearClub.text}</p>
                  <div className='oe-chips'>
                    {clubPlans.map((option) => (
                      <button
                        key={option.id}
                        type='button'
                        aria-pressed={plan === option.id}
                        onClick={() => setPlan(option.id)}>
                        {option.label}
                        <small>{option.hint}</small>
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset
                  className='oe-fields'
                  disabled={pending}>
                  <legend className='sr-only'>Your details</legend>
                  <label>
                    First name
                    <input
                      name='firstName'
                      autoComplete='given-name'
                      required
                      maxLength={100}
                    />
                  </label>
                  <label>
                    Last name
                    <input
                      name='lastName'
                      autoComplete='family-name'
                      required
                      maxLength={100}
                    />
                  </label>
                  <label>
                    Mobile number
                    <input
                      name='phone'
                      type='tel'
                      autoComplete='tel'
                      required
                      maxLength={32}
                      pattern={phonePattern}
                      title='Enter a phone number with 7 to 15 digits.'
                    />
                  </label>
                  <label>
                    Email
                    <input
                      name='email'
                      type='email'
                      autoComplete='email'
                      required
                      maxLength={254}
                    />
                  </label>
                  <label className='oe-wide'>
                    Street address
                    <input
                      name='address'
                      autoComplete='street-address'
                      required
                      maxLength={200}
                    />
                  </label>
                  <label>
                    City
                    <input
                      name='city'
                      autoComplete='address-level2'
                      required
                      maxLength={100}
                    />
                  </label>
                  <label>
                    ZIP code
                    <input
                      name='postalCode'
                      autoComplete='postal-code'
                      required
                      maxLength={10}
                      pattern='[0-9]{5}(-[0-9]{4})?'
                      title='Enter a 5-digit ZIP code or ZIP+4.'
                    />
                  </label>
                </fieldset>
                <p className='oe-fine'>{paymentNote}</p>
                {result && (
                  <p
                    className='oe-error'
                    role='alert'>
                    {result.status === 'invalid'
                      ? 'Check your details and pick an open day, then try again.'
                      : result.status === 'conflict'
                        ? 'This request was already sent. We’ll be in touch soon.'
                        : `We couldn’t send your request just now. Please try again, or call or text ${company.phone}.`}
                  </p>
                )}
                <button
                  className='oe-send'
                  type='submit'
                  disabled={pending || !day}>
                  {pending ? 'Sending…' : day ? 'Send my request' : 'Pick a day above first'}
                  {!pending && day && <Arrow />}
                </button>
              </form>
            </Section>
          </>
        )}
      </div>

      {/* Right: progress, the live price and what's still to come. */}
      <aside
        className='oe-side oe-right'
        aria-label='Your price'>
        <div className='oe-ring'>
          <svg
            viewBox='0 0 64 64'
            aria-hidden='true'>
            <circle
              cx='32'
              cy='32'
              r='25'
              className='oe-ring-bg'
            />
            <circle
              cx='32'
              cy='32'
              r='25'
              className='oe-ring-fg'
              style={{ strokeDashoffset: ringLength - (ringLength * finished) / parts.length }}
            />
          </svg>
          <div>
            <b>{done ? 'All done' : `Step ${step} of ${parts.length}`}</b>
            <span>{done ? 'Request sent' : parts[step - 1].label}</span>
          </div>
        </div>

        <div
          className='oe-price'
          aria-live='polite'>
          <span className='oe-label'>Today’s estimate</span>
          <b>{totalText}</b>
          <span className={`oe-chip ${needsReview ? 'oe-chip-review' : 'oe-chip-auto'}`}>
            {needsReview ? 'Part of this needs review' : 'Instant estimate'}
          </span>
        </div>

        {!done && (
          <button
            type='button'
            className='oe-request'
            onClick={goToDay}>
            Request a day
            <Arrow />
          </button>
        )}

        {!done && (
          <div className='oe-next'>
            <span className='oe-label'>Next up</span>
            {parts.map((part, index) =>
              index > current ? (
                <div key={part.id}>
                  <i>{index + 1}</i>
                  {part.label}
                </div>
              ) : null,
            )}
            {current === parts.length - 1 && <div className='oe-next-last'>Last step. Almost done.</div>}
          </div>
        )}

        <p className='oe-promise'>
          <b>{clearPricePromise.title}</b>
          {clearPricePromise.text}
        </p>
      </aside>

      <LeaveOffer
        armed={!done && !pending}
        price={totalText}
        canPickGold={hasWindows && packageId !== 'gold'}
        onPickGold={() => {
          setPackageId('gold');
          document.getElementById('oe-package')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
      />
    </div>
  );
}
