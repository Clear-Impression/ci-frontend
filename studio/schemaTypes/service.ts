import {defineArrayMember, defineField, defineType} from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
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
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Cleaning method', value: 'method'},
          {title: 'Core service', value: 'core'},
          {title: 'Specialized service', value: 'specialized'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'previewDescription',
      title: 'Preview description',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'largeDescription',
      title: 'Large description',
      type: 'text',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detailParagraphs',
      title: 'Detail paragraphs',
      type: 'array',
      of: [defineArrayMember({type: 'text'})],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
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
      subtitle: 'category',
    },
  },
})
