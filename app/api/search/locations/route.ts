import { NextResponse } from 'next/server';
import { getLocations } from '@/lib/locations';
import type { SearchEntry } from '@/lib/search';

// City pages for the header search. They come from Sanity, so a city the
// owner adds shows up in search without changing the code.
export async function GET() {
  const { cities } = await getLocations();
  const entries: SearchEntry[] = cities.map((city) => ({
    type: 'location',
    title: city.name,
    href: city.href,
    description: `${city.region}. ${city.intro}`,
    short: city.region,
    keywords: ['az', 'arizona', 'city'],
  }));

  return NextResponse.json(entries, {
    headers: { 'Cache-Control': 'public, max-age=300' },
  });
}
