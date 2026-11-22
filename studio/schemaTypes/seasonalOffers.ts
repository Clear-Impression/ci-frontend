import {defineArrayMember, defineField, defineType, type UrlRule} from 'sanity'
import {offerIcons, offerThemes} from '../../data/offer-themes'
import {OfferColorInput, OfferIconInput} from '../components/OfferInputs'

// Links can go to a page on this site (/estimate) or a full web address.
const linkRule = (rule: UrlRule) =>
  rule.uri({allowRelative: true, scheme: ['http', 'https', 'tel', 'mailto']})

// These only show when the theme is "Make your own".
const notCustom = ({document}: {document?: Record<string, unknown>}) => document?.theme !== 'custom'

// Only ask for the text when that part of the offer is turned on.
const requiredWhen = (part: 'barOn' | 'popupOn', message: string) =>
  (value: unknown, context: {document?: Record<string, unknown>}) => {
    if (!context.document?.[part]) return true
    const filled = Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim()
    return filled ? true : message
  }

// The one Seasonal offers document: a scrolling line of offers in the header on
// every page, and a popup on the homepage that visitors can close.
export const seasonalOffers = defineType({
  name: 'seasonalOffers',
  title: 'Seasonal offers',
  type: 'document',
  groups: [
    {name: 'bar', title: 'Scrolling bar', default: true},
    {name: 'popup', title: 'Homepage popup'},
    {name: 'dates', title: 'Dates'},
  ],
  initialValue: {
    theme: 'regular',
    customColor: '#55ab68',
    customIcon: 'tag',
    barOn: false,
    barPosition: 'strip',
    barLink: '/estimate',
    popupOn: false,
    popupButtonLabel: 'Get a free quote',
    popupLink: '/estimate',
  },
  fields: [
    defineField({
      name: 'theme',
      title: 'Theme',
      type: 'string',
      // Shown on both tabs, since it changes the bar and the popup.
      group: ['bar', 'popup'],
      options: {
        list: offerThemes.map(({id, title}) => ({title, value: id})),
        layout: 'radio',
      },
      description: 'Sets the colors and little icon on the bar and popup. Use Regular outside of holidays, or Make your own to pick them yourself.',
    }),
    defineField({
      name: 'customColor',
      title: 'Color',
      type: 'string',
      group: ['bar', 'popup'],
      description: 'Pick one, or any color. The text colors are picked for you so it’s always easy to read.',
      hidden: notCustom,
      components: {input: OfferColorInput},
      validation: (rule) => rule.custom((value, context) => {
        if (context.document?.theme !== 'custom') return true
        if (!value) return 'Pick a color.'
        return /^#[0-9a-f]{6}$/i.test(value) ? true : 'Use a color like #1d3a8a.'
      }),
    }),
    defineField({
      name: 'customIcon',
      title: 'Icon',
      type: 'string',
      group: ['bar', 'popup'],
      description: 'Shows between the scrolling offers and next to the popup’s label.',
      hidden: notCustom,
      options: {list: offerIcons.map(({id, title}) => ({title, value: id}))},
      components: {input: OfferIconInput},
    }),
    defineField({
      name: 'barOn',
      title: 'Show the scrolling bar',
      type: 'boolean',
      group: 'bar',
      description: 'Turn on to show the offers in the header on every page. Publish to update the website.',
    }),
    defineField({
      name: 'barPosition',
      title: 'Where the bar goes',
      type: 'string',
      group: 'bar',
      options: {
        list: [
          {title: 'Inside the purple strip at the top of the header', value: 'strip'},
          {title: 'Its own colored bar above the header', value: 'above'},
        ],
        layout: 'radio',
      },
      description: 'Its own bar stands out more. Both tuck away when visitors scroll down.',
    }),
    defineField({
      name: 'barMessages',
      title: 'Messages',
      type: 'array',
      group: 'bar',
      of: [defineArrayMember({type: 'string', validation: (rule) => rule.max(120)})],
      description: 'Each message scrolls by one after another. Keep each one short, for example “Holiday special: 15% off exterior windows through Dec 31”.',
      validation: (rule) => rule.max(6).custom(requiredWhen('barOn', 'Add at least one message, or turn the bar off.')),
    }),
    defineField({
      name: 'barLink',
      title: 'Where the bar links to (optional)',
      type: 'url',
      group: 'bar',
      description: 'A page on the site like /estimate or /quote. Leave empty if the bar shouldn’t be a link.',
      validation: linkRule,
    }),
    defineField({
      name: 'popupOn',
      title: 'Show the homepage popup',
      type: 'boolean',
      group: 'popup',
      description: 'Pops up a few seconds after someone opens the homepage. Once they close it, it stays closed until you change the popup.',
    }),
    defineField({
      name: 'popupLabel',
      title: 'Small label above the title (optional)',
      type: 'string',
      group: 'popup',
      description: 'Leave empty to use the theme’s label, like “Diwali special” or “Holiday special”.',
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: 'popupTitle',
      title: 'Title',
      type: 'string',
      group: 'popup',
      validation: (rule) => rule.max(60).custom(requiredWhen('popupOn', 'Add a title, or turn the popup off.')),
    }),
    defineField({
      name: 'popupText',
      title: 'Text',
      type: 'text',
      rows: 3,
      group: 'popup',
      validation: (rule) => rule.max(240).custom(requiredWhen('popupOn', 'Add some text, or turn the popup off.')),
    }),
    defineField({
      name: 'popupImage',
      title: 'Photo (optional)',
      type: 'image',
      group: 'popup',
      description: 'Shows across the top of the popup. Wide photos work best. After it uploads, drag the circle on the photo to choose what stays in view when it’s cropped.',
      options: {hotspot: true, accept: 'image/jpeg,image/png,image/webp'},
      fields: [
        defineField({
          name: 'alt',
          title: 'What it shows',
          type: 'string',
          description: 'A short description for people using screen readers.',
        }),
      ],
    }),
    defineField({
      name: 'popupButtonLabel',
      title: 'Button text',
      type: 'string',
      group: 'popup',
      validation: (rule) => rule.max(30).custom(requiredWhen('popupOn', 'Add the button text, or turn the popup off.')),
    }),
    defineField({
      name: 'popupLink',
      title: 'Where the button goes',
      type: 'url',
      group: 'popup',
      description: 'A page on the site like /estimate or /quote.',
      validation: (rule) => linkRule(rule).custom(requiredWhen('popupOn', 'Add where the button goes, or turn the popup off.')),
    }),
    defineField({
      name: 'startsAt',
      title: 'Start showing (optional)',
      type: 'datetime',
      group: 'dates',
      description: 'Set this ahead of time and the offer turns on by itself. Leave empty to show it as soon as it’s published.',
    }),
    defineField({
      name: 'endsAt',
      title: 'Stop showing (optional)',
      type: 'datetime',
      group: 'dates',
      description: 'The bar and popup turn off by themselves after this. Leave empty to keep them on until you switch them off.',
      validation: (rule) => rule.custom((value, context) => {
        const startsAt = context.document?.startsAt
        return !value || typeof startsAt !== 'string' || value > startsAt ? true : 'Pick a time after the start.'
      }),
    }),
  ],
  preview: {
    select: {theme: 'theme', barOn: 'barOn', popupOn: 'popupOn'},
    prepare: ({theme, barOn, popupOn}) => ({
      title: 'Seasonal offers',
      subtitle: [
        offerThemes.find((entry) => entry.id === theme)?.title,
        barOn && 'Bar on',
        popupOn && 'Popup on',
      ].filter(Boolean).join(' · '),
    }),
  },
})
