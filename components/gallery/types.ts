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
}
