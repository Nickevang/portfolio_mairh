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
import {LayoutAlbum} from './LayoutAlbum'
import {LayoutEditorial} from './LayoutEditorial'
import {LayoutDiptych} from './LayoutDiptych'
import {LayoutBento} from './LayoutBento'
import {LayoutScatter} from './LayoutScatter'
import {LayoutPanorama} from './LayoutPanorama'

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
    case 'album':
      return <LayoutAlbum section={section} />
    case 'editorial':
      return <LayoutEditorial section={section} />
    case 'diptych':
      return <LayoutDiptych section={section} />
    case 'bento':
      return <LayoutBento section={section} />
    case 'scatter':
      return <LayoutScatter section={section} />
    case 'panorama':
      return <LayoutPanorama section={section} />
    default:
      return null
  }
}
