import {ProjectCard} from '@/components/project-card'
import {sanityFetch, sanityDataset, sanityProjectId} from '@/lib/sanity.client'
import {urlForImage} from '@/lib/sanity.image'
import {siteSettingsQuery, projectsQuery, type SiteSettings, type ProjectListItem} from '@/lib/sanity.queries'

export default async function HomePage() {
  if (!sanityProjectId || !sanityDataset) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10">
        <p className="text-sm text-white/60">
          Set <span className="text-white/80">NEXT_PUBLIC_SANITY_PROJECT_ID</span> and{' '}
          <span className="text-white/80">NEXT_PUBLIC_SANITY_DATASET</span> in{' '}
          <code>.env.local</code> to load content.
        </p>
      </div>
    )
  }

  const [settings, allProjects] = await Promise.all([
    sanityFetch<SiteSettings>(siteSettingsQuery),
    sanityFetch<ProjectListItem[]>(projectsQuery),
  ])

  const displayProjects: ProjectListItem[] =
    settings?.featuredProjects?.length
      ? settings.featuredProjects
      : allProjects

  const cards = displayProjects
    .filter((p) => Boolean(p.slug) && Boolean(p.coverImage))
    .map((p) => ({
      _id: p._id,
      title: p.title,
      slug: p.slug,
      mediaType: p.mediaType,
      coverImageUrl: urlForImage(p.coverImage).width(1200).height(1500).fit('crop').url(),
      lqip: p.lqip ?? undefined,
    }))

  return (
    <div className="mx-auto w-full max-w-6xl px-4">
      {/* Hero */}
      {(settings?.heroHeading || settings?.heroSubheading) && (
        <section className="py-20 md:py-32">
          {settings.heroHeading && (
            <h1 className="text-4xl font-light tracking-tight text-white/90 md:text-6xl lg:text-7xl">
              {settings.heroHeading}
            </h1>
          )}
          {settings.heroSubheading && (
            <p className="mt-4 max-w-xl text-base leading-7 text-white/50 md:text-lg">
              {settings.heroSubheading}
            </p>
          )}
        </section>
      )}

      {/* Project grid */}
      <section className="pb-20">
        {!settings?.heroHeading && !settings?.heroSubheading && (
          <div className="mb-10 pt-10">
            <h1 className="text-2xl tracking-tight text-white/90">Work</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">
              Selected photography and videography projects.
            </p>
          </div>
        )}

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
      </section>
    </div>
  )
}
