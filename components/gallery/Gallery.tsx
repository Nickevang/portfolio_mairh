'use client'

import type {RenderedSection} from './types'
import {GallerySection} from './GallerySection'

export function Gallery({sections}: {sections: RenderedSection[]}) {
  if (!sections?.length) return null

  // Group sections into rows. Sections with the same sectionRow integer appear
  // side-by-side; sections without sectionRow each get their own solo row.
  const rows: RenderedSection[][] = []
  sections.forEach(section => {
    const row = section.sectionRow
    if (row == null) {
      rows.push([section])
    } else {
      const existing = rows.find(r => r[0]?.sectionRow === row)
      if (existing) existing.push(section)
      else rows.push([section])
    }
  })

  return (
    <div className="space-y-12">
      {rows.map((row, i) => {
        if (row.length === 1) {
          return <GallerySection key={row[0]._key} section={row[0]} />
        }
        return (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '1.5rem',
              alignItems: 'flex-start',
            }}
          >
            {row.map(section => {
              const pct = section.sectionWidth ?? Math.round(100 / row.length)
              return (
                <div
                  key={section._key}
                  style={{
                    flex: `0 0 calc(${pct}% - 0.75rem)`,
                    minWidth: 0,
                  }}
                >
                  <GallerySection section={section} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}
