import type {SanityImageSource} from './sanity.image'

// ─── TypeScript Interfaces ────────────────────────────────────────────────────

export interface ProjectListItem {
  _id: string
  title: string
  slug: string
  tagline: string | null
  mediaType: 'photo' | 'video'
  coverImage: SanityImageSource
  lqip: string | null
}

export interface GalleryImage {
  _key: string
  asset: {_ref: string; _type: 'reference'}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  lqip: string | null
  dimensions: {width: number; height: number} | null
  displaySize: 'half' | 'third' | 'full' | null
  colSpan: number | null
}

export interface SubprojectItem {
  _id: string
  title: string
  slug: string
  tagline: string | null
  mediaType: 'photo' | 'video'
  coverImage: SanityImageSource
  lqip: string | null
}

export interface ProjectDetail {
  _id: string
  title: string
  slug: string
  mediaType: 'photo' | 'video'
  coverImage: SanityImageSource
  lqip: string | null
  muxPlaybackId: string | null
  galleryLayout: 'mixed' | 'masonry' | '2-col' | '3-col' | 'custom' | null
  gallery: GalleryImage[] | null
  subprojects: SubprojectItem[] | null
  description: unknown[] | null
  publishedAt: string | null
}

export interface SiteSettings {
  siteName: string | null
  tagline: string | null
  heroHeading: string | null
  heroSubheading: string | null
  featuredProjects: ProjectListItem[] | null
  bio: unknown[] | null
  profilePhoto: SanityImageSource | null
  profilePhotoLqip: string | null
  disciplines: string[] | null
  contactHeading: string | null
  contactNote: string | null
  contactEmail: string | null
  instagram: string | null
  vimeo: string | null
  youtube: string | null
  linkedin: string | null
  seoTitle: string | null
  seoDescription: string | null
  ogImage: SanityImageSource | null
  accentColor: string | null
  heroBgImage: SanityImageSource | null
  heroBgImageLqip: string | null
  heroLayout: 'minimal' | 'fullscreen' | 'split' | null
  showAboutPreview: boolean | null
  workGridCols: 2 | 3 | 4 | null
  cardStyle: 'below' | 'overlay' | null
  colorScheme: 'dark' | 'light' | null
  fontFamily: 'geist' | 'playfair' | 'dm-sans' | 'pf-transport' | 'pf-bague' | 'asty' | null
}

// ─── GROQ Queries ─────────────────────────────────────────────────────────────

export const siteSettingsQuery = /* groq */ `
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    heroHeading,
    heroSubheading,
    "featuredProjects": featuredProjects[]-> {
      _id,
      title,
      "slug": slug.current,
      tagline,
      mediaType,
      coverImage,
      "lqip": coverImage.asset->metadata.lqip
    },
    bio,
    profilePhoto,
    "profilePhotoLqip": profilePhoto.asset->metadata.lqip,
    disciplines,
    contactHeading,
    contactNote,
    contactEmail,
    instagram,
    vimeo,
    youtube,
    linkedin,
    seoTitle,
    seoDescription,
    ogImage,
    accentColor,
    heroBgImage,
    "heroBgImageLqip": heroBgImage.asset->metadata.lqip,
    heroLayout,
    showAboutPreview,
    workGridCols,
    cardStyle,
    colorScheme,
    fontFamily
  }
`

export const projectsQuery = /* groq */ `
  *[_type == "project"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    tagline,
    mediaType,
    coverImage,
    "lqip": coverImage.asset->metadata.lqip
  }
`

export const projectBySlugQuery = /* groq */ `
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    mediaType,
    coverImage,
    "lqip": coverImage.asset->metadata.lqip,
    "muxPlaybackId": video.asset->data.playback_ids[0].id,
    galleryLayout,
    gallery[defined(asset._ref)] {
      ...,
      "lqip": asset->metadata.lqip,
      "dimensions": asset->metadata.dimensions
    },
    "subprojects": subprojects[]->{
      _id,
      title,
      "slug": slug.current,
      tagline,
      mediaType,
      coverImage,
      "lqip": coverImage.asset->metadata.lqip
    },
    description,
    publishedAt
  }
`

export const projectSlugsQuery = /* groq */ `
  *[_type == "project" && defined(slug.current)] {
    "slug": slug.current
  }
`
