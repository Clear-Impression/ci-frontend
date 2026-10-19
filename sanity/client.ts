import {createClient} from 'next-sanity'

// Connect the website to your Sanity project.
export const client = createClient({
  // These public identifiers let teammates run the site without .env.local.
  // Environment variables can override them for another Sanity environment.
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'vpeebhw5',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  // Pin the API behavior to this version.
  apiVersion: '2026-10-19',

  // Read published content directly so edits appear on the next page request.
  useCdn: false,
  perspective: 'published',
})
