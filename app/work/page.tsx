import {ProjectCard} from '@/components/project-card'
import {sanityFetch, sanityDataset, sanityProjectId} from '@/lib/sanity.client'
import {urlForImage} from '@/lib/sanity.image'
import {siteSettingsQuery, projectsQuery, type SiteSettings, type ProjectListItem} from '@/lib/sanity.queries'

export const metadata = {
  title: 'Work',
}

const GRID_COLS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

export default async function WorkPage() {
  if (!sanityProjectId || !sanityDataset) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <h1 className="text-2xl tracking-tight text-white/90">Work</h1>
        <p className="mt-2 text-sm text-white/60">
          Configure environment variables to load projects.
        </p>
      </div>
    )
  }

  const [settings, projects] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery),
    sanityFetch<ProjectListItem[]>(projectsQuery),
  ])

  const cards = projects
    .filter((p) => Boolean(p.slug) && Boolean(p.coverImage))
    .map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      mediaType: p.mediaType,
      coverImageUrl: urlForImage(p.coverImage).width(900).height(1125).fit('crop').url(),
      lqip: p.lqip ?? undefined,
    }))

  const cardStyle = settings?.cardStyle ?? 'below'
  const colsClass = GRID_COLS[settings?.workGridCols ?? 4] ?? GRID_COLS[4]

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-10">
        <h1 className="text-2xl tracking-tight text-white/90">Archive</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">
          All photography and videography projects.
        </p>
      </div>

      {cards.length === 0 ? (
        <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/60">
          No projects yet. Add a <span className="text-white/80">Project</span> in the Studio.
        </div>
      ) : (
        <div className={`grid grid-cols-2 gap-4 ${colsClass}`}>
          {cards.map((p) => (
            <ProjectCard key={p._id} project={p} cardStyle={cardStyle} />
          ))}
        </div>
      )}
    </div>
  )
}
