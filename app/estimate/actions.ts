'use server';

import { submitQuote } from '@/app/quote/actions';
import { getEstimatePricing } from '@/lib/estimate-pricing';
import { quoteTabs } from '@/data/estimate-flow';
import { buildInstantQuoteRequest, contactError, type EstimateContact } from '@/data/estimate-request';

import { describeValues, rangeFor, type EstimateValues } from '@/data/estimate';
import {
  cleanValues,
  clubPlans,
  extras,
  formatRange,
  homeFromValues,
  packagePrice,
  packages,
  type ClubPlan,
  type ExtraId,
  type PackageId,
  type Range,
} from '@/data/packages';

// Sends a request from the one-page estimate to our backend, using the same
// quote endpoint as the /quote page. The services, package, extras, price and
// requested day go in the details, so nothing changes on the backend.
// Next step: pass it on to The Customer Factor (through Zapier) for texts.

export type AppointmentRequest = {
  submissionKey: string;
  services: { slug: string; values: EstimateValues }[];
  // Only used when windows are picked.
  packageId: PackageId | null;
  extras: ExtraId[];
  plan: ClubPlan;
  day: string;
  time: string;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
};

export type AppointmentResult =
  | { status: 'saved'; id: string }
  | { status: 'invalid' | 'conflict' | 'unavailable' };

const uuidPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const windowsSlug = 'residential-window-washing';

// The quote API only knows three categories; the details say exactly what was picked.
const backendService: Record<string, string> = {
  'residential-window-washing': 'window-cleaning',
  'commercial-office-glass': 'window-cleaning',
  'gutter-roof-care': 'window-cleaning',
  'hard-water-stain-removal': 'window-cleaning',
  'screen-deep-cleaning': 'screen-cleaning',
  'solar-panel-cleaning': 'solar-panel-cleaning',
};

const clip = (value: unknown, limit: number) => (typeof value === 'string' ? value.trim().slice(0, limit) : '');

export async function requestAppointment(request: AppointmentRequest): Promise<AppointmentResult> {
  // Prices are worked out again here from the Sanity prices, so the request
  // shows the real numbers even if the page was changed in the browser.
  const tabs = await getEstimatePricing();
  const given = Array.isArray(request.services) ? request.services.slice(0, tabs.length) : [];
  const slugs = given.map((entry) => entry?.slug);
  const chosen = tabs.filter((tab) => slugs.includes(tab.slug));
  const packageEntry = packages.find((entry) => entry.id === request.packageId);
  const hasWindows = chosen.some((tab) => tab.slug === windowsSlug);

  if (
    !chosen.length ||
    chosen.length !== new Set(slugs).size ||
    (hasWindows && !packageEntry) ||
    !uuidPattern.test(request.submissionKey) ||
    !datePattern.test(request.day)
  ) {
    return { status: 'invalid' };
  }

  const lines: string[] = [];
  let total: Range = { low: 0, high: 0 };
  const add = (range: Range | null) => {
    if (range) total = { low: total.low + range.low, high: total.high + range.high };
  };

  for (const tab of chosen) {
    const values = cleanValues(tab, given.find((entry) => entry.slug === tab.slug)?.values);
    if (tab.slug === windowsSlug && packageEntry) {
      const price = packagePrice(packageEntry.id, homeFromValues(values), tabs);
      add(price);
      const answers = tab.questions
        .filter((question) => question.id === 'size' || question.id === 'height' || question.id === 'dirt')
        .map((question) => describeValues({ ...tab, questions: [question] }, values));
      lines.push(`${tab.name}: ${packageEntry.name} package (${formatRange(price)})\n  ${answers.join(' · ')}`);
      continue;
    }
    if (tab.slug === 'screen-deep-cleaning' && packageEntry?.id === 'gold' && hasWindows) {
      lines.push(`${tab.name}: included in Gold\n  ${describeValues(tab, values)}`);
      continue;
    }
    const price = rangeFor(tab, values);
    add(price);
    lines.push(
      price
        ? `${tab.name}: ${formatRange(price)}\n  ${describeValues(tab, values)}`
        : `${tab.name}: needs a photo to price`,
    );
  }

  const pickedExtras = extras.filter(
    (extra) => request.extras?.includes(extra.id) && !(hasWindows && extra.includedIn === packageEntry?.id),
  );
  for (const extra of pickedExtras) lines.push(`Extra: ${extra.name} (needs a custom quote)`);

  const plan = clubPlans.find((entry) => entry.id === request.plan) ?? clubPlans[0];
  lines.push(
    `Instant total: ${total.high ? formatRange(total) : 'priced after review'}`,
    `Clear Club: ${plan.id === 'once' ? 'not now (one-time clean)' : plan.label.toLowerCase()}`,
    `Requested day: ${request.day}, ${clip(request.time, 20) || 'any time'}`,
    'Source: instant estimate (request, not a confirmed booking)',
  );

  const services = [...new Set(chosen.map((tab) => backendService[tab.slug] ?? 'window-cleaning'))];
  if (hasWindows && packageEntry?.id === 'gold') services.push('screen-cleaning');
  const commercialOnly = chosen.every((tab) => tab.slug === 'commercial-office-glass');

  const payload = {
    submission_key: request.submissionKey,
    first_name: clip(request.contact?.firstName, 100),
    last_name: clip(request.contact?.lastName, 100),
    email: clip(request.contact?.email, 254),
    phone: clip(request.contact?.phone, 32),
    address: clip(request.contact?.address, 200),
    city: clip(request.contact?.city, 100),
    state: 'AZ',
    postal_code: clip(request.contact?.postalCode, 10),
    property_type: commercialOnly ? 'commercial' : 'residential',
    services: [...new Set(services)],
    details: lines.join('\n'),
  };

  const baseUrl = (process.env.API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  try {
    const response = await fetch(baseUrl + '/api/v1/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
      signal: AbortSignal.timeout(65_000),
    });

    if (response.status === 422) return { status: 'invalid' };
    if (response.status === 409) return { status: 'conflict' };
    if (response.status !== 200 && response.status !== 201) return { status: 'unavailable' };

    const receipt: { id?: unknown } = await response.json();
    if (typeof receipt.id === 'string' && uuidPattern.test(receipt.id)) {
      return { status: 'saved', id: receipt.id };
    }
    return { status: 'unavailable' };
  } catch {
    // Running the site locally without the backend: pretend it worked, so
    // the whole flow can be tried. Never happens on the live site.
    if (process.env.NODE_ENV === 'development') {
      console.warn('Backend not reachable; showing the request as sent (local preview only).');
      return { status: 'saved', id: crypto.randomUUID() };
    }
    return { status: 'unavailable' };
  }
}

// Active service-by-service quote flow. Package appointments remain inactive.
export async function submitInstantQuote(data: FormData) {
  const text = (field: string) => typeof data.get(field) === 'string' ? String(data.get(field)).trim() : '';
  const contact: EstimateContact = { name: text('name'), email: text('email'), phone: text('phone'), address: text('address'), city: text('city') };
  const error = contactError(contact);
  if (error) return { status: 'invalid' as const, ...error };
  const key = text('submissionKey');
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(key)) return { status: 'invalid' as const, message: 'Please refresh and try again.' };
  const valuesText = text('values');
  if (valuesText.length > 20_000) return { status: 'invalid' as const, message: 'Please check your selected services.' };
  let values: unknown;
  try { values = JSON.parse(valuesText); }
  catch { return { status: 'invalid' as const, message: 'Please check your quote answers.' }; }
  const selected = data.getAll('services');
  if (!selected.every((value): value is string => typeof value === 'string')) return { status: 'invalid' as const, message: 'Please select your services again.' };
  // Never trust submitted prices: rebuild all line items using published Sanity rates.
  const tabs = quoteTabs(await getEstimatePricing());
  const payload = buildInstantQuoteRequest(contact, selected, values, text('photoSent') === 'true', tabs);
  if (!payload) return { status: 'invalid' as const, message: 'Please review the selected services and cleaning options.' };
  if (text('pricingVersion') !== JSON.stringify(tabs)) return { status: 'pricing_changed' as const, tabs };
  const request = new FormData();
  request.set('submissionKey', key);
  for (const [field, value] of Object.entries(payload)) {
    if (field === 'services') for (const service of value as string[]) request.append('services', service);
    else request.set(field, value as string);
  }
  // Reuse the detailed form's storage, retry semantics, and email notifications.
  return submitQuote(request);
}
