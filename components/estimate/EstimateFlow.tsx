'use client';

import { useRef, useState, type FormEvent } from 'react';
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

type Step = 1 | 2 | 3 | 4;

const stepNames = ['Your home', 'Your package', 'Request a day'] as const;
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

function Check() {
  return (
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
  );
}

// A small drawing of what each package cleans. The glass shines when picked.
function PackageArt({ id }: { id: PackageId }) {
  if (id === 'gold') {
    return (
      <svg viewBox='0 0 150 104' aria-hidden='true'>
        <defs>
          <clipPath id='ef-clip-gold'>
            <rect x='38' y='36' width='74' height='50' />
          </clipPath>
        </defs>
        <path className='ef-house' d='M18 50 L75 10 L132 50 M28 44 V92 H122 V44' />
        <rect className='ef-glass' x='38' y='36' width='74' height='50' />
        <g className='ef-mesh'>
          {[46, 56, 66, 76].map((y) => (
            <line key={y} x1='38' y1={y} x2='112' y2={y} />
          ))}
        </g>
        <g clipPath='url(#ef-clip-gold)'>
          <rect className='ef-shine' x='0' y='0' width='22' height='120' transform='rotate(20)' />
        </g>
        <rect className='ef-frame' x='38' y='36' width='74' height='50' rx='2' />
        <line className='ef-frame' x1='75' y1='36' x2='75' y2='86' />
        <rect className='ef-track' x='36' y='86' width='78' height='5' rx='2' />
      </svg>
    );
  }
  const wide = id === 'silver';
  const x = wide ? 20 : 35;
  const width = wide ? 110 : 80;
  return (
    <svg viewBox='0 0 150 104' aria-hidden='true'>
      <defs>
        <clipPath id={`ef-clip-${id}`}>
          <rect x={x} y='14' width={width} height='76' />
        </clipPath>
      </defs>
      <rect className='ef-glass' x={x} y='14' width={width} height='76' />
      <g clipPath={`url(#ef-clip-${id})`}>
        <rect className='ef-shine' x='0' y='0' width='22' height='120' transform='rotate(20)' />
      </g>
      <rect className='ef-frame' x={x} y='14' width={width} height='76' rx='2' />
      <line className='ef-frame' x1='75' y1='14' x2='75' y2='90' />
      {wide ? (
        <>
          <text x='47' y='102' textAnchor='middle'>inside</text>
          <text x='103' y='102' textAnchor='middle'>outside</text>
        </>
      ) : (
        <text x='75' y='102' textAnchor='middle'>outside</text>
      )}
    </svg>
  );
}

type EstimateFlowProps = {
  availability: Availability;
};

// The 3-step estimate: tell us about your home, pick a package (and any
// extras), then request a day. A live price panel sits beside it. Sending the
// request shows a tracker; we call to confirm, so nothing is booked yet.
export default function EstimateFlow({ availability }: EstimateFlowProps) {
  const [step, setStep] = useState<Step>(1);
  const [furthest, setFurthest] = useState<Step>(1);
  const [home, setHome] = useState<HomeDetails>(startingHome);
  const [packageId, setPackageId] = useState<PackageId>('silver');
  const [picked, setPicked] = useState<AddonId[]>([]);
  const [panels, setPanels] = useState(solarPanels.start);
  const firstOpen = availability.days.find((day) => day.open)?.date ?? '';
  const [day, setDay] = useState(firstOpen);
  const [time, setTime] = useState<string>('Morning');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AppointmentResult | null>(null);
  const [firstName, setFirstName] = useState('');
  const submissionKey = useRef<string | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const offered = addons.filter((addon) => addon.includedIn !== packageId);
  const chosenAddons = offered.filter((addon) => picked.includes(addon.id));

  const summary = (() => {
    const lines: { label: string; value: string; muted?: boolean }[] = [];
    const base = packagePrice(packageId, home);
    let total: Range = { ...base };
    lines.push({ label: `${packages.find((entry) => entry.id === packageId)?.name} package`, value: formatRange(base) });
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
    const needsReview =
      packageId === 'gold' || home.hardWater || chosenAddons.some((addon) => !addon.instant);
    return { lines, total, needsReview };
  })();

  const qualifying = chosenAddons.filter((addon) => addon.qualifies).length;

  function go(next: Step) {
    setStep(next);
    setFurthest((value) => (next > value ? next : value));
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        go(4);
      }
    } catch {
      setResult({ status: 'unavailable' });
    } finally {
      setPending(false);
    }
  }

  // The first empty cells line the first day up under its weekday.
  const leadingBlanks = availability.days.length
    ? new Date(`${availability.days[0].date}T12:00:00-07:00`).getUTCDay()
    : 0;

  return (
    <div
      ref={topRef}
      className='ef'>
      <div className='ef-flow'>
        <ol className='ef-steps'>
          {stepNames.map((name, index) => {
            const number = (index + 1) as Step;
            const state = step === 4 || number < step ? 'done' : number === step ? 'on' : '';
            return (
              <li
                key={name}
                className={state}>
                <button
                  type='button'
                  disabled={step === 4 || number > furthest}
                  aria-current={number === step ? 'step' : undefined}
                  onClick={() => go(number)}>
                  <span className='ef-bar'>
                    <i />
                  </span>
                  <span className='ef-step-name'>
                    Step {number}
                    <b>{name}</b>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>

        {step === 1 && (
          <div className='ef-pane'>
            <div>
              <h2>Tell us about your home</h2>
              <p className='ef-sub'>Four quick questions. A guess is fine; we confirm everything before any work starts.</p>
            </div>
            <div className='ef-q'>
              <label
                className='ef-q-label'
                htmlFor='ef-size'>
                Home size <output htmlFor='ef-size'>{home.size.toLocaleString('en-US')} sq ft</output>
              </label>
              <input
                id='ef-size'
                type='range'
                min={homeSize.min}
                max={homeSize.max}
                step={homeSize.step}
                value={home.size}
                onChange={(event) => setHome({ ...home, size: Number(event.target.value) })}
              />
              <p className='ef-help'>The living space on your listing or tax record.</p>
            </div>
            <fieldset className='ef-q'>
              <legend className='ef-q-label'>Stories</legend>
              <div className='ef-seg'>
                {([1, 2] as const).map((stories) => (
                  <button
                    key={stories}
                    type='button'
                    aria-pressed={home.stories === stories}
                    onClick={() => setHome({ ...home, stories })}>
                    {stories} story
                    {stories === 2 && <small>Upper glass from the ground with a pure water pole</small>}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className='ef-q'>
              <legend className='ef-q-label'>How dirty, honestly?</legend>
              <div className='ef-seg'>
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
            <fieldset className='ef-q'>
              <legend className='ef-q-label'>Anything we should know?</legend>
              <div className='ef-seg'>
                <button
                  type='button'
                  aria-pressed={!home.hardWater}
                  onClick={() => setHome({ ...home, hardWater: false })}>
                  Nothing special
                </button>
                <button
                  type='button'
                  aria-pressed={home.hardWater}
                  onClick={() => setHome({ ...home, hardWater: true })}>
                  Hard water spots
                  <small>We’ll ask for a photo</small>
                </button>
              </div>
            </fieldset>
            <div className='ef-nav'>
              <span className='ef-fine'>Your price updates as you go.</span>
              <button
                className='ef-btn ef-btn-gold'
                type='button'
                onClick={() => go(2)}>
                Choose a package <span aria-hidden='true'>→</span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className='ef-pane'>
            <div>
              <h2>Choose your cleaning</h2>
              <p className='ef-sub'>Priced for your home. Silver is what most people mean by “clean my windows”.</p>
            </div>
            <div
              className='ef-pkgs'
              role='radiogroup'
              aria-label='Cleaning package'>
              {packages.map((entry) => (
                <button
                  key={entry.id}
                  type='button'
                  role='radio'
                  aria-checked={packageId === entry.id}
                  className='ef-pkg'
                  onClick={() => setPackageId(entry.id)}>
                  {entry.recommended && <span className='ef-flag'>Recommended</span>}
                  <span className='ef-art'>
                    <PackageArt id={entry.id} />
                  </span>
                  <span className='ef-pkg-name'>{entry.name}</span>
                  <span className='ef-pkg-note'>{entry.note}</span>
                  <span className='ef-price'>
                    {formatRange(packagePrice(entry.id, home))}
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
            <p className='ef-upgrade'>{upgradeNotes[packageId]}</p>

            <div className='ef-addons'>
              <h3>
                Want to add anything else? <span>Optional. Skip it if not.</span>
              </h3>
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
                        <Check />
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
                              Math.min(solarPanels.max, Math.max(solarPanels.min, Number(event.target.value) || solarPanels.min)),
                            )
                          }
                        />
                      </label>
                    )}
                  </div>
                );
              })}
              {bonusOffer.enabled && qualifying === 1 && (
                <p className='ef-bonus'>
                  <span aria-hidden='true'>★</span>
                  {bonusOffer.text}
                </p>
              )}
            </div>
            <div className='ef-nav'>
              <button
                className='ef-btn ef-btn-ghost'
                type='button'
                onClick={() => go(1)}>
                <span aria-hidden='true'>←</span> Back
              </button>
              <button
                className='ef-btn ef-btn-gold'
                type='button'
                onClick={() => go(3)}>
                Pick a day <span aria-hidden='true'>→</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form
            className='ef-pane'
            onSubmit={send}
            aria-busy={pending}>
            <div>
              <h2>Request a day</h2>
              <p className='ef-sub'>
                These are our open days. This is a request: we call to confirm the time and your details.
              </p>
            </div>
            <fieldset className='ef-q'>
              <legend className='ef-q-label'>Preferred day</legend>
              <div className='ef-cal'>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((name) => (
                  <span
                    key={name}
                    className='ef-dow'
                    aria-hidden='true'>
                    {name}
                  </span>
                ))}
                {Array.from({ length: leadingBlanks }, (_, index) => (
                  <span key={`blank-${index}`} />
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
            </fieldset>
            <fieldset className='ef-q'>
              <legend className='ef-q-label'>Best time</legend>
              <div className='ef-seg'>
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
            </fieldset>
            <fieldset
              className='ef-form'
              disabled={pending}>
              <legend className='ef-q-label'>Your details</legend>
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
            <p className='ef-fine'>{paymentNote}</p>
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
            <div className='ef-nav'>
              <button
                className='ef-btn ef-btn-ghost'
                type='button'
                onClick={() => go(2)}>
                <span aria-hidden='true'>←</span> Back
              </button>
              <button
                className='ef-btn ef-btn-gold'
                type='submit'
                disabled={pending || !day}>
                {pending ? 'Sending…' : 'Send my request'}
              </button>
            </div>
          </form>
        )}

        {step === 4 && (
          <div
            className='ef-pane'
            role='status'>
            <div>
              <h2>Request received{firstName ? `, ${firstName}` : ''}.</h2>
              <p className='ef-sub'>We’ll call or text you to confirm the time and your final price.</p>
            </div>
            <ol className='ef-tracker'>
              <li className='done'>
                <span className='ef-pip'>
                  <i />
                </span>
                <span>
                  <b>Received</b>Just now
                </span>
              </li>
              <li className='now'>
                <span className='ef-pip'>
                  <i />
                </span>
                <span>
                  <b>Being reviewed</b>We check the details
                </span>
              </li>
              <li>
                <span className='ef-pip'>
                  <i />
                </span>
                <span>
                  <b>Confirmed</b>We call to set the time
                </span>
              </li>
              <li>
                <span className='ef-pip'>
                  <i />
                </span>
                <span>
                  <b>Cleaning day</b>
                  {day && `${longDay(day)}, ${time === 'Either' ? 'any time' : time.toLowerCase()}`}
                </span>
              </li>
            </ol>
            <div className='ef-recap'>
              <b>Your estimate: {formatRange(summary.total)}</b>
              {summary.needsReview && <span> plus the parts we confirm after review</span>}
            </div>
          </div>
        )}
      </div>

      <aside
        className='ef-summary'
        aria-live='polite'>
        <span className='ef-label'>Today’s estimate</span>
        <span className='ef-total'>{formatRange(summary.total)}</span>
        <span className={`ef-chip ${summary.needsReview ? 'ef-chip-review' : 'ef-chip-auto'}`}>
          {summary.needsReview ? 'Part of this needs review' : 'Instant estimate'}
        </span>
        <ul className='ef-lines'>
          {summary.lines.map((line) => (
            <li
              key={line.label}
              className={line.muted ? 'muted' : undefined}>
              <span>{line.label}</span>
              <span>{line.value}</span>
            </li>
          ))}
          <li className='muted'>
            <span>
              {home.size.toLocaleString('en-US')} sq ft · {home.stories} story · {home.dirt}
            </span>
          </li>
        </ul>
        <div className='ef-club'>
          <b>{clearClub.title}</b>
          {clearClub.text}
        </div>
        <p className='ef-promise'>
          <b>{clearPricePromise.title}</b>
          {clearPricePromise.text}
        </p>
        <p className='ef-help-line'>
          Stuck? Call or text <a href={company.phoneHref}>{company.phone}</a>
        </p>
      </aside>
    </div>
  );
}
