import { cache } from 'react';
import { offerIcons, offerThemes, type OfferIconId, type OfferThemeId } from '@/data/offer-themes';
import { client } from '@/sanity/client';
import { SEASONAL_OFFERS_QUERY } from '@/sanity/queries';

type OffersDocument = {
  theme?: string | null;
  customColor?: string | null;
  customIcon?: string | null;
  barOn?: boolean | null;
  barPosition?: string | null;
  barMessages?: (string | null)[] | null;
  barLink?: string | null;
  popupOn?: boolean | null;
  popupLabel?: string | null;
  popupTitle?: string | null;
  popupText?: string | null;
  popupButtonLabel?: string | null;
  popupLink?: string | null;
  popupImage?: {
    alt?: string | null;
    url?: string;
    width?: number;
    height?: number;
    hotspot?: { x?: number; y?: number } | null;
  } | null;
  startsAt?: string | null;
  endsAt?: string | null;
} | null;

// For "Make your own", the theme's colors as CSS variables (see
// data-offer-theme in globals.css). Other themes have theirs in the CSS.
export type OfferColors = Record<`--offer-${string}`, string>;

export type OfferBar = {
  theme: OfferThemeId;
  icon: OfferIconId;
  colors: OfferColors | null;
  messages: string[];
  href: string | null;
  // 'strip' scrolls inside the purple strip; 'above' is its own colored bar.
  position: 'strip' | 'above';
};

export type OfferPopup = {
  // Changes whenever the popup changes, so visitors who closed an old
  // offer still see the new one.
  id: string;
  theme: OfferThemeId;
  icon: OfferIconId;
  colors: OfferColors | null;
  // The small line above the title, like "Diwali special".
  label: string;
  title: string;
  text: string;
  buttonLabel: string;
  href: string;
  // position is the focus point picked in Sanity, as a CSS object-position.
  image: { url: string; width: number; height: number; alt: string; position: string } | null;
};

export type SeasonalOffers = {
  bar: OfferBar | null;
  popup: OfferPopup | null;
};

const noOffers: SeasonalOffers = { bar: null, popup: null };

function clean(value: string | null | undefined) {
  return value?.trim() ?? '';
}

// The deep purple of the header, and the darkest text used on light colors.
const ink = '#200b38';

function channels(hex: string) {
  return [1, 3, 5].map((start) => parseInt(hex.slice(start, start + 2), 16));
}

// How bright a color looks, from 0 (black) to 1 (white).
function luminance(hex: string) {
  const [red, green, blue] = channels(hex).map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

// The contrast between two colors. Text needs at least 4.5 to be easy to read.
function contrast(first: string, second: string) {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}

function mix(from: string, to: string, amount: number) {
  const target = channels(to);
  return `#${channels(from)
    .map((value, index) => Math.round(value + (target[index] - value) * amount).toString(16).padStart(2, '0'))
    .join('')}`;
}

// Moves a color toward white or ink, a little at a time, until it's easy to read.
function readableOn(background: string, color: string, toward: string) {
  for (let amount = 0; amount <= 1; amount += 0.05) {
    const next = mix(color, toward, amount);
    if (contrast(next, background) >= 4.5) return next;
  }
  return toward;
}

// "Make your own" colors from the one color picked in Sanity. The bar gets white
// or ink text, whichever is easier to read. Wherever the color itself is used for
// text or behind it, it's lightened or darkened only as much as needed to stay readable.
function customColors(color: string): OfferColors {
  const text = contrast(color, '#ffffff') >= contrast(color, ink) ? '#ffffff' : ink;
  return {
    // A few mid-tones need a small nudge away from the text color.
    '--offer-bg': readableOn(text, color, text === ink ? '#ffffff' : ink),
    '--offer-fg': text,
    '--offer-icon': text,
    '--offer-strip': readableOn(ink, color, '#ffffff'),
    '--offer-accent': color,
    '--offer-label': readableOn('#ffffff', color, ink),
  };
}

// The offer only shows between its start and end times, if they're set.
function isRunning(startsAt?: string | null, endsAt?: string | null) {
  const now = Date.now();
  if (startsAt && Date.parse(startsAt) > now) return false;
  if (endsAt && Date.parse(endsAt) <= now) return false;
  return true;
}

// A short code made from the popup's content, used to remember who closed it.
function contentId(text: string) {
  let hash = 5381;
  for (let index = 0; index < text.length; index++) {
    hash = (hash * 33) ^ text.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

// Shared by the header and the homepage, so it's only fetched once per page.
// If Sanity can't be reached, nothing shows.
export const getSeasonalOffers = cache(async (): Promise<SeasonalOffers> => {
  try {
    const offers = await client.fetch<OffersDocument>(
      SEASONAL_OFFERS_QUERY,
      {},
      { next: { revalidate: 60 } },
    );
    if (!offers || !isRunning(offers.startsAt, offers.endsAt)) return noOffers;

    const theme = offerThemes.find((entry) => entry.id === offers.theme) ?? offerThemes[0];
    const custom = theme.id === 'custom';
    const customColor = clean(offers.customColor).toLowerCase();
    const colors = custom ? customColors(/^#[0-9a-f]{6}$/.test(customColor) ? customColor : '#55ab68') : null;
    const icon = (custom && offerIcons.find((entry) => entry.id === offers.customIcon)?.id) || theme.icon;

    const messages = (offers.barMessages ?? []).map(clean).filter(Boolean);
    const bar: OfferBar | null = offers.barOn && messages.length
      ? {
          theme: theme.id,
          icon,
          colors,
          messages,
          href: clean(offers.barLink) || null,
          position: offers.barPosition === 'above' ? 'above' : 'strip',
        }
      : null;

    const label = clean(offers.popupLabel) || theme.label;
    const title = clean(offers.popupTitle);
    const text = clean(offers.popupText);
    const buttonLabel = clean(offers.popupButtonLabel) || 'Get a free quote';
    const href = clean(offers.popupLink) || '/estimate';
    const photo = offers.popupImage;
    const spot = photo?.hotspot;
    const image = photo?.url && photo.width && photo.height
      ? {
          url: photo.url,
          width: photo.width,
          height: photo.height,
          alt: clean(photo.alt),
          // Keep the part he picked in view when the photo is cropped.
          position: typeof spot?.x === 'number' && typeof spot.y === 'number'
            ? `${(spot.x * 100).toFixed(1)}% ${(spot.y * 100).toFixed(1)}%`
            : '50% 50%',
        }
      : null;
    const popup: OfferPopup | null = offers.popupOn && title && text
      ? {
          id: contentId([theme.id, icon, customColor, label, title, text, buttonLabel, href, image?.url ?? ''].join('|')),
          theme: theme.id,
          icon,
          colors,
          label,
          title,
          text,
          buttonLabel,
          href,
          image,
        }
      : null;

    return { bar, popup };
  } catch (error) {
    console.error('Unable to load seasonal offers.', error);
    return noOffers;
  }
});
