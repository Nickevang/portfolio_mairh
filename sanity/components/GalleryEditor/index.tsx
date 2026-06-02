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
  const ops = useDocumentOperation(documentId, schemaType.name)
  const {patch} = ops
  // publish op: disabled is false when there are unpublished changes
  const publishOp = ops.publish as unknown as {execute: () => void; disabled: false | string}

  const serverSections = (displayed?.sections as GallerySection[] | undefined) ?? []
  const legacyImages = (displayed?.gallery as LegacyImage[] | undefined) ?? []
  const legacyLayout = (displayed?.galleryLayout as string | undefined) ?? 'mixed'
  const hasOldFormat = legacyImages.length > 0 && serverSections.length === 0
  const serverTimestamp = displayed?._updatedAt as string | undefined

  const [sections, setSections] = useState<GallerySection[]>(serverSections)
  const [selectedKey, setSelectedKey] = useState<string | null>(serverSections[0]?._key ?? null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const prevTimestamp = useRef(serverTimestamp)
  const lastPatchTime = useRef(0)

  // Sync from server only when someone else edited (not our own patch)
  useEffect(() => {
    if (prevTimestamp.current !== serverTimestamp) {
      prevTimestamp.current = serverTimestamp
      if (Date.now() - lastPatchTime.current > 2000) {
        setSections(serverSections)
        setSelectedKey(k => {
          const still = serverSections.find(s => s._key === k)
          return still ? k : (serverSections[0]?._key ?? null)
        })
      }
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
    lastPatchTime.current = Date.now()
    patch.execute([{set: {sections: next}}])
  }

  async function handleUploadImages(files: File[]) {
    if (!selectedKey || files.length === 0) return
    setUploading(true)
    try {
      const uploads = await Promise.all(
        files.map(file => client.assets.upload('image', file, {filename: file.name}))
      )
      const newImages: GalleryImage[] = uploads.map(asset => ({
        _key: newKey(),
        _type: 'image',
        asset: {_ref: asset._id, _type: 'reference' as const},
      }))
      const next = sections.map(s =>
        s._key !== selectedKey ? s : {...s, images: [...s.images, ...newImages]}
      )
      commit(next)
    } catch (err) {
      console.error('Upload failed:', err)
    } finally {
      setUploading(false)
    }
  }

  function handleRenameSection(key: string, name: string) {
    const next = sections.map(s => s._key === key ? {...s, name: name || undefined} : s)
    commit(next)
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
        ...(isFullscreen
          ? {position: 'fixed', inset: 0, zIndex: 9999}
          : {height: '100%'}),
        display: 'flex',
        flexDirection: 'column',
        background: '#111',
        color: '#fff',
        overflow: 'hidden',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 12px',
          height: 40,
          borderBottom: '1px solid #1e1e1e',
          background: '#0d0d0d',
          flexShrink: 0,
          gap: 10,
        }}
      >
        <span style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#3a3a3a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1}}>
          {(displayed?.title as string | undefined) ?? 'Gallery Editor'}
        </span>

        <div style={{display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0}}>
          {/* Publish button */}
          <button
            onClick={() => { if (publishOp.disabled === false) publishOp.execute() }}
            title={publishOp.disabled === false ? 'Publish changes to the live site' : 'No unpublished changes'}
            style={{
              background: publishOp.disabled === false ? '#e26012' : 'transparent',
              color: publishOp.disabled === false ? '#fff' : '#333',
              border: `1px solid ${publishOp.disabled === false ? '#e26012' : '#222'}`,
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 700,
              padding: '4px 12px',
              cursor: publishOp.disabled === false ? 'pointer' : 'default',
              letterSpacing: '0.04em',
              transition: 'all 0.15s',
            }}
          >
            {publishOp.disabled === false ? 'Publish' : '✓ Live'}
          </button>

          {/* Fullscreen toggle */}
          <button
            onClick={() => setIsFullscreen(f => !f)}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            style={{
              background: 'none',
              border: '1px solid #2a2a2a',
              borderRadius: 4,
              color: '#555',
              cursor: 'pointer',
              fontSize: 11,
              padding: '3px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            {isFullscreen ? (
              <svg width={11} height={11} viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="7,0 11,0 11,4"/>
                <polyline points="4,11 0,11 0,7"/>
                <line x1="11" y1="0" x2="6.5" y2="4.5"/>
                <line x1="0" y1="11" x2="4.5" y2="6.5"/>
              </svg>
            ) : (
              <svg width={11} height={11} viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="7,4 11,4 11,0"/>
                <polyline points="4,7 0,7 0,11"/>
                <line x1="11" y1="0" x2="6.5" y2="4.5"/>
                <line x1="0" y1="11" x2="4.5" y2="6.5"/>
              </svg>
            )}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>

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
          onRename={handleRenameSection}
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
                onUpload={handleUploadImages}
                uploading={uploading}
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
