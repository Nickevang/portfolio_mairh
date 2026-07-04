'use client'

import Image from 'next/image'
import Link from 'next/link'
import {useState, useEffect, useCallback, useRef} from 'react'
import {ChevronUp, ChevronDown, ChevronRight} from 'lucide-react'

export interface Slide {
  key: string
  slug: string
  title: string
  tagline?: string
  imageUrl: string
  lqip?: string
}

const DWELL_MS       = 5500
const SLIDE_MS       = 950
const EASING         = `${SLIDE_MS}ms cubic-bezier(0.77, 0, 0.175, 1) both`
const WHEEL_COOLDOWN = SLIDE_MS + 400
const SWIPE_MIN      = 50   // px threshold to register a swipe

type Dir = 'forward' | 'backward'

export function HeroSlideshow({slides}: {slides: Slide[]}) {
  const [active, setActive]       = useState(0)
  const [outgoing, setOutgoing]   = useState<number | null>(null)
  const [dir, setDir]             = useState<Dir>('forward')
  const [animating, setAnimating] = useState(false)

  const containerRef  = useRef<HTMLDivElement>(null)
  const timer         = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wheelLocked   = useRef(false)
  const touchStartY   = useRef<number | null>(null)
  const touchStartX   = useRef<number | null>(null)

  const clearAutoplay = () => {
    if (timer.current) clearTimeout(timer.current)
  }

  const goTo = useCallback(
    (newIndex: number, direction: Dir) => {
      if (animating || newIndex === active) return
      clearAutoplay()
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

  // ── Autoplay ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (slides.length <= 1) return
    timer.current = setTimeout(next, DWELL_MS)
    return clearAutoplay
  }, [active, next, slides.length])

  // ── Keyboard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next()
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [next, prev])

  // ── Mouse wheel — attached to container, non-passive so we block page scroll
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (wheelLocked.current) return
      if (Math.abs(e.deltaY) < 20) return
      wheelLocked.current = true
      if (e.deltaY > 0) next(); else prev()
      setTimeout(() => { wheelLocked.current = false }, WHEEL_COOLDOWN)
    }
    el.addEventListener('wheel', onWheel, {passive: false})
    return () => el.removeEventListener('wheel', onWheel)
  }, [next, prev])

  // ── Touch / swipe ─────────────────────────────────────────────────────────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const onTouchMove = (e: TouchEvent) => {
      if (touchStartY.current === null || touchStartX.current === null) return
      const dy = Math.abs(e.touches[0].clientY - touchStartY.current)
      const dx = Math.abs(e.touches[0].clientX - touchStartX.current)
      // Only prevent page scroll when the gesture is primarily vertical
      if (dy > dx) e.preventDefault()
    }

    const onTouchEnd = (e: TouchEvent) => {
      if (touchStartY.current === null) return
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      const deltaX = touchStartX.current! - e.changedTouches[0].clientX
      touchStartY.current = null
      touchStartX.current = null
      // Only navigate if vertical swipe dominates horizontal
      if (Math.abs(deltaY) < SWIPE_MIN || Math.abs(deltaX) > Math.abs(deltaY)) return
      if (deltaY > 0) next(); else prev()
    }

    el.addEventListener('touchstart', onTouchStart, {passive: true})
    el.addEventListener('touchmove', onTouchMove, {passive: false})
    el.addEventListener('touchend', onTouchEnd, {passive: true})
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [next, prev])

  if (!slides.length) return null

  return (
    <div ref={containerRef} className="relative h-screen w-full overflow-hidden bg-black">
      {/* ── Slides ─────────────────────────────────────────────────────── */}
      {slides.map((slide, i) => {
        const isActive = i === active
        const isOut    = i === outgoing
        const visible  = isActive || isOut

        let anim = 'none'
        if (animating) {
          if (isActive) anim = dir === 'forward' ? 'slide-enter-bottom' : 'slide-enter-top'
          if (isOut)    anim = dir === 'forward' ? 'slide-exit-top'     : 'slide-exit-bottom'
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

            {/* gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/25 pointer-events-none" />

            {/* text */}
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
                  View project <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>
        )
      })}

      {/* ── Up / Down arrows (desktop only) ────────────────────────────── */}
      {slides.length > 1 && (
        <div className="hidden md:block">
          <button
            onClick={prev}
            className="absolute right-5 top-1/2 -translate-y-8 z-10 p-2 text-white/35 hover:text-white transition-colors duration-300"
            aria-label="Previous slide"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <button
            onClick={next}
            className="absolute right-5 top-1/2 translate-y-2 z-10 p-2 text-white/35 hover:text-white transition-colors duration-300"
            aria-label="Next slide"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* ── Dot indicators ──────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div
          className="absolute z-10 flex flex-col items-center gap-[6px]"
          style={{right: '1.5rem', top: '50%', transform: 'translateY(calc(-50% + 3rem))'}}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > active ? 'forward' : 'backward')}
              aria-label={`Go to slide ${i + 1}`}
              className="w-[2px] rounded-full bg-white transition-all duration-400"
              style={{
                height: i === active ? '2rem' : '0.625rem',
                opacity: i === active ? 1 : 0.3,
              }}
            />
          ))}
        </div>
      )}

      {/* ── Swipe hint (mobile only, fades after first interaction) ─────── */}
      {slides.length > 1 && (
        <div className="md:hidden absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 pointer-events-none select-none animate-[fadeout_3s_2s_ease-in_forwards]">
          <ChevronUp className="w-4 h-4 text-white/30" />
          <span className="text-[10px] tracking-widest uppercase text-white/25">Swipe</span>
          <ChevronDown className="w-4 h-4 text-white/30" />
        </div>
      )}

      {/* ── Counter ─────────────────────────────────────────────────────── */}
      {slides.length > 1 && (
        <div className="absolute bottom-7 right-8 md:right-10 z-10 text-[11px] text-white/30 tabular-nums tracking-widest select-none">
          {String(active + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </div>
      )}
    </div>
  )
}
