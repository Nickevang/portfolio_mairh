'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

// Each template maps image indices to named grid areas
const TEMPLATES = {
  // Template A: designed for 6 images
  // Big left + 4 tiles right + 1 full-width bottom
  A: {
    areas: '"a a b c" "a a d e" "f f f f"',
    columns: 'repeat(4, 1fr)',
    rows: '200px 200px 160px',
    slots: ['a', 'b', 'c', 'd', 'e', 'f'] as const,
  },
  // Template B: designed for 5 images — asymmetric 2x2 + wide strip
  B: {
    areas: '"a a b" "a a c" "d e e"',
    columns: 'repeat(3, 1fr)',
    rows: '180px 180px 180px',
    slots: ['a', 'b', 'c', 'd', 'e'] as const,
  },
  // Template C: designed for 7 images — complex asymmetric mix
  C: {
    areas: '"a b b b" "c c d d" "e f f g"',
    columns: 'repeat(4, 1fr)',
    rows: '200px 200px 200px',
    slots: ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const,
  },
}

export function LayoutBento({section}: {section: RenderedSection}) {
  const {images, bentoTemplate = 'A'} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  const t = TEMPLATES[bentoTemplate] ?? TEMPLATES.A

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
        style={{
          display: 'grid',
          gridTemplateAreas: t.areas,
          gridTemplateColumns: t.columns,
          gridTemplateRows: t.rows,
          gap: 10,
        }}
      >
        {t.slots.map((slot, i) => {
          const img = images[i]
          if (!img) return <div key={slot} style={{gridArea: slot}} />
          return (
            <button
              key={img._key}
              onClick={() => setIndex(i)}
              style={{gridArea: slot}}
              className="relative overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                placeholder={img.lqip ? 'blur' : 'empty'}
                blurDataURL={img.lqip}
                sizes="(min-width: 1024px) 33vw, 50vw"
                priority={i < 2}
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
