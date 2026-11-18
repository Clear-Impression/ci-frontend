import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'vpeebhw5',
    dataset: 'production'
  },
  studioHost: 'clear-impression-services',
  deployment: {
    appId: 'xu9ovfnb12kj7hx82bgtcfw9',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
