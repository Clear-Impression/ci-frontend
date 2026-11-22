'use server';

import { submitQuote } from '@/app/quote/actions';
import { getEstimatePricing } from '@/lib/estimate-pricing';
import { quoteTabs } from '@/data/estimate-flow';
import { buildInstantQuoteRequest, contactError, type EstimateContact } from '@/data/estimate-request';

import {
  addonPrice,
  addons,
  formatRange,
  packagePrice,
  packages,
  solarPanels,
  type AddonId,
  type HomeDetails,
  type PackageId,
} from '@/data/packages';

// Sends an appointment request from the estimate to our backend, using the
// same quote endpoint as the /quote page. The package, add-ons, price and
// requested day go in the details, so nothing changes on the backend.
// Next step: pass it on to The Customer Factor (through Zapier) for texts.

export type AppointmentRequest = {
  submissionKey: string;
  home: HomeDetails;
  packageId: PackageId;
  addons: AddonId[];
  panels: number;
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

// Which backend service each choice belongs to.
const backendService: Partial<Record<AddonId, string>> = {
  screens: 'screen-cleaning',
  solar: 'solar-panel-cleaning',
};

const clip = (value: unknown, limit: number) => (typeof value === 'string' ? value.trim().slice(0, limit) : '');

export async function requestAppointment(request: AppointmentRequest): Promise<AppointmentResult> {
  const chosen = packages.find((entry) => entry.id === request.packageId);
  const picked = addons.filter(
    (addon) => request.addons.includes(addon.id) && addon.includedIn !== request.packageId,
  );
  const panels = Math.min(solarPanels.max, Math.max(solarPanels.min, Math.round(Number(request.panels) || 0)));
  const home: HomeDetails = {
    size: Math.min(20000, Math.max(0, Math.round(Number(request.home?.size) || 0))),
    stories: request.home?.stories === 2 ? 2 : 1,
    dirt: ['light', 'normal', 'rough'].includes(request.home?.dirt) ? request.home.dirt : 'normal',
    hardWater: Boolean(request.home?.hardWater),
  };

  if (!chosen || !uuidPattern.test(request.submissionKey) || !datePattern.test(request.day)) {
    return { status: 'invalid' };
  }

  // Prices are worked out again here, so the request shows what the
  // customer saw even if the page was changed in their browser.
  const lines = [
    `Package: ${chosen.name} (${formatRange(packagePrice(chosen.id, home))})`,
    ...picked.map((addon) => {
      const price = addonPrice(addon.id, home, panels);
      const extra = addon.id === 'solar' ? `, ${panels} panels` : '';
      return `Add-on: ${addon.name}${extra} (${price ? formatRange(price) : 'needs a custom quote'})`;
    }),
    `Home: ${home.size.toLocaleString('en-US')} sq ft, ${home.stories} story, ${home.dirt}${home.hardWater ? ', hard water spots' : ''}`,
    `Requested day: ${request.day}, ${clip(request.time, 20) || 'any time'}`,
    'Source: instant estimate (request, not a confirmed booking)',
  ];

  const services = new Set(['window-cleaning']);
  for (const addon of picked) {
    const service = backendService[addon.id];
    if (service) services.add(service);
  }
  if (chosen.id === 'gold') services.add('screen-cleaning');

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
    property_type: 'residential',
    services: [...services],
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
