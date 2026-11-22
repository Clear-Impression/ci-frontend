import {defineArrayMember, defineField, defineType} from 'sanity'
import {galleryJobTypes} from '../../data/gallery'

type MediaItem = {
  photo?: {asset?: {_ref?: string}}
  video?: {asset?: {_ref?: string}}
}

// One job on the Gallery page: a few photos or videos from the same visit.
// Visitors can narrow the gallery by city and by type of job.
export const galleryJob = defineType({
  name: 'galleryJob',
  title: 'Gallery job',
  type: 'document',
  initialValue: () => ({
    published: true,
    size: 'normal',
    // Today, so new jobs show first.
    date: new Date().toISOString().slice(0, 10),
  }),
  fields: [
    defineField({
      name: 'title',
      title: 'Job title',
      type: 'string',
      description: 'A few words about the job, for example “Two-story home, inside and out.”',
      validation: (rule) => [
        rule.required().error('Add a job title.'),
        rule.max(60).warning('Short titles fit best on the photo.'),
      ],
    }),
    defineField({
      name: 'media',
      title: 'Photos and videos',
      type: 'array',
      description:
        'The first one is shown in the gallery. Drag them to change the order. Visitors see the rest when they open the job.',
      of: [defineArrayMember({type: 'photoOrVideo'})],
      validation: (rule) => [
        rule.required().min(1).error('Add at least one photo or video.'),
        // A video needs a photo to show in the grid while it isn't playing.
        rule.custom<MediaItem[]>((items) =>
          items?.[0] && items[0].video?.asset?._ref && !items[0].photo?.asset?._ref
            ? 'The first item is shown in the gallery, so add a photo to it too. The photo shows while the video loads.'
            : true,
        ),
      ],
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'reference',
      to: [{type: 'city'}],
      description: 'Where the job was. Visitors can tap this city on the map to find it.',
      validation: (rule) => rule.required().error('Pick the city.'),
    }),
    defineField({
      name: 'jobType',
      title: 'Type of job',
      type: 'string',
      description: 'Which filter button the job shows under.',
      options: {list: galleryJobTypes.map(({value, label}) => ({value, title: label})), layout: 'radio'},
      validation: (rule) => rule.required().error('Pick the type of job.'),
    }),
    defineField({
      name: 'service',
      title: 'Service (optional)',
      type: 'reference',
      to: [{type: 'service'}],
      description: 'Adds a link to that service’s page when visitors open the job.',
    }),
    defineField({
      name: 'caption',
      title: 'What we did (optional)',
      type: 'text',
      rows: 2,
      description: 'One sentence shown when visitors open the job.',
    }),
    defineField({
      name: 'size',
      title: 'Size in the gallery',
      type: 'string',
      description: 'Tall suits photos taken upright. Wide suits wide photos and videos.',
      options: {
        list: [
          {value: 'normal', title: 'Normal'},
          {value: 'tall', title: 'Tall'},
          {value: 'wide', title: 'Wide'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({
      name: 'date',
      title: 'Date of the job',
      type: 'date',
      description: 'Newer jobs show first.',
      validation: (rule) => rule.required().error('Add the date of the job.'),
    }),
    defineField({
      name: 'published',
      title: 'Show this job on the website',
      type: 'boolean',
      description: 'Turn this off to hide the job without deleting it.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      city: 'city.name',
      published: 'published',
      media: 'media.0.photo',
    },
    prepare: ({title, city, published, media}) => ({
      title,
      subtitle: published === false ? 'Hidden from the website' : city,
      media,
    }),
  },
})
