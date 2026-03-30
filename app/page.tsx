import {ProjectCard, type ProjectCardData} from '@/components/project-card'
import {sanityFetch, sanityDataset, sanityProjectId} from '@/lib/sanity.client'
import {urlForImage, type SanityImageSource} from '@/lib/sanity.image'

interface ProjectListItemQueryResult {
  _id: string
  title: string
  slug: string
  mediaType: 'photo' | 'video'
  coverImage: SanityImageSource
}

const projectsQuery = /* groq */ `
  *[_type == "project"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    mediaType,
    coverImage
  }
`

export default async function HomePage() {
  if (!sanityProjectId || !sanityDataset) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-2xl tracking-tight text-white/90">Work</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
          Set <span className="text-white/80">NEXT_PUBLIC_SANITY_PROJECT_ID</span> and{' '}
          <span className="text-white/80">NEXT_PUBLIC_SANITY_DATASET</span> in <code>.env.local</code> to load
          projects.
        </p>
      </div>
    )
  }

  const projects = await sanityFetch<ProjectListItemQueryResult[]>(projectsQuery)

  const cards: ProjectCardData[] = projects
    .filter((p) => Boolean(p.slug) && Boolean(p.coverImage))
    .map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      mediaType: p.mediaType,
      coverImageUrl: urlForImage(p.coverImage).width(1200).height(1500).fit('crop').url(),
    }))

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-2xl tracking-tight text-white/90">Work</h1>
        <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
          Selected photography and videography projects.
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/60">
          No projects yet. Add a <span className="text-white/80">Project</span> in the Studio.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((p) => (
            <ProjectCard key={p._id} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}
