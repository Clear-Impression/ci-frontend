import type { FeatureCollection, MultiPolygon, Polygon, Position } from 'geojson';
import rawCityBoundaries from '@/data/geojson/service-city-boundaries.json';

const cityBoundaries = rawCityBoundaries as unknown as FeatureCollection;

type Point = [number, number];

// A degree of longitude is shorter than a degree of latitude this far
// north, so shrink it to keep the shapes from looking stretched.
const lonScale = Math.cos((33.4 * Math.PI) / 180);

// Flat x/y for a longitude/latitude pair, with north at the top.
function project([lon, lat]: Position): Point {
  return [lon * lonScale, -lat];
}

function ringArea(ring: Point[]) {
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const [x1, y1] = ring[i];
    const [x2, y2] = ring[(i + 1) % ring.length];
    total += x1 * y2 - x2 * y1;
  }
  return Math.abs(total / 2);
}

// The outer edge of each part of a city, largest first. Holes are left out,
// and so are tiny islands that would only add noise at small sizes.
function cityRings(name: string): Point[][] {
  const feature = cityBoundaries.features.find(
    (item) => item.properties?.name === name,
  );
  if (!feature) return [];
  const geometry = feature.geometry as Polygon | MultiPolygon;
  const polygons =
    geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  const rings = polygons
    .map((polygon) => polygon[0].map(project))
    .sort((first, second) => ringArea(second) - ringArea(first));
  if (rings.length === 0) return [];
  const largest = ringArea(rings[0]);
  return rings.filter((ring) => ringArea(ring) >= largest * 0.05);
}

// How far a point sits from the line between two others.
function distanceToLine([x, y]: Point, [x1, y1]: Point, [x2, y2]: Point) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  if (length === 0) return Math.hypot(x - x1, y - y1);
  return Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / length;
}

// Drop the points that barely change the outline (Ramer–Douglas–Peucker).
function simplify(points: Point[], tolerance: number): Point[] {
  if (points.length < 3) return points;
  let farthest = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const distance = distanceToLine(points[i], points[0], points[points.length - 1]);
    if (distance > farthest) {
      farthest = distance;
      index = i;
    }
  }
  if (farthest <= tolerance) return [points[0], points[points.length - 1]];
  return [
    ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(index), tolerance),
  ];
}

// Round to one decimal so the SVG paths stay short.
function round(value: number) {
  return Math.round(value * 10) / 10;
}

function ringPath(ring: Point[]) {
  return `M${ring.map(([x, y]) => `${round(x)} ${round(y)}`).join('L')}Z`;
}

// Scale and move flat points so a box of them fits inside a frame.
function fitTo(
  bounds: { minX: number; minY: number; maxX: number; maxY: number },
  width: number,
  height: number,
  padding: number,
) {
  const scale = Math.min(
    (width - padding * 2) / (bounds.maxX - bounds.minX),
    (height - padding * 2) / (bounds.maxY - bounds.minY),
  );
  const offsetX = (width - (bounds.maxX - bounds.minX) * scale) / 2;
  const offsetY = (height - (bounds.maxY - bounds.minY) * scale) / 2;
  return ([x, y]: Point): Point => [
    (x - bounds.minX) * scale + offsetX,
    (y - bounds.minY) * scale + offsetY,
  ];
}

function boundsOf(points: Point[]) {
  return {
    minX: Math.min(...points.map(([x]) => x)),
    minY: Math.min(...points.map(([, y]) => y)),
    maxX: Math.max(...points.map(([x]) => x)),
    maxY: Math.max(...points.map(([, y]) => y)),
  };
}

// A smooth line through each point in order (Catmull-Rom as Bézier curves).
function smoothPath(points: Point[]) {
  let path = `M${round(points[0][0])} ${round(points[0][1])}`;
  for (let i = 0; i < points.length - 1; i++) {
    const before = points[i - 1] ?? points[i];
    const start = points[i];
    const end = points[i + 1];
    const after = points[i + 2] ?? end;
    const control1 = [
      start[0] + (end[0] - before[0]) / 6,
      start[1] + (end[1] - before[1]) / 6,
    ];
    const control2 = [
      end[0] - (after[0] - start[0]) / 6,
      end[1] - (after[1] - start[1]) / 6,
    ];
    path += ` C${round(control1[0])} ${round(control1[1])} ${round(control2[0])} ${round(control2[1])} ${round(end[0])} ${round(end[1])}`;
  }
  return path;
}

type ValleyCity = {
  name: string;
  coordinates: [number, number];
};

// Everything the Locations header needs to draw the Valley: a pin for each
// city center, faint city outlines, and a route through the cities in order.
export function getValleyMap(
  cities: readonly ValleyCity[],
  routeOrder: readonly string[],
  { width, height, padding }: { width: number; height: number; padding: number },
) {
  // Fit the city centers to the frame; outlines can run past the edges.
  const centers = cities.map((city) => project([city.coordinates[1], city.coordinates[0]]));
  const toFrame = fitTo(boundsOf(centers), width, height, padding);

  const pins = cities.map((city, index) => {
    const [x, y] = toFrame(centers[index]);
    return { name: city.name, x: round(x), y: round(y) };
  });

  const outlines = cities.map((city) => ({
    name: city.name,
    path: cityRings(city.name)
      .map((ring) => ringPath(simplify(ring.map(toFrame), 0.8)))
      .join(''),
  }));

  const stops = routeOrder.flatMap((name): Point[] => {
    const pin = pins.find((item) => item.name === name);
    return pin ? [[pin.x, pin.y]] : [];
  });

  return { pins, outlines, route: stops.length > 1 ? smoothPath(stops) : '' };
}
