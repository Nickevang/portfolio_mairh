'use client'

import Image from 'next/image'
import {useState, useEffect, useCallback} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutSlideshow({section}: {section: RenderedSection}) {
  const {images, autoplay = false, duration = 4} = section
  const [current, setCurrent] = useState(0)
  const {index, setIndex, close, prev: lbPrev, next: lbNext} = useLightbox(images.length)

  const prev = useCallback(() => setCurrent((c) => (c - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length])

  useEffect(() => {
    if (!autoplay || images.length <= 1) return
    const id = setInterval(next, duration * 1000)
    return () => clearInterval(id)
  }, [autoplay, duration, next, images.length])

  if (!images.length) return null

  const img = images[current]
  const focalPoint = img.focalPoint
  const objectPosition = focalPoint ? `${focalPoint.x * 100}% ${focalPoint.y * 100}%` : 'center'

  const lightboxItems = images.map((img) => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  return (
    <>
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl group">
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
            className="object-cover transition-opacity duration-500"
            style={{objectPosition}}
            placeholder={img.lqip ? 'blur' : 'empty'}
            blurDataURL={img.lqip}
            sizes="100vw"
            priority
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrent(i)
                  }}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <span className="absolute top-3 right-4 text-xs text-white/50 tabular-nums select-none">
              {current + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={lbPrev} onNext={lbNext} />
      )}
    </>
  )
}
