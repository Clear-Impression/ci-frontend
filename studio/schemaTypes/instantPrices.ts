import {defineField, defineType} from 'sanity'
import {initialPricing, pricingSections} from '../../data/estimate-pricing'

const priceField = (name: string, title: string, min = 0, max = 1_000_000) => defineField({
  name,
  title,
  type: 'number',
  validation: (rule) => rule.required().min(min).max(max).custom((value) =>
    value === undefined || Number.isFinite(value) ? true : 'Enter a finite number.',
  ),
})

export const instantPriceTypes = pricingSections.map(({tab, title, schemaType}) => {
  const size = tab.questions.find((question) => question.kind === 'slider')
  const adjustments = tab.questions.filter((question) => question.kind !== 'slider')
  const unit = size?.kind === 'slider' ? size.unit : 'unit'
  return defineType({
    name: schemaType,
    title,
    type: 'document',
    description: 'Publish to update customer estimates. Multipliers apply to the size-based price; flat adjustments and add-ons are added afterward. The minimum is applied last.',
    groups: [
      {name: 'size', title: `${size?.label ?? 'Size'} affects price`, default: true},
      ...adjustments.map((question) => ({name: question.id, title: `${question.label} pricing`})),
      {name: 'range', title: 'Price range'},
    ],
    fields: [
      {...priceField('rate', `Price per ${unit === 'sq ft' ? 'square foot' : unit.replace(/s$/, '')} ($)`), group: 'size',
        description: 'The customer’s size or quantity is multiplied by this rate before other adjustments.'},
      {...priceField('minimum', 'Minimum service price ($)'), group: 'size'},
      {...priceField('rangePercent', 'Price range above and below estimate (%)', 0, 99), group: 'range',
        description: '12 shows a range from 12% below to 12% above the calculated price. The minimum charge still applies.'},
      {...priceField('roundingIncrement', 'Round displayed prices to nearest ($)', 0.01, 100), group: 'range',
        description: 'For example, 5 rounds to the nearest $5; 1 rounds to the nearest dollar.'},
      ...adjustments.map((question) => defineField({
        name: question.id,
        title: question.label,
        type: 'object',
        group: question.id,
        options: {collapsible: false},
        fields: question.options.map((option) => defineField({
          name: option.id,
          title: option.label,
          type: 'object',
          options: {collapsible: true, collapsed: false},
          fields: question.kind === 'choice' ? [
            {...priceField('multiply', 'Price multiplier', 0, 100),
              description: '1 leaves the base price unchanged; 1.2 adds 20%; 0.6 charges 60% of the base price.'},
            {...priceField('add', 'Flat price adjustment ($)', -1_000_000),
              description: 'Use a negative amount for a discount, or 0 for no adjustment.'},
          ] : [
            priceField('add', 'Flat add-on charge ($)'),
            priceField('perUnit', `Add-on charge per ${unit.replace(/s$/, '')} ($)`),
          ],
        })),
      })),
    ],
    initialValue: initialPricing(tab),
    preview: {prepare: () => ({title, subtitle: 'Instant customer prices'})},
  })
})
