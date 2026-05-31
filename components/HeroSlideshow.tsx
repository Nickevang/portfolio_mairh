'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useState, useEffect, useCallback, useRef} from 'react'
import {ChevronLeft, ChevronRight} from 'lucide-react'

export interface Slide {
  key: string
  slug: string
  title: string
  tagline?: string
  imageUrl: string
  lqip?: string
}

const AUTOPLAY_MS = 6000
const SLIDE_MS = 850
const EASING = `${SLIDE_MS}ms cubic-bezier(0.77, 0, 0.175, 1) both`

type Dir = 'forward' | 'backward'

export function HeroSlideshow({slides}: {slides: Slide[]}) {
  const [active, setActive] = useState(0)
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const [dir, setDir] = useState<Dir>('forward')
  const [animating, setAnimating] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current)
  }

  const goTo = useCallback(
    (newIndex: number, direction: Dir) => {
      if (animating || newIndex === active) return
      clearTimer()
      setDir(direction)
      setOutgoing(active)
      setActive(newIndex)
      setAnimating(true)
      setTimeout(() => {
        setOutgoing(null)
        setAnimating(false)
      }, SLIDE_MS + 50)
    },
    [active, animating],
  )

  const next = useCallback(
    () => goTo((active + 1) % slides.length, 'forward'),
    [active, slides.length, goTo],
  )
  const prev = useCallback(
    () => goTo((active - 1 + slides.length) % slides.length, 'backward'),
    [active, slides.length, goTo],
  )

  // Autoplay
  useEffect(() => {
    if (slides.length <= 1) return
    timer.current = setTimeout(next, AUTOPLAY_MS)
    return clearTimer
  }, [active, next, slides.length])

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  if (!slides.length) return null

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {/* ── Slides ──────────────────────────────────────────────────── */}
      {slides.map((slide, i) => {
        const isActive = i === active
        const isOut = i === outgoing
        const visible = isActive || isOut

        // Pick animation for this render
        let anim = 'none'
        if (animating) {
          if (isActive) anim = dir === 'forward' ? 'slide-enter-right' : 'slide-enter-left'
          if (isOut)    anim = dir === 'forward' ? 'slide-exit-left'   : 'slide-exit-right'
        }

        return (
          <div
            key={slide.key}
            aria-hidden={!isActive}
            className="absolute inset-0"
            style={{
              visibility: visible ? 'visible' : 'hidden',
              zIndex: isActive ? 2 : isOut ? 1 : 0,
              animation: anim !== 'none' ? `${anim} ${EASING}` : 'none',
            }}
          >
            {/* Photo */}
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
              placeholder={slide.lqip ? 'blur' : 'empty'}
              blurDataURL={slide.lqip ?? undefined}
            />

            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/25 pointer-events-none" />

            {/* Text overlay — only interactive on active slide */}
            <div className="absolute inset-x-0 bottom-0 pb-20 md:pb-24 px-8 md:px-16 lg:px-24">
              <Link
                href={`/work/${slide.slug}`}
                className="group inline-block"
                tabIndex={isActive ? 0 : -1}
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-tight">
                  {slide.title}
                </h2>
                {slide.tagline && (
                  <p className="mt-2 text-sm md:text-base text-white/55 max-w-xl">
                    {slide.tagline}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-xs tracking-widest uppercase text-white/45 group-hover:text-white/90 transition-colors duration-300">
                  View project
                  <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        )
      })}

      {/* ── Prev / Next arrows ─────────────────────────────────────── */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/35 hover:text-white transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 text-white/35 hover:text-white transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      {/* ── Progress dots ────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-7 left-8 md:left-16 lg:left-24 z-10 flex items-center gap-[6px]">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? 'forward' : 'backward')}
              aria-label={`Go to slide ${i + 1}`}
              className="h-[2px] rounded-full bg-white transition-all duration-400"
              style={{
                width: i === active ? '2rem' : '0.625rem',
                opacity: i === active ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Slide counter ─────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-[1.85rem] right-8 md:right-16 lg:right-24 z-10 text-[11px] text-white/30 tabular-nums tracking-widest select-none">
          {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      )}
    </div>
  )
}
