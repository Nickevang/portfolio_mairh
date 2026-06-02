'use client'

import {set, unset} from 'sanity'
import type {StringInputProps} from 'sanity'

type Layout = {
  value: string
  label: string
  sub: string
  icon: React.ReactNode
}

const W = 80
const H = 56
const stroke = '#666'
const fill = '#333'

const LAYOUTS: Layout[] = [
  {
    value: 'uniformGrid',
    label: 'Uniform Grid',
    sub: 'equal cells',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0, 1, 2].map((row) =>
          [0, 1, 2].map((col) => (
            <rect
              key={`${row}-${col}`}
              x={4 + col * 25}
              y={4 + row * 17}
              width={22}
              height={14}
              rx={2}
              fill={fill}
              stroke={stroke}
              strokeWidth={1}
            />
          )),
        )}
      </svg>
    ),
  },
  {
    value: 'masonry',
    label: 'Masonry',
    sub: 'waterfall',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {[
          {x: 4, y: 4, h: 22},
          {x: 4, y: 29, h: 14},
          {x: 4, y: 46, h: 8},
          {x: 30, y: 4, h: 14},
          {x: 30, y: 21, h: 22},
          {x: 30, y: 46, h: 8},
          {x: 56, y: 4, h: 8},
          {x: 56, y: 15, h: 18},
          {x: 56, y: 36, h: 18},
        ].map((r, i) => (
          <rect key={i} x={r.x} y={r.y} width={22} height={r.h} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        ))}
      </svg>
    ),
  },
  {
    value: 'justified',
    label: 'Justified',
    sub: 'equal-height rows',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {[
          [{x: 4, w: 28}, {x: 36, w: 20}, {x: 60, w: 16}],
          [{x: 4, w: 18}, {x: 26, w: 26}, {x: 56, w: 20}],
          [{x: 4, w: 22}, {x: 30, w: 22}, {x: 56, w: 20}],
        ].map((row, ri) =>
          row.map((r, ci) => (
            <rect
              key={`${ri}-${ci}`}
              x={r.x}
              y={4 + ri * 18}
              width={r.w}
              height={14}
              rx={2}
              fill={fill}
              stroke={stroke}
              strokeWidth={1}
            />
          )),
        )}
      </svg>
    ),
  },
  {
    value: 'customGrid',
    label: 'Custom Grid',
    sub: 'drag & resize',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={4} y={4} width={44} height={22} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={52} y={4} width={24} height={22} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={4} y={30} width={24} height={22} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={32} y={30} width={44} height={22} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
      </svg>
    ),
  },
  {
    value: 'slideshow',
    label: 'Slideshow',
    sub: 'full-bleed',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={4} y={4} width={72} height={42} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <polygon points="12,25 22,18 22,32" fill="#888" />
        <polygon points="68,25 58,18 58,32" fill="#888" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={34 + i * 6} cy={52} r={2} fill={i === 1 ? '#aaa' : stroke} />
        ))}
      </svg>
    ),
  },
  {
    value: 'cinematic',
    label: 'Cinematic',
    sub: 'single column',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={4} y={4} width={72} height={14} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={12} y={22} width={56} height={14} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={4} y={40} width={72} height={14} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
      </svg>
    ),
  },
  {
    value: 'mosaic',
    label: 'Mosaic',
    sub: 'hero + grid',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <rect x={4} y={4} width={44} height={48} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={52} y={4} width={24} height={22} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={52} y={30} width={11} height={22} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
        <rect x={65} y={30} width={11} height={22} rx={2} fill={fill} stroke={stroke} strokeWidth={1} />
      </svg>
    ),
  },
  {
    value: 'filmstrip',
    label: 'Filmstrip',
    sub: 'horizontal scroll',
    icon: (
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        {[0, 1, 2, 3, 4].map((i) => (
          <rect
            key={i}
            x={4 + i * 16}
            y={14}
            width={13}
            height={28}
            rx={2}
            fill={fill}
            stroke={stroke}
            strokeWidth={1}
          />
        ))}
        <line x1={2} y1={28} x2={78} y2={28} stroke={stroke} strokeWidth={0.5} strokeDasharray="3,2" />
        <line x1={2} y1={28} x2={78} y2={28} stroke={stroke} strokeWidth={0.5} strokeDasharray="3,2" />
      </svg>
    ),
  },
]

export function LayoutPicker(props: StringInputProps) {
  const {value, onChange} = props

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        padding: '4px 0',
      }}
    >
      {LAYOUTS.map((layout) => {
        const selected = value === layout.value
        return (
          <button
            key={layout.value}
            type="button"
            onClick={() => onChange(set(layout.value))}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 4px',
              border: selected ? '2px solid #e26012' : '1px solid #333',
              borderRadius: '6px',
              background: selected ? '#1a0f00' : '#1a1a1a',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            {layout.icon}
            <span style={{fontSize: '10px', color: selected ? '#e26012' : '#aaa', fontWeight: 600, textAlign: 'center'}}>
              {layout.label}
            </span>
            <span style={{fontSize: '9px', color: '#666', textAlign: 'center'}}>{layout.sub}</span>
          </button>
        )
      })}
    </div>
  )
}
