'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutPanorama({section}: {section: RenderedSection}) {
  const {images, panoramaHeight = 380} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  const lightboxItems = images.map(img => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  return (
    <>
      <div
        className="overflow-x-auto rounded-xl"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.15) transparent',
          scrollSnapType: 'x proximity',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        <div
          className="flex gap-2"
          style={{
            height: panoramaHeight,
            width: 'max-content',
            padding: '0 2px',
          }}
        >
          {images.map((img, i) => {
            // Compute natural width at the strip height to preserve aspect ratio
            const ar = img.width && img.height ? img.width / img.height : 4 / 3
            const w = Math.round(panoramaHeight * ar)

            return (
              <button
                key={img._key}
                onClick={() => setIndex(i)}
                className="relative flex-shrink-0 overflow-hidden rounded-lg cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group"
                style={{
                  width: w,
                  height: panoramaHeight,
                  scrollSnapAlign: 'start',
                }}
                aria-label={img.alt}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  placeholder={img.lqip ? 'blur' : 'empty'}
                  blurDataURL={img.lqip}
                  sizes={`${w}px`}
                  priority={i < 3}
                />
              </button>
            )
          })}
        </div>
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
