'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutFilmstrip({section}: {section: RenderedSection}) {
  const {images, thumbHeight = 220} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  const lightboxItems = images.map((img) => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  return (
    <>
      <div
        className="flex flex-row gap-2 overflow-x-auto pb-2"
        style={{scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch'}}
      >
        {images.map((img, i) => {
          const aspectRatio = img.width && img.height ? img.width / img.height : 1.5
          const thumbWidth = Math.round(thumbHeight * aspectRatio)
          return (
            <button
              key={img._key}
              onClick={() => setIndex(i)}
              className="flex-shrink-0 overflow-hidden rounded-lg cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{
                width: thumbWidth,
                height: thumbHeight,
                scrollSnapAlign: 'start',
                position: 'relative',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                placeholder={img.lqip ? 'blur' : 'empty'}
                blurDataURL={img.lqip}
                sizes="25vw"
              />
            </button>
          )
        })}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
