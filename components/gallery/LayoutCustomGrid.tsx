'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutCustomGrid({section}: {section: RenderedSection}) {
  const {images} = section
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
      <div className="grid grid-cols-6 gap-3">
        {images.map((img, i) => {
          const span = img.colSpan ?? 3
          return (
            <button
              key={img._key}
              onClick={() => setIndex(i)}
              className="block overflow-hidden rounded-xl cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              style={{gridColumn: `span ${span}`}}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                style={{width: '100%', height: 'auto', display: 'block'}}
                className="transition-transform duration-500 group-hover:scale-[1.02]"
                placeholder={img.lqip ? 'blur' : 'empty'}
                blurDataURL={img.lqip}
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority={i < 3}
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
