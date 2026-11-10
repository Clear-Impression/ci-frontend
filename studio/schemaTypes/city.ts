import {defineField, defineType} from 'sanity'

// Turn "Queen Creek" into "queen-creek" for the city page's address.
function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// One city we serve. Each city gets its own page, a map pin, and links in the
// header menu, footer, homepage, and search.
export const city = defineType({
  name: 'city',
  title: 'City',
  type: 'document',
  fieldsets: [
    {
      name: 'pin',
      title: 'Map pin',
      description:
        'On Google Maps, right-click the middle of the city and click the two numbers at the top of the menu to copy them. Paste the first number into Latitude and the second into Longitude.',
      options: {columns: 2},
    },
  ],
  // New cities go to the end of the list.
  initialValue: async (_params, {getClient}) => {
    const last = await getClient({apiVersion: '2026-10-19'}).fetch<number | null>(
      '*[_type == "city"] | order(displayOrder desc)[0].displayOrder',
    )
    return {published: true, displayOrder: (last ?? 0) + 1}
  },
  fields: [
    defineField({
      name: 'name',
      title: 'City name',
      type: 'string',
      description: 'The city as visitors know it, for example Queen Creek.',
      validation: (rule) => rule.required().error('Add the city name.'),
    }),
    defineField({
      name: 'slug',
      title: 'Page link',
      type: 'slug',
      description:
        'The end of the city page’s address. Click Generate to make it from the city name. Changing it later breaks links people have saved, so set it once.',
      options: {source: 'name', maxLength: 96, slugify},
      validation: (rule) => rule.required().error('Click Generate to make the page link.'),
    }),
    defineField({
      name: 'published',
      title: 'Show this city on the website',
      type: 'boolean',
      description:
        'Turn this off to hide the city page, its map pin, and its header and footer links. Nothing is deleted.',
      initialValue: true,
    }),
    defineField({
      name: 'title',
      title: 'Page heading',
      type: 'string',
      description: 'The large heading at the top of the city page.',
      validation: (rule) => rule.required().error('Add a page heading.'),
    }),
    defineField({
      name: 'intro',
      title: 'Short intro',
      type: 'text',
      rows: 3,
      description:
        'One sentence under the page heading. Google also shows it under the page title in search results.',
      validation: (rule) => [
        rule.required().error('Add a short intro.'),
        rule
          .max(160)
          .warning('Google usually shows about 160 characters, so the end may be cut off in search results.'),
      ],
    }),
    defineField({
      name: 'description',
      title: 'About this city',
      type: 'text',
      rows: 6,
      description:
        'The paragraph beside the photo on the city page. Mention local areas and what you clean there.',
      validation: (rule) => rule.required().error('Add a description of the city.'),
    }),
    defineField({
      name: 'media',
      title: 'Photo or video',
      type: 'photoOrVideo',
      description:
        'Shown beside the description. Leave it empty to use the shared photo or video from Locations page.',
    }),
    defineField({
      name: 'region',
      title: 'Region in the header menu',
      type: 'string',
      description:
        'The small line under the city name when visitors open Locations in the header, for example East Valley.',
    }),
    defineField({
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
      fieldset: 'pin',
      validation: (rule) => [
        rule.required().error('Paste the latitude from Google Maps.'),
        rule
          .min(31)
          .max(37.1)
          .error('That point isn’t in Arizona. Latitude should be between 31 and 37.'),
      ],
    }),
    defineField({
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
      fieldset: 'pin',
      validation: (rule) => [
        rule.required().error('Paste the longitude from Google Maps.'),
        rule
          .min(-115)
          .max(-109)
          .error('That point isn’t in Arizona. Longitude should be between -115 and -109.'),
      ],
    }),
    defineField({
      name: 'displayOrder',
      title: 'Position in lists',
      type: 'number',
      description: 'Lower numbers show first. Mesa is 1.',
      validation: (rule) =>
        rule.required().integer().min(0).error('Use a whole number, 0 or higher.'),
    }),
  ],
  orderings: [
    {
      title: 'Position in lists',
      name: 'displayOrder',
      by: [
        {field: 'displayOrder', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {
      title: 'name',
      region: 'region',
      published: 'published',
      media: 'media.photo',
    },
    prepare: ({title, region, published, media}) => ({
      title,
      subtitle: published === false ? 'Hidden from the website' : region,
      media,
    }),
  },
})
