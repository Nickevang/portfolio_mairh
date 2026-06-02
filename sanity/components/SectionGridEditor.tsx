import {type ArrayOfObjectsInputProps, set, useClient} from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import {useState} from 'react'

interface SectionImage {
  _key: string
  _type: string
  asset?: {_ref: string; _type: string}
  colSpan?: number
  [key: string]: unknown
}

const SPANS = [
  {v: 1, label: '1', sub: 'thin'},
  {v: 2, label: '2', sub: '⅓'},
  {v: 3, label: '3', sub: '½'},
  {v: 4, label: '4', sub: '⅔'},
  {v: 6, label: '6', sub: 'full'},
] as const

export function SectionGridEditor(props: ArrayOfObjectsInputProps) {
  const {value, onChange, renderDefault} = props
  const client = useClient({apiVersion: '2024-01-01'})
  const builder = imageUrlBuilder(client)

  const [selected, setSelected] = useState<string | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)

  const items = (value ?? []) as SectionImage[]

  function thumbUrl(item: SectionImage): string | null {
    if (!item.asset) return null
    try {
      return builder
        .image(item.asset as Parameters<typeof builder.image>[0])
        .width(300)
        .url()
    } catch {
      return null
    }
  }

  function updateSpan(key: string, colSpan: number) {
    const updated = items.map((it) => (it._key === key ? {...it, colSpan} : it))
    onChange(set(updated))
  }

  function reorder(from: number, to: number) {
    if (from === to) return
    const next = [...items]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(set(next))
    setSelected(null)
  }

  const selectedItem = selected ? items.find((x) => x._key === selected) : null

  return (
    <div>
      <p style={{fontSize: 11, color: '#888', margin: '0 0 8px'}}>
        Click a photo to set its width · Drag to reorder
      </p>

      {/* ── Visual grid ─────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: 3,
          background: '#111',
          padding: 3,
          borderRadius: 6,
          marginBottom: 10,
          minHeight: 60,
        }}
      >
        {items.length === 0 && (
          <div
            style={{
              gridColumn: 'span 6',
              padding: '20px 12px',
              textAlign: 'center',
              fontSize: 12,
              color: '#444',
            }}
          >
            Add images below, then arrange them here.
          </div>
        )}

        {items.map((item, i) => {
          const span = item.colSpan ?? 3
          const isSel = selected === item._key
          const isDragging = dragIdx === i
          const isDrop = dropIdx === i && dragIdx !== i
          const url = thumbUrl(item)

          return (
            <div
              key={item._key}
              draggable
              style={{
                gridColumn: `span ${span}`,
                position: 'relative',
                cursor: 'grab',
                opacity: isDragging ? 0.3 : 1,
                outline: isSel
                  ? '2px solid #3b82f6'
                  : isDrop
                    ? '2px dashed #60a5fa'
                    : '2px solid transparent',
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'opacity 0.1s, outline 0.1s',
              }}
              onClick={() => setSelected(isSel ? null : item._key)}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = 'move'
                setDragIdx(i)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'move'
                setDropIdx(i)
              }}
              onDragLeave={() => setDropIdx(null)}
              onDrop={(e) => {
                e.preventDefault()
                if (dragIdx !== null) reorder(dragIdx, i)
                setDragIdx(null)
                setDropIdx(null)
              }}
              onDragEnd={() => {
                setDragIdx(null)
                setDropIdx(null)
              }}
            >
              {url ? (
                <img
                  src={url}
                  alt=""
                  draggable={false}
                  style={{width: '100%', height: 'auto', display: 'block', pointerEvents: 'none'}}
                />
              ) : (
                <div
                  style={{
                    aspectRatio: '1',
                    background: '#222',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#444',
                    fontSize: 18,
                  }}
                >
                  ?
                </div>
              )}

              <div
                style={{
                  position: 'absolute',
                  top: 3,
                  right: 3,
                  background: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  fontSize: 9,
                  padding: '2px 4px',
                  borderRadius: 2,
                  pointerEvents: 'none',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}
              >
                {span}/6
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Width controls ──────────────────────────────────────────── */}
      {selectedItem && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#1a1a1a',
            border: '1px solid #2e2e2e',
            borderRadius: 6,
            padding: '8px 12px',
            marginBottom: 10,
          }}
        >
          <span style={{fontSize: 11, color: '#777', whiteSpace: 'nowrap'}}>Width (cols):</span>
          <div style={{display: 'flex', gap: 4}}>
            {SPANS.map(({v, label, sub}) => {
              const active = (selectedItem.colSpan ?? 3) === v
              return (
                <button
                  key={v}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    updateSpan(selected!, v)
                  }}
                  style={{
                    padding: '4px 9px',
                    borderRadius: 4,
                    border: `1px solid ${active ? '#3b82f6' : '#3a3a3a'}`,
                    background: active ? '#1d4ed8' : '#252525',
                    color: '#fff',
                    fontSize: 11,
                    cursor: 'pointer',
                    fontWeight: active ? 600 : 400,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                    lineHeight: 1.2,
                    minWidth: 34,
                  }}
                >
                  <span>{label}</span>
                  <span style={{fontSize: 9, opacity: 0.6}}>{sub}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: 18,
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* ── Default list (add / remove / edit) ──────────────────────── */}
      <details>
        <summary
          style={{
            fontSize: 11,
            color: '#666',
            cursor: 'pointer',
            userSelect: 'none',
            marginBottom: 6,
            listStyle: 'none',
          }}
        >
          ＋ Add / remove images
        </summary>
        <div style={{marginTop: 8}}>
          {renderDefault(props as Parameters<typeof renderDefault>[0])}
        </div>
      </details>
    </div>
  )
}
