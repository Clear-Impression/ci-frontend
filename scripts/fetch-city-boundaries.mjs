//Script which calls Nominatim API to obtain city boundaries. See line 15!
//Run this script via ./fetch-city-boundaries.mjs on your machine to add boundaries.

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = path.join(
  root,
  'data',
  'geojson',
  'service-city-boundaries.json',
);

//Use to define cities to add boundaries to /data/geojson/service-city-boundaries.json !!
//EXAMPLE: const cities = ['Scottsdale', 'Paradise Valley', 'Queen Creek', 'Glendale'];
const cities = [''];
//

const userAgent = 'ci-frontend-city-boundaries/1.0 (Clear Impression Services)';

async function fetchBoundary(city) {
  const query = new URLSearchParams({
    q: `${city}, Arizona, United States`,
    format: 'jsonv2',
    limit: '1',
    addressdetails: '1',
    polygon_geojson: '1',
  });
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?${query}`,
    {
      headers: {
        Accept: 'application/json',
        'User-Agent': userAgent,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Nominatim returned ${response.status} for ${city}`);
  }

  const results = await response.json();
  const result = results[0];
  if (!result?.geojson || !['Polygon', 'MultiPolygon'].includes(result.geojson.type)) {
    throw new Error(`No polygon boundary found for ${city}`);
  }

  return {
    type: 'Feature',
    properties: {
      place_id: result.place_id,
      osm_type: result.osm_type,
      osm_id: result.osm_id,
      place_rank: result.place_rank,
      category: result.category,
      type: result.type,
      importance: result.importance,
      addresstype: result.addresstype,
      name: city,
      display_name: result.display_name,
    },
    bbox: result.boundingbox
      ? [
          Number(result.boundingbox[2]),
          Number(result.boundingbox[0]),
          Number(result.boundingbox[3]),
          Number(result.boundingbox[1]),
        ]
      : undefined,
    geometry: result.geojson,
  };
}

const existing = JSON.parse(await readFile(outputPath, 'utf8'));
const fetched = [];

for (const city of cities) {
  fetched.push(await fetchBoundary(city));
  console.log(`Fetched ${city}`);
  await new Promise((resolve) => setTimeout(resolve, 1100));
}

const fetchedNames = new Set(cities);
const features = [
  ...existing.features.filter(
    (feature) => !fetchedNames.has(feature.properties?.name),
  ),
  ...fetched,
];

await writeFile(
  outputPath,
  `${JSON.stringify(
    {
      type: 'FeatureCollection',
      licence: 'Data © OpenStreetMap contributors, ODbL 1.0',
      features,
    },
    null,
    2,
  )}\n`,
);

console.log(`Saved ${fetched.length} boundaries to ${path.relative(root, outputPath)}`);
