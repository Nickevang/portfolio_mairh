import {useEffect, useRef, useState} from 'react'
import {useClient, useDocumentOperation} from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import type {GalleryImage, GallerySection, LayoutType, LegacyImage} from './types'
import {SectionList} from './SectionList'
import {LayoutBar} from './LayoutBar'
import {SectionCanvas} from './SectionCanvas'
import {SectionControls} from './SectionControls'

interface GalleryEditorProps {
  document: {
    displayed: Record<string, unknown>
    draft: Record<string, unknown> | null
    published: Record<string, unknown> | null
  }
  documentId: string
  schemaType: {name: string}
}

function newKey(): string {
  return Math.random().toString(36).slice(2, 10)
}

function displaySizeToColSpan(displaySize: string | undefined): number {
  if (displaySize === 'full') return 6
  if (displaySize === 'third') return 2
  return 3
}

export function GalleryEditorView({document: {displayed}, documentId, schemaType}: GalleryEditorProps) {
  const client = useClient({apiVersion: '2024-01-01'})
  const builder = imageUrlBuilder(client)
  const {patch} = useDocumentOperation(documentId, schemaType.name)

  const serverSections = (displayed?.sections as GallerySection[] | undefined) ?? []
  const legacyImages = (displayed?.gallery as LegacyImage[] | undefined) ?? []
  const legacyLayout = (displayed?.galleryLayout as string | undefined) ?? 'mixed'
  const hasOldFormat = legacyImages.length > 0 && serverSections.length === 0
  const serverTimestamp = displayed?._updatedAt as string | undefined

  const [sections, setSections] = useState<GallerySection[]>(serverSections)
  const [selectedKey, setSelectedKey] = useState<string | null>(serverSections[0]?._key ?? null)
  const prevTimestamp = useRef(serverTimestamp)

  // Sync local state when external edits arrive (Edit tab, migration action, etc.)
  useEffect(() => {
    if (prevTimestamp.current !== serverTimestamp) {
      prevTimestamp.current = serverTimestamp
      setSections(serverSections)
      setSelectedKey(k => {
        const still = serverSections.find(s => s._key === k)
        return still ? k : (serverSections[0]?._key ?? null)
      })
    }
  }, [serverTimestamp]) // eslint-disable-line react-hooks/exhaustive-deps

  function imgUrl(ref: string, width: number): string {
    if (!ref) return ''
    try {
      return builder.image(ref).width(width).auto('format').url()
    } catch {
      return ''
    }
  }

  function commit(next: GallerySection[]) {
    setSections(next)
    patch.execute([{set: {sections: next}}])
  }

  // ── Section handlers ──────────────────────────────────────────────────

  function handleAddSection() {
    const key = newKey()
    const next: GallerySection[] = [
      ...sections,
      {_key: key, _type: 'gallerySection', layoutType: 'uniformGrid', images: [], columnCount: 3},
    ]
    commit(next)
    setSelectedKey(key)
  }

  function handleDeleteSection(key: string) {
    const next = sections.filter(s => s._key !== key)
    commit(next)
    if (selectedKey === key) setSelectedKey(next[0]?._key ?? null)
  }

  function handleReorderSections(from: number, to: number) {
    if (from === to) return
    const next = [...sections]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    commit(next)
  }

  function handleDuplicateSection(key: string) {
    const src = sections.find(s => s._key === key)
    if (!src) return
    const newSection: GallerySection = {
      ...src,
      _key: newKey(),
      images: src.images.map(img => ({...img, _key: newKey()})),
    }
    const idx = sections.findIndex(s => s._key === key)
    const next = [...sections]
    next.splice(idx + 1, 0, newSection)
    commit(next)
    setSelectedKey(newSection._key)
  }

  // ── Layout / settings handlers ────────────────────────────────────────

  function handleLayoutChange(layoutType: LayoutType) {
    if (!selectedKey) return
    const next = sections.map(s => (s._key === selectedKey ? {...s, layoutType} : s))
    commit(next)
  }

  function handleSectionUpdate(updates: Partial<GallerySection>) {
    if (!selectedKey) return
    const next = sections.map(s => (s._key === selectedKey ? {...s, ...updates} : s))
    commit(next)
  }

  // ── Image handlers ────────────────────────────────────────────────────

  function handleReorderImages(from: number, to: number) {
    if (!selectedKey || from === to) return
    const next = sections.map(s => {
      if (s._key !== selectedKey) return s
      const imgs = [...s.images]
      const [moved] = imgs.splice(from, 1)
      imgs.splice(to, 0, moved)
      return {...s, images: imgs}
    })
    commit(next)
  }

  function handleDeleteImage(imageKey: string) {
    if (!selectedKey) return
    const next = sections.map(s =>
      s._key !== selectedKey ? s : {...s, images: s.images.filter(img => img._key !== imageKey)},
    )
    commit(next)
  }

  function handleUpdateImage(imageKey: string, updates: Partial<GalleryImage>) {
    if (!selectedKey) return
    const next = sections.map(s =>
      s._key !== selectedKey
        ? s
        : {...s, images: s.images.map(img => (img._key === imageKey ? {...img, ...updates} : img))},
    )
    commit(next)
  }

  // ── Migration handler ─────────────────────────────────────────────────

  function handleMigrate() {
    if (!legacyImages.length) return
    let layoutType: LayoutType = 'customGrid'
    const extraSettings: Partial<GallerySection> = {}
    switch (legacyLayout) {
      case 'masonry':
        layoutType = 'masonry'
        extraSettings.columnCount = 3
        break
      case '2-col':
        layoutType = 'uniformGrid'
        extraSettings.columnCount = 2
        break
      case '3-col':
        layoutType = 'uniformGrid'
        extraSettings.columnCount = 3
        break
      default:
        layoutType = 'customGrid'
    }
    const images: GalleryImage[] = legacyImages.map(img => ({
      _key: img._key,
      _type: img._type,
      ...(img.asset && {asset: img.asset as GalleryImage['asset']}),
      ...(img.hotspot && {hotspot: img.hotspot}),
      ...(img.crop && {crop: img.crop}),
      ...(layoutType === 'customGrid' && {
        colSpan: img.colSpan ?? displaySizeToColSpan(img.displaySize),
      }),
    }))
    const newSection: GallerySection = {
      _key: `migrated-${Date.now()}`,
      _type: 'gallerySection',
      layoutType,
      images,
      ...extraSettings,
    }
    commit([newSection])
    setSelectedKey(newSection._key)
  }

  // ─────────────────────────────────────────────────────────────────────

  const selectedSection = sections.find(s => s._key === selectedKey) ?? null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: '#111',
        color: '#fff',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Migration banner */}
      {hasOldFormat && (
        <div
          style={{
            padding: '10px 20px',
            background: '#1a1200',
            borderBottom: '1px solid #3a2c00',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            flexShrink: 0,
          }}
        >
          <span style={{fontSize: 12, color: '#ffa040'}}>
            This project uses the legacy gallery format.
          </span>
          <button
            onClick={handleMigrate}
            style={{
              padding: '5px 14px',
              background: '#e26012',
              color: '#fff',
              border: 'none',
              borderRadius: 5,
              fontSize: 12,
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Convert to Gallery Editor →
          </button>
        </div>
      )}

      {/* Main layout */}
      <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
        <SectionList
          sections={sections}
          selectedKey={selectedKey}
          imgUrl={imgUrl}
          onSelect={setSelectedKey}
          onAdd={handleAddSection}
          onDelete={handleDeleteSection}
          onDuplicate={handleDuplicateSection}
          onReorder={handleReorderSections}
        />

        <div style={{flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
          {selectedSection ? (
            <>
              <LayoutBar
                section={selectedSection}
                imgUrl={imgUrl}
                onLayoutChange={handleLayoutChange}
              />
              <SectionCanvas
                section={selectedSection}
                imgUrl={imgUrl}
                onReorder={handleReorderImages}
                onDelete={handleDeleteImage}
                onUpdateImage={handleUpdateImage}
              />
              <SectionControls section={selectedSection} onChange={handleSectionUpdate} />
            </>
          ) : (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                color: '#444',
              }}
            >
              <svg width={48} height={48} viewBox="0 0 48 48" fill="none">
                <rect x={4} y={4} width={18} height={18} rx={3} stroke="#333" strokeWidth={2}/>
                <rect x={26} y={4} width={18} height={18} rx={3} stroke="#333" strokeWidth={2}/>
                <rect x={4} y={26} width={18} height={18} rx={3} stroke="#333" strokeWidth={2}/>
                <rect x={26} y={26} width={18} height={18} rx={3} stroke="#333" strokeWidth={2}/>
              </svg>
              <p style={{fontSize: 13, margin: 0}}>Add a section to start arranging your gallery</p>
              <button
                onClick={handleAddSection}
                style={{
                  padding: '8px 22px',
                  background: '#e26012',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                + Add First Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
