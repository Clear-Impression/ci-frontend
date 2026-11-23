import {defineField, defineType} from 'sanity'

// A matching pair of photos for the slider at the top of the Gallery page.
// Visitors drag a handle across to compare them. With more than one pair,
// arrows on each side switch between them.
export const beforeAfter = defineType({
  name: 'beforeAfter',
  title: 'Before and after',
  type: 'document',
  // New pairs go to the end of the list.
  initialValue: async (_params, {getClient}) => {
    const last = await getClient({apiVersion: '2026-10-19'}).fetch<number | null>(
      '*[_type == "beforeAfter"] | order(displayOrder desc)[0].displayOrder',
    )
    return {published: true, displayOrder: (last ?? 0) + 1}
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'A short line under the slider, for example “Desert dust, gone.”',
      validation: (rule) => rule.required().error('Add a title.'),
    }),
    defineField({
      name: 'caption',
      title: 'Caption (optional)',
      type: 'text',
      rows: 2,
      description: 'One sentence under the title.',
    }),
    defineField({
      name: 'before',
      title: 'Before photo',
      type: 'image',
      description:
        'Take both photos from the same spot, so the glass lines up when visitors slide between them.',
      options: {hotspot: true, accept: 'image/jpeg,image/png,image/webp'},
      validation: (rule) => rule.required().error('Add the before photo.'),
    }),
    defineField({
      name: 'after',
      title: 'After photo',
      type: 'image',
      options: {hotspot: true, accept: 'image/jpeg,image/png,image/webp'},
      validation: (rule) => rule.required().error('Add the after photo.'),
    }),
    defineField({
      name: 'alt',
      title: 'What it shows',
      type: 'string',
      description:
        'One sentence for people who use screen readers, for example “A sliding glass door on a backyard patio.”',
      validation: (rule) => rule.required().error('Describe what the photos show.'),
    }),
    defineField({
      name: 'published',
      title: 'Show this pair on the website',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Position',
      type: 'number',
      description: 'Lower numbers show first. The first pair is the one visitors see when the page opens.',
      validation: (rule) =>
        rule.required().integer().min(0).error('Use a whole number, 0 or higher.'),
    }),
  ],
  orderings: [
    {
      title: 'Position',
      name: 'displayOrder',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', published: 'published', media: 'after'},
    prepare: ({title, published, media}) => ({
      title,
      subtitle: published === false ? 'Hidden from the website' : undefined,
      media,
    }),
  },
})
