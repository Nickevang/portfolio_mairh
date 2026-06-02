import type {GallerySection, LayoutType} from './types'

interface Props {
  section: GallerySection
  imgUrl: (ref: string, width: number) => string
  onLayoutChange: (layout: LayoutType) => void
}

const LAYOUTS: {value: LayoutType; label: string; sub: string}[] = [
  {value: 'uniformGrid', label: 'Grid', sub: 'equal cells'},
  {value: 'masonry', label: 'Masonry', sub: 'waterfall'},
  {value: 'justified', label: 'Justified', sub: 'equal-height rows'},
  {value: 'customGrid', label: 'Custom', sub: 'drag & resize'},
  {value: 'slideshow', label: 'Slideshow', sub: 'full-bleed'},
  {value: 'cinematic', label: 'Cinematic', sub: 'single column'},
  {value: 'mosaic', label: 'Mosaic', sub: 'hero + grid'},
  {value: 'filmstrip', label: 'Filmstrip', sub: 'horizontal scroll'},
  {value: 'album', label: 'Album', sub: 'focus + navigator'},
  {value: 'editorial', label: 'Editorial', sub: 'magazine spread'},
  {value: 'diptych', label: 'Diptych', sub: 'always pairs'},
  {value: 'bento', label: 'Bento', sub: 'bento box grid'},
  {value: 'scatter', label: 'Scatter', sub: 'polaroid style'},
  {value: 'panorama', label: 'Panorama', sub: 'full-height scroll'},
]

// Shared placeholder
function Placeholder({width, height, style}: {width: string; height: number; style?: React.CSSProperties}) {
  return <div style={{width, height, background: '#252525', borderRadius: 1, flexShrink: 0, ...style}} />
}

// Mini layout renderers — 120 × 76px canvas, real photos where available

function MiniUniformGrid({urls}: {urls: string[]}) {
  const cells = Array.from({length: 6}, (_, i) => urls[i] ?? '')
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, width: '100%'}}>
      {cells.map((url, i) =>
        url ? (
          <img key={i} src={url} alt="" draggable={false} style={{width: '100%', aspectRatio: '1', objectFit: 'cover'}} />
        ) : (
          <Placeholder key={i} width="100%" height={22} />
        ),
      )}
    </div>
  )
}

function MiniMasonry({urls}: {urls: string[]}) {
  const heights = [30, 20, 34, 24, 16, 28]
  const cells = Array.from({length: 6}, (_, i) => urls[i] ?? '')
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 2, width: '100%', alignItems: 'start'}}>
      {cells.map((url, i) =>
        url ? (
          <img
            key={i}
            src={url}
            alt=""
            draggable={false}
            style={{width: '100%', height: heights[i], objectFit: 'cover', display: 'block'}}
          />
        ) : (
          <Placeholder key={i} width="100%" height={heights[i]} />
        ),
      )}
    </div>
  )
}

function MiniJustified({urls}: {urls: string[]}) {
  const row1w = ['44%', '30%', '26%']
  const row2w = ['28%', '44%', '28%']
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%'}}>
      <div style={{display: 'flex', gap: 2}}>
        {row1w.map((w, i) =>
          urls[i] ? (
            <img key={i} src={urls[i]} alt="" draggable={false} style={{width: w, height: 28, objectFit: 'cover', flexShrink: 0}} />
          ) : (
            <Placeholder key={i} width={w} height={28} />
          ),
        )}
      </div>
      <div style={{display: 'flex', gap: 2}}>
        {row2w.map((w, i) =>
          urls[i + 3] ? (
            <img key={i} src={urls[i + 3]} alt="" draggable={false} style={{width: w, height: 28, objectFit: 'cover', flexShrink: 0}} />
          ) : (
            <Placeholder key={i} width={w} height={28} />
          ),
        )}
      </div>
    </div>
  )
}

function MiniCustomGrid({urls}: {urls: string[]}) {
  // Fixed illustrative pattern: 4-wide + 2-wide / 2-wide + 4-wide
  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 2, width: '100%'}}>
      {urls[0] ? (
        <img src={urls[0]} alt="" draggable={false} style={{gridColumn: 'span 4', width: '100%', height: 30, objectFit: 'cover'}} />
      ) : (
        <Placeholder style={{gridColumn: 'span 4'}} width="100%" height={30} />
      )}
      {urls[1] ? (
        <img src={urls[1]} alt="" draggable={false} style={{gridColumn: 'span 2', width: '100%', height: 30, objectFit: 'cover'}} />
      ) : (
        <Placeholder style={{gridColumn: 'span 2'}} width="100%" height={30} />
      )}
      {urls[2] ? (
        <img src={urls[2]} alt="" draggable={false} style={{gridColumn: 'span 2', width: '100%', height: 26, objectFit: 'cover'}} />
      ) : (
        <Placeholder style={{gridColumn: 'span 2'}} width="100%" height={26} />
      )}
      {urls[3] ? (
        <img src={urls[3]} alt="" draggable={false} style={{gridColumn: 'span 4', width: '100%', height: 26, objectFit: 'cover'}} />
      ) : (
        <Placeholder style={{gridColumn: 'span 4'}} width="100%" height={26} />
      )}
    </div>
  )
}

function MiniSlideshow({urls}: {urls: string[]}) {
  return (
    <div style={{width: '100%'}}>
      {urls[0] ? (
        <img src={urls[0]} alt="" draggable={false} style={{width: '100%', height: 52, objectFit: 'cover', display: 'block'}} />
      ) : (
        <Placeholder width="100%" height={52} />
      )}
      <div style={{display: 'flex', justifyContent: 'center', gap: 4, paddingTop: 5}}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: i === 0 ? '#e26012' : '#333',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function MiniCinematic({urls}: {urls: string[]}) {
  const widths = ['100%', '78%', '100%']
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 3, width: '100%', alignItems: 'center'}}>
      {widths.map((w, i) =>
        urls[i] ? (
          <img key={i} src={urls[i]} alt="" draggable={false} style={{width: w, height: 18, objectFit: 'cover'}} />
        ) : (
          <Placeholder key={i} width={w} height={18} />
        ),
      )}
    </div>
  )
}

function MiniMosaic({urls}: {urls: string[]}) {
  return (
    <div style={{display: 'grid', gridTemplateColumns: '58% 42%', gap: 2, width: '100%'}}>
      {urls[0] ? (
        <img
          src={urls[0]}
          alt=""
          draggable={false}
          style={{gridRow: 'span 2', width: '100%', height: 58, objectFit: 'cover'}}
        />
      ) : (
        <Placeholder style={{gridRow: 'span 2'}} width="100%" height={58} />
      )}
      {urls[1] ? (
        <img src={urls[1]} alt="" draggable={false} style={{width: '100%', height: 28, objectFit: 'cover'}} />
      ) : (
        <Placeholder width="100%" height={28} />
      )}
      {urls[2] ? (
        <img src={urls[2]} alt="" draggable={false} style={{width: '100%', height: 28, objectFit: 'cover'}} />
      ) : (
        <Placeholder width="100%" height={28} />
      )}
    </div>
  )
}

function MiniFilmstrip({urls}: {urls: string[]}) {
  const cells = Array.from({length: 5}, (_, i) => urls[i] ?? '')
  return (
    <div style={{display: 'flex', gap: 2, width: '100%', overflow: 'hidden'}}>
      {cells.map((url, i) =>
        url ? (
          <img
            key={i}
            src={url}
            alt=""
            draggable={false}
            style={{flexShrink: 0, width: 22, height: 58, objectFit: 'cover'}}
          />
        ) : (
          <Placeholder key={i} width="22px" height={58} />
        ),
      )}
    </div>
  )
}

function MiniAlbum({urls}: {urls: string[]}) {
  const thumbs = Array.from({length: 4}, (_, i) => urls[i] ?? '')
  return (
    <div style={{display: 'flex', gap: 2, width: '100%', height: 64}}>
      {/* Focus area */}
      {urls[0] ? (
        <img src={urls[0]} alt="" draggable={false} style={{flex: '0 0 68%', height: '100%', objectFit: 'cover'}} />
      ) : (
        <Placeholder width="68%" height={64} />
      )}
      {/* Thumbnail strip */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
        {thumbs.map((url, i) =>
          url ? (
            <img key={i} src={url} alt="" draggable={false} style={{width: '100%', flex: 1, objectFit: 'cover'}} />
          ) : (
            <Placeholder key={i} width="100%" height={14} />
          ),
        )}
      </div>
    </div>
  )
}

function MiniEditorial({urls}: {urls: string[]}) {
  return (
    <div style={{display: 'flex', gap: 2, width: '100%', height: 64}}>
      {urls[0] ? (
        <img src={urls[0]} alt="" draggable={false} style={{flex: '0 0 58%', height: '100%', objectFit: 'cover'}} />
      ) : (
        <Placeholder width="58%" height={64} />
      )}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 2}}>
        {[1, 2, 3].map(i =>
          urls[i] ? (
            <img key={i} src={urls[i]} alt="" draggable={false} style={{width: '100%', flex: 1, objectFit: 'cover'}} />
          ) : (
            <Placeholder key={i} width="100%" height={18} />
          ),
        )}
      </div>
    </div>
  )
}

function MiniDiptych({urls}: {urls: string[]}) {
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%'}}>
      <div style={{display: 'flex', gap: 2}}>
        {[0, 1].map(i =>
          urls[i] ? (
            <img key={i} src={urls[i]} alt="" draggable={false} style={{flex: 1, height: 28, objectFit: 'cover'}} />
          ) : (
            <Placeholder key={i} width="50%" height={28} />
          ),
        )}
      </div>
      <div style={{display: 'flex', gap: 2}}>
        {[2, 3].map(i =>
          urls[i] ? (
            <img key={i} src={urls[i]} alt="" draggable={false} style={{flex: 1, height: 28, objectFit: 'cover'}} />
          ) : (
            <Placeholder key={i} width="50%" height={28} />
          ),
        )}
      </div>
    </div>
  )
}

function MiniBento({urls}: {urls: string[]}) {
  return (
    <div style={{display: 'grid', gridTemplateAreas: '"a a b c" "a a d e" "f f f f"', gridTemplateColumns: 'repeat(4,1fr)', gridTemplateRows: '22px 22px 16px', gap: 2, width: '100%'}}>
      {(['a','b','c','d','e','f'] as const).map((area, i) =>
        urls[i] ? (
          <img key={area} src={urls[i]} alt="" draggable={false} style={{gridArea: area, width: '100%', height: '100%', objectFit: 'cover'}} />
        ) : (
          <Placeholder key={area} style={{gridArea: area}} width="100%" height={100} />
        ),
      )}
    </div>
  )
}

function MiniScatter({urls}: {urls: string[]}) {
  const rots = [-7, 4, -3, 6]
  return (
    <div style={{position: 'relative', width: '100%', height: 64}}>
      {[0,1,2,3].map(i =>
        urls[i] ? (
          <img
            key={i}
            src={urls[i]}
            alt=""
            draggable={false}
            style={{
              position: 'absolute',
              width: 48,
              height: 40,
              objectFit: 'cover',
              transform: `rotate(${rots[i]}deg)`,
              left: [4, 22, 40, 58][i],
              top: [8, 4, 12, 6][i],
              background: '#fff',
              padding: 2,
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
            }}
          />
        ) : null,
      )}
    </div>
  )
}

function MiniPanorama({urls}: {urls: string[]}) {
  const widths = [28, 18, 26, 16, 22]
  return (
    <div style={{display: 'flex', gap: 2, width: '100%', height: 64, overflow: 'hidden'}}>
      {widths.map((w, i) =>
        urls[i] ? (
          <img key={i} src={urls[i]} alt="" draggable={false} style={{flexShrink: 0, width: w, height: '100%', objectFit: 'cover'}} />
        ) : (
          <Placeholder key={i} width={`${w}px`} height={64} />
        ),
      )}
    </div>
  )
}

const MINI_RENDERERS: Record<LayoutType, React.ComponentType<{urls: string[]}>> = {
  uniformGrid: MiniUniformGrid,
  masonry: MiniMasonry,
  justified: MiniJustified,
  customGrid: MiniCustomGrid,
  slideshow: MiniSlideshow,
  cinematic: MiniCinematic,
  mosaic: MiniMosaic,
  filmstrip: MiniFilmstrip,
  album: MiniAlbum,
  editorial: MiniEditorial,
  diptych: MiniDiptych,
  bento: MiniBento,
  scatter: MiniScatter,
  panorama: MiniPanorama,
}

export function LayoutBar({section, imgUrl, onLayoutChange}: Props) {
  // Prepare up to 6 thumbnail URLs from the section's images (loaded at 120px)
  const thumbnailUrls = section.images
    .slice(0, 6)
    .map(img => (img.asset ? imgUrl(img.asset._ref, 120) : ''))

  return (
    <div
      style={{
        borderBottom: '1px solid #1e1e1e',
        overflowX: 'auto',
        flexShrink: 0,
        background: '#141414',
        // Scrollbar styling
        scrollbarWidth: 'thin',
        scrollbarColor: '#333 transparent',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: 6,
          padding: '10px 12px',
          width: 'max-content',
        }}
      >
        {LAYOUTS.map(layout => {
          const isActive = section.layoutType === layout.value
          const MiniRenderer = MINI_RENDERERS[layout.value]

          return (
            <button
              key={layout.value}
              onClick={() => onLayoutChange(layout.value)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                padding: '8px 8px 6px',
                width: 128,
                flexShrink: 0,
                border: isActive ? '1.5px solid #e26012' : '1.5px solid #282828',
                borderRadius: 7,
                background: isActive ? '#1a0e00' : '#1a1a1a',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#3a3a3a'
              }}
              onMouseLeave={e => {
                if (!isActive)
                  (e.currentTarget as HTMLButtonElement).style.borderColor = '#282828'
              }}
            >
              {/* Mini preview with actual photos */}
              <div style={{width: '100%', overflow: 'hidden', borderRadius: 3}}>
                <MiniRenderer urls={thumbnailUrls} />
              </div>

              {/* Label */}
              <div style={{textAlign: 'center'}}>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: isActive ? '#e26012' : '#888',
                    letterSpacing: '0.04em',
                  }}
                >
                  {layout.label}
                </div>
                <div style={{fontSize: 9, color: '#444', marginTop: 1}}>{layout.sub}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
