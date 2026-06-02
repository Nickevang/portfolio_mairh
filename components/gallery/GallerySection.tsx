'use client'

import type {RenderedSection} from './types'
import {LayoutCustomGrid} from './LayoutCustomGrid'
import {LayoutJustified} from './LayoutJustified'
import {LayoutMasonry} from './LayoutMasonry'
import {LayoutUniformGrid} from './LayoutUniformGrid'
import {LayoutSlideshow} from './LayoutSlideshow'
import {LayoutCinematic} from './LayoutCinematic'
import {LayoutMosaic} from './LayoutMosaic'
import {LayoutFilmstrip} from './LayoutFilmstrip'

export function GallerySection({section}: {section: RenderedSection}) {
  switch (section.layoutType) {
    case 'customGrid':
      return <LayoutCustomGrid section={section} />
    case 'justified':
      return <LayoutJustified section={section} />
    case 'masonry':
      return <LayoutMasonry section={section} />
    case 'uniformGrid':
      return <LayoutUniformGrid section={section} />
    case 'slideshow':
      return <LayoutSlideshow section={section} />
    case 'cinematic':
      return <LayoutCinematic section={section} />
    case 'mosaic':
      return <LayoutMosaic section={section} />
    case 'filmstrip':
      return <LayoutFilmstrip section={section} />
    default:
      return null
  }
}
