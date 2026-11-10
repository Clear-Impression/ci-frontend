import { cache } from 'react';
import {
  cityPageContent,
  defaultCityMedia,
  locationPages,
  locationServices,
  locationsPageContent,
  type LocationMedia,
  type LocationPage,
} from '@/data/locations';
import { client } from '@/sanity/client';
import { LOCATIONS_QUERY } from '@/sanity/queries';

type MediaDocument = {
  alt?: string | null;
  photo?: { url?: string; width?: number; height?: number } | null;
  hotspot?: { x?: number; y?: number } | null;
  video?: { url?: string; mimeType?: string } | null;
} | null;

type CityDocument = {
  name?: string | null;
  slug?: string | null;
  title?: string | null;
  intro?: string | null;
  description?: string | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  media?: MediaDocument;
};

// Text on the Locations page itself. Its title and intro come from the page header.
const pageText = {
  eyebrow: locationsPageContent.eyebrow,
  citiesHeading: locationsPageContent.citiesHeading,
  citiesDescription: locationsPageContent.citiesDescription,
  nextHeading: locationsPageContent.nextHeading,
  nextText: locationsPageContent.nextText,
  servicesLabel: locationsPageContent.servicesLabel,
};

type LocationsDocument = {
  page: (Partial<Record<keyof typeof pageText | keyof typeof cityPageContent, string | null>> & {
    media?: MediaDocument;
    services?: { name?: string | null; description?: string | null }[] | null;
  }) | null;
  cities: CityDocument[];
};

export type LocationsContent = {
  page: typeof pageText;
  // What every city page shares.
  cityPage: typeof cityPageContent & {
    media: LocationMedia;
    services: { name: string; description: string }[];
  };
  cities: LocationPage[];
};

const fallback: LocationsContent = {
  page: pageText,
  cityPage: { ...cityPageContent, media: defaultCityMedia, services: locationServices },
  cities: locationPages,
};

// Use the text from Sanity unless it's empty.
function text(value: string | null | undefined, backup: string) {
  return value?.trim() ? value : backup;
}

function toMedia(media: MediaDocument | undefined): LocationMedia | null {
  const { photo, hotspot, video } = media ?? {};
  const usablePhoto = photo?.url && photo.width && photo.height
    ? {
        url: photo.url,
        width: photo.width,
        height: photo.height,
        hotspot: typeof hotspot?.x === 'number' && typeof hotspot.y === 'number'
          ? { x: hotspot.x, y: hotspot.y }
          : null,
      }
    : null;
  const usableVideo = video?.url
    ? { url: video.url, mimeType: video.mimeType || 'video/mp4' }
    : null;

  if (!usablePhoto && !usableVideo) return null;
  return { photo: usablePhoto, video: usableVideo, alt: media?.alt?.trim() ?? '' };
}

// Skip a city that is missing what its page and map pin need.
function toCity(city: CityDocument): LocationPage[] {
  const { name, slug, latitude, longitude } = city;
  if (!name?.trim() || !slug || typeof latitude !== 'number' || typeof longitude !== 'number') {
    return [];
  }

  return [{
    name,
    slug,
    href: `/locations/${slug}`,
    title: text(city.title, `Window cleaning in ${name}, AZ.`),
    intro: text(city.intro, `Residential and commercial window cleaning in ${name}, provided by Clear Impression Services.`),
    description: city.description ?? '',
    region: text(city.region, 'Phoenix metro'),
    coordinates: [latitude, longitude],
    media: toMedia(city.media),
  }];
}

// Every page that lists cities asks for this, so fetch it once per request.
export const getLocations = cache(async (): Promise<LocationsContent> => {
  try {
    const { page, cities } = await client.fetch<LocationsDocument>(
      LOCATIONS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    const liveCities = cities.flatMap(toCity);
    const services = (page?.services ?? []).flatMap((service) =>
      service.name?.trim() && service.description?.trim()
        ? [{ name: service.name, description: service.description }]
        : [],
    );

    return {
      page: {
        eyebrow: text(page?.eyebrow, pageText.eyebrow),
        citiesHeading: text(page?.citiesHeading, pageText.citiesHeading),
        citiesDescription: text(page?.citiesDescription, pageText.citiesDescription),
        nextHeading: text(page?.nextHeading, pageText.nextHeading),
        nextText: text(page?.nextText, pageText.nextText),
        servicesLabel: text(page?.servicesLabel, pageText.servicesLabel),
      },
      cityPage: {
        backLabel: text(page?.backLabel, cityPageContent.backLabel),
        photoEyebrow: text(page?.photoEyebrow, cityPageContent.photoEyebrow),
        photoHeading: text(page?.photoHeading, cityPageContent.photoHeading),
        quoteLabel: text(page?.quoteLabel, cityPageContent.quoteLabel),
        servicesDescription: text(page?.servicesDescription, cityPageContent.servicesDescription),
        servicesLinkLabel: text(page?.servicesLinkLabel, cityPageContent.servicesLinkLabel),
        media: toMedia(page?.media) ?? defaultCityMedia,
        services: services.length > 0 ? services : locationServices,
      },
      // Keep the built-in list until the cities have been added in Sanity.
      cities: liveCities.length > 0 ? liveCities : locationPages,
    };
  } catch (error) {
    console.error('Unable to load locations from Sanity.', error);
    return fallback;
  }
});

export async function getLocationBySlug(slug: string) {
  const { cities } = await getLocations();
  return cities.find((city) => city.slug === slug);
}

// Put the number of cities wherever the text says {count}.
export function withCityCount(value: string, count: number) {
  return value.replaceAll('{count}', String(count));
}
