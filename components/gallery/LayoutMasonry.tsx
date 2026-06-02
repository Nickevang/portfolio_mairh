'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutMasonry({section}: {section: RenderedSection}) {
  const {images, columnCount = 3} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  const colClass =
    columnCount === 2 ? 'columns-2' : columnCount === 4 ? 'columns-2 md:columns-4' : 'columns-2 md:columns-3'

  const lightboxItems = images.map((img) => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  return (
    <>
      <div className={`${colClass} gap-3`}>
        {images.map((img, i) => (
          <div
            key={img._key}
            className={`break-inside-avoid mb-3${img.featured ? ' [column-span:all]' : ''}`}
          >
            <button
              onClick={() => setIndex(i)}
              className="block w-full overflow-hidden rounded-xl cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
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
                sizes="(min-width: 768px) 33vw, 50vw"
                priority={i < 4}
              />
            </button>
          </div>
        ))}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
