import {defineArrayMember, defineField, defineType} from 'sanity'
import {aboutOwner, aboutPromise, aboutStory, aboutValues} from '../../data/about'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  groups: [
    {name: 'story', title: 'Story', default: true},
    {name: 'owner', title: 'Owner'},
    {name: 'promise', title: 'Promise & values'},
  ],
  initialValue: {
    ownerName: aboutOwner.name,
    ownerRole: aboutOwner.role,
    story: aboutStory.map((section, sectionIndex) => ({
      _key: `story-${sectionIndex}`,
      heading: section.heading,
      paragraphs: section.paragraphs.map((text, paragraphIndex) => ({
        _key: `paragraph-${sectionIndex}-${paragraphIndex}`,
        text,
      })),
    })),
    promiseHeading: aboutPromise.heading,
    promiseTagline: aboutPromise.tagline,
    promiseParagraphs: aboutPromise.paragraphs.map((text, index) => ({
      _key: `promise-paragraph-${index}`,
      text,
    })),
    values: aboutValues.map((value, index) => ({
      _key: `value-${index}`,
      icon: value.icon,
      title: value.title,
      description: value.description,
    })),
  },
  fields: [
    defineField({
      name: 'ownerName',
      title: 'Owner name',
      type: 'string',
      group: 'owner',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ownerRole',
      title: 'Owner role',
      type: 'string',
      group: 'owner',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'ownerPhoto',
      title: 'Owner headshot',
      type: 'image',
      group: 'owner',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe the headshot for visitors using a screen reader.',
        }),
      ],
    }),
    defineField({
      name: 'story',
      title: 'Story sections',
      type: 'array',
      group: 'story',
      of: [
        defineArrayMember({
          name: 'storySection',
          title: 'Story section',
          type: 'object',
          fields: [
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'paragraphs',
              title: 'Paragraphs',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'storyParagraph',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'text',
                      title: 'Paragraph',
                      type: 'text',
                      rows: 3,
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {select: {title: 'text'}},
                }),
              ],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {select: {title: 'heading'}},
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'promiseHeading',
      title: 'Promise heading',
      type: 'string',
      group: 'promise',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'promiseTagline',
      title: 'Promise tagline',
      type: 'string',
      group: 'promise',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'promiseParagraphs',
      title: 'Promise paragraphs',
      type: 'array',
      group: 'promise',
      of: [
        defineArrayMember({
          name: 'promiseParagraph',
          type: 'object',
          fields: [
            defineField({
              name: 'text',
              title: 'Paragraph',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'text'}},
        }),
      ],
    }),
    defineField({
      name: 'values',
      title: 'Promise tiles',
      description: 'Add, remove, or reorder tiles. The page adjusts automatically.',
      type: 'array',
      group: 'promise',
      of: [
        defineArrayMember({
          name: 'aboutValue',
          title: 'Promise tile',
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              options: {
                list: [
                  {title: 'Honesty', value: 'value-honesty'},
                  {title: 'Satisfaction', value: 'value-satisfaction'},
                  {title: 'Attention to detail', value: 'value-detail'},
                ],
                layout: 'radio',
              },
              initialValue: 'value-honesty',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {select: {title: 'title', subtitle: 'description'}},
        }),
      ],
      validation: (rule) => rule.min(1).error('Add at least one promise tile.'),
    }),
  ],
  preview: {
    prepare: () => ({title: 'About page'}),
  },
})