import { NextRequest, NextResponse } from 'next/server';
import { ownerBackendUrl, ownerRequestOrigin, ownerSessionCookie } from '@/lib/ownerAuth';

export const runtime = 'nodejs';

function reply(message: string, status: number) {
  return NextResponse.json({ message }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  // Check the origin before forwarding credentials.
  const origin = ownerRequestOrigin(request);
  if (!origin) {
    return reply('Sign-in is not available from this address.', 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return reply('Send the sign-in form as JSON.', 415);
  }

  let payload: unknown;
  try {
    // Count bytes rather than trusting Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply('Enter your email and password.', 422);
    const decoder = new TextDecoder();
    let size = 0;
    let text = '';
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > 8192) {
          await reader.cancel();
          return reply('The sign-in request is too large.', 413);
        }
        text += decoder.decode(value, { stream: true });
      }
      text += decoder.decode();
    } finally {
      reader.releaseLock();
    }
    payload = JSON.parse(text);
  } catch {
    return reply('Unable to read the sign-in form.', 400);
  }

  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return reply('Enter your email and password.', 422);
  }
  const { email, password } = payload as Record<string, unknown>;
  if (typeof email !== 'string' || !email.trim() || email.trim().length > 254 ||
      typeof password !== 'string' || !password || password.length > 128) {
    return reply('Enter a valid email and password.', 422);
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      Origin: origin,
    };
    // Forward the session cookie so FastAPI can revoke the old session.
    const previousToken = request.cookies.get('owner_session')?.value;
    if (previousToken && /^[A-Za-z0-9_-]{43}$/.test(previousToken)) {
      headers.Cookie = `owner_session=${previousToken}`;
    }

    const upstream = await fetch(ownerBackendUrl('/auth/login'), {
      method: 'POST',
      headers,
      body: JSON.stringify({ email: email.trim(), password }),
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
    });

    if (upstream.status === 401) return reply('Incorrect email or password.', 401);
    if (upstream.status === 422) return reply('Enter a valid email and password.', 422);
    if (upstream.status === 429) return reply('Too many sign-in attempts. Please try again later.', 429);
    if (!upstream.ok) return reply('Sign-in is unavailable. Please try again.', 503);

    const cookie = ownerSessionCookie(upstream.headers);
    if (!cookie) return reply('Sign-in is unavailable. Please try again.', 503);

    const response = reply('Signed in.', 200);
    response.headers.append('Set-Cookie', cookie);
    return response;
  } catch {
    return reply('Unable to connect. Please try again.', 503);
  }
}
