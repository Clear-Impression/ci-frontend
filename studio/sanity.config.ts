import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {pageHeaders} from '../data/page-headers'

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
    actions: (actions, context) => context.schemaType === 'pageHeader'
      ? actions.filter((action) => action.action !== 'duplicate') : actions,
    newDocumentOptions: (options) => options.filter((option) => option.templateId !== 'page-header'),
  },
})
