'use server';

import { submitQuote } from '@/app/quote/actions';
import { getEstimatePricing } from '@/lib/estimate-pricing';
import { quoteTabs } from '@/data/estimate-flow';
import { buildInstantQuoteRequest, contactError, type EstimateContact } from '@/data/estimate-request';

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
