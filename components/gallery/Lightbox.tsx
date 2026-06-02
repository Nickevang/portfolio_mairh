'use client'

import Image from 'next/image'
import {X, ChevronLeft, ChevronRight} from 'lucide-react'

export interface LightboxImage {
  key: string
  fullSrc: string
  width: number
  height: number
  alt: string
}

export function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: LightboxImage[]
  index: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-xs text-white/30 tracking-widest tabular-nums select-none">
        {index + 1} / {items.length}
      </span>

      {items.length > 1 && (
        <button
          className="absolute left-3 p-2 text-white/50 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-7 h-7" />
        </button>
      )}

      <div
        className="flex items-center justify-center"
        style={{maxHeight: '90vh', maxWidth: '90vw'}}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          key={items[index].fullSrc}
          src={items[index].fullSrc}
          alt={items[index].alt}
          width={items[index].width}
          height={items[index].height}
          style={{
            maxHeight: '90vh',
            maxWidth: '90vw',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
          }}
          className="rounded-lg"
          priority
        />
      </div>

      {items.length > 1 && (
        <button
          className="absolute right-3 p-2 text-white/50 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next image"
        >
          <ChevronRight className="w-7 h-7" />
        </button>
      )}
    </div>
  )
}
