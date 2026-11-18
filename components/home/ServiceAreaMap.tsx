'use client';

import { useEffect, useRef, useState } from 'react';
import type {
  LayerGroup,
  Map as LeafletMap,
  Marker,
} from 'leaflet';
import type { FeatureCollection } from 'geojson';
import { serviceCities, type ServiceCity } from '@/data/home';
import { serviceCenter } from '@/data/home';
import rawCityBoundaries from '@/data/geojson/service-city-boundaries.json';

const cityBoundaries = rawCityBoundaries as unknown as FeatureCollection;

type ServiceAreaMapProps = {
  cities: readonly ServiceCity[];
  large?: boolean;
  // A shorter map for the homepage.
  compact?: boolean;
  showBoundaries?: boolean;
  // Leave out the city buttons when the page already lists the cities.
  cityButtons?: boolean;
  // Start collapsed on small screens, while remaining fully visible on larger screens.
  collapsibleOnMobile?: boolean;
};

export default function ServiceAreaMap({
  cities,
  large = false,
  compact = false,
  showBoundaries = false,
  cityButtons = true,
  collapsibleOnMobile = false,
}: ServiceAreaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const boundariesRef = useRef<LayerGroup | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>(
    'loading',
  );
  const [tileError, setTileError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | undefined;
    let resizeObserver: ResizeObserver | undefined;
    const markers = markersRef.current;

    function loadBoundaries(
      L: typeof import('leaflet'),
      targetMap: LeafletMap,
    ) {
      if (!showBoundaries) return;

      const boundaryLayer = L.layerGroup().addTo(targetMap);
      boundariesRef.current = boundaryLayer;
      // Only outline the cities on the map, so a city hidden in Sanity loses its outline too.
      const cityNames = new Set(cities.map((city) => city.name));

      L.geoJSON(cityBoundaries, {
        filter: (feature) => cityNames.has(feature.properties?.name),
        style: {
          color: '#6c3fb8',
          fillColor: '#8f63d0',
          fillOpacity: 0.12,
          opacity: 0.2,
          weight: 2,
        },
        onEachFeature: (feature, layer) => {
          const name =
            feature.properties &&
            typeof feature.properties.name === 'string'
              ? feature.properties.name
              : 'City';
          layer.bindTooltip(`${name} city boundary`);
        },
      }).addTo(boundaryLayer);
    }

    async function setupMap() {
      try {
        // Load the map's styles with Leaflet so they don't block the initial page render.
        const [L] = await Promise.all([
          import('leaflet'),
          import('leaflet/dist/leaflet.css'),
        ]);
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
            [33.65, -111.7],
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
          iconSize: [16, 20],
          iconAnchor: [16, 40],
          popupAnchor: [0, -35],
        });

        // Geneate a circle boundary radiating from Mesa to desginate service areas.
        if(serviceCenter){
          //10 mile
          L.circle(serviceCenter, {
            color: '#55ab68',
            fillColor: '#55ab68',
            fillOpacity: 0.05,
            opacity: 0.95,
            dashArray: '8, 8',
            weight: 3,
            lineCap: 'round',
            //Radius is defined in meters in leaflet, thus 16093.4m equals 10 mi
            radius: 16093.4
          }).addTo(map);
          //20-mile boundary
          L.circle(serviceCenter, {
            color: '#8061b7',
            fillColor: '#8061b7',
            fillOpacity: 0.018,
            opacity: 0.9,
            dashArray: '8, 8',
            weight: 3,
            radius: 16093.4*2,
          }).addTo(map);
          //30 mile
          L.circle(serviceCenter, {
            color: '#b3a0d1',
            fillColor: '#b3a0d1',
            fillOpacity: 0.01,
            opacity: 0.85,
            dashArray: '8, 8',
            weight: 3,
            lineCap: 'round',
            radius: 16093.4*3
          }).addTo(map);
        }

        for (const city of cities) {
          const popup = document.createElement('p');
          popup.textContent = `${city.name}`;
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
        loadBoundaries(L, map);
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
        {collapsibleOnMobile ? (
          <button
            type='button'
            onClick={() => setMobileExpanded((expanded) => !expanded)}
            aria-expanded={mobileExpanded}
            aria-controls='locations-service-map-content'
            className='flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-semibold text-[#542d90] sm:hidden'>
            {mobileExpanded ? 'Close map' : 'Open map'}
            <svg
              aria-hidden='true'
              viewBox='0 0 20 20'
              fill='none'
              className={`h-4 w-4 transition-transform ${mobileExpanded ? 'rotate-180' : ''}`}>
              <path
                d='m5 7.5 5 5 5-5'
                stroke='currentColor'
                strokeWidth='1.75'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        ) : (
          <span className='flex items-center gap-2 text-xs font-medium text-[#6c3fb8]'>
            <span
              className='h-2 w-2 rounded-full bg-[#6c3fb8]'
              aria-hidden='true'
            />
            Service cities
          </span>
        )}
      </div>
      <div
        id='locations-service-map-content'
        className={collapsibleOnMobile && !mobileExpanded ? 'hidden sm:block' : 'block'}>
      {/* Keep a fixed map height so loading tiles does not move the page. */}
      {/* The Locations page asks for a larger map and the homepage for a shorter one. */}
      <div
        className={`relative isolate bg-[#eeeaf4] ${
          large ? 'h-90 sm:h-120 lg:h-140' : compact ? 'h-64 sm:h-72' : 'h-80 sm:h-96'
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
        {cityButtons && (
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
        )}
        <p className={`${cityButtons ? 'mt-3' : ''} text-xs leading-5 text-[#686170]`}>
          Shaded outlines show city boundaries; pins mark the city centers.
          Call to confirm service at your address.
        </p>
        {tileError && (
          <p
            role='status'
            className='mt-2 text-xs text-[#686170]'>
            Some map tiles could not load. The city list is still available.
          </p>
        )}
      </div>
      </div>
    </div>
  );
}
