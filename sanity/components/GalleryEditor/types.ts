export type LayoutType =
  | 'justified'
  | 'masonry'
  | 'uniformGrid'
  | 'customGrid'
  | 'slideshow'
  | 'cinematic'
  | 'mosaic'
  | 'filmstrip'
  | 'album'
  | 'editorial'
  | 'diptych'
  | 'bento'
  | 'scatter'
  | 'panorama'

export interface GalleryImage {
  _key: string
  _type: string
  asset?: {_ref: string; _type: 'reference'}
  colSpan?: number
  featured?: boolean
  widthCap?: 'contained' | 'full'
  focalPoint?: {x: number; y: number}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
}

export interface GallerySection {
  _key: string
  _type: 'gallerySection'
  name?: string
  layoutType: LayoutType
  images: GalleryImage[]
  // existing layout settings
  rowHeight?: number
  columnCount?: number
  autoplay?: boolean
  duration?: number
  heroIndex?: number
  supportCount?: number
  thumbHeight?: number
  // new layout settings
  thumbnailPosition?: 'right' | 'bottom'
  thumbnailSize?: number
  heroSide?: 'left' | 'right'
  bentoTemplate?: 'A' | 'B' | 'C'
  panoramaHeight?: number
  // 2D row positioning
  sectionRow?: number   // integer 1-10; sections with same value appear side-by-side
  sectionWidth?: number // percentage: 25 | 33 | 50 | 67 | 75 | 100
}

export interface LegacyImage {
  _key: string
  _type: string
  asset?: {_ref: string; _type: string}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  displaySize?: 'half' | 'third' | 'full'
  colSpan?: number
}
