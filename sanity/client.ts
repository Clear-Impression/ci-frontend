import {createClient} from 'next-sanity'

// Connect the website to your Sanity project.
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  // Pin the API behavior to this version.
  apiVersion: '2026-10-19',

  // Use Sanity's CDN for published content.
  useCdn: false,
  perspective: 'published',
})