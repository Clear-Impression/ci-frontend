import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

function reply(message: string, status: number) {
  return NextResponse.json({ message }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  // Reject cross-site login requests before forwarding any credentials.
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin) {
    return reply('Sign-in is not available from this address.', 403);
  }
  if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
    return reply('Send the sign-in form as JSON.', 415);
  }

  let payload: unknown;
  try {
    // Bound the actual body size, including requests without Content-Length.
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
    // Forward only the owner cookie so FastAPI can replace an existing session.
    const previousToken = request.cookies.get('owner_session')?.value;
    if (previousToken && /^[A-Za-z0-9_-]{43}$/.test(previousToken)) {
      headers.Cookie = `owner_session=${previousToken}`;
    }

    const backend = process.env.OWNER_API_URL || process.env.API_BASE_URL || 'http://127.0.0.1:8000';
    const upstream = await fetch(new URL('/auth/login', backend), {
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

    const cookie = upstream.headers.getSetCookie().find((value) => value.startsWith('owner_session='));
    if (!cookie) return reply('Sign-in is unavailable. Please try again.', 503);

    const response = reply('Signed in.', 200);
    response.headers.append('Set-Cookie', cookie);
    return response;
  } catch {
    // Do not return backend errors, credentials, or session tokens in JSON.
    return reply('Unable to connect. Please try again.', 503);
  }
}
