'use client';

import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { requestAppointment, type AppointmentResult } from '@/app/estimate/actions';
import { company } from '@/data/company';
import {
  addonPrice,
  addons,
  bonusOffer,
  clearClub,
  clearPricePromise,
  dirtOptions,
  formatRange,
  homeSize,
  packagePrice,
  packages,
  paymentNote,
  solarPanels,
  startingHome,
  upgradeNotes,
  type AddonId,
  type HomeDetails,
  type PackageId,
  type Range,
} from '@/data/packages';
import type { Availability } from '@/lib/availability';
import './estimate-flow.css';

// One question per screen, grouped into the three steps from the brief.
const questions = [
  { id: 'size', part: 0 },
  { id: 'stories', part: 0 },
  { id: 'dirt', part: 0 },
  { id: 'extra', part: 0 },
  { id: 'package', part: 1 },
  { id: 'addons', part: 1 },
  { id: 'day', part: 2 },
  { id: 'details', part: 2 },
] as const;

const parts = ['Your home', 'Your package', 'Request a day'] as const;

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

// ---------- Drawings ----------
// Simple line drawings for each answer: dark lines, pale blue glass, green
// for screens and tracks, gold for the house wash.

function Window({ x, y, w, h, inside = true }: { x: number; y: number; w: number; h: number; inside?: boolean }) {
  return (
    <g>
      <rect className='ef-glass' x={x} y={y} width={w} height={h} rx='2' />
      {!inside && <rect className='ef-glass-dim' x={x + w / 2} y={y} width={w / 2} height={h} />}
      <path className='ef-shine' d={`M${x + 6} ${y + h - 6} L${x + 16} ${y + 6} L${x + 22} ${y + 6} L${x + 12} ${y + h - 6} Z`} />
      <rect className='ef-line' x={x} y={y} width={w} height={h} rx='2' />
      <line className='ef-line' x1={x + w / 2} y1={y} x2={x + w / 2} y2={y + h} />
    </g>
  );
}

function Art({ name }: { name: string }) {
  const svg = (children: ReactNode) => (
    <svg viewBox='0 0 160 100' aria-hidden='true'>
      {children}
    </svg>
  );
  switch (name) {
    case 'one-story':
      return svg(
        <>
          <path className='ef-line' d='M28 48 L80 20 L132 48' />
          <rect className='ef-wall' x='36' y='44' width='88' height='46' />
          <Window x={46} y={56} w={30} h={22} />
          <rect className='ef-wall' x='88' y='60' width='14' height='30' />
        </>,
      );
    case 'two-story':
      return svg(
        <>
          <path className='ef-line' d='M36 30 L80 6 L124 30' />
          <rect className='ef-wall' x='44' y='26' width='72' height='66' />
          <Window x={52} y={34} w={24} h={18} />
          <Window x={84} y={34} w={24} h={18} />
          <Window x={52} y={64} w={24} h={18} />
          <rect className='ef-wall' x='88' y='64' width='14' height='28' />
        </>,
      );
    case 'light':
    case 'normal':
    case 'rough': {
      const dots = name === 'light' ? 4 : name === 'normal' ? 12 : 26;
      return svg(
        <>
          <Window x={50} y={14} w={60} h={72} />
          {Array.from({ length: dots }, (_, index) => (
            <circle
              key={index}
              className='ef-dust'
              cx={54 + ((index * 23) % 52)}
              cy={18 + ((index * 37) % 64)}
              r={name === 'rough' ? 2.6 : 2}
            />
          ))}
          {name === 'rough' && <path className='ef-streak' d='M58 30 Q80 40 100 28 M56 60 Q78 70 104 58' />}
        </>,
      );
    }
    case 'none':
      return svg(
        <>
          <Window x={50} y={14} w={60} h={72} />
          <circle className='ef-ok' cx='112' cy='78' r='14' />
          <path className='ef-ok-tick' d='M105 78 l5 5 9-10' />
        </>,
      );
    case 'hard':
      return svg(
        <>
          <Window x={50} y={14} w={60} h={72} />
          {[
            [62, 30],
            [92, 40],
            [70, 62],
            [98, 70],
            [80, 24],
          ].map(([cx, cy]) => (
            <ellipse
              key={`${cx}-${cy}`}
              className='ef-spot'
              cx={cx}
              cy={cy}
              rx='6'
              ry='4.5'
            />
          ))}
        </>,
      );
    case 'bronze':
      return svg(
        <>
          <Window x={50} y={12} w={60} h={68} inside={false} />
          <text x='80' y='96'>outside</text>
        </>,
      );
    case 'silver':
      return svg(
        <>
          <Window x={34} y={12} w={92} h={68} />
          <text x='57' y='96'>inside</text>
          <text x='103' y='96'>outside</text>
        </>,
      );
    case 'gold':
      return svg(
        <>
          <path className='ef-wash' d='M22 46 L80 12 L138 46 V94 H22 Z' />
          <path className='ef-line' d='M18 46 L80 10 L142 46' />
          <rect className='ef-wall' x='28' y='42' width='104' height='50' />
          <Window x={40} y={52} w={44} h={28} />
          <g className='ef-mesh'>
            <line x1='40' y1='59' x2='84' y2='59' />
            <line x1='40' y1='66' x2='84' y2='66' />
            <line x1='40' y1='73' x2='84' y2='73' />
          </g>
          <rect className='ef-track' x='38' y='80' width='48' height='4' rx='2' />
          <rect className='ef-wall' x='100' y='60' width='18' height='32' />
        </>,
      );
    default:
      return null;
  }
}

// ---------- Pieces ----------

function Choice({
  pressed,
  onClick,
  art,
  title,
  hint,
  extra,
  flag,
}: {
  pressed: boolean;
  onClick: () => void;
  art: string;
  title: string;
  hint?: string;
  extra?: ReactNode;
  flag?: string;
}) {
  return (
    <button
      type='button'
      className='ef-choice'
      aria-pressed={pressed}
      onClick={onClick}>
      {flag && <span className='ef-flag'>{flag}</span>}
      <span className='ef-art'>
        <Art name={art} />
      </span>
      <b>{title}</b>
      {hint && <span className='ef-hint'>{hint}</span>}
      {extra}
    </button>
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

type EstimateFlowProps = {
  availability: Availability;
};

// The estimate, one question at a time: four about the home, then the
// package and extras, then a day and contact details. A small price card
// follows along. Sending shows the request tracker; nothing is booked until
// we call to confirm.
export default function EstimateFlow({ availability }: EstimateFlowProps) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [home, setHome] = useState<HomeDetails>(startingHome);
  const [packageId, setPackageId] = useState<PackageId>('silver');
  const [picked, setPicked] = useState<AddonId[]>([]);
  const [panels, setPanels] = useState(solarPanels.start);
  const [day, setDay] = useState(availability.days.find((entry) => entry.open)?.date ?? '');
  const [time, setTime] = useState<string>('Morning');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AppointmentResult | null>(null);
  const [firstName, setFirstName] = useState('');
  const submissionKey = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const question = questions[index].id;
  const part = questions[index].part;
  const offered = addons.filter((addon) => addon.includedIn !== packageId);
  const chosenAddons = offered.filter((addon) => picked.includes(addon.id));
  const qualifying = chosenAddons.filter((addon) => addon.qualifies).length;

  // The running total and what still needs a person to price it.
  const base = packagePrice(packageId, home);
  let total: Range = { ...base };
  const lines: { label: string; value: string; muted?: boolean }[] = [
    { label: `${packages.find((entry) => entry.id === packageId)?.name} package`, value: formatRange(base) },
  ];
  for (const addon of chosenAddons) {
    const price = addonPrice(addon.id, home, panels);
    if (price) {
      total = { low: total.low + price.low, high: total.high + price.high };
      lines.push({ label: addon.name, value: `+${formatRange(price)}` });
    } else {
      lines.push({ label: addon.name, value: 'after review', muted: true });
    }
  }
  if (packageId === 'gold') lines.push({ label: 'House wash', value: 'after review', muted: true });
  if (home.hardWater) lines.push({ label: 'Hard water spots', value: 'photo needed', muted: true });
  const needsReview = packageId === 'gold' || home.hardWater || chosenAddons.some((addon) => !addon.instant);

  function goTo(next: number) {
    setIndex(next);
    // Keep the question in view and move focus to it for keyboard and
    // screen reader users.
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      headingRef.current?.focus({ preventScroll: true });
    });
  }

  function toggleAddon(id: AddonId) {
    setPicked((value) => (value.includes(id) ? value.filter((entry) => entry !== id) : [...value, id]));
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
        home,
        packageId,
        addons: chosenAddons.map((addon) => addon.id),
        panels,
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
        setFirstName(read('firstName'));
        submissionKey.current = null;
        setDone(true);
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

  const back =
    index > 0 && !done ? (
      <button
        type='button'
        className='ef-back'
        onClick={() => goTo(index - 1)}>
        <span aria-hidden='true'>←</span> Back
      </button>
    ) : (
      <span />
    );

  const next = (label = 'Continue') => (
    <button
      type='button'
      className='ef-btn ef-btn-gold'
      onClick={() => goTo(index + 1)}>
      {label}
      <Arrow />
    </button>
  );

  return (
    <div
      ref={topRef}
      className='ef'>
      {/* Progress: one dash per question, grouped by step. */}
      <div className='ef-top'>
        {back}
        <div className='ef-progress'>
          <ol
            className='ef-dashes'
            aria-hidden='true'>
            {questions.map((entry, position) => (
              <li
                key={entry.id}
                className={done || position < index ? 'done' : position === index ? 'on' : ''}
              />
            ))}
          </ol>
          <p className='ef-count'>
            {done ? (
              'All done'
            ) : (
              <>
                <b>
                  Step {part + 1} · {parts[part]}
                </b>{' '}
                · Question {index + 1} of {questions.length}
              </>
            )}
          </p>
        </div>

        <div
          className='ef-price'
          aria-live='polite'>
          <span>Your estimate so far</span>
          <b>{formatRange(total)}</b>
          <span className={`ef-chip ${needsReview ? 'ef-chip-review' : 'ef-chip-auto'}`}>
            {needsReview ? 'Part needs review' : 'Instant estimate'}
          </span>
        </div>
      </div>

      <div
        className='ef-stage'
        key={done ? 'done' : question}>
        {!done && question === 'size' && (
          <section className='ef-q'>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              How big is <em>your home?</em>
            </h2>
            <p className='ef-sub'>The living space on your listing or tax record. A guess is fine.</p>
            <div className='ef-size'>
              <output htmlFor='ef-size'>
                {home.size.toLocaleString('en-US')}
                <small>sq ft</small>
              </output>
              <input
                id='ef-size'
                type='range'
                min={homeSize.min}
                max={homeSize.max}
                step={homeSize.step}
                value={home.size}
                aria-label='Home size in square feet'
                style={{ '--fill': `${((home.size - homeSize.min) / (homeSize.max - homeSize.min)) * 100}%` } as React.CSSProperties}
                onChange={(event) => setHome({ ...home, size: Number(event.target.value) })}
              />
              <span className='ef-scale'>
                <span>{homeSize.min.toLocaleString('en-US')}</span>
                <span>{homeSize.max.toLocaleString('en-US')}+</span>
              </span>
            </div>
            <div className='ef-foot'>{next()}</div>
          </section>
        )}

        {!done && question === 'stories' && (
          <section className='ef-q'>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              How many <em>stories?</em>
            </h2>
            <div className='ef-choices ef-two'>
              <Choice
                pressed={home.stories === 1}
                onClick={() => setHome({ ...home, stories: 1 })}
                art='one-story'
                title='1 story'
                hint='All windows on the ground floor'
              />
              <Choice
                pressed={home.stories === 2}
                onClick={() => setHome({ ...home, stories: 2 })}
                art='two-story'
                title='2 stories'
                hint='Upper glass cleaned from the ground with a pure water pole'
              />
            </div>
            <div className='ef-foot'>{next()}</div>
          </section>
        )}

        {!done && question === 'dirt' && (
          <section className='ef-q'>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              How dirty are they, <em>honestly?</em>
            </h2>
            <div className='ef-choices'>
              {dirtOptions.map((option) => (
                <Choice
                  key={option.id}
                  pressed={home.dirt === option.id}
                  onClick={() => setHome({ ...home, dirt: option.id })}
                  art={option.id}
                  title={option.label}
                  hint={option.hint}
                />
              ))}
            </div>
            <div className='ef-foot'>{next()}</div>
          </section>
        )}

        {!done && question === 'extra' && (
          <section className='ef-q'>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              Anything we <em>should know?</em>
            </h2>
            <div className='ef-choices ef-two'>
              <Choice
                pressed={!home.hardWater}
                onClick={() => setHome({ ...home, hardWater: false })}
                art='none'
                title='Nothing special'
                hint='Regular dust and water marks'
              />
              <Choice
                pressed={home.hardWater}
                onClick={() => setHome({ ...home, hardWater: true })}
                art='hard'
                title='Hard water spots'
                hint='White spots from sprinklers. We’ll ask for a photo.'
              />
            </div>
            <div className='ef-foot'>{next('See my packages')}</div>
          </section>
        )}

        {!done && question === 'package' && (
          <section className='ef-q'>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              How clean do you want <em>your windows?</em>
            </h2>
            <p className='ef-sub'>Priced for your home. Most people pick Silver.</p>
            <div
              className='ef-choices ef-packages'
              role='radiogroup'
              aria-label='Cleaning package'>
              {packages.map((entry) => (
                <button
                  key={entry.id}
                  type='button'
                  role='radio'
                  aria-checked={packageId === entry.id}
                  className='ef-choice ef-package'
                  data-tier={entry.id}
                  onClick={() => setPackageId(entry.id)}>
                  {entry.recommended && <span className='ef-flag'>Recommended</span>}
                  <span className='ef-art'>
                    <Art name={entry.id} />
                  </span>
                  <b>{entry.name}</b>
                  <span className='ef-hint'>{entry.note}</span>
                  <span className='ef-tier-price'>
                    {formatRange(packagePrice(entry.id, home))}
                    {entry.needsReview && <small>{entry.needsReview}</small>}
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
            <p className='ef-upgrade'>{upgradeNotes[packageId]}</p>
            <div className='ef-foot'>{next()}</div>
          </section>
        )}

        {!done && question === 'addons' && (
          <section className='ef-q'>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              Want to add <em>anything else?</em>
            </h2>
            <p className='ef-sub'>Optional. Skip it if not.</p>
            <div className='ef-addons'>
              {offered.map((addon) => {
                const on = picked.includes(addon.id);
                const price = addonPrice(addon.id, home, panels);
                return (
                  <div
                    key={addon.id}
                    className='ef-addon-row'>
                    <button
                      type='button'
                      className='ef-addon'
                      aria-pressed={on}
                      onClick={() => toggleAddon(addon.id)}>
                      <span className='ef-box'>
                        <svg
                          aria-hidden='true'
                          viewBox='0 0 24 24'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='3'
                          strokeLinecap='round'
                          strokeLinejoin='round'>
                          <path d='M6 12.5l4 4 8-9' />
                        </svg>
                      </span>
                      <span className='ef-what'>
                        <b>{addon.name}</b>
                        <span>{addon.id === 'solar' ? `${panels} panels` : addon.note}</span>
                      </span>
                      <span className='ef-amt'>
                        {price ? (
                          <>
                            +{formatRange(price)}
                            <span className='ef-chip ef-chip-auto'>Instant</span>
                          </>
                        ) : (
                          <span className='ef-chip ef-chip-review'>Needs review</span>
                        )}
                      </span>
                    </button>
                    {addon.id === 'solar' && on && (
                      <label className='ef-panels'>
                        How many panels?
                        <input
                          type='number'
                          min={solarPanels.min}
                          max={solarPanels.max}
                          value={panels}
                          onChange={(event) =>
                            setPanels(
                              Math.min(
                                solarPanels.max,
                                Math.max(solarPanels.min, Number(event.target.value) || solarPanels.min),
                              ),
                            )
                          }
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>
            {bonusOffer.enabled && qualifying === 1 && <p className='ef-bonus'>{bonusOffer.text}</p>}
            <div className='ef-foot'>
              <button
                type='button'
                className='ef-skip'
                onClick={() => {
                  setPicked([]);
                  goTo(index + 1);
                }}>
                Skip
              </button>
              {next('Pick a day')}
            </div>
          </section>
        )}

        {!done && question === 'day' && (
          <section className='ef-q'>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              Which day <em>works best?</em>
            </h2>
            <p className='ef-sub'>These are our open days. We call to confirm the exact time.</p>
            <div
              className='ef-cal'
              role='group'
              aria-label='Open days'>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((name) => (
                <span
                  key={name}
                  className='ef-dow'
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
                  className='ef-day'
                  disabled={!entry.open}
                  aria-pressed={day === entry.date}
                  aria-label={`${longDay(entry.date)}, ${entry.label.toLowerCase()}`}
                  onClick={() => setDay(entry.date)}>
                  <b>{Number(entry.date.slice(8))}</b>
                  <small>{entry.label}</small>
                </button>
              ))}
            </div>
            <div
              className='ef-times'
              role='group'
              aria-label='Best time'>
              {times.map((option) => (
                <button
                  key={option.id}
                  type='button'
                  aria-pressed={time === option.id}
                  onClick={() => setTime(option.id)}>
                  {option.id === 'Either' ? 'Either works' : option.id}
                  <small>{option.hint}</small>
                </button>
              ))}
            </div>
            <div className='ef-foot'>{next('Almost done')}</div>
          </section>
        )}

        {!done && question === 'details' && (
          <form
            className='ef-q'
            onSubmit={send}
            aria-busy={pending}>
            <h2
              ref={headingRef}
              tabIndex={-1}>
              Where should we <em>send it?</em>
            </h2>
            <p className='ef-sub'>
              {day && `${longDay(day)}, ${time === 'Either' ? 'any time' : time.toLowerCase()}. `}
              We’ll call or text to confirm.
            </p>
            <fieldset
              className='ef-form'
              disabled={pending}>
              <legend className='sr-only'>Your details</legend>
              <label>
                First name
                <input name='firstName' autoComplete='given-name' required maxLength={100} />
              </label>
              <label>
                Last name
                <input name='lastName' autoComplete='family-name' required maxLength={100} />
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
                <input name='email' type='email' autoComplete='email' required maxLength={254} />
              </label>
              <label className='ef-wide'>
                Street address
                <input name='address' autoComplete='street-address' required maxLength={200} />
              </label>
              <label>
                City
                <input name='city' autoComplete='address-level2' required maxLength={100} />
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
            <div className='ef-review'>
              <ul>
                {lines.map((line) => (
                  <li
                    key={line.label}
                    className={line.muted ? 'muted' : undefined}>
                    <span>{line.label}</span>
                    <span>{line.value}</span>
                  </li>
                ))}
              </ul>
              <p>
                <b>{clearPricePromise.title}.</b> {clearPricePromise.text}
              </p>
              <p>{paymentNote}</p>
            </div>
            {result && result.status !== 'saved' && (
              <p
                className='ef-error'
                role='alert'>
                {result.status === 'invalid'
                  ? 'Check your details and the day you picked, then try again.'
                  : result.status === 'conflict'
                    ? 'This request was already sent. We’ll be in touch soon.'
                    : `We couldn’t send your request just now. Please try again, or call or text ${company.phone}.`}
              </p>
            )}
            <div className='ef-foot'>
              <button
                className='ef-btn ef-btn-gold'
                type='submit'
                disabled={pending || !day}>
                {pending ? 'Sending…' : 'Send my request'}
                {!pending && <Arrow />}
              </button>
            </div>
          </form>
        )}

        {done && (
          <section
            className='ef-q ef-done'
            role='status'>
            <span
              className='ef-done-mark'
              aria-hidden='true'>
              <svg
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.6'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M6 12.5l4 4 8-9' />
              </svg>
            </span>
            <h2>
              Request received{firstName ? `, ${firstName}` : ''}. <em>We’ll be in touch.</em>
            </h2>
            <p className='ef-sub'>We’ll call or text to confirm the time and your final price.</p>
            <ol className='ef-tracker'>
              <li className='done'>
                <i />
                <b>Received</b>
                <span>Just now</span>
              </li>
              <li className='now'>
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
                <span>{day && `${longDay(day)}, ${time === 'Either' ? 'any time' : time.toLowerCase()}`}</span>
              </li>
            </ol>
            <p className='ef-club'>
              <b>{clearClub.title}.</b> {clearClub.text}
            </p>
          </section>
        )}
      </div>

      <p className='ef-help'>
        Stuck? Call or text <a href={company.phoneHref}>{company.phone}</a>
      </p>
    </div>
  );
}
