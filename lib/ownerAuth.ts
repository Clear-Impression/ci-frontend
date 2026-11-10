import 'server-only';
import type { NextRequest } from 'next/server';

export function ownerBackendUrl(path: string): URL {
  const address = process.env.OWNER_API_URL || process.env.API_BASE_URL;
  if (!address && process.env.NODE_ENV === 'production') {
    throw new Error('Configure OWNER_API_URL or API_BASE_URL.');
  }
  const url = new URL(path, address || 'http://127.0.0.1:8000');
  if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password ||
      (process.env.NODE_ENV === 'production' && url.protocol !== 'https:')) {
    throw new Error('Configure a valid HTTPS owner API URL.');
  }
  return url;
}

export function ownerRequestOrigin(request: NextRequest): string | null {
  // Hosting proxies can rewrite Host; use the configured website origin.
  const configured = process.env.OWNER_SITE_URL;
  if (!configured && process.env.NODE_ENV === 'production') return null;
  const expected = new URL(configured || request.url).origin;
  if (process.env.NODE_ENV === 'production' && !expected.startsWith('https://')) return null;
  return request.headers.get('origin') === expected ? expected : null;
}

export function ownerSessionCookie(headers: Headers): string | undefined {
  const cookie = headers.getSetCookie().find((value) => value.startsWith('owner_session='));
  if (!cookie || !/;\s*HttpOnly(?:;|$)/i.test(cookie) ||
      !/;\s*SameSite=Lax(?:;|$)/i.test(cookie) ||
      (process.env.NODE_ENV === 'production' && !/;\s*Secure(?:;|$)/i.test(cookie))) return undefined;
  return cookie;
}
