import {useState} from 'react'
import type {GalleryImage, GallerySection} from './types'

// ── ImageCard ─────────────────────────────────────────────────────────────────

interface ImageCardProps {
  img: GalleryImage
  index: number
  total: number
  imgUrl: (ref: string, width: number) => string
  layoutType: GallerySection['layoutType']
  wrapperStyle?: React.CSSProperties
  imgStyle?: React.CSSProperties
  isDragging: boolean
  isDropTarget: boolean
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave: () => void
  onDrop: (e: React.DragEvent) => void
  onDragEnd: () => void
  onDelete: () => void
  onUpdate: (updates: Partial<GalleryImage>) => void
}

function ImageCard({
  img,
  index,
  total,
  imgUrl,
  layoutType,
  wrapperStyle,
  imgStyle,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDelete,
  onUpdate,
}: ImageCardProps) {
  const [hovered, setHovered] = useState(false)
  const url = img.asset ? imgUrl(img.asset._ref, 800) : ''

  return (
    <div
      draggable
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      style={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        cursor: 'grab',
        opacity: isDragging ? 0.25 : 1,
        outline: isDropTarget ? '2px dashed #3b82f6' : '2px solid transparent',
        transition: 'opacity 0.12s',
        ...wrapperStyle,
      }}
    >
      {url ? (
        <img
          src={url}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            display: 'block',
            pointerEvents: 'none',
            ...imgStyle,
          }}
        />
      ) : (
        <div
          style={{
            background: '#1e1e1e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2a2a2a',
            fontSize: 22,
            ...imgStyle,
          }}
        >
          ?
        </div>
      )}

      {/* Hover overlay */}
      {hovered && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.52)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 8,
          }}
        >
          {/* Top: index + delete */}
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
            <span
              style={{
                fontSize: 9,
                color: 'rgba(255,255,255,0.35)',
                background: 'rgba(0,0,0,0.4)',
                padding: '2px 6px',
                borderRadius: 3,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {index + 1}/{total}
            </span>
            <button
              onClick={e => {
                e.stopPropagation()
                onDelete()
              }}
              style={{
                background: 'rgba(200,40,40,0.9)',
                border: 'none',
                borderRadius: 4,
                color: '#fff',
                width: 26,
                height: 26,
                cursor: 'pointer',
                fontSize: 16,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ×
            </button>
          </div>

          {/* Bottom: layout-specific controls */}
          <div>
            {layoutType === 'customGrid' && (
              <div style={{display: 'flex', gap: 3, flexWrap: 'wrap'}}>
                {[1, 2, 3, 4, 6].map(v => (
                  <button
                    key={v}
                    onClick={e => {
                      e.stopPropagation()
                      onUpdate({colSpan: v})
                    }}
                    style={{
                      padding: '3px 7px',
                      fontSize: 10,
                      fontWeight: 700,
                      border: 'none',
                      borderRadius: 3,
                      cursor: 'pointer',
                      background: (img.colSpan ?? 3) === v ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                      color: '#fff',
                    }}
                  >
                    {v}
                  </button>
                ))}
                <span style={{fontSize: 9, color: 'rgba(255,255,255,0.35)', alignSelf: 'center', marginLeft: 2}}>
                  cols
                </span>
              </div>
            )}

            {layoutType === 'masonry' && (
              <button
                onClick={e => {
                  e.stopPropagation()
                  onUpdate({featured: !img.featured})
                }}
                style={{
                  background: img.featured ? '#e26012' : 'rgba(255,255,255,0.12)',
                  border: `1px solid ${img.featured ? '#e26012' : 'rgba(255,255,255,0.2)'}`,
                  borderRadius: 4,
                  color: '#fff',
                  padding: '4px 10px',
                  fontSize: 11,
                  cursor: 'pointer',
                }}
              >
                {img.featured ? '★ Featured' : '☆ Feature'}
              </button>
            )}

            {layoutType === 'cinematic' && (
              <div style={{display: 'flex', gap: 4}}>
                {(['contained', 'full'] as const).map(v => (
                  <button
                    key={v}
                    onClick={e => {
                      e.stopPropagation()
                      onUpdate({widthCap: v})
                    }}
                    style={{
                      padding: '3px 9px',
                      fontSize: 10,
                      border: 'none',
                      borderRadius: 3,
                      cursor: 'pointer',
                      background: (img.widthCap ?? 'full') === v ? '#3b82f6' : 'rgba(255,255,255,0.15)',
                      color: '#fff',
                    }}
                  >
                    {v === 'contained' ? 'Contained' : 'Full bleed'}
                  </button>
                ))}
              </div>
            )}

            {layoutType === 'mosaic' && (
              <span style={{fontSize: 9, color: 'rgba(255,255,255,0.35)'}}>
                Drag to reorder · hero set in options below
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Canvas layouts ────────────────────────────────────────────────────────────

interface CanvasProps {
  section: GallerySection
  images: GalleryImage[]
  imgUrl: (ref: string, width: number) => string
  dndProps: (i: number) => {
    isDragging: boolean
    isDropTarget: boolean
    onDragStart: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDragLeave: () => void
    onDrop: (e: React.DragEvent) => void
    onDragEnd: () => void
  }
  onDelete: (key: string) => void
  onUpdateImage: (key: string, updates: Partial<GalleryImage>) => void
}

function cardProps(images: GalleryImage[], i: number, section: GallerySection, imgUrl: CanvasProps['imgUrl'], dndProps: CanvasProps['dndProps'], onDelete: CanvasProps['onDelete'], onUpdateImage: CanvasProps['onUpdateImage']): ImageCardProps {
  const img = images[i]
  return {
    img,
    index: i,
    total: images.length,
    imgUrl,
    layoutType: section.layoutType,
    isDragging: dndProps(i).isDragging,
    isDropTarget: dndProps(i).isDropTarget,
    onDragStart: dndProps(i).onDragStart,
    onDragOver: dndProps(i).onDragOver,
    onDragLeave: dndProps(i).onDragLeave,
    onDrop: dndProps(i).onDrop,
    onDragEnd: dndProps(i).onDragEnd,
    onDelete: () => onDelete(img._key),
    onUpdate: u => onUpdateImage(img._key, u),
  }
}

function UniformGridCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const cols = section.columnCount ?? 3
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 6}}>
      {images.map((img, i) => (
        <ImageCard
          key={img._key}
          {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
          imgStyle={{aspectRatio: '1', objectFit: 'cover'}}
        />
      ))}
    </div>
  )
}

function MasonryCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const cols = section.columnCount ?? 3
  return (
    <div style={{columns: cols, gap: 6}}>
      {images.map((img, i) => (
        <ImageCard
          key={img._key}
          {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
          wrapperStyle={{
            breakInside: 'avoid',
            marginBottom: 6,
            width: '100%',
            ...(img.featured ? {gridColumn: `span ${cols}`} : {}),
          }}
          imgStyle={{height: 'auto'}}
        />
      ))}
    </div>
  )
}

function JustifiedCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const rowH = section.rowHeight ?? 300
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 6}}>
      {images.map((img, i) => (
        <ImageCard
          key={img._key}
          {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
          wrapperStyle={{flexGrow: 1, flexBasis: rowH * 1.3}}
          imgStyle={{height: Math.min(rowH, 340), objectFit: 'cover'}}
        />
      ))}
    </div>
  )
}

function CustomGridCanvas({images, imgUrl, dndProps, section, onDelete, onUpdateImage}: CanvasProps) {
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 6}}>
      {images.map((img, i) => {
        const span = img.colSpan ?? 3
        return (
          <ImageCard
            key={img._key}
            {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
            wrapperStyle={{gridColumn: `span ${span}`}}
            imgStyle={{aspectRatio: '4/3', objectFit: 'cover'}}
          />
        )
      })}
    </div>
  )
}

function SlideshowCanvas({images, imgUrl, dndProps, section, onDelete, onUpdateImage}: CanvasProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const current = images[activeIdx] ?? images[0]

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      {/* Main slide */}
      {current && (
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            position: 'relative',
            borderRadius: 6,
            overflow: 'hidden',
            background: '#111',
          }}
        >
          {current.asset && (
            <img
              src={imgUrl(current.asset._ref, 1200)}
              alt=""
              draggable={false}
              style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
            />
          )}
          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setActiveIdx(i => (i - 1 + images.length) % images.length)}
                style={arrowBtn('left')}
              >‹</button>
              <button
                onClick={() => setActiveIdx(i => (i + 1) % images.length)}
                style={arrowBtn('right')}
              >›</button>
            </>
          )}
        </div>
      )}

      {/* Thumbnail strip — draggable */}
      <div style={{display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 2}}>
        {images.map((img, i) => {
          const dp = dndProps(i)
          return (
            <div
              key={img._key}
              draggable
              onClick={() => setActiveIdx(i)}
              onDragStart={dp.onDragStart}
              onDragOver={dp.onDragOver}
              onDragLeave={dp.onDragLeave}
              onDrop={dp.onDrop}
              onDragEnd={dp.onDragEnd}
              style={{
                flexShrink: 0,
                width: 72,
                height: 48,
                borderRadius: 3,
                overflow: 'hidden',
                cursor: 'pointer',
                border: i === activeIdx ? '2px solid #e26012' : dp.isDropTarget ? '2px dashed #3b82f6' : '2px solid transparent',
                opacity: dp.isDragging ? 0.25 : 1,
                position: 'relative',
              }}
            >
              {img.asset && (
                <img
                  src={imgUrl(img.asset._ref, 150)}
                  alt=""
                  draggable={false}
                  style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}}
                />
              )}
              <button
                onClick={e => { e.stopPropagation(); onDelete(img._key) }}
                style={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  background: 'rgba(200,40,40,0.85)',
                  border: 'none',
                  borderRadius: 3,
                  color: '#fff',
                  width: 18,
                  height: 18,
                  cursor: 'pointer',
                  fontSize: 12,
                  lineHeight: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
                onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.opacity = '0')}
              >
                ×
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function arrowBtn(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute',
    top: '50%',
    [side]: 12,
    transform: 'translateY(-50%)',
    background: 'rgba(0,0,0,0.5)',
    border: 'none',
    borderRadius: 4,
    color: '#fff',
    width: 36,
    height: 36,
    cursor: 'pointer',
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  }
}

function CinematicCanvas({images, imgUrl, dndProps, section, onDelete, onUpdateImage}: CanvasProps) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 8}}>
      {images.map((img, i) => {
        const isFull = (img.widthCap ?? 'full') === 'full'
        return (
          <div key={img._key} style={{display: 'flex', justifyContent: 'center'}}>
            <ImageCard
              {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
              wrapperStyle={{width: isFull ? '100%' : '75%', maxWidth: isFull ? 'none' : 860}}
              imgStyle={{width: '100%', height: 'auto', aspectRatio: '16/7', objectFit: 'cover'}}
            />
          </div>
        )
      })}
    </div>
  )
}

function MosaicCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const heroIdx = section.heroIndex ?? 0
  const supportCount = section.supportCount ?? 4
  const hero = images[heroIdx]
  const rest = images.filter((_, i) => i !== heroIdx).slice(0, supportCount)
  const all = hero ? [hero, ...rest] : rest

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '3fr 2fr',
          gridTemplateRows: `repeat(${Math.ceil(rest.length / 2)}, 1fr)`,
          gap: 6,
        }}
      >
        {hero && (
          <ImageCard
            {...cardProps(all, 0, section, imgUrl, dndProps, onDelete, onUpdateImage)}
            wrapperStyle={{gridRow: `span ${Math.ceil(rest.length / 2)}`}}
            imgStyle={{width: '100%', height: '100%', objectFit: 'cover', minHeight: 260}}
          />
        )}
        {rest.map((img, i) => (
          <ImageCard
            key={img._key}
            {...cardProps(all, i + 1, section, imgUrl, dndProps, onDelete, onUpdateImage)}
            imgStyle={{width: '100%', aspectRatio: '4/3', objectFit: 'cover'}}
          />
        ))}
      </div>
      {images.length > supportCount + 1 && (
        <p style={{fontSize: 11, color: '#444', marginTop: 8, textAlign: 'center'}}>
          {images.length - supportCount - 1} more images hidden (increase Support Count below)
        </p>
      )}
    </div>
  )
}

function FilmstripCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const h = section.thumbHeight ?? 220
  return (
    <div style={{display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4}}>
      {images.map((img, i) => (
        <ImageCard
          key={img._key}
          {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
          wrapperStyle={{flexShrink: 0, width: h * 0.75}}
          imgStyle={{width: '100%', height: h, objectFit: 'cover'}}
        />
      ))}
    </div>
  )
}

function AlbumCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const [current, setCurrent] = useState(0)
  const thumbSize = section.thumbnailSize ?? 88
  const isRight = (section.thumbnailPosition ?? 'right') !== 'bottom'

  const focus = images[current]

  return (
    <div style={{display: 'flex', flexDirection: isRight ? 'row' : 'column', gap: 8, alignItems: 'flex-start'}}>
      {/* Focus view */}
      <div style={{flex: 1, position: 'relative', borderRadius: 6, overflow: 'hidden'}}>
        {focus?.asset ? (
          <img
            src={imgUrl(focus.asset._ref, 800)}
            alt=""
            draggable={false}
            style={{width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block'}}
          />
        ) : (
          <div style={{width: '100%', aspectRatio: '4/3', background: '#1a1a1a'}} />
        )}
      </div>

      {/* Thumbnail strip — draggable */}
      <div
        style={{
          display: 'flex',
          flexDirection: isRight ? 'column' : 'row',
          gap: 4,
          flexShrink: 0,
          overflowY: isRight ? 'auto' : undefined,
          overflowX: !isRight ? 'auto' : undefined,
          maxHeight: isRight ? 480 : undefined,
          width: isRight ? thumbSize : undefined,
        }}
      >
        {images.map((img, i) => {
          const dp = dndProps(i)
          return (
            <div
              key={img._key}
              draggable
              onClick={() => setCurrent(i)}
              onDragStart={dp.onDragStart}
              onDragOver={dp.onDragOver}
              onDragLeave={dp.onDragLeave}
              onDrop={dp.onDrop}
              onDragEnd={dp.onDragEnd}
              style={{
                flexShrink: 0,
                width: thumbSize,
                height: thumbSize,
                borderRadius: 4,
                overflow: 'hidden',
                cursor: 'pointer',
                border: i === current ? '2px solid #e26012' : dp.isDropTarget ? '2px dashed #3b82f6' : '2px solid transparent',
                opacity: dp.isDragging ? 0.25 : i === current ? 1 : 0.5,
                position: 'relative',
              }}
            >
              {img.asset && (
                <img
                  src={imgUrl(img.asset._ref, 150)}
                  alt=""
                  draggable={false}
                  style={{width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none'}}
                />
              )}
              <button
                onClick={e => { e.stopPropagation(); onDelete(img._key) }}
                style={{position:'absolute',top:2,right:2,background:'rgba(200,40,40,0.85)',border:'none',borderRadius:3,color:'#fff',width:18,height:18,cursor:'pointer',fontSize:12,lineHeight:1,display:'flex',alignItems:'center',justifyContent:'center'}}
              >×</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EditorialCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const heroSide = section.heroSide ?? 'left'
  const hero = images[0]
  const rest = images.slice(1, 5)

  const HeroEl = hero ? (
    <ImageCard
      {...cardProps(images, 0, section, imgUrl, dndProps, onDelete, onUpdateImage)}
      wrapperStyle={{flex: 3}}
      imgStyle={{width: '100%', height: '100%', minHeight: 280, objectFit: 'cover'}}
    />
  ) : <div style={{flex: 3, minHeight: 280, background: '#1a1a1a', borderRadius: 4}} />

  const RestEl = (
    <div style={{flex: 2, display: 'flex', flexDirection: 'column', gap: 6}}>
      {rest.map((_, i) => (
        <ImageCard
          key={images[i + 1]._key}
          {...cardProps(images, i + 1, section, imgUrl, dndProps, onDelete, onUpdateImage)}
          wrapperStyle={{flex: 1}}
          imgStyle={{width: '100%', height: '100%', minHeight: 60, objectFit: 'cover'}}
        />
      ))}
    </div>
  )

  return (
    <div style={{display: 'flex', gap: 6, flexDirection: heroSide === 'right' ? 'row-reverse' : 'row'}}>
      {HeroEl}
      {RestEl}
    </div>
  )
}

function DiptychCanvas({images, imgUrl, dndProps, section, onDelete, onUpdateImage}: CanvasProps) {
  const pairs = Array.from({length: Math.ceil(images.length / 2)}, (_, p) => [p * 2, p * 2 + 1])
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
      {pairs.map(([a, b]) => (
        <div key={a} style={{display: 'flex', gap: 6}}>
          <ImageCard
            {...cardProps(images, a, section, imgUrl, dndProps, onDelete, onUpdateImage)}
            wrapperStyle={{flex: 1}}
            imgStyle={{width: '100%', aspectRatio: '3/4', objectFit: 'cover'}}
          />
          {images[b] ? (
            <ImageCard
              {...cardProps(images, b, section, imgUrl, dndProps, onDelete, onUpdateImage)}
              wrapperStyle={{flex: 1}}
              imgStyle={{width: '100%', aspectRatio: '3/4', objectFit: 'cover'}}
            />
          ) : (
            <div style={{flex: 1, aspectRatio: '3/4'}} />
          )}
        </div>
      ))}
    </div>
  )
}

function BentoCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const t = section.bentoTemplate ?? 'A'
  const configs = {
    A: {areas: '"a a b c" "a a d e" "f f f f"', cols: 'repeat(4,1fr)', rows: '160px 160px 120px', slots: ['a','b','c','d','e','f']},
    B: {areas: '"a a b" "a a c" "d e e"',        cols: 'repeat(3,1fr)', rows: '160px 160px 160px', slots: ['a','b','c','d','e']},
    C: {areas: '"a b b b" "c c d d" "e f f g"',  cols: 'repeat(4,1fr)', rows: '160px 160px 160px', slots: ['a','b','c','d','e','f','g']},
  }
  const cfg = configs[t as keyof typeof configs] ?? configs.A

  return (
    <div style={{display: 'grid', gridTemplateAreas: cfg.areas, gridTemplateColumns: cfg.cols, gridTemplateRows: cfg.rows, gap: 6}}>
      {cfg.slots.map((slot, i) => {
        const img = images[i]
        if (!img) return <div key={slot} style={{gridArea: slot}} />
        return (
          <ImageCard
            key={img._key}
            {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
            wrapperStyle={{gridArea: slot}}
            imgStyle={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        )
      })}
    </div>
  )
}

function ScatterCanvas({images, imgUrl, dndProps, section, onDelete, onUpdateImage}: CanvasProps) {
  const cols = Math.min(images.length, 3)
  return (
    <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols},1fr)`, gap: 24, padding: '20px 16px', isolation: 'isolate'}}>
      {images.map((img, i) => {
        const rot = Math.sin(i * 2.3 + 1.1) * 7
        return (
          <ImageCard
            key={img._key}
            {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
            wrapperStyle={{
              background: '#fff',
              padding: '5px 5px 28px',
              transform: `rotate(${rot}deg)`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
              borderRadius: 2,
              zIndex: 1,
            }}
            imgStyle={{width: '100%', aspectRatio: '4/3', objectFit: 'cover'}}
          />
        )
      })}
    </div>
  )
}

function PanoramaCanvas({section, images, imgUrl, dndProps, onDelete, onUpdateImage}: CanvasProps) {
  const h = section.panoramaHeight ?? 280
  return (
    <div style={{display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4}}>
      {images.map((img, i) => (
        <ImageCard
          key={img._key}
          {...cardProps(images, i, section, imgUrl, dndProps, onDelete, onUpdateImage)}
          wrapperStyle={{flexShrink: 0, width: h * 1.4}}
          imgStyle={{width: '100%', height: h, objectFit: 'cover'}}
        />
      ))}
    </div>
  )
}

// ── SectionCanvas ─────────────────────────────────────────────────────────────

interface SectionCanvasProps {
  section: GallerySection
  imgUrl: (ref: string, width: number) => string
  onReorder: (from: number, to: number) => void
  onDelete: (imageKey: string) => void
  onUpdateImage: (imageKey: string, updates: Partial<GalleryImage>) => void
}

export function SectionCanvas({section, imgUrl, onReorder, onDelete, onUpdateImage}: SectionCanvasProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dropIdx, setDropIdx] = useState<number | null>(null)
  const images = section.images ?? []

  function dndProps(i: number) {
    return {
      isDragging: dragIdx === i,
      isDropTarget: dropIdx === i && dragIdx !== i,
      onDragStart: (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move'
        setDragIdx(i)
      },
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setDropIdx(i)
      },
      onDragLeave: () => setDropIdx(null),
      onDrop: (e: React.DragEvent) => {
        e.preventDefault()
        if (dragIdx !== null && dragIdx !== i) onReorder(dragIdx, i)
        setDragIdx(null)
        setDropIdx(null)
      },
      onDragEnd: () => {
        setDragIdx(null)
        setDropIdx(null)
      },
    }
  }

  const canvasProps: CanvasProps = {section, images, imgUrl, dndProps, onDelete, onUpdateImage}

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: 16,
        background: '#111',
        // Scrollbar
        scrollbarWidth: 'thin',
        scrollbarColor: '#2a2a2a transparent',
      }}
    >
      {images.length === 0 ? (
        <div
          style={{
            height: '100%',
            minHeight: 200,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2e2e2e',
            gap: 8,
            border: '1px dashed #222',
            borderRadius: 8,
          }}
        >
          <svg width={32} height={32} viewBox="0 0 32 32" fill="none">
            <rect x={2} y={2} width={12} height={12} rx={2} stroke="#2e2e2e" strokeWidth={1.5}/>
            <rect x={18} y={2} width={12} height={12} rx={2} stroke="#2e2e2e" strokeWidth={1.5}/>
            <rect x={2} y={18} width={12} height={12} rx={2} stroke="#2e2e2e" strokeWidth={1.5}/>
            <rect x={18} y={18} width={12} height={12} rx={2} stroke="#2e2e2e" strokeWidth={1.5}/>
          </svg>
          <span style={{fontSize: 12}}>
            Add images to this section in the <strong style={{color: '#3a3a3a'}}>Edit</strong> tab
          </span>
        </div>
      ) : (
        <>
          {section.layoutType === 'uniformGrid' && <UniformGridCanvas {...canvasProps} />}
          {section.layoutType === 'masonry' && <MasonryCanvas {...canvasProps} />}
          {section.layoutType === 'justified' && <JustifiedCanvas {...canvasProps} />}
          {section.layoutType === 'customGrid' && <CustomGridCanvas {...canvasProps} />}
          {section.layoutType === 'slideshow' && <SlideshowCanvas {...canvasProps} />}
          {section.layoutType === 'cinematic' && <CinematicCanvas {...canvasProps} />}
          {section.layoutType === 'mosaic' && <MosaicCanvas {...canvasProps} />}
          {section.layoutType === 'filmstrip' && <FilmstripCanvas {...canvasProps} />}
          {section.layoutType === 'album' && <AlbumCanvas {...canvasProps} />}
          {section.layoutType === 'editorial' && <EditorialCanvas {...canvasProps} />}
          {section.layoutType === 'diptych' && <DiptychCanvas {...canvasProps} />}
          {section.layoutType === 'bento' && <BentoCanvas {...canvasProps} />}
          {section.layoutType === 'scatter' && <ScatterCanvas {...canvasProps} />}
          {section.layoutType === 'panorama' && <PanoramaCanvas {...canvasProps} />}
        </>
      )}
    </div>
  )
}
