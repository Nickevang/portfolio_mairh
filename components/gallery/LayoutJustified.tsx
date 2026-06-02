'use client'

import Image from 'next/image'
import {useRef, useState, useEffect} from 'react'
import type {RenderedSection, RenderedImage} from './types'
import {Lightbox} from './Lightbox'
import {useLightbox} from './useLightbox'

function buildRows(images: RenderedImage[], containerWidth: number, targetHeight: number): RenderedImage[][] {
  if (containerWidth <= 0) return [images]
  const rows: RenderedImage[][] = []
  let current: RenderedImage[] = []
  let currentWidth = 0
  const gap = 12

  for (const img of images) {
    const aspectRatio = img.width && img.height ? img.width / img.height : 1.5
    const scaledWidth = targetHeight * aspectRatio
    const needed = currentWidth + scaledWidth + (current.length > 0 ? gap : 0)

    if (needed > containerWidth && current.length > 0) {
      rows.push(current)
      current = [img]
      currentWidth = scaledWidth
    } else {
      current.push(img)
      currentWidth = needed
    }
  }
  if (current.length) rows.push(current)
  return rows
}

export function LayoutJustified({section}: {section: RenderedSection}) {
  const {images, rowHeight = 300} = section
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const {index, setIndex, close, prev, next} = useLightbox(images.length)

  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width)
    })
    ro.observe(containerRef.current)
    setContainerWidth(containerRef.current.offsetWidth)
    return () => ro.disconnect()
  }, [])

  if (!images.length) return null

  const rows = buildRows(images, containerWidth, rowHeight)
  const gap = 12

  const lightboxItems = images.map((img) => ({
    key: img._key,
    fullSrc: img.fullSrc,
    width: img.width,
    height: img.height,
    alt: img.alt,
  }))

  let imageIdx = 0

  return (
    <>
      <div ref={containerRef} style={{display: 'flex', flexDirection: 'column', gap}}>
        {rows.map((row, ri) => {
          const totalAspect = row.reduce((sum, img) => {
            return sum + (img.width && img.height ? img.width / img.height : 1.5)
          }, 0)
          const totalGapWidth = (row.length - 1) * gap
          const computedHeight =
            containerWidth > 0 ? (containerWidth - totalGapWidth) / totalAspect : rowHeight

          return (
            <div key={ri} style={{display: 'flex', gap, height: computedHeight}}>
              {row.map((img) => {
                const aspectRatio = img.width && img.height ? img.width / img.height : 1.5
                const imgWidth = computedHeight * aspectRatio
                const capturedIdx = imageIdx++
                return (
                  <button
                    key={img._key}
                    onClick={() => setIndex(capturedIdx)}
                    style={{
                      flex: `0 0 ${imgWidth}px`,
                      height: computedHeight,
                      overflow: 'hidden',
                      borderRadius: 8,
                      cursor: 'zoom-in',
                      border: 'none',
                      padding: 0,
                      background: 'transparent',
                      position: 'relative',
                    }}
                    className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      placeholder={img.lqip ? 'blur' : 'empty'}
                      blurDataURL={img.lqip}
                      sizes="(min-width: 1024px) 40vw, 80vw"
                    />
                  </button>
                )
              })}
            </div>
          )
        })}
      </div>
      {index !== null && (
        <Lightbox items={lightboxItems} index={index} onClose={close} onPrev={prev} onNext={next} />
      )}
    </>
  )
}
