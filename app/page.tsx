import Image from 'next/image'
import Link from 'next/link'
import {sanityFetch, sanityDataset, sanityProjectId} from '@/lib/sanity.client'
import {urlForImage} from '@/lib/sanity.image'
import {siteSettingsQuery, projectsQuery, type SiteSettings, type ProjectListItem} from '@/lib/sanity.queries'
import {HeroSlideshow, type Slide} from '@/components/HeroSlideshow'

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

  const slides: Slide[] = displayProjects
    .filter((p) => Boolean(p.slug) && Boolean(p.coverImage))
    .map((p) => ({
      key: p._id,
      slug: p.slug,
      title: p.title,
      tagline: p.tagline ?? undefined,
      imageUrl: urlForImage(p.coverImage).width(1920).url(),
      lqip: p.lqip ?? undefined,
    }))

  return (
    <div>
      {/* ── Fullscreen slideshow ──────────────────────────────────── */}
      {slides.length > 0 ? (
        <HeroSlideshow slides={slides} />
      ) : (
        <div className="flex h-screen items-center justify-center">
          <p className="text-sm text-white/40">
            Add projects in the Studio to populate the slideshow.
          </p>
        </div>
      )}

      {/* ── About preview ─────────────────────────────────────────── */}
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
