import {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import imageUrlBuilder from '@sanity/image-url'
import {GalleryEditorView} from '../../components/GalleryEditor'

interface Project {
  _id: string
  title: string
  coverImage?: {asset?: {_ref?: string}}
}

export function GalleryEditorTool() {
  const client = useClient({apiVersion: '2024-01-01'})
  const builder = imageUrlBuilder(client)
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [doc, setDoc] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)

  // Fetch project list
  useEffect(() => {
    client
      .fetch<Project[]>('*[_type == "project"] | order(title asc) {_id, title, coverImage}')
      .then(setProjects)
  }, [client])

  // Listen to selected project document (prefer draft)
  useEffect(() => {
    if (!selectedId) {
      setDoc(null)
      return
    }
    setLoading(true)
    const pubId = selectedId.replace(/^drafts\./, '')
    const draftId = `drafts.${pubId}`
    const q = `coalesce(*[_id == $draftId][0], *[_id == $pubId][0])`

    client.fetch(q, {draftId, pubId}).then(d => {
      setDoc(d)
      setLoading(false)
    })

    const sub = client
      .listen(`*[_id == $draftId || _id == $pubId]`, {draftId, pubId})
      .subscribe(() => {
        client.fetch(q, {draftId, pubId}).then(setDoc)
      })

    return () => sub.unsubscribe()
  }, [selectedId, client])

  const docId = selectedId?.replace(/^drafts\./, '') ?? null

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        background: '#111',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Project list sidebar */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          borderRight: '1px solid #1a1a1a',
          display: 'flex',
          flexDirection: 'column',
          background: '#0a0a0a',
        }}
      >
        <div
          style={{
            padding: '14px 16px 10px',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#3a3a3a',
            borderBottom: '1px solid #1a1a1a',
            flexShrink: 0,
          }}
        >
          Projects
        </div>

        <div style={{flex: 1, overflowY: 'auto'}}>
          {projects.length === 0 && (
            <div style={{padding: '20px 16px', fontSize: 12, color: '#222', textAlign: 'center'}}>
              No projects yet
            </div>
          )}
          {projects.map(p => {
            const pubId = p._id.replace(/^drafts\./, '')
            const selPubId = selectedId?.replace(/^drafts\./, '')
            const isSelected = pubId === selPubId
            const thumbRef = p.coverImage?.asset?._ref
            return (
              <button
                key={p._id}
                onClick={() => setSelectedId(pubId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  width: '100%',
                  padding: '9px 12px',
                  textAlign: 'left',
                  background: isSelected ? '#1a0e00' : 'transparent',
                  border: 'none',
                  borderLeft: isSelected ? '2px solid #e26012' : '2px solid transparent',
                  color: isSelected ? '#e26012' : '#666',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 0.1s',
                }}
              >
                {thumbRef ? (
                  <img
                    src={builder.image(thumbRef).width(48).height(48).fit('crop').url()}
                    alt=""
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 3,
                      objectFit: 'cover',
                      flexShrink: 0,
                      opacity: isSelected ? 1 : 0.6,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 3,
                      background: '#1a1a1a',
                      flexShrink: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 13,
                  }}
                >
                  {p.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Gallery editor area */}
      <div style={{flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
        {docId && doc ? (
          <GalleryEditorView
            document={{displayed: doc, draft: null, published: null}}
            documentId={docId}
            schemaType={{name: 'project'}}
          />
        ) : loading ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#333',
              fontSize: 13,
            }}
          >
            Loading…
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 16,
            }}
          >
            <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
              <rect x={4} y={12} width={48} height={32} rx={5} stroke="#222" strokeWidth={2} />
              <circle cx={20} cy={26} r={6} stroke="#222" strokeWidth={2} />
              <polyline
                points="4,44 16,28 26,38 36,24 52,44"
                stroke="#222"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            </svg>
            <p style={{fontSize: 13, margin: 0, color: '#2a2a2a'}}>
              {projects.length === 0
                ? 'Create a project in the Desk to get started'
                : 'Select a project from the left'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export const GalleryIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x={1} y={4} width={18} height={13} rx={2} />
    <circle cx={10} cy={10.5} r={3} />
    <path d="M6 4 L7.5 1.5 L12.5 1.5 L14 4" strokeLinejoin="round" />
  </svg>
)
