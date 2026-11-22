import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ownerBackendUrl } from '@/lib/ownerAuth';

// Validate with the backend on every request, including direct page visits.
// False means verification is unavailable; protected content must stay hidden.
export async function verifyOwnerSession(): Promise<boolean> {
  const token = (await cookies()).get('owner_session')?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    redirect('/owner/login');
  }

  let status = 503;
  try {
    const response = await fetch(ownerBackendUrl('/auth/me'), {
      headers: { Cookie: `owner_session=${token}` },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(5000),
    });
    status = response.status;
  } catch {
    return false;
  }

  if (status === 401 || status === 403) redirect('/owner/login');
  return status === 200;
}
