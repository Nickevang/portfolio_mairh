'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutMosaic({section}: {section: RenderedSection}) {
  const {images, heroIndex = 0, supportCount = 4} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  const heroImg = images[heroIndex] ?? images[0]
  const rest = images.filter((_, i) => i !== heroIndex).slice(0, supportCount)

  const lightboxItems = images.map((img) => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  const heroOriginalIdx = images.indexOf(heroImg)

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        {/* Hero */}
        <button
          onClick={() => setIndex(heroOriginalIdx)}
          className="relative overflow-hidden rounded-xl cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 aspect-[3/4] lg:aspect-auto lg:min-h-[400px]"
        >
          <Image
            src={heroImg.src}
            alt={heroImg.alt}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            placeholder={heroImg.lqip ? 'blur' : 'empty'}
            blurDataURL={heroImg.lqip}
            sizes="(min-width: 1024px) 60vw, 100vw"
            priority
          />
        </button>

        {/* Supporting grid */}
        {rest.length > 0 && (
          <div
            className="grid gap-3"
            style={{
              gridTemplateRows: `repeat(${Math.min(rest.length, 4)}, 1fr)`,
            }}
          >
            {rest.map((img) => {
              const originalIdx = images.indexOf(img)
              return (
                <button
                  key={img._key}
                  onClick={() => setIndex(originalIdx)}
                  className="relative overflow-hidden rounded-xl cursor-zoom-in group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    placeholder={img.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.lqip}
                    sizes="(min-width: 1024px) 30vw, 50vw"
                  />
                </button>
              )
            })}
          </div>
        )}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
