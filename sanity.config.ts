import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {muxInput} from 'sanity-plugin-mux-input'

import {schemaTypes} from './sanity/schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    deskTool(),
    muxInput({
      video_quality: 'basic',
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})

