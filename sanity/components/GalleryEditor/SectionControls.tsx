import type {GallerySection} from './types'

interface Props {
  section: GallerySection
  onChange: (updates: Partial<GallerySection>) => void
}

function Btn({active, onClick, children}: {active: boolean; onClick: () => void; children: React.ReactNode}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '4px 10px',
        fontSize: 11,
        fontWeight: active ? 700 : 400,
        border: 'none',
        borderRadius: 4,
        cursor: 'pointer',
        background: active ? '#3b82f6' : '#252525',
        color: active ? '#fff' : '#888',
        transition: 'background 0.1s, color 0.1s',
      }}
    >
      {children}
    </button>
  )
}

function Label({children}: {children: React.ReactNode}) {
  return (
    <span style={{fontSize: 11, color: '#555', whiteSpace: 'nowrap'}}>{children}</span>
  )
}

function Group({children}: {children: React.ReactNode}) {
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
      {children}
    </div>
  )
}

export function SectionControls({section, onChange}: Props) {
  const {layoutType} = section

  const hasLayoutControls =
    layoutType === 'masonry' ||
    layoutType === 'uniformGrid' ||
    layoutType === 'justified' ||
    layoutType === 'slideshow' ||
    layoutType === 'mosaic' ||
    layoutType === 'filmstrip' ||
    layoutType === 'album' ||
    layoutType === 'editorial' ||
    layoutType === 'bento' ||
    layoutType === 'panorama'

  return (
    <div
      style={{
        borderTop: '1px solid #1e1e1e',
        padding: '10px 16px',
        background: '#141414',
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16,
        alignItems: 'center',
        flexShrink: 0,
      }}
    >
      {/* ── Row / width positioning — always visible ── */}
      <Group>
        <Label>Side by side:</Label>
        <Btn active={section.sectionRow == null} onClick={() => onChange({sectionRow: undefined, sectionWidth: undefined})}>
          Solo
        </Btn>
        {[1, 2, 3, 4, 5].map(n => (
          <Btn key={n} active={section.sectionRow === n} onClick={() => onChange({sectionRow: n, sectionWidth: section.sectionWidth ?? 50})}>
            Row {n}
          </Btn>
        ))}
      </Group>

      {section.sectionRow != null && (
        <Group>
          <Label>Width:</Label>
          {[25, 33, 50, 67, 75, 100].map(w => (
            <Btn key={w} active={(section.sectionWidth ?? 50) === w} onClick={() => onChange({sectionWidth: w})}>
              {w}%
            </Btn>
          ))}
        </Group>
      )}

      {/* Divider between positioning and layout controls */}
      {hasLayoutControls && (
        <div style={{width: '100%', height: 1, background: '#1e1e1e', margin: '0 -16px', flexBasis: '100%'}} />
      )}
      {/* Column count: masonry + uniformGrid */}
      {(layoutType === 'masonry' || layoutType === 'uniformGrid') && (
        <Group>
          <Label>Columns:</Label>
          {[2, 3, 4].map(n => (
            <Btn key={n} active={(section.columnCount ?? 3) === n} onClick={() => onChange({columnCount: n})}>
              {n}
            </Btn>
          ))}
        </Group>
      )}

      {/* Row height: justified */}
      {layoutType === 'justified' && (
        <Group>
          <Label>Row height:</Label>
          <input
            type="range"
            min={150}
            max={500}
            step={10}
            value={section.rowHeight ?? 300}
            onChange={e => onChange({rowHeight: Number(e.target.value)})}
            style={{width: 100, accentColor: '#3b82f6'}}
          />
          <span style={{fontSize: 11, color: '#666', minWidth: 36, fontVariantNumeric: 'tabular-nums'}}>
            {section.rowHeight ?? 300}px
          </span>
        </Group>
      )}

      {/* Slideshow: autoplay + duration */}
      {layoutType === 'slideshow' && (
        <>
          <Group>
            <label style={{display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 11}}>
              <input
                type="checkbox"
                checked={section.autoplay ?? false}
                onChange={e => onChange({autoplay: e.target.checked})}
                style={{accentColor: '#3b82f6', width: 13, height: 13}}
              />
              <span style={{color: '#888'}}>Autoplay</span>
            </label>
          </Group>
          {section.autoplay && (
            <Group>
              <Label>Duration:</Label>
              {[2, 3, 4, 6, 8].map(s => (
                <Btn key={s} active={(section.duration ?? 4) === s} onClick={() => onChange({duration: s})}>
                  {s}s
                </Btn>
              ))}
            </Group>
          )}
        </>
      )}

      {/* Mosaic: hero index + support count */}
      {layoutType === 'mosaic' && (
        <>
          <Group>
            <Label>Hero image #:</Label>
            {[0, 1, 2, 3].map(n => (
              <Btn key={n} active={(section.heroIndex ?? 0) === n} onClick={() => onChange({heroIndex: n})}>
                {n + 1}
              </Btn>
            ))}
          </Group>
          <Group>
            <Label>Supporting:</Label>
            {[2, 3, 4, 6].map(n => (
              <Btn key={n} active={(section.supportCount ?? 4) === n} onClick={() => onChange({supportCount: n})}>
                {n}
              </Btn>
            ))}
          </Group>
        </>
      )}

      {/* Filmstrip: thumb height */}
      {layoutType === 'filmstrip' && (
        <Group>
          <Label>Thumb height:</Label>
          <input
            type="range"
            min={100}
            max={400}
            step={10}
            value={section.thumbHeight ?? 220}
            onChange={e => onChange({thumbHeight: Number(e.target.value)})}
            style={{width: 100, accentColor: '#3b82f6'}}
          />
          <span style={{fontSize: 11, color: '#666', minWidth: 36, fontVariantNumeric: 'tabular-nums'}}>
            {section.thumbHeight ?? 220}px
          </span>
        </Group>
      )}

      {/* Album controls */}
      {layoutType === 'album' && (
        <>
          <Group>
            <Label>Thumbnails:</Label>
            {(['right', 'bottom'] as const).map(v => (
              <Btn key={v} active={(section.thumbnailPosition ?? 'right') === v} onClick={() => onChange({thumbnailPosition: v})}>
                {v === 'right' ? 'Right' : 'Below'}
              </Btn>
            ))}
          </Group>
          <Group>
            <Label>Thumb size:</Label>
            <input
              type="range"
              min={60}
              max={140}
              step={4}
              value={section.thumbnailSize ?? 88}
              onChange={e => onChange({thumbnailSize: Number(e.target.value)})}
              style={{width: 80, accentColor: '#3b82f6'}}
            />
            <span style={{fontSize: 11, color: '#666', minWidth: 30, fontVariantNumeric: 'tabular-nums'}}>
              {section.thumbnailSize ?? 88}px
            </span>
          </Group>
        </>
      )}

      {/* Editorial controls */}
      {layoutType === 'editorial' && (
        <Group>
          <Label>Hero side:</Label>
          {(['left', 'right'] as const).map(v => (
            <Btn key={v} active={(section.heroSide ?? 'left') === v} onClick={() => onChange({heroSide: v})}>
              {v === 'left' ? '← Left' : 'Right →'}
            </Btn>
          ))}
        </Group>
      )}

      {/* Bento controls */}
      {layoutType === 'bento' && (
        <Group>
          <Label>Template:</Label>
          {(['A', 'B', 'C'] as const).map(v => (
            <Btn key={v} active={(section.bentoTemplate ?? 'A') === v} onClick={() => onChange({bentoTemplate: v})}>
              {v === 'A' ? 'A (6 imgs)' : v === 'B' ? 'B (5 imgs)' : 'C (7 imgs)'}
            </Btn>
          ))}
        </Group>
      )}

      {/* Panorama controls */}
      {layoutType === 'panorama' && (
        <Group>
          <Label>Strip height:</Label>
          <input
            type="range"
            min={180}
            max={600}
            step={20}
            value={section.panoramaHeight ?? 380}
            onChange={e => onChange({panoramaHeight: Number(e.target.value)})}
            style={{width: 100, accentColor: '#3b82f6'}}
          />
          <span style={{fontSize: 11, color: '#666', minWidth: 36, fontVariantNumeric: 'tabular-nums'}}>
            {section.panoramaHeight ?? 380}px
          </span>
        </Group>
      )}
    </div>
  )
}
