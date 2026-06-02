'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutCinematic({section}: {section: RenderedSection}) {
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
      <div className="flex flex-col gap-6">
        {images.map((img, i) => {
          const contained = img.widthCap === 'contained'
          return (
            <button
              key={img._key}
              onClick={() => setIndex(i)}
              className={`cursor-zoom-in overflow-hidden rounded-xl group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 block${contained ? ' max-w-4xl mx-auto w-full' : ' w-full'}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.width}
                height={img.height}
                style={{width: '100%', height: 'auto', display: 'block'}}
                className="transition-transform duration-700 group-hover:scale-[1.01]"
                placeholder={img.lqip ? 'blur' : 'empty'}
                blurDataURL={img.lqip}
                sizes="(min-width: 1024px) 80vw, 100vw"
                priority={i === 0}
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
