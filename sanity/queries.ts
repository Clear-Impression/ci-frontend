import {defineQuery} from 'groq'

export const ESTIMATE_PRICING_QUERY = defineQuery(`
  *[_id in $ids] {
    _id, rate, minimum, rangePercent, roundingIncrement,
    height, sides, dirt, extras, frequency, fill, parts
  }
`)

// The scrolling header bar and the homepage popup, with their theme and dates.
export const SEASONAL_OFFERS_QUERY = defineQuery(`
  *[_type == "seasonalOffers" && _id == "seasonalOffers"][0] {
    theme,
    customColor,
    customIcon,
    barOn,
    barPosition,
    barMessages,
    barLink,
    popupOn,
    popupLabel,
    popupTitle,
    popupText,
    popupButtonLabel,
    popupLink,
    "popupImage": popupImage {
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "hotspot": hotspot{x, y}
    },
    startsAt,
    endsAt
  }
`)

export const PAGE_HEADER_QUERY = defineQuery(`
  *[_type == "pageHeader" && _id == $id][0] {title, subtitle}
`)

export const ABOUT_QUERY = defineQuery(`
  *[_type == "about" && _id == "about"][0] {
    ownerName,
    ownerRole,
    "ownerPhoto": ownerPhoto {
      alt,
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "hotspot": hotspot{x, y}
    },
    "story": story[]{
      heading,
      "paragraphs": paragraphs[].text
    },
    promiseHeading,
    promiseTagline,
    "promiseParagraphs": promiseParagraphs[].text,
    "values": values[]{icon, title, description}
  }
`)

// The photo and video fields shared by cities and the Locations page.
const PHOTO_OR_VIDEO = `{
  alt,
  "photo": photo.asset->{
    url,
    "width": metadata.dimensions.width,
    "height": metadata.dimensions.height
  },
  "hotspot": photo.hotspot{x, y},
  "video": video.asset->{url, mimeType}
}`

// Hidden cities and cities without a page link are left out.
export const LOCATIONS_QUERY = defineQuery(`{
  "page": *[_type == "locationsPage" && _id == "locationsPage"][0] {
    eyebrow,
    citiesHeading,
    citiesDescription,
    nextHeading,
    nextText,
    servicesLabel,
    photoEyebrow,
    photoHeading,
    quoteLabel,
    servicesDescription,
    servicesLinkLabel,
    backLabel,
    "media": media ${PHOTO_OR_VIDEO},
    "services": services[]{name, description}
  },
  "cities": *[
    _type == "city" &&
    coalesce(published, true) == true &&
    defined(slug.current)
  ] | order(displayOrder asc, name asc) {
    name,
    "slug": slug.current,
    title,
    intro,
    description,
    region,
    latitude,
    longitude,
    "media": media ${PHOTO_OR_VIDEO}
  }
}`)

// Gallery jobs newest first, and the before-and-after pairs in their set order.
// Hidden jobs, and jobs whose city is hidden, are left out.
export const GALLERY_QUERY = defineQuery(`{
  "jobs": *[
    _type == "galleryJob" &&
    coalesce(published, true) == true &&
    coalesce(city->published, true) == true
  ] | order(date desc, _createdAt desc) {
    _id,
    title,
    caption,
    jobType,
    size,
    "city": city->name,
    "service": service->{title, "slug": slug.current},
    "media": media[] ${PHOTO_OR_VIDEO}
  },
  "pairs": *[
    _type == "beforeAfter" &&
    coalesce(published, true) == true
  ] | order(displayOrder asc) {
    title,
    caption,
    alt,
    "before": before{"url": asset->url, "hotspot": hotspot{x, y}},
    "after": after{"url": asset->url, "hotspot": hotspot{x, y}}
  }
}`)

export const SERVICES_QUERY = defineQuery(`
  *[
    _type == "service" &&
    coalesce(published, true) == true
  ] | order(displayOrder asc, title asc) {
    "slug": slug.current,
    title,
    category,
    previewDescription,
    largeDescription,
    "detailParagraphs": coalesce(detailParagraphs, []),
    detailHeading,
    glanceHeading,
    bestForLabel,
    benefitsLabel,
    layout,
    bestFor,
    "benefits": coalesce(benefits, []),
    "image": image {
      "url": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height,
      "alt": coalesce(alt, ^.title),
      caption
    }
  }
`)

export const BLOGS_QUERY = defineQuery(`
  *[
    _type == "blog" &&
    coalesce(published, true) == true &&
    defined(slug.current)
  ] | order(date desc, _createdAt desc) {
    title,
    date,
    description,
    "slug": slug.current,
    "image": image {
      "url": asset->url,
      "alt": alt,
      "caption": caption
    }
  }
`)

export const BLOG_QUERY = defineQuery(`
  *[
    _type == "blog" &&
    coalesce(published, true) == true &&
    slug.current == $slug
  ][0] {
    title,
    date,
    description,
    "slug": slug.current,
    "image": image {
      "url": asset->url,
      "alt": alt,
      "caption": caption
    }
  }
`)

// Roles on the Careers page. Paused roles are left out.
const JOB_OPENING_FIELDS = `{
  title,
  "slug": slug.current,
  employmentType,
  "pay": coalesce(pay, null),
  summary,
  "duties": coalesce(duties, []),
  "requirements": coalesce(requirements, []),
  "schedule": coalesce(schedule, null)
}`

export const JOB_OPENINGS_QUERY = defineQuery(`
  *[
    _type == "jobOpening" &&
    coalesce(accepting, true) == true &&
    defined(slug.current)
  ] | order(displayOrder asc, title asc) ${JOB_OPENING_FIELDS}
`)

export const JOB_OPENING_QUERY = defineQuery(`
  *[
    _type == "jobOpening" &&
    coalesce(accepting, true) == true &&
    slug.current == $slug
  ][0] ${JOB_OPENING_FIELDS}
`)
