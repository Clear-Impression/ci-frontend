import {defineField, defineType} from 'sanity'

export const blog = defineType({
  name: 'blog',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publication date',
      type: 'date',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Optional image description for screen readers.',
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional text displayed below the image.',
        }),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Paragraph description',
      type: 'text',
      rows: 8,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'published',
      title: 'Show on website',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      media: 'image',
      subtitle: 'description',
    },
    prepare({title, date, media, subtitle}) {
      return {
        title,
        media,
        subtitle: date ? `${date} - ${subtitle ?? ''}` : subtitle,
      }
    },
  },
})