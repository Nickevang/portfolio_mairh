import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {muxInput} from 'sanity-plugin-mux-input'
import {presentationTool} from 'sanity/presentation'

import {schemaTypes} from './sanity/schemas'
import {MigrateToSectionsAction} from './sanity/actions/migrateToSections'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'missing'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'default',
  title: 'Portfolio Studio',

  projectId,
  dataset,

  basePath: '/studio',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site Settings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('project').title('Projects'),
          ]),
    }),
    muxInput({
      video_quality: 'basic',
    }),
    presentationTool({
      previewUrl: {
        origin: typeof location !== 'undefined' ? location.origin : 'https://portfolio-mairh.vercel.app',
        previewMode: {
          enable: '/api/draft',
          disable: '/api/draft?disable=1',
        },
      },
    }),
  ],

  document: {
    actions: (prev, context) =>
      context.schemaType === 'project'
        ? [...prev, MigrateToSectionsAction]
        : prev,
  },

  schema: {
    types: schemaTypes,
  },
})
