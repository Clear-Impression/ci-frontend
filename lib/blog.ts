import {cache} from 'react'
import {client} from '@/sanity/client'
import {BLOGS_QUERY, BLOG_QUERY} from '@/sanity/queries'

export type BlogTextSpan = {
  _key?: string
  _type?: string
  text?: string
  marks?: string[]
}

export type BlogTextBlock = {
  _key?: string
  _type: 'block'
  children?: BlogTextSpan[]
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
    blank?: boolean
  }>
  style?: 'normal' | 'h2' | 'h3' | 'h4' | 'blockquote'
  listItem?: 'bullet' | 'number'
  level?: number
}

export type Blog = {
  title: string
  date: string
  description: string | BlogTextBlock[]
  slug: string
  image?: {
    url?: string
    alt?: string
    caption?: string
  } | null
}

export function getBlogDescriptionText(description: Blog['description']): string {
  if (typeof description === 'string') return description

  return description
    .map((block) => block.children?.map((child) => child.text ?? '').join('') ?? '')
    .join('\n\n')
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