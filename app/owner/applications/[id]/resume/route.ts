import { NextRequest, NextResponse } from 'next/server';
import { ownerBackendUrl } from '@/lib/ownerAuth';
import { applicationIdPattern } from '@/lib/ownerApplications';

export const runtime = 'nodejs';

const noStore = { 'Cache-Control': 'no-store' };

// The resume download. The owner cookie lives on the website's domain, so the
// website asks the backend for the file and passes it through.
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = request.cookies.get('owner_session')?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return NextResponse.redirect(new URL('/owner/login', request.url), { headers: noStore });
  }
  if (!applicationIdPattern.test(id)) {
    return NextResponse.json({ message: 'Resume not found.' }, { status: 404, headers: noStore });
  }

  try {
    const upstream = await fetch(ownerBackendUrl(`/api/v1/owner/applications/${id}/resume`), {
      headers: { Cookie: `owner_session=${token}` },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(15_000),
    });
    if (upstream.status === 401 || upstream.status === 403) {
      return NextResponse.redirect(new URL('/owner/login', request.url), { headers: noStore });
    }
    if (upstream.status === 404) {
      return NextResponse.json({ message: 'Resume not found.' }, { status: 404, headers: noStore });
    }
    if (!upstream.ok || !upstream.body) throw new Error('Resume unavailable.');

    return new NextResponse(upstream.body, {
      headers: {
        ...noStore,
        'Content-Type': upstream.headers.get('content-type') ?? 'application/octet-stream',
        'Content-Disposition': upstream.headers.get('content-disposition') ?? 'attachment',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch {
    return NextResponse.json(
      { message: 'Unable to download the resume. Please try again.' },
      { status: 503, headers: noStore },
    );
  }
}
