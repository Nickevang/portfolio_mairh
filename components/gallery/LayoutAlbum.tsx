'use client'

import Image from 'next/image'
import {useState, useRef, useEffect, useCallback} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutAlbum({section}: {section: RenderedSection}) {
  const {images, thumbnailPosition = 'right', thumbnailSize = 88} = section
  const [current, setCurrent] = useState(0)
  const {index, setIndex, close, prev: lbPrev, next: lbNext} = useLightbox(images.length)
  const stripRef = useRef<HTMLDivElement>(null)

  const prev = useCallback(
    () => setCurrent(c => (c - 1 + images.length) % images.length),
    [images.length],
  )
  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length])

  // Scroll selected thumbnail into view
  useEffect(() => {
    const child = stripRef.current?.children[current] as HTMLElement | undefined
    child?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'nearest'})
  }, [current])

  // Arrow-key navigation (only when lightbox is not open)
  useEffect(() => {
    if (index !== null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, prev, next])

  if (!images.length) return null

  const img = images[current]
  const isRight = thumbnailPosition !== 'bottom'
  const lightboxItems = images.map(i => ({
    key: i._key,
    fullSrc: i.fullSrc,
    width: i.width,
    height: i.height,
    alt: i.alt,
  }))

  const ThumbnailStrip = () => (
    <div
      ref={stripRef}
      className={
        isRight
          ? 'flex flex-col gap-2 overflow-y-auto flex-shrink-0'
          : 'flex flex-row gap-2 overflow-x-auto pb-1'
      }
      style={{
        width: isRight ? thumbnailSize : undefined,
        maxHeight: isRight ? 540 : undefined,
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(255,255,255,0.15) transparent',
      }}
    >
      {images.map((thumb, i) => (
        <button
          key={thumb._key}
          onClick={() => setCurrent(i)}
          aria-label={`View image ${i + 1}`}
          className="relative flex-shrink-0 overflow-hidden rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          style={{
            width: thumbnailSize,
            height: thumbnailSize,
            opacity: i === current ? 1 : 0.42,
            transform: i === current ? 'scale(1)' : 'scale(0.94)',
            outline: i === current ? '2px solid rgba(255,255,255,0.65)' : 'none',
            outlineOffset: 1,
          }}
        >
          <Image
            src={thumb.src}
            alt={thumb.alt}
            fill
            className="object-cover"
            placeholder={thumb.lqip ? 'blur' : 'empty'}
            blurDataURL={thumb.lqip}
            sizes={`${thumbnailSize}px`}
          />
        </button>
      ))}
    </div>
  )

  return (
    <>
      <div className={`flex gap-3 ${isRight ? 'flex-row items-start' : 'flex-col'}`}>
        {/* Focus image */}
        <div className="relative flex-1 overflow-hidden rounded-xl group">
          <div className="relative aspect-[4/3]">
            <button
              onClick={() => setIndex(current)}
              className="absolute inset-0 cursor-zoom-in focus:outline-none"
              aria-label="Open full size"
            >
              <Image
                key={img._key}
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-opacity duration-300"
                placeholder={img.lqip ? 'blur' : 'empty'}
                blurDataURL={img.lqip}
                sizes="(min-width: 1024px) 75vw, 100vw"
                priority
              />
            </button>
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="absolute bottom-3 right-4 text-xs text-white/40 tabular-nums select-none bg-black/30 rounded px-2 py-0.5">
                {current + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <ThumbnailStrip />
      </div>

      {index !== null && (
        <Lightbox
          items={lightboxItems}
          index={index}
          onClose={close}
          onPrev={lbPrev}
          onNext={lbNext}
        />
      )}
    </>
  )
}
