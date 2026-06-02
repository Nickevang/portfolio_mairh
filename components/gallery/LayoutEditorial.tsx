'use client'

import Image from 'next/image'
import type {RenderedSection} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

export function LayoutEditorial({section}: {section: RenderedSection}) {
  const {images, heroSide = 'left'} = section
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  if (!images.length) return null

  const hero = images[0]
  const rest = images.slice(1, 5) // up to 4 supporting images

  const lightboxItems = images.map(img => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  const HeroEl = (
    <button
      onClick={() => setIndex(0)}
      className="relative overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group flex-[3] min-h-[360px]"
    >
      <Image
        src={hero.src}
        alt={hero.alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
        placeholder={hero.lqip ? 'blur' : 'empty'}
        blurDataURL={hero.lqip}
        sizes="(min-width: 1024px) 60vw, 100vw"
        priority
      />
    </button>
  )

  const SupportEl = rest.length > 0 ? (
    <div className="flex flex-col gap-3 flex-[2]">
      {rest.map((img, i) => (
        <button
          key={img._key}
          onClick={() => setIndex(i + 1)}
          className="relative overflow-hidden rounded-xl cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 group flex-1 min-h-[80px]"
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
      ))}
    </div>
  ) : null

  return (
    <>
      <div
        className={`flex gap-3 min-h-[400px] ${heroSide === 'right' ? 'flex-row-reverse' : 'flex-row'}`}
      >
        {HeroEl}
        {SupportEl}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
