'use client'

import Image from 'next/image'
import {useState, useEffect, useCallback} from 'react'
import {X, ChevronLeft, ChevronRight} from 'lucide-react'

export interface GalleryItem {
  key: string
  src: string
  fullSrc: string
  width: number
  height: number
  lqip?: string
  displaySize: 'half' | 'third' | 'full'
  alt: string
}

export type GalleryLayout = 'mixed' | 'masonry' | '2-col' | '3-col'

// ─── Thumbnail grid ───────────────────────────────────────────────────────────

function GridImage({
  item,
  index,
  layout,
  onClick,
}: {
  item: GalleryItem
  index: number
  layout: GalleryLayout
  onClick: () => void
}) {
  const spanClass =
    layout === 'mixed'
      ? item.displaySize === 'full'
        ? 'col-span-6'
        : item.displaySize === 'third'
          ? 'col-span-2'
          : 'col-span-3'
      : ''

  return (
    <button
      onClick={onClick}
      className={`block overflow-hidden rounded-xl cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40${spanClass ? ` ${spanClass}` : ''}`}
    >
      <Image
        src={item.src}
        alt={item.alt}
        width={item.width}
        height={item.height}
        style={{width: '100%', height: 'auto', display: 'block'}}
        className="transition-transform duration-500 group-hover:scale-[1.02]"
        placeholder={item.lqip ? 'blur' : 'empty'}
        blurDataURL={item.lqip ?? undefined}
        sizes="(min-width: 1024px) 50vw, 100vw"
        priority={index < 3}
      />
    </button>
  )
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: GalleryItem[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/30 tracking-widest tabular-nums select-none">
        {index + 1} / {items.length}
      </span>

      {items.length > 1 && (
        <button
          className="absolute left-3 p-2 text-white/50 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      <div
        className="flex items-center justify-center"
        style={{maxHeight: '90vh', maxWidth: '90vw'}}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={items[index].fullSrc}
          src={items[index].fullSrc}
          alt={items[index].alt}
          width={items[index].width}
          height={items[index].height}
          style={{
            maxHeight: '90vh',
            maxWidth: '90vw',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
          className="rounded-lg"
          priority
        />
      </div>

      {items.length > 1 && (
        <button
          className="absolute right-3 p-2 text-white/50 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function GalleryGrid({
  items,
  layout = 'mixed',
}: {
  items: GalleryItem[]
  layout?: GalleryLayout
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const close = useCallback(() => setLightboxIndex(null), [])
  const prev = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i - 1 + items.length) % items.length : null)),
    [items.length],
  )
  const next = useCallback(
    () => setLightboxIndex((i) => (i !== null ? (i + 1) % items.length : null)),
    [items.length],
  )

  useEffect(() => {
    if (lightboxIndex === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex, close, prev, next])

  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [lightboxIndex])

  // ── Masonry (CSS columns) ──────────────────────────────────────────────────
  if (layout === 'masonry') {
    return (
      <>
        <div className="columns-2 md:columns-3 gap-3">
          {items.map((item, i) => (
            <div key={item.key} className="break-inside-avoid mb-3">
              <button
                onClick={() => setLightboxIndex(i)}
                className="block w-full overflow-hidden rounded-xl cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  style={{width: '100%', height: 'auto', display: 'block'}}
                  className="transition-transform duration-500 group-hover:scale-[1.02]"
                  placeholder={item.lqip ? 'blur' : 'empty'}
                  blurDataURL={item.lqip ?? undefined}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  priority={i < 4}
                />
              </button>
            </div>
          ))}
        </div>
        {lightboxIndex !== null && (
          <Lightbox
            items={items}
            index={lightboxIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </>
    )
  }

  // ── Uniform grids (2-col / 3-col) ─────────────────────────────────────────
  if (layout === '2-col' || layout === '3-col') {
    const colClass = layout === '2-col' ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'
    return (
      <>
        <div className={`grid ${colClass} gap-3`}>
          {items.map((item, i) => (
            <GridImage
              key={item.key}
              item={item}
              index={i}
              layout={layout}
              onClick={() => setLightboxIndex(i)}
            />
          ))}
        </div>
        {lightboxIndex !== null && (
          <Lightbox
            items={items}
            index={lightboxIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </>
    )
  }

  // ── Mixed (per-photo displaySize, 6-column base grid) ─────────────────────
  return (
    <>
      <div className="grid grid-cols-6 gap-3">
        {items.map((item, i) => (
          <GridImage
            key={item.key}
            item={item}
            index={i}
            layout="mixed"
            onClick={() => setLightboxIndex(i)}
          />
        ))}
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          items={items}
          index={lightboxIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </>
  )
}
