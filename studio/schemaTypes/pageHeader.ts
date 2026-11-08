import {defineField, defineType} from 'sanity'
import {pageHeaders} from '../../data/page-headers'

export const pageHeader = defineType({
  name: 'pageHeader',
  title: 'Page header',
  type: 'document',
  fields: [
    defineField({name: 'pageId', type: 'string', hidden: true, readOnly: true}),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 2,
      description: 'The main page heading. On Home and Services, each line appears separately.',
      validation: (rule) => rule.required().custom((value) =>
        value?.trim() ? true : 'Enter a title.',
      ),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 3,
      description: 'The text below the heading. On Service terms, this is the effective date.',
    }),
  ],
  preview: {
    select: {pageId: 'pageId', subtitle: 'title'},
    prepare: ({pageId, subtitle}) => ({
      title: `${pageHeaders[pageId]?.label ?? 'Page'} header`,
      subtitle,
    }),
  },
})
