import { formatRange, totalRange, type EstimateTab } from './estimate';
import { canFinalizeQuote, quoteLines, restoreQuoteFlow, quoteServices } from './estimate-flow';

export type EstimateContact = { name: string; email: string; phone: string; address: string; city: string };
export const estimatePhonePattern = String.raw`\+?(?:[\(\). \-]*[0-9]){7,15}[\(\). \-]*`;
export function contactError(contact: EstimateContact): { field: keyof EstimateContact; message: string } | null {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) || contact.email.length > 254) return { field: 'email', message: 'Enter a valid email address.' };
  if (!new RegExp(`^${estimatePhonePattern}$`).test(contact.phone.trim()) || contact.phone.length > 32) return { field: 'phone', message: 'Enter a phone number with 7 to 15 digits.' };
  if (!contact.city.trim() || contact.city.length > 100 || contact.city.includes('\0')) return { field: 'city', message: 'Choose your city.' };
  if (contact.name.length > 100 || contact.name.includes('\0')) return { field: 'name', message: 'Keep your name under 100 characters.' };
  if (contact.address.length > 200 || contact.address.includes('\0')) return { field: 'address', message: 'Keep your address under 200 characters.' };
  return null;
}

// Only these legacy categories are accepted by the existing quote API.
const apiCategory: Record<string, string> = {
  'residential-window-washing': 'window-cleaning',
  'screen-deep-cleaning': 'screen-cleaning',
  'solar-panel-cleaning': 'solar-panel-cleaning',
  'gutter-roof-care': 'window-cleaning',
  'hard-water-stain-removal': 'window-cleaning',
};

export function buildInstantQuoteRequest(contact: EstimateContact, selected: string[], values: unknown, photoSent: boolean, tabs: readonly EstimateTab[]) {
  const flow = restoreQuoteFlow(tabs, { added: selected, values, photoSent });
  if (contactError(contact) || !canFinalizeQuote(flow, tabs) || selected.length !== flow.selected.length ||
    selected.some((slug) => !quoteServices.some((service) => service.slug === slug))) return null;
  const lines = quoteLines(flow, tabs);
  const total = totalRange(lines);
  const compatibilityServices = flow.selected.filter((slug) => ['gutter-roof-care', 'hard-water-stain-removal'].includes(slug));
  const notes = [
    'Instant quote request — residential / single building',
    `Customer name: ${contact.name.trim() || 'Not provided'}`,
    `Customer address: ${contact.address.trim() || 'Not provided'}; city: ${contact.city.trim()}`,
    'ZIP 00000 is a compatibility placeholder, not the customer’s ZIP. Any address marked Not provided is a placeholder.',
    ...(compatibilityServices.length ? ['API category note: gutters/hard-water use window-cleaning for compatibility. Quote the actual selected services listed below.'] : []),
    ...lines.map((line) => `${line.name}: ${line.range ? formatRange(line.range) : 'Photo quote — not included in priced total'}\n  ${line.details}`),
    `Priced services total: ${total ? formatRange(total) : 'Photo quote only'}`,
    'Ballpark estimate only; final price requires confirmation.',
  ].join('\n');
  const [firstName, ...lastName] = contact.name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: firstName || 'Name', lastName: lastName.join(' ') || (firstName ? '(not provided)' : 'not provided'),
    email: contact.email.trim(), phone: contact.phone.trim(),
    address: contact.address.trim() || 'Not provided (instant quote)', city: contact.city.trim(),
    postalCode: '00000', propertyType: 'residential',
    services: [...new Set(flow.selected.map((slug) => apiCategory[slug]))].sort(),
    details: notes,
  };
}
