import {useState} from 'react'
import type {GallerySection} from './types'

const LAYOUT_LABELS: Record<string, string> = {
  uniformGrid: 'Grid',
  masonry: 'Masonry',
  justified: 'Justified',
  customGrid: 'Custom',
  slideshow: 'Slideshow',
  cinematic: 'Cinematic',
  mosaic: 'Mosaic',
  filmstrip: 'Filmstrip',
}

interface Props {
  sections: GallerySection[]
  selectedKey: string | null
  imgUrl: (ref: string, width: number) => string
  onSelect: (key: string) => void
  onAdd: () => void
  onDelete: (key: string) => void
  onDuplicate: (key: string) => void
  onReorder: (from: number, to: number) => void
}

export function SectionList({
  sections,
  selectedKey,
  imgUrl,
  onSelect,
  onAdd,
  onDelete,
  onDuplicate,
  onReorder,
}: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null)

  return (
    <div
      style={{
        width: 272,
        flexShrink: 0,
        borderRight: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#141414',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 10px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#555',
          flexShrink: 0,
          borderBottom: '1px solid #1e1e1e',
        }}
      >
        Sections
      </div>

      {/* Section cards */}
      <div style={{flex: 1, overflowY: 'auto', padding: '8px 8px 0'}}>
        {sections.length === 0 && (
          <div
            style={{
              padding: '24px 12px',
              textAlign: 'center',
              fontSize: 12,
              color: '#333',
            }}
          >
            No sections yet
          </div>
        )}

        {sections.map((section, i) => {
          const isSelected = section._key === selectedKey
          const isDragging = dragIdx === i
          const isDropTarget = dropIdx === i && dragIdx !== i
          const isHovered = hoveredKey === section._key
          const thumbs = section.images.slice(0, 5)

          return (
            <div
              key={section._key}
              draggable
              onClick={() => { onSelect(section._key); setOpenMenuKey(null) }}
              onMouseEnter={() => setHoveredKey(section._key)}
              onMouseLeave={() => { setHoveredKey(null) }}
              onDragStart={e => {
                e.dataTransfer.effectAllowed = 'move'
                setDragIdx(i)
              }}
              onDragOver={e => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                setDropIdx(i)
              }}
              onDragLeave={() => setDropIdx(null)}
              onDrop={e => {
                e.preventDefault()
                if (dragIdx !== null) onReorder(dragIdx, i)
                setDragIdx(null)
                setDropIdx(null)
              }}
              onDragEnd={() => { setDragIdx(null); setDropIdx(null) }}
              style={{
                marginBottom: 6,
                borderRadius: 6,
                border: isSelected
                  ? '1px solid #e26012'
                  : isDropTarget
                    ? '1px dashed #3b82f6'
                    : '1px solid #222',
                background: isSelected ? '#1a0e00' : '#1a1a1a',
                cursor: 'grab',
                opacity: isDragging ? 0.3 : 1,
                transition: 'border-color 0.1s, background 0.1s, opacity 0.1s',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* Thumbnail strip */}
              <div
                style={{
                  display: 'flex',
                  height: 52,
                  overflow: 'hidden',
                  gap: 2,
                  padding: 2,
                  background: '#111',
                }}
              >
                {thumbs.length === 0 ? (
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2a2a2a',
                      fontSize: 11,
                    }}
                  >
                    No images
                  </div>
                ) : (
                  thumbs.map(img => {
                    const url = img.asset ? imgUrl(img.asset._ref, 120) : ''
                    return url ? (
                      <img
                        key={img._key}
                        src={url}
                        alt=""
                        draggable={false}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: 2,
                        }}
                      />
                    ) : (
                      <div
                        key={img._key}
                        style={{flex: 1, background: '#222', borderRadius: 2}}
                      />
                    )
                  })
                )}
              </div>

              {/* Label row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '6px 8px',
                }}
              >
                <div style={{display: 'flex', alignItems: 'center', gap: 6, minWidth: 0}}>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      color: isSelected ? '#e26012' : '#666',
                      textTransform: 'uppercase',
                      flexShrink: 0,
                    }}
                  >
                    {LAYOUT_LABELS[section.layoutType] ?? section.layoutType}
                  </span>
                  <span style={{fontSize: 10, color: '#333'}}>
                    · {section.images.length} {section.images.length === 1 ? 'image' : 'images'}
                  </span>
                </div>

                {/* Context menu button */}
                {(isHovered || isSelected || openMenuKey === section._key) && (
                  <div style={{position: 'relative', flexShrink: 0}}>
                    <button
                      onClick={e => {
                        e.stopPropagation()
                        setOpenMenuKey(openMenuKey === section._key ? null : section._key)
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#555',
                        fontSize: 16,
                        lineHeight: 1,
                        padding: '0 2px',
                        borderRadius: 3,
                      }}
                    >
                      ⋯
                    </button>

                    {openMenuKey === section._key && (
                      <div
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 24,
                          background: '#222',
                          border: '1px solid #333',
                          borderRadius: 6,
                          zIndex: 100,
                          minWidth: 130,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                          overflow: 'hidden',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { onDuplicate(section._key); setOpenMenuKey(null) }}
                          style={menuItemStyle}
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() => { onDelete(section._key); setOpenMenuKey(null) }}
                          style={{...menuItemStyle, color: '#f87171'}}
                        >
                          Delete section
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Add section */}
      <div style={{padding: '8px', flexShrink: 0, borderTop: '1px solid #1e1e1e'}}>
        <button
          onClick={onAdd}
          style={{
            width: '100%',
            padding: '8px 0',
            background: 'none',
            border: '1px dashed #2e2e2e',
            borderRadius: 6,
            color: '#555',
            fontSize: 12,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'border-color 0.1s, color 0.1s',
          }}
          onMouseEnter={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#444'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#aaa'
          }}
          onMouseLeave={e => {
            ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#2e2e2e'
            ;(e.currentTarget as HTMLButtonElement).style.color = '#555'
          }}
        >
          + Add Section
        </button>
      </div>
    </div>
  )
}

const menuItemStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '8px 14px',
  background: 'none',
  border: 'none',
  textAlign: 'left',
  fontSize: 12,
  color: '#ccc',
  cursor: 'pointer',
}
