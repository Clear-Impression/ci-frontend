'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  LayerGroup,
  Map as LeafletMap,
  Marker,
} from 'leaflet';
import type { ServiceCity } from '@/data/home';
import 'leaflet/dist/leaflet.css';

type ServiceAreaMapProps = {
  cities: readonly ServiceCity[];
  large?: boolean;
  showBoundaries?: boolean;
};

export default function ServiceAreaMap({
  cities,
  large = false,
  showBoundaries = false,
}: ServiceAreaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const boundariesRef = useRef<LayerGroup | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [boundaryStatus, setBoundaryStatus] = useState<
    'idle' | 'loading' | 'ready' | 'error'
  >('idle');
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const markers = markersRef.current;

    async function loadBoundaries(
      L: typeof import('leaflet'),
      targetMap: LeafletMap,
    ) {
      if (!showBoundaries) return;

      setBoundaryStatus('loading');
      const boundaryLayer = L.layerGroup().addTo(targetMap);
      boundariesRef.current = boundaryLayer;

      try {
        for (const [index, city] of cities.entries()) {
          if (cancelled) return;

          if (index > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1100));
          }

          const params = new URLSearchParams({
            q: `${city.name}, Arizona, USA`,
            format: 'jsonv2',
            limit: '1',
            polygon_geojson: '1',
          });
          console.log(`${params.toString()}`);
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?${params.toString()}`,
            { headers: { Accept: 'application/json' } },
          );
          if (!response.ok) {
            throw new Error(
              `Nominatim returned ${response.status} for ${city.name}.`,
            );
          }

          const results: unknown = await response.json();
          if (
            !Array.isArray(results) ||
            !results[0] ||
            typeof results[0] !== 'object' ||
            !('geojson' in results[0]) ||
            !isGeoJsonObject(results[0].geojson)
          ) {
            throw new Error(`No polygon boundary was returned for ${city.name}!`);
          }

          L.geoJSON(results[0].geojson, {
            style: {
              color: '#6c3fb8',
              fillColor: '#8f63d0',
              fillOpacity: 0.12,
              opacity: 0.85,
              weight: 2,
            },
          }).addTo(boundaryLayer);
        }

        if (!cancelled) setBoundaryStatus('ready');
      } catch (error) {
        if (!cancelled) {
          console.error('Unable to load city boundaries.', error);
          setBoundaryStatus('error');
        }
      }
    }

    async function setupMap() {
      try {
        // Load Leaflet in the browser; it needs the window and map container.
        const L = await import('leaflet');
        if (cancelled || !containerRef.current) return;

        map = L.map(containerRef.current, {
          scrollWheelZoom: false,
          minZoom: 8,
          maxZoom: 16,
          attributionControl: true,
        });
        mapRef.current = map;

        // Start with the wider Phoenix area rather than a single city.
        map.fitBounds(
          [
            [33.15, -112.4],
            [33.75, -111.5],
          ],
          { padding: [12, 12] },
        );

        const tiles = L.tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        );
        tiles.on('tileerror', () => {
          if (!cancelled) setTileError(true);
        });
        tiles.addTo(map);

        // Use our own purple pins instead of Leaflet's default image files.
        const icon = L.divIcon({
          className: '',
          html: '<svg width="32" height="40" viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 1C7.7 1 1 7.7 1 16c0 10 15 23 15 23s15-13 15-23C31 7.7 24.3 1 16 1Z" fill="#6c3fb8" stroke="white" stroke-width="2"/><circle cx="16" cy="15" r="5" fill="white"/></svg>',
          iconSize: [32, 40],
          iconAnchor: [16, 40],
          popupAnchor: [0, -35],
        });

        for (const city of cities) {
          const popup = document.createElement('p');
          popup.textContent = `${city.name} — window cleaning service available.`;
          const marker = L.marker(city.coordinates, {
            icon,
            title: `${city.name} service area`,
            alt: `${city.name} service area`,
            keyboard: true,
          })
            .bindPopup(popup)
            .addTo(map);
          markers.set(city.name, marker);
        }

        // Keep the map sized correctly when the page changes columns.
        resizeObserver = new ResizeObserver(() => map?.invalidateSize());
        resizeObserver.observe(containerRef.current);
        setStatus('ready');
        void loadBoundaries(L, map);
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    void setupMap();

    // Remove the old map when leaving the page or remounting in development.
    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      map?.remove();
      mapRef.current = null;
      boundariesRef.current = null;
      markers.clear();
    };
  }, [cities, showBoundaries]);

  function showCity(city: ServiceCity) {
    const map = mapRef.current;
    if (!map) return;
    map.setView(city.coordinates, 11, { animate: false });
    markersRef.current.get(city.name)?.openPopup();
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-[#200b38]/10 bg-white shadow-sm'>
      <div className='flex items-center justify-between gap-3 border-b border-[#200b38]/10 px-5 py-4'>
        <h2 className='font-semibold text-[#200b38]'>Greater Phoenix</h2>
        <span className='flex items-center gap-2 text-xs font-medium text-[#6c3fb8]'>
          <span
            className='h-2 w-2 rounded-full bg-[#6c3fb8]'
            aria-hidden='true'
          />
          Service cities
        </span>
      </div>
      {/* Keep a fixed map height so loading tiles does not move the page. */}
      {/* Only the Locations page requests a larger map; other pages keep the original height. */}
      <div
        className={`relative isolate bg-[#eeeaf4] ${
          large ? 'h-[360px] sm:h-[480px] lg:h-[560px]' : 'h-80 sm:h-96'
        }`}>
        <div
          ref={containerRef}
          role='region'
          aria-label='Greater Phoenix service map. Use arrow keys to pan and plus or minus to zoom.'
          className='h-full w-full'
        />
        {status !== 'ready' && (
          <div
            className='absolute inset-0 z-1000 flex items-center justify-center bg-[#eeeaf4] px-6 text-center text-sm text-[#200b38]'
            role='status'>
            {status === 'error'
              ? 'The map could not load. Our service cities are listed below.'
              : 'Loading service map…'}
          </div>
        )}
      </div>
      <div className='px-5 py-4'>
        {/* These buttons provide another way to select cities without dragging. */}
        <ul
          className='flex flex-wrap gap-2'
          aria-label='Service cities'>
          {cities.map((city) => (
            <li key={city.name}>
              <button
                type='button'
                onClick={() => showCity(city)}
                disabled={status !== 'ready'}
                aria-label={`Show ${city.name} on the map`}
                className='min-h-11 rounded-full border border-[#6c3fb8]/20 bg-[#f5f0fb] px-4 py-2 text-sm font-medium text-[#542d90] hover:bg-[#eae0f7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6c3fb8] disabled:cursor-default'>
                {city.name}
              </button>
            </li>
          ))}
        </ul>
        <p className='mt-3 text-xs leading-5 text-[#686170]'>
          Shaded outlines show city boundaries; pins mark the city centers.
          Call to confirm service at your address.
        </p>
        {boundaryStatus === 'loading' && (
          <p role='status' className='mt-2 text-xs text-[#686170]'>
            Loading city boundaries…
          </p>
        )}
        {boundaryStatus === 'error' && (
          <p role='status' className='mt-2 text-xs text-[#686170]'>
            City boundaries could not load. The city pins and list are still
            available.
          </p>
        )}
        {tileError && (
          <p
            role='status'
            className='mt-2 text-xs text-[#686170]'>
            Some map tiles could not load. The city list is still available.
          </p>
        )}
      </div>
    </div>
  );
}

function isGeoJsonObject(value: unknown): value is GeoJSON.GeoJsonObject {
  return (
    typeof value === 'object' &&
    value !== null &&
    'type' in value &&
    typeof value.type === 'string'
  );
}
