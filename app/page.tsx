import Image from 'next/image'
import Link from 'next/link'
import {ProjectCard} from '@/components/project-card'
import {sanityFetch, sanityDataset, sanityProjectId} from '@/lib/sanity.client'
import {urlForImage} from '@/lib/sanity.image'
import {siteSettingsQuery, projectsQuery, type SiteSettings, type ProjectListItem} from '@/lib/sanity.queries'

const GRID_COLS: Record<number, string> = {
  2: 'sm:grid-cols-2',
  3: 'sm:grid-cols-2 lg:grid-cols-3',
  4: 'sm:grid-cols-2 lg:grid-cols-4',
}

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
    settings?.featuredProjects?.length ? settings.featuredProjects : allProjects

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

  const heroLayout = settings?.heroLayout ?? 'minimal'
  const hasBg = Boolean(settings?.heroBgImage)
  const hasHero = Boolean(settings?.heroHeading || settings?.heroSubheading || settings?.heroBgImage)
  const cardStyle = settings?.cardStyle ?? 'below'
  const colsClass = GRID_COLS[settings?.workGridCols ?? 3] ?? GRID_COLS[3]

  return (
    <div>
      {/* ── Hero: Minimal ─────────────────────────────────────────────── */}
      {hasHero && heroLayout === 'minimal' && (
        <div className="mx-auto w-full max-w-6xl px-4">
          <section className="py-20 md:py-32">
            {settings?.heroHeading && (
              <h1 className="text-4xl font-light tracking-tight text-white/90 md:text-6xl lg:text-7xl">
                {settings.heroHeading}
              </h1>
            )}
            {settings?.heroSubheading && (
              <p className="mt-4 max-w-xl text-base leading-7 text-white/50 md:text-lg">
                {settings.heroSubheading}
              </p>
            )}
          </section>
        </div>
      )}

      {/* ── Hero: Fullscreen ──────────────────────────────────────────── */}
      {hasHero && heroLayout === 'fullscreen' && (
        <section className="relative flex min-h-screen w-full items-center justify-center">
          {hasBg && (
            <>
              <Image
                src={urlForImage(settings!.heroBgImage!).width(1920).url()}
                alt=""
                fill
                className="object-cover"
                priority
                placeholder={settings?.heroBgImageLqip ? 'blur' : 'empty'}
                blurDataURL={settings?.heroBgImageLqip ?? undefined}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
            </>
          )}
          <div className="relative mx-auto w-full max-w-6xl px-4 text-center">
            {settings?.heroHeading && (
              <h1 className="text-4xl font-light tracking-tight text-white/90 md:text-6xl lg:text-7xl">
                {settings.heroHeading}
              </h1>
            )}
            {settings?.heroSubheading && (
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/50 md:text-lg">
                {settings.heroSubheading}
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── Hero: Split ───────────────────────────────────────────────── */}
      {hasHero && heroLayout === 'split' && (
        <section className="relative flex min-h-[70vh] w-full">
          {hasBg && (
            <div className="relative hidden w-1/2 lg:block">
              <Image
                src={urlForImage(settings!.heroBgImage!).width(960).url()}
                alt=""
                fill
                className="object-cover"
                priority
                placeholder={settings?.heroBgImageLqip ? 'blur' : 'empty'}
                blurDataURL={settings?.heroBgImageLqip ?? undefined}
              />
            </div>
          )}
          <div
            className={`flex items-center py-20 px-8 ${
              hasBg ? 'w-full lg:w-1/2' : 'mx-auto w-full max-w-3xl'
            }`}
          >
            <div>
              {settings?.heroHeading && (
                <h1 className="text-4xl font-light tracking-tight text-white/90 md:text-5xl lg:text-6xl">
                  {settings.heroHeading}
                </h1>
              )}
              {settings?.heroSubheading && (
                <p className="mt-4 max-w-xl text-base leading-7 text-white/50 md:text-lg">
                  {settings.heroSubheading}
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Project grid ──────────────────────────────────────────────── */}
      <div className="mx-auto w-full max-w-6xl px-4">
        <section className="pb-20">
          {!hasHero && (
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
            <div className={`grid grid-cols-1 gap-6 ${colsClass}`}>
              {cards.map((p) => (
                <ProjectCard key={p._id} project={p} cardStyle={cardStyle} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── About preview ─────────────────────────────────────────────── */}
      {settings?.showAboutPreview && (
        <section className="border-t border-white/10 py-20">
          <div className="mx-auto w-full max-w-6xl px-4">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_2fr]">
              {settings.profilePhoto && (
                <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={urlForImage(settings.profilePhoto).width(400).height(533).fit('crop').url()}
                    alt={settings.siteName ?? 'Profile photo'}
                    fill
                    className="object-cover"
                    placeholder={settings.profilePhotoLqip ? 'blur' : 'empty'}
                    blurDataURL={settings.profilePhotoLqip ?? undefined}
                  />
                </div>
              )}
              <div className="flex flex-col justify-center">
                <h2 className="mb-2 text-2xl font-light tracking-tight text-white/90">
                  {settings.siteName ?? 'About'}
                </h2>
                {settings.tagline && (
                  <p className="mb-6 text-base text-white/50">{settings.tagline}</p>
                )}
                <Link
                  href="/about"
                  className="inline-flex items-center gap-1 text-sm transition-colors hover:opacity-80"
                  style={{color: 'var(--accent)'}}
                >
                  About →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
