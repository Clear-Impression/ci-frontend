import {defineQuery} from 'next-sanity'

export const PAGE_HEADER_QUERY = defineQuery(`
  *[_type == "pageHeader" && _id == $id][0] {title, subtitle}
`)

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
    "detailParagraphs": coalesce(detailParagraphs, [])
  }
`)
