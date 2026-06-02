'use client'

import Image from 'next/image'
import {useState} from 'react'
import type {RenderedSection, RenderedImage} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

// Deterministic "random" rotation so SSR and client match
function rotation(i: number): number {
  return Math.sin(i * 2.3 + 1.1) * 7 // ±7 degrees
}

function ScatterCard({
  img,
  i,
  onClick,
}: {
  img: RenderedImage
  i: number
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const rot = rotation(i)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
      style={{
        transform: hovered ? 'rotate(0deg) scale(1.07)' : `rotate(${rot}deg) scale(1)`,
        transition: 'transform 0.35s ease, box-shadow 0.35s ease',
        background: '#fff',
        padding: '6px 6px 32px',
        boxShadow: hovered
          ? '0 12px 40px rgba(0,0,0,0.55)'
          : '0 4px 18px rgba(0,0,0,0.35)',
        zIndex: hovered ? 10 : 1,
        position: 'relative',
        cursor: 'zoom-in',
      }}
    >
      <div className="relative overflow-hidden" style={{aspectRatio: '4/3', width: '100%'}}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          className="object-cover"
          placeholder={img.lqip ? 'blur' : 'empty'}
          blurDataURL={img.lqip}
          sizes="(min-width: 1024px) 33vw, 50vw"
          priority={i < 3}
        />
      </div>
      {/* Polaroid caption area */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{fontSize: 10, color: '#bbb', fontFamily: 'serif', letterSpacing: '0.05em'}}>
          {i + 1}
        </span>
      </div>
    </button>
  )
}

export function LayoutScatter({section}: {section: RenderedSection}) {
  const {images} = section
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
      {/* Padding so rotated cards don't clip at edges */}
      <div
        className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 px-4"
        style={{isolation: 'isolate'}}
      >
        {images.map((img, i) => (
          <ScatterCard key={img._key} img={img} i={i} onClick={() => setIndex(i)} />
        ))}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
