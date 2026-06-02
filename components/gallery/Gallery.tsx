'use client'

import type {RenderedSection} from './types'
import {GallerySection} from './GallerySection'

export function Gallery({sections}: {sections: RenderedSection[]}) {
  if (!sections?.length) return null
  return (
    <div className="space-y-12">
      {sections.map((section) => (
        <GallerySection key={section._key} section={section} />
      ))}
    </div>
  )
}
