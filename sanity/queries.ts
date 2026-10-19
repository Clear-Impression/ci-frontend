import {defineQuery} from 'next-sanity'

// Get FAQs in display order using the fields our accordion expects.
export const FAQ_QUERY = defineQuery(`
  *[_type == "faq"] | order(order asc, _id asc) {
    "id": _id,
    question,
    answer,
    "bullets": coalesce(bullets, [])
  }
`)