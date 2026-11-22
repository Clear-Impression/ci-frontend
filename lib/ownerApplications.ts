import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ownerBackendUrl } from '@/lib/ownerAuth';

export type ApplicationSummary = {
  id: string;
  role_slug: string;
  role_title: string;
  name: string;
  city: string | null;
  created_at: string;
  resume_filename: string;
  resume_content_type: string;
  resume_size_bytes: number;
};

export type ApplicationDetail = ApplicationSummary & {
  email: string;
  phone: string;
  has_license: boolean;
  available_days: string[];
  start_date: string | null;
  experience: string | null;
};

export const applicationIdPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

// The owner's session token, or a trip to the login page.
export async function ownerToken(): Promise<string> {
  const token = (await cookies()).get('owner_session')?.value;
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) redirect('/owner/login');
  return token;
}

// Ask the backend with the owner's cookie. Null means the data is unavailable.
async function ownerGet<T>(path: string): Promise<T | null> {
  const token = await ownerToken();
  let response: Response;
  try {
    response = await fetch(ownerBackendUrl(path), {
      headers: { Cookie: `owner_session=${token}`, Accept: 'application/json' },
      cache: 'no-store',
      redirect: 'error',
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    return null;
  }
  if (response.status === 401 || response.status === 403) redirect('/owner/login');
  if (!response.ok) return null;
  return (await response.json()) as T;
}

export function getApplications() {
  return ownerGet<ApplicationSummary[]>('/api/v1/owner/applications');
}

export function getApplication(id: string) {
  if (!applicationIdPattern.test(id)) return Promise.resolve(null);
  return ownerGet<ApplicationDetail>(`/api/v1/owner/applications/${id}`);
}
