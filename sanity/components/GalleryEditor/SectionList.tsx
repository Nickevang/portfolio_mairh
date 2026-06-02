import {useState, useRef} from 'react'
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
  album: 'Album',
  editorial: 'Editorial',
  diptych: 'Diptych',
  bento: 'Bento',
  scatter: 'Scatter',
  panorama: 'Panorama',
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
  onRename: (key: string, name: string) => void
}

// ── Page Map ──────────────────────────────────────────────────────────────────
// Visual overview of the page layout — shows which sections are side-by-side.

type RowGroup = {rowId: string; isSolo: boolean; sections: GallerySection[]}

function PageMap({
  sections,
  selectedKey,
  imgUrl,
  onSelect,
}: {
  sections: GallerySection[]
  selectedKey: string | null
  imgUrl: (ref: string, w: number) => string
  onSelect: (key: string) => void
}) {
  if (sections.length === 0) return null

  const groups: RowGroup[] = []
  sections.forEach(s => {
    if (s.sectionRow == null) {
      groups.push({rowId: `solo-${s._key}`, isSolo: true, sections: [s]})
    } else {
      const existing = groups.find(g => g.rowId === `row-${s.sectionRow}`)
      if (existing) existing.sections.push(s)
      else groups.push({rowId: `row-${s.sectionRow}`, isSolo: false, sections: [s]})
    }
  })

  const selectedSection = sections.find(s => s._key === selectedKey)
  const selectedRow = selectedSection?.sectionRow

  return (
    <div
      style={{
        padding: '8px 8px 6px',
        borderBottom: '1px solid #1a1a1a',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#2e2e2e',
          marginBottom: 6,
        }}
      >
        Page layout
      </div>

      {groups.map(group => {
        const totalW = group.sections.reduce(
          (acc, s) => acc + (s.sectionWidth ?? (group.isSolo ? 100 : 50)),
          0,
        )
        const inSameRow =
          !group.isSolo && selectedRow != null && group.sections[0]?.sectionRow === selectedRow

        return (
          <div
            key={group.rowId}
            style={{
              display: 'flex',
              gap: 3,
              marginBottom: 4,
              padding: inSameRow ? '2px' : '0',
              borderRadius: 5,
              background: inSameRow ? 'rgba(74,222,128,0.06)' : 'transparent',
              border: inSameRow ? '1px solid rgba(74,222,128,0.15)' : '1px solid transparent',
            }}
          >
            {group.sections.map(s => {
              const w = s.sectionWidth ?? (group.isSolo ? 100 : 50)
              const flex = w / totalW
              const isSelected = s._key === selectedKey
              const thumbRef = s.images[0]?.asset?._ref

              return (
                <div
                  key={s._key}
                  onClick={() => onSelect(s._key)}
                  title={`${s.name ?? LAYOUT_LABELS[s.layoutType] ?? s.layoutType}${group.isSolo ? '' : ` · ${w}%`}`}
                  style={{
                    flex,
                    minWidth: 0,
                    height: 32,
                    borderRadius: 4,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: isSelected
                      ? '1.5px solid #e26012'
                      : inSameRow
                        ? '1.5px solid rgba(74,222,128,0.3)'
                        : '1.5px solid #1e1e1e',
                    position: 'relative',
                    background: '#0d0d0d',
                    transition: 'border-color 0.1s',
                  }}
                >
                  {thumbRef && (
                    <img
                      src={imgUrl(thumbRef, 80)}
                      alt=""
                      draggable={false}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                        opacity: 0.55,
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: isSelected ? 'rgba(226,96,18,0.35)' : undefined,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 7,
                        fontWeight: 700,
                        color: isSelected ? '#fff' : '#555',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                        textAlign: 'center',
                        padding: '0 2px',
                      }}
                    >
                      {s.name
                        ? s.name.slice(0, 8)
                        : (LAYOUT_LABELS[s.layoutType] ?? s.layoutType).slice(0, 8)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function DragHandle() {
  return (
    <svg
      width={8}
      height={12}
      viewBox="0 0 8 12"
      style={{flexShrink: 0, opacity: 0.35, cursor: 'grab'}}
    >
      <circle cx={2} cy={2} r={1.5} fill="#fff" />
      <circle cx={6} cy={2} r={1.5} fill="#fff" />
      <circle cx={2} cy={6} r={1.5} fill="#fff" />
      <circle cx={6} cy={6} r={1.5} fill="#fff" />
      <circle cx={2} cy={10} r={1.5} fill="#fff" />
      <circle cx={6} cy={10} r={1.5} fill="#fff" />
    </svg>
  )
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
  onRename,
}: Props) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)
  const [openMenuKey, setOpenMenuKey] = useState<string | null>(null)
  const [editingNameKey, setEditingNameKey] = useState<string | null>(null)
  const [editingNameValue, setEditingNameValue] = useState('')
  const nameInputRef = useRef<HTMLInputElement>(null)

  function startEditing(section: GallerySection, e: React.MouseEvent) {
    e.stopPropagation()
    setEditingNameKey(section._key)
    setEditingNameValue(section.name ?? '')
    setTimeout(() => nameInputRef.current?.select(), 0)
  }

  function commitName() {
    if (editingNameKey) {
      onRename(editingNameKey, editingNameValue.trim())
    }
    setEditingNameKey(null)
  }

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
          padding: '10px 16px 8px',
          flexShrink: 0,
          borderBottom: '1px solid #1e1e1e',
        }}
      >
        <div style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555'}}>
          Sections
        </div>
        <div style={{fontSize: 10, color: '#2e2e2e', marginTop: 2}}>
          Drag ⠿ to reorder · stacks top→bottom
        </div>
      </div>

      {/* Page Map — visual overview of row layout */}
      <PageMap
        sections={sections}
        selectedKey={selectedKey}
        imgUrl={imgUrl}
        onSelect={key => { onSelect(key); setOpenMenuKey(null) }}
      />

      {/* Section cards */}
      <div style={{flex: 1, overflowY: 'auto', padding: '8px 8px 0'}}>
        {sections.length === 0 && (
          <div style={{padding: '24px 12px', textAlign: 'center', fontSize: 12, color: '#333'}}>
            No sections yet
          </div>
        )}

        {sections.map((section, i) => {
          const isSelected = section._key === selectedKey
          const isDragging = dragIdx === i
          const isDropTarget = dropIdx === i && dragIdx !== i
          const isHovered = hoveredKey === section._key
          const isEditingName = editingNameKey === section._key
          const thumbs = section.images.slice(0, 5)

          return (
            <div
              key={section._key}
              draggable
              onClick={() => { onSelect(section._key); setOpenMenuKey(null) }}
              onMouseEnter={() => setHoveredKey(section._key)}
              onMouseLeave={() => setHoveredKey(null)}
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
                        style={{flex: 1, minWidth: 0, height: '100%', objectFit: 'cover', borderRadius: 2}}
                      />
                    ) : (
                      <div key={img._key} style={{flex: 1, background: '#222', borderRadius: 2}} />
                    )
                  })
                )}
              </div>

              {/* Label row */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '5px 8px',
                }}
              >
                <DragHandle />

                {/* Section number */}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: '#333',
                    background: '#222',
                    borderRadius: 3,
                    padding: '1px 5px',
                    flexShrink: 0,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  #{i + 1}
                </span>

                {/* Name / editable label */}
                {isEditingName ? (
                  <input
                    ref={nameInputRef}
                    value={editingNameValue}
                    autoFocus
                    onChange={e => setEditingNameValue(e.target.value)}
                    onBlur={commitName}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitName()
                      if (e.key === 'Escape') setEditingNameKey(null)
                      e.stopPropagation()
                    }}
                    onClick={e => e.stopPropagation()}
                    placeholder="Section name…"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      background: '#0d0d0d',
                      border: '1px solid #3b82f6',
                      borderRadius: 3,
                      color: '#ddd',
                      fontSize: 11,
                      padding: '2px 5px',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <div style={{flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 4}}>
                    <span
                      onClick={e => startEditing(section, e)}
                      title="Click to rename"
                      style={{
                        fontSize: 11,
                        color: section.name
                          ? (isSelected ? '#e26012' : '#aaa')
                          : '#444',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        cursor: 'text',
                        fontStyle: section.name ? 'normal' : 'italic',
                        minWidth: 0,
                      }}
                    >
                      {section.name || 'Untitled'}
                    </span>
                    {!section.name && isHovered && (
                      <span style={{fontSize: 9, color: '#3b82f6', flexShrink: 0}}>rename</span>
                    )}
                  </div>
                )}

                {/* Row badge */}
                {section.sectionRow != null && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      background: '#1a2a1a',
                      color: '#4ade80',
                      borderRadius: 3,
                      padding: '1px 5px',
                      flexShrink: 0,
                    }}
                  >
                    R{section.sectionRow} · {section.sectionWidth ?? 50}%
                  </span>
                )}

                {/* Layout badge */}
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    color: isSelected ? '#e26012' : '#444',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  {LAYOUT_LABELS[section.layoutType] ?? section.layoutType}
                </span>

                {/* Context menu */}
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
                        fontSize: 15,
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
                          minWidth: 140,
                          boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
                          overflow: 'hidden',
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => { startEditing(section, {stopPropagation: () => {}} as React.MouseEvent); setOpenMenuKey(null) }}
                          style={menuItemStyle}
                        >
                          Rename…
                        </button>
                        <div style={{height: 1, background: '#2a2a2a', margin: '2px 0'}} />
                        <button
                          disabled={i === 0}
                          onClick={() => { onReorder(i, i - 1); setOpenMenuKey(null) }}
                          style={{...menuItemStyle, color: i === 0 ? '#333' : '#ccc', cursor: i === 0 ? 'default' : 'pointer'}}
                        >
                          ↑ Move up
                        </button>
                        <button
                          disabled={i === sections.length - 1}
                          onClick={() => { onReorder(i, i + 1); setOpenMenuKey(null) }}
                          style={{...menuItemStyle, color: i === sections.length - 1 ? '#333' : '#ccc', cursor: i === sections.length - 1 ? 'default' : 'pointer'}}
                        >
                          ↓ Move down
                        </button>
                        <div style={{height: 1, background: '#2a2a2a', margin: '2px 0'}} />
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
