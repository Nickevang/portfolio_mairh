import createImageUrlBuilder from '@sanity/image-url'

import {sanityDataset, sanityProjectId} from './sanity.client'

export type SanityImageSource = Parameters<ReturnType<typeof createImageUrlBuilder>['image']>[0]

const builder = createImageUrlBuilder({
  projectId: sanityProjectId || 'missing',
  dataset: sanityDataset || 'production',
})

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

