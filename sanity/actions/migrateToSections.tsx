import {useDocumentOperation} from 'sanity'
import {useCallback, useState} from 'react'

interface LegacyImage {
  _key: string
  _type: string
  asset?: {_ref: string; _type: string}
  hotspot?: {x: number; y: number}
  crop?: {top: number; bottom: number; left: number; right: number}
  displaySize?: 'half' | 'third' | 'full'
  colSpan?: number
  [key: string]: unknown
}

interface ProjectDoc {
  _id: string
  _type: string
  galleryLayout?: string
  gallery?: LegacyImage[]
  sections?: unknown[]
  [key: string]: unknown
}

function displaySizeToColSpan(displaySize: string | undefined): number {
  if (displaySize === 'full') return 6
  if (displaySize === 'third') return 2
  return 3
}

export function MigrateToSectionsAction(props: {id: string; type: string; published: ProjectDoc | null; draft: ProjectDoc | null}) {
  const doc = props.draft ?? props.published
  const {patch} = useDocumentOperation(props.id, props.type)

  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')

  const hasGallery = Array.isArray(doc?.gallery) && (doc?.gallery?.length ?? 0) > 0
  const hasSections = Array.isArray(doc?.sections) && (doc?.sections?.length ?? 0) > 0

  const migrate = useCallback(async () => {
    if (!doc?.gallery?.length) return
    setStatus('running')

    try {
      const legacyLayout = doc.galleryLayout ?? 'mixed'
      let layoutType: string
      let extraSettings: Record<string, unknown> = {}

      switch (legacyLayout) {
        case 'masonry':
          layoutType = 'masonry'
          extraSettings = {columnCount: 3}
          break
        case '2-col':
          layoutType = 'uniformGrid'
          extraSettings = {columnCount: 2}
          break
        case '3-col':
          layoutType = 'uniformGrid'
          extraSettings = {columnCount: 3}
          break
        case 'custom':
          layoutType = 'customGrid'
          break
        default:
          // 'mixed' or anything else → customGrid with colSpan mapped from displaySize
          layoutType = 'customGrid'
      }

      const images = (doc.gallery ?? []).map((img) => {
        const base: Record<string, unknown> = {
          _key: img._key,
          _type: img._type,
          asset: img.asset,
        }
        if (img.hotspot) base.hotspot = img.hotspot
        if (img.crop) base.crop = img.crop

        if (layoutType === 'customGrid') {
          base.colSpan = img.colSpan ?? displaySizeToColSpan(img.displaySize)
        }

        return base
      })

      const newSection = {
        _type: 'gallerySection',
        _key: `migrated-${Date.now()}`,
        layoutType,
        images,
        ...extraSettings,
      }

      patch.execute([
        {set: {sections: [newSection]}},
      ])

      setStatus('done')
    } catch {
      setStatus('error')
    }
  }, [doc, patch])

  if (!hasGallery || hasSections) return null

  return {
    label:
      status === 'running'
        ? 'Converting…'
        : status === 'done'
          ? 'Converted ✓'
          : status === 'error'
            ? 'Error — try again'
            : 'Convert Gallery → Sections',
    disabled: status === 'running' || status === 'done',
    onHandle: migrate,
    tone: 'primary' as const,
  }
}
