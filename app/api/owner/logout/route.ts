import { NextRequest, NextResponse } from 'next/server';
import { ownerBackendUrl, ownerRequestOrigin, ownerSessionCookie } from '@/lib/ownerAuth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const origin = ownerRequestOrigin(request);
  if (!origin) return NextResponse.json({ message: 'Sign-out is not available from this address.' }, {
    status: 403, headers: { 'Cache-Control': 'no-store' },
  });
  const token = request.cookies.get('owner_session')?.value;
  try {
    const headers: Record<string, string> = { Origin: origin };
    if (token && /^[A-Za-z0-9_-]{43}$/.test(token)) headers.Cookie = `owner_session=${token}`;
    const upstream = await fetch(ownerBackendUrl('/auth/logout'), {
      method: 'POST', headers, cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(10000),
    });
    const cookie = ownerSessionCookie(upstream.headers);
    if (!upstream.ok || !cookie) throw new Error('Sign-out unavailable.');
    return NextResponse.json({ message: 'Signed out.' }, {
      headers: { 'Cache-Control': 'no-store', 'Set-Cookie': cookie },
    });
  } catch {
    return NextResponse.json({ message: 'Unable to sign out. Please try again.' }, {
      status: 503, headers: { 'Cache-Control': 'no-store' },
    });
  }
}
