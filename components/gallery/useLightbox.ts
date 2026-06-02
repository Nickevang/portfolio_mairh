'use client'

import {useState, useEffect, useCallback} from 'react'

export function useLightbox(count: number) {
  const [index, setIndex] = useState<number | null>(null)

  const close = useCallback(() => setIndex(null), [])
  const prev = useCallback(
    () => setIndex((i) => (i !== null ? (i - 1 + count) % count : null)),
    [count],
  )
  const next = useCallback(
    () => setIndex((i) => (i !== null ? (i + 1) % count : null)),
    [count],
  )

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, close, prev, next])

  useEffect(() => {
    document.body.style.overflow = index !== null ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [index])

  return {index, setIndex, close, prev, next}
}
