import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {pageHeaders} from '../data/page-headers'
import {pricingSections} from '../data/estimate-pricing'

const pricingTypes = new Set(pricingSections.map((section) => section.schemaType))

export default defineConfig({
  name: 'default',
  title: 'Clear Impressions Services',

  projectId: 'vpeebhw5',
  dataset: 'production',

  plugins: [structureTool({structure}), visionTool()],

  schema: {
    types: schemaTypes,
    templates: (templates) => [
      ...templates.filter((template) => template.schemaType !== 'pageHeader'),
      {
        id: 'service-category',
        title: 'Service',
        schemaType: 'service',
        parameters: [{name: 'category', type: 'string'}],
        value: ({category}: {category: string}) => ({category}),
      },
      {
        id: 'page-header',
        title: 'Page header',
        schemaType: 'pageHeader',
        parameters: [{name: 'pageId', type: 'string'}],
        value: ({pageId}: {pageId: string}) => ({
          pageId,
          title: pageHeaders[pageId].title,
          subtitle: pageHeaders[pageId].subtitle,
        }),
      },
    ],
  },
  document: {
    actions: (actions, context) => {
      if (pricingTypes.has(context.schemaType)) {
        return actions.filter((action) => action.action !== 'duplicate')
      }
      if (context.schemaType === 'pageHeader') {
        return actions.filter((action) => action.action !== 'duplicate')
      }
      // There is only one Locations page and one Seasonal offers document, so they
      // can't be copied, unpublished, or deleted. Offers are turned off with their switches.
      if (context.schemaType === 'locationsPage' || context.schemaType === 'seasonalOffers') {
        return actions.filter((action) =>
          !['duplicate', 'unpublish', 'delete'].includes(action.action ?? ''),
        )
      }
      return actions
    },
    newDocumentOptions: (options, {creationContext}) => options.filter((option) =>
      !pricingTypes.has(option.templateId) &&
      option.templateId !== 'page-header' &&
      option.templateId !== 'locationsPage' &&
      option.templateId !== 'seasonalOffers' &&
      (option.templateId !== 'service-category' || creationContext.type !== 'global'),
    ),
  },
})
