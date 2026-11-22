'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { requestAppointment, type AppointmentResult } from '@/app/estimate/actions';
import { company } from '@/data/company';
import type { EstimateTab } from '@/data/estimate';
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
import './one-page-estimate.css';

// The four parts of the estimate, all on one page.
const parts = [
  { id: 'oe-home', label: 'Your home' },
  { id: 'oe-package', label: 'Your package' },
  { id: 'oe-extras', label: 'Anything else' },
  { id: 'oe-day', label: 'Request a day' },
] as const;

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

type OnePageEstimateProps = {
  // Instant prices, loaded from Sanity.
  tabs: readonly EstimateTab[];
  availability: Availability;
};

// The whole estimate on one page: the questions in the middle, a receipt of
// what you've picked on the left, and the live price with what's still to
// come on the right. Prices come from Sanity, so Niels can change them.
export default function OnePageEstimate({ tabs, availability }: OnePageEstimateProps) {
  const [home, setHome] = useState<HomeDetails>(startingHome);
  const [packageId, setPackageId] = useState<PackageId>('silver');
  const [picked, setPicked] = useState<AddonId[]>([]);
  const [panels, setPanels] = useState(solarPanels.start);
  const [day, setDay] = useState('');
  const [time, setTime] = useState<string>('Morning');
  const [current, setCurrent] = useState(0);
  const [reached, setReached] = useState(0);
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AppointmentResult | null>(null);
  const [sentTo, setSentTo] = useState('');
  const submissionKey = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const offered = addons.filter((addon) => addon.includedIn !== packageId);
  const chosenAddons = offered.filter((addon) => picked.includes(addon.id));
  const qualifying = chosenAddons.filter((addon) => addon.qualifies).length;
  const done = result?.status === 'saved';

  // Which part is on screen. Parts above it count as done.
  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.45;
      let index = 0;
      parts.forEach((part, position) => {
        const element = document.getElementById(part.id);
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
  }, []);

  // Choosing something in a part also counts as reaching it.
  const reach = (index: number) => setReached((value) => Math.max(value, index));

  // The running total, and what still needs a person to price it.
  const base = packagePrice(packageId, home, tabs);
  let total: Range = { ...base };
  for (const addon of chosenAddons) {
    const price = addonPrice(addon.id, home, panels, tabs);
    if (price) total = { low: total.low + price.low, high: total.high + price.high };
  }
  const needsReview = packageId === 'gold' || home.hardWater || chosenAddons.some((addon) => !addon.instant);
  const packageName = packages.find((entry) => entry.id === packageId)?.name ?? '';

  const stateOf = (index: number): 'done' | 'now' | 'later' =>
    done || index < current ? 'done' : index === current ? 'now' : index <= reached ? 'done' : 'later';

  // Progress ring: how many of the four parts are done.
  const finished = done ? parts.length : Math.min(parts.length, Math.max(current, reached) + (day ? 1 : 0));
  const step = Math.min(parts.length, current + 1);
  const ringLength = 157;

  function toggleAddon(id: AddonId) {
    reach(2);
    setPicked((value) => (value.includes(id) ? value.filter((entry) => entry !== id) : [...value, id]));
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

  // The receipt on the left: what's been picked so far.
  const receipt: { label: string; value: string; part: number }[] = [
    { label: 'Home', value: `${home.size.toLocaleString('en-US')} sq ft`, part: 0 },
    { label: 'Stories', value: `${home.stories}`, part: 0 },
    { label: 'Condition', value: dirtOptions.find((option) => option.id === home.dirt)?.label ?? '', part: 0 },
    { label: 'Hard water', value: home.hardWater ? 'Yes, photo needed' : 'No', part: 0 },
    { label: 'Package', value: `${packageName} · ${formatRange(base)}`, part: 1 },
    {
      label: 'Extras',
      value: chosenAddons.length ? chosenAddons.map((addon) => addon.name).join(', ') : 'None',
      part: 2,
    },
    { label: 'Day', value: day ? `${shortDay(day)}, ${time === 'Either' ? 'any time' : time.toLowerCase()}` : '', part: 3 },
  ];

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
            const waiting = !done && line.part > reached && !(line.part === 3 && day);
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
            <span>{formatRange(total)}</span>
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
              id='oe-home'
              number={1}
              title='Your home'
              note='A guess is fine'
              state={stateOf(0)}>
              <div className='oe-q'>
                <div className='oe-size'>
                  <label htmlFor='oe-size'>Home size</label>
                  <output htmlFor='oe-size'>
                    {home.size.toLocaleString('en-US')}
                    <small>sq ft</small>
                  </output>
                </div>
                <input
                  id='oe-size'
                  type='range'
                  min={homeSize.min}
                  max={homeSize.max}
                  step={homeSize.step}
                  value={home.size}
                  style={
                    {
                      '--fill': `${((home.size - homeSize.min) / (homeSize.max - homeSize.min)) * 100}%`,
                    } as React.CSSProperties
                  }
                  onChange={(event) => setHome({ ...home, size: Number(event.target.value) })}
                />
                <span className='oe-scale'>
                  <span>{homeSize.min.toLocaleString('en-US')}</span>
                  <span>{homeSize.max.toLocaleString('en-US')}+</span>
                </span>
              </div>
              <div className='oe-two'>
                <fieldset className='oe-q'>
                  <legend>Stories</legend>
                  <div className='oe-seg'>
                    {([1, 2] as const).map((stories) => (
                      <button
                        key={stories}
                        type='button'
                        aria-pressed={home.stories === stories}
                        onClick={() => setHome({ ...home, stories })}>
                        {stories} story
                      </button>
                    ))}
                  </div>
                </fieldset>
                <fieldset className='oe-q'>
                  <legend>Hard water spots?</legend>
                  <div className='oe-seg'>
                    <button
                      type='button'
                      aria-pressed={!home.hardWater}
                      onClick={() => setHome({ ...home, hardWater: false })}>
                      No
                    </button>
                    <button
                      type='button'
                      aria-pressed={home.hardWater}
                      onClick={() => setHome({ ...home, hardWater: true })}>
                      Yes
                    </button>
                  </div>
                </fieldset>
              </div>
              <fieldset className='oe-q'>
                <legend>How dirty, honestly?</legend>
                <div className='oe-chips'>
                  {dirtOptions.map((option) => (
                    <button
                      key={option.id}
                      type='button'
                      aria-pressed={home.dirt === option.id}
                      onClick={() => setHome({ ...home, dirt: option.id })}>
                      {option.label}
                      <small>{option.hint}</small>
                    </button>
                  ))}
                </div>
              </fieldset>
            </Section>

            <Section
              id='oe-package'
              number={2}
              title='Choose your package'
              note='Most people pick Silver'
              state={stateOf(1)}>
              <div
                className='oe-pkgs'
                role='radiogroup'
                aria-label='Cleaning package'>
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
                      reach(1);
                    }}>
                    {entry.recommended && <span className='oe-flag'>Recommended</span>}
                    <span className='oe-art'>
                      <PackageArt id={entry.id} />
                    </span>
                    <b>{entry.name}</b>
                    <span className='oe-pkg-note'>{entry.note}</span>
                    <span className='oe-pkg-price'>
                      {formatRange(packagePrice(entry.id, home, tabs))}
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

            <Section
              id='oe-extras'
              number={3}
              title='Want to add anything else?'
              note='Optional'
              state={stateOf(2)}>
              <div className='oe-addons'>
                {offered.map((addon) => {
                  const on = picked.includes(addon.id);
                  const price = addonPrice(addon.id, home, panels, tabs);
                  return (
                    <div
                      key={addon.id}
                      className='oe-addon-row'>
                      <button
                        type='button'
                        className='oe-addon'
                        aria-pressed={on}
                        onClick={() => toggleAddon(addon.id)}>
                        <span
                          className='oe-box'
                          aria-hidden='true'>
                          ✓
                        </span>
                        <span className='oe-what'>
                          <b>{addon.name}</b>
                          <span>{addon.id === 'solar' ? `${panels} panels` : addon.note}</span>
                        </span>
                        <span className='oe-amt'>
                          {price ? (
                            <>
                              +{formatRange(price)}
                              <span className='oe-chip oe-chip-auto'>Instant</span>
                            </>
                          ) : (
                            <span className='oe-chip oe-chip-review'>Needs review</span>
                          )}
                        </span>
                      </button>
                      {addon.id === 'solar' && on && (
                        <label className='oe-panels'>
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
              {bonusOffer.enabled && qualifying === 1 && <p className='oe-bonus'>{bonusOffer.text}</p>}
            </Section>

            <Section
              id='oe-day'
              number={4}
              title='Request a day'
              note='We call to confirm'
              state={stateOf(3)}>
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
                          reach(3);
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
                        {option.id === 'Either' ? 'Either' : option.id}
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
          <b>{formatRange(total)}</b>
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
        <p className='oe-club'>
          <b>{clearClub.title}</b>
          {clearClub.text}
        </p>
      </aside>
    </div>
  );
}
