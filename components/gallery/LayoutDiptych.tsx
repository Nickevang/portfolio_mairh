'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutDiptych({section}: {section: RenderedSection}) {
  const {images} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  // Build pairs: [[0,1], [2,3], ...]
  const pairs = Array.from({length: Math.ceil(images.length / 2)}, (_, p) => [
    images[p * 2],
    images[p * 2 + 1] ?? null,
  ] as const)

  const lightboxItems = images.map(img => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  return (
    <>
      <div className="flex flex-col gap-3">
        {pairs.map(([a, b], pairIdx) => (
          <div key={a._key} className="flex gap-3">
            {/* Left image */}
            <button
              onClick={() => setIndex(pairIdx * 2)}
              className="relative overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group flex-1 aspect-[3/4]"
            >
              <Image
                src={a.src}
                alt={a.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                placeholder={a.lqip ? 'blur' : 'empty'}
                blurDataURL={a.lqip}
                sizes="50vw"
                priority={pairIdx === 0}
              />
            </button>

            {/* Right image (or empty placeholder to maintain pair grid) */}
            {b ? (
              <button
                onClick={() => setIndex(pairIdx * 2 + 1)}
                className="relative overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group flex-1 aspect-[3/4]"
              >
                <Image
                  src={b.src}
                  alt={b.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  placeholder={b.lqip ? 'blur' : 'empty'}
                  blurDataURL={b.lqip}
                  sizes="50vw"
                />
              </button>
            ) : (
              <div className="flex-1 aspect-[3/4]" aria-hidden />
            )}
          </div>
        ))}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
