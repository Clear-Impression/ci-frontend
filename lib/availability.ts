import { createSign } from 'node:crypto';

// Which days customers can request, from our Google Calendar.
//
// The site only asks Google which times are busy ("free/busy"). It never reads
// what the appointments are and never writes to the calendar. Set these in
// .env.local (and in Vercel) to turn it on:
//   GOOGLE_CALENDAR_ID            the calendar to check, usually an email address
//   GOOGLE_SERVICE_ACCOUNT_EMAIL  a Google Cloud service account
//   GOOGLE_SERVICE_ACCOUNT_KEY    that account's private key (keep the \n's)
// Then share the calendar with the service account ("See only free/busy").
// Without them, every working day shows as open, so the page still works.

export type OpenDay = { date: string; open: boolean; label: 'Open' | 'Full' | 'Closed' };

export type Availability = { days: OpenDay[]; fromCalendar: boolean };

const timeZone = 'America/Phoenix';
// Working hours, Monday to Saturday.
const workStart = 8;
const workEnd = 16;
const closedWeekdays = [0];
// A day with this many busy hours or more shows as full.
const fullAfterHours = 6;
const daysAhead = 14;

// Arizona doesn't change its clocks, so it's always UTC-7.
const phoenixOffset = '-07:00';

function phoenixDate(daysFromToday: number) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
  const date = new Date(`${today}T12:00:00${phoenixOffset}`);
  date.setUTCDate(date.getUTCDate() + daysFromToday);
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(date);
}

function weekday(isoDate: string) {
  return new Date(`${isoDate}T12:00:00${phoenixOffset}`).getUTCDay();
}

const base64url = (input: string | Buffer) => Buffer.from(input).toString('base64url');

async function accessToken(email: string, key: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(
    JSON.stringify({
      iss: email,
      scope: 'https://www.googleapis.com/auth/calendar.freebusy',
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claims}`);
  const signature = signer.sign(key.replace(/\\n/g, '\n')).toString('base64url');

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${header}.${claims}.${signature}`,
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Google sign-in failed');
  const data: { access_token?: string } = await response.json();
  if (!data.access_token) throw new Error('Google sign-in failed');
  return data.access_token;
}

async function busyHoursByDay(dates: string[]) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!calendarId || !email || !key) return null;

  const token = await accessToken(email, key);
  const response = await fetch('https://www.googleapis.com/calendar/v3/freeBusy', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      timeMin: `${dates[0]}T00:00:00${phoenixOffset}`,
      timeMax: `${dates[dates.length - 1]}T23:59:59${phoenixOffset}`,
      timeZone,
      items: [{ id: calendarId }],
    }),
    cache: 'no-store',
  });
  if (!response.ok) throw new Error('Google free/busy failed');
  const data: { calendars?: Record<string, { busy?: { start: string; end: string }[] }> } = await response.json();
  const busy = data.calendars?.[calendarId]?.busy ?? [];

  // Busy hours inside working hours, for each day.
  const hours = new Map<string, number>();
  for (const date of dates) {
    const dayStart = new Date(`${date}T${String(workStart).padStart(2, '0')}:00:00${phoenixOffset}`).getTime();
    const dayEnd = new Date(`${date}T${String(workEnd).padStart(2, '0')}:00:00${phoenixOffset}`).getTime();
    let total = 0;
    for (const block of busy) {
      const start = Math.max(dayStart, new Date(block.start).getTime());
      const end = Math.min(dayEnd, new Date(block.end).getTime());
      if (end > start) total += (end - start) / 3_600_000;
    }
    hours.set(date, total);
  }
  return hours;
}

export async function getAvailability(): Promise<Availability> {
  // Start tomorrow, so there's time to review each request.
  const dates = Array.from({ length: daysAhead }, (_, index) => phoenixDate(index + 1));

  let busy: Map<string, number> | null = null;
  try {
    busy = await busyHoursByDay(dates);
  } catch {
    // If Google can't be reached, show working days as open. We confirm every
    // request by phone anyway.
    busy = null;
  }

  return {
    fromCalendar: busy !== null,
    days: dates.map((date) => {
      if (closedWeekdays.includes(weekday(date))) return { date, open: false, label: 'Closed' };
      if ((busy?.get(date) ?? 0) >= fullAfterHours) return { date, open: false, label: 'Full' };
      return { date, open: true, label: 'Open' };
    }),
  };
}
