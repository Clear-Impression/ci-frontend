import {defineArrayMember, defineField, defineType} from 'sanity'

// One role on the Careers page. Create a new one with the + button, delete it
// from the ⋯ menu, or turn off "Accepting applications" to pause it.
export const jobOpening = defineType({
  name: 'jobOpening',
  title: 'Job opening',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Job title',
      type: 'string',
      description: 'For example, Window cleaning technician.',
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      description:
        'The end of the apply page address, like /careers/window-cleaning-technician. Keep it the same once the role is live.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'employmentType',
      title: 'Job type',
      type: 'string',
      options: {
        list: [
          {title: 'Full-time', value: 'Full-time'},
          {title: 'Part-time', value: 'Part-time'},
          {title: 'Full-time or part-time', value: 'Full-time or part-time'},
          {title: 'Seasonal', value: 'Seasonal'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'pay',
      title: 'Pay',
      type: 'string',
      description: 'Optional. For example, $18 to $22 an hour. Leave it empty to hide pay.',
    }),
    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown on the Careers page.',
      validation: (rule) => rule.required().max(300),
    }),
    defineField({
      name: 'duties',
      title: 'What you’ll do',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'requirements',
      title: 'What we’re looking for',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'string',
      description: 'Optional. For example, Weekday daytime jobs, some Saturdays.',
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display order',
      description: 'Lower numbers appear first.',
      type: 'number',
      initialValue: 0,
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: 'accepting',
      title: 'Accepting applications',
      description:
        'Turn off to take this role off the website without deleting it. Applications already sent are kept.',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      type: 'employmentType',
      accepting: 'accepting',
    },
    prepare: ({title, type, accepting}) => ({
      title,
      subtitle: accepting === false ? `${type ?? ''} · Paused` : type,
    }),
  },
})
