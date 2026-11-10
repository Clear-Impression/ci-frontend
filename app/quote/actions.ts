'use server';

type QuoteResult =
  | { status: 'saved'; id: string }
  | { status: 'invalid' | 'conflict' | 'unavailable' };

const uuidPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function readText(data: FormData, field: string) {
  const value = data.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

export async function submitQuote(data: FormData): Promise<QuoteResult> {
  const payload = {
    submission_key: readText(data, 'submissionKey'),
    first_name: readText(data, 'firstName'),
    last_name: readText(data, 'lastName'),
    email: readText(data, 'email'),
    phone: readText(data, 'phone'),
    address: readText(data, 'address'),
    city: readText(data, 'city'),
    state: 'AZ',
    postal_code: readText(data, 'postalCode'),
    property_type: readText(data, 'propertyType').toLowerCase(),
    services: data.getAll('services').filter((value) => typeof value === 'string'),
    details: readText(data, 'details') || null,
  };

  if (!uuidPattern.test(payload.submission_key) || !payload.services.length) {
    return { status: 'invalid' };
  }

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
    return { status: 'unavailable' };
  }
}
