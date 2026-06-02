// ── Raw GROQ types (server-side) ─────────────────────────────────────────────

export type LayoutType =
  | 'justified'
  | 'masonry'
  | 'uniformGrid'
  | 'customGrid'
  | 'slideshow'
  | 'cinematic'
  | 'mosaic'
  | 'filmstrip'
  // New layouts
  | 'album'      // focus view + thumbnail navigator strip (side or below)
  | 'editorial'  // magazine spread: hero + stacked supporting images
  | 'diptych'    // always pairs, two images per row
  | 'bento'      // bento box grid with predefined templates A/B/C
  | 'scatter'    // polaroid-style, images at slight random rotations
  | 'panorama'   // full-height horizontal scroll strip

export interface GalleryImage {
  _key: string
  asset: {_ref: string; _type: 'reference'}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  lqip?: string | null
  dimensions?: {width: number; height: number} | null
  // customGrid
  colSpan?: number
  // masonry
  featured?: boolean
  // cinematic
  widthCap?: 'contained' | 'full'
  // slideshow
  focalPoint?: {x: number; y: number}
}

export interface Section {
  _key: string
  layoutType: LayoutType
  images: GalleryImage[]
  // justified
  rowHeight?: number
  // masonry + uniformGrid
  columnCount?: number
  // slideshow
  autoplay?: boolean
  duration?: number
  // mosaic
  heroIndex?: number
  supportCount?: number
  // filmstrip
  thumbHeight?: number
  // album
  thumbnailPosition?: 'right' | 'bottom'
  thumbnailSize?: number
  // editorial
  heroSide?: 'left' | 'right'
  // bento
  bentoTemplate?: 'A' | 'B' | 'C'
  // panorama
  panoramaHeight?: number
  // 2D row positioning
  sectionRow?: number
  sectionWidth?: number
}

// ── Rendered types (client-side renderers) ───────────────────────────────────
// URLs are pre-built server-side; no next/headers dependency in client bundle.

export interface RenderedImage {
  _key: string
  src: string
  fullSrc: string
  width: number
  height: number
  alt: string
  lqip?: string
  colSpan?: number
  featured?: boolean
  widthCap?: 'contained' | 'full'
  focalPoint?: {x: number; y: number}
}

export interface RenderedSection {
  _key: string
  layoutType: LayoutType
  images: RenderedImage[]
  rowHeight?: number
  columnCount?: number
  autoplay?: boolean
  duration?: number
  heroIndex?: number
  supportCount?: number
  thumbHeight?: number
  // New layout fields
  thumbnailPosition?: 'right' | 'bottom'
  thumbnailSize?: number
  heroSide?: 'left' | 'right'
  bentoTemplate?: 'A' | 'B' | 'C'
  panoramaHeight?: number
  // 2D row positioning
  sectionRow?: number
  sectionWidth?: number
}
