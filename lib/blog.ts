import {cache} from 'react'
import {client} from '@/sanity/client'
import {BLOGS_QUERY, BLOG_QUERY} from '@/sanity/queries'

export type Blog = {
  title: string
  date: string
  description: string
  slug: string
  image?: {
    url?: string
    alt?: string
    caption?: string
  } | null
}

export const getBlogs = cache(async (): Promise<Blog[]> => {
  return client.fetch<Blog[]>(
    BLOGS_QUERY,
    {},
    {next: {revalidate: 60}},
  )
})

export const getBlogBySlug = cache(async (slug: string) => {
  return client.fetch<Blog | null>(
    BLOG_QUERY,
    {slug},
    {next: {revalidate: 60}},
  )
})