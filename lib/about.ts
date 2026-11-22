import {cache} from 'react'
import {aboutOwner, aboutPromise, aboutStory, aboutValues} from '@/data/about'
import {client} from '@/sanity/client'
import {ABOUT_QUERY} from '@/sanity/queries'

type AboutImage = {
  alt?: string | null
  url?: string | null
  width?: number | null
  height?: number | null
  hotspot?: {x?: number; y?: number} | null
} | null

type AboutDocument = {
  ownerName?: string | null
  ownerRole?: string | null
  ownerPhoto?: AboutImage
  story?: {heading?: string | null; paragraphs?: string[] | null}[] | null
  promiseHeading?: string | null
  promiseTagline?: string | null
  promiseParagraphs?: string[] | null
  values?: {icon?: string | null; title?: string | null; description?: string | null}[] | null
} | null

export type AboutContent = {
  owner: {
    name: string
    role: string
    photo: string
    photoAlt: string
  }
  story: {heading: string; paragraphs: string[]}[]
  promise: {
    heading: string
    tagline: string
    paragraphs: string[]
  }
  values: {icon: string; title: string; description: string}[]
}

const fallback: AboutContent = {
  owner: {
    name: aboutOwner.name,
    role: aboutOwner.role,
    photo: aboutOwner.photo,
    photoAlt: '',
  },
  story: aboutStory.map((section) => ({
    heading: section.heading,
    paragraphs: [...section.paragraphs],
  })),
  promise: {
    heading: aboutPromise.heading,
    tagline: aboutPromise.tagline,
    paragraphs: [...aboutPromise.paragraphs],
  },
  values: aboutValues.map((value) => ({...value})),
}

function text(value: string | null | undefined, backup: string) {
  return value?.trim() ? value : backup
}

export const getAbout = cache(async (): Promise<AboutContent> => {
  try {
    const about = await client.fetch<AboutDocument>(
      ABOUT_QUERY,
      {},
      {next: {revalidate: 60}},
    )
    const photo = about?.ownerPhoto
    const story = (about?.story ?? []).flatMap((section) => {
      if (!section.heading?.trim()) return []
      const paragraphs = (section.paragraphs ?? []).filter((paragraph): paragraph is string =>
        typeof paragraph === 'string' && paragraph.trim().length > 0,
      )
      return [{heading: section.heading, paragraphs}]
    })
    const promiseParagraphs = (about?.promiseParagraphs ?? []).filter(
      (paragraph): paragraph is string => typeof paragraph === 'string' && paragraph.trim().length > 0,
    )
    const values = (about?.values ?? []).flatMap((value) =>
      value.title?.trim() && value.description?.trim()
        ? [{
            icon: value.icon?.trim() || 'value-honesty',
            title: value.title,
            description: value.description,
          }]
        : [],
    )

    return {
      owner: {
        name: text(about?.ownerName, fallback.owner.name),
        role: text(about?.ownerRole, fallback.owner.role),
        photo: photo?.url?.trim() || fallback.owner.photo,
        photoAlt: photo?.alt?.trim() || '',
      },
      story: story.length > 0 ? story : fallback.story,
      promise: {
        heading: text(about?.promiseHeading, fallback.promise.heading),
        tagline: text(about?.promiseTagline, fallback.promise.tagline),
        paragraphs: promiseParagraphs.length > 0 ? promiseParagraphs : fallback.promise.paragraphs,
      },
      values: values.length > 0 ? values : fallback.values,
    }
  } catch (error) {
    console.error('Unable to load About page from Sanity.', error)
    return fallback
  }
})
