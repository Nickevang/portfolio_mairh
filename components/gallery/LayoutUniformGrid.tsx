'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutUniformGrid({section}: {section: RenderedSection}) {
  const {images, columnCount = 3} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  const colClass =
    columnCount === 2
      ? 'grid-cols-2'
      : columnCount === 4
        ? 'grid-cols-2 md:grid-cols-4'
        : 'grid-cols-2 md:grid-cols-3'

  const lightboxItems = images.map((img) => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  return (
    <>
      <div className={`grid ${colClass} gap-3`}>
        {images.map((img, i) => (
          <button
            key={img._key}
            onClick={() => setIndex(i)}
            className="block overflow-hidden rounded-xl cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 relative aspect-[4/3]"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              placeholder={img.lqip ? 'blur' : 'empty'}
              blurDataURL={img.lqip}
              sizes="(min-width: 768px) 33vw, 50vw"
              priority={i < 4}
            />
          </button>
        ))}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
