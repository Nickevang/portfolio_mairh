import {notFound} from 'next/navigation'
import Image from 'next/image'
import {PortableText} from 'next-sanity'
import type {Metadata} from 'next'

import {sanityFetch} from '@/lib/sanity.client'
import {urlForImage} from '@/lib/sanity.image'
import {projectBySlugQuery, projectSlugsQuery, type ProjectDetail} from '@/lib/sanity.queries'
import {MuxPlayer} from '@/components/MuxPlayer'
import {GalleryGrid, type GalleryItem, type GalleryLayout} from '@/components/GalleryGrid'
import {ProjectCard, type ProjectCardData} from '@/components/project-card'
import {Gallery} from '@/components/gallery/Gallery'
import type {RenderedSection, RenderedImage} from '@/components/gallery/types'

interface Props {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const slugs = await sanityFetch<{slug: string}[]>(projectSlugsQuery)
  return slugs.map((s) => ({slug: s.slug}))
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {slug} = await params
  const project = await sanityFetch<ProjectDetail>(projectBySlugQuery, {slug})
  if (!project) return {}

  const ogImageUrl = project.coverImage
    ? urlForImage(project.coverImage).width(1200).height(630).fit('crop').url()
    : undefined

  return {
    title: project.title,
    openGraph: ogImageUrl ? {images: [{url: ogImageUrl}]} : undefined,
  }
}

export default async function ProjectPage({params}: Props) {
  const {slug} = await params
  const project = await sanityFetch<ProjectDetail>(projectBySlugQuery, {slug})

  if (!project || !project._id) notFound()

  // Transform raw sections into rendered sections with pre-built URLs
  const renderedSections: RenderedSection[] | null =
    project.sections && project.sections.length > 0
      ? project.sections.map((section) => ({
          _key: section._key,
          layoutType: section.layoutType as RenderedSection['layoutType'],
          rowHeight: section.rowHeight ?? undefined,
          columnCount: section.columnCount ?? undefined,
          autoplay: section.autoplay ?? undefined,
          duration: section.duration ?? undefined,
          heroIndex: section.heroIndex ?? undefined,
          supportCount: section.supportCount ?? undefined,
          thumbHeight: section.thumbHeight ?? undefined,
          thumbnailPosition: section.thumbnailPosition ?? undefined,
          thumbnailSize: section.thumbnailSize ?? undefined,
          heroSide: section.heroSide ?? undefined,
          bentoTemplate: section.bentoTemplate ?? undefined,
          panoramaHeight: section.panoramaHeight ?? undefined,
          sectionRow: section.sectionRow ?? undefined,
          sectionWidth: section.sectionWidth ?? undefined,
          images: (section.images ?? []).map((img, i): RenderedImage => ({
            _key: img._key,
            src: urlForImage(img.asset).width(1200).url(),
            fullSrc: urlForImage(img.asset).width(2400).url(),
            width: img.dimensions?.width ?? 1200,
            height: img.dimensions?.height ?? 900,
            alt: `${project.title} — ${i + 1}`,
            lqip: img.lqip ?? undefined,
            colSpan: img.colSpan ?? undefined,
            featured: img.featured ?? undefined,
            widthCap: img.widthCap ?? undefined,
            focalPoint: img.focalPoint ?? undefined,
          })),
        }))
      : null

  const publishedDate = project.publishedAt
    ? new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'long'}).format(
        new Date(project.publishedAt),
      )
    : null

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-10">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-light tracking-tight text-white/90">{project.title}</h1>
        {publishedDate && (
          <p className="mt-2 text-sm text-white/40">{publishedDate}</p>
        )}
      </header>

      {/* Media */}
      {project.mediaType === 'video' ? (() => {
        const ids = project.videoPlaybackIds?.length
          ? project.videoPlaybackIds
          : project.muxPlaybackId
            ? [project.muxPlaybackId]
            : []
        return ids.length > 0 ? (
          <div className="mb-10 flex flex-col gap-6">
            {ids.map((id) => (
              <div key={id} className="overflow-hidden rounded-2xl border border-white/10">
                <MuxPlayer playbackId={id} />
              </div>
            ))}
          </div>
        ) : null
      })() : (
        <div className="mb-10">
          {/* New sections-based gallery */}
          {renderedSections && <Gallery sections={renderedSections} />}

          {/* Legacy flat gallery (backward compat) */}
          {!renderedSections && project.gallery && project.gallery.length > 0 && (() => {
            const galleryItems: GalleryItem[] = project.gallery!
              .filter((img) => img.asset)
              .map((img, i) => ({
                key: img._key ?? String(i),
                src: urlForImage(img).width(900).url(),
                fullSrc: urlForImage(img).width(2400).url(),
                width: img.dimensions?.width ?? 900,
                height: img.dimensions?.height ?? 1200,
                lqip: img.lqip ?? undefined,
                displaySize: (img.displaySize ?? 'half') as 'half' | 'third' | 'full',
                colSpan: img.colSpan ?? undefined,
                alt: `${project.title} — ${i + 1}`,
              }))
            const layout = (project.galleryLayout ?? 'mixed') as GalleryLayout
            return <GalleryGrid items={galleryItems} layout={layout} />
          })()}

          {/* Cover image fallback when no gallery at all */}
          {!renderedSections && (!project.gallery || project.gallery.length === 0) && project.coverImage && (
            <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl border border-white/10">
              <Image
                src={urlForImage(project.coverImage).width(1600).height(1067).fit('crop').url()}
                alt={project.title}
                fill
                className="object-cover"
                placeholder={project.lqip ? 'blur' : 'empty'}
                blurDataURL={project.lqip ?? undefined}
                priority
              />
            </div>
          )}
        </div>
      )}

      {/* Description */}
      {project.description && project.description.length > 0 && (
        <div className="prose prose-invert prose-sm max-w-2xl prose-p:text-white/70 prose-p:leading-7">
          <PortableText value={project.description as Parameters<typeof PortableText>[0]['value']} />
        </div>
      )}

      {/* Sub-projects */}
      {project.subprojects && project.subprojects.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-6 text-sm tracking-widest uppercase text-white/30">
            {project.subprojects.length === 1 ? '1 project' : `${project.subprojects.length} projects`}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {project.subprojects.map((sub) => {
              const card: ProjectCardData = {
                _id: sub._id,
                title: sub.title,
                slug: sub.slug,
                mediaType: sub.mediaType,
                coverImageUrl: urlForImage(sub.coverImage).width(800).height(1000).fit('crop').url(),
                lqip: sub.lqip ?? undefined,
              }
              return <ProjectCard key={sub._id} project={card} cardStyle="overlay" />
            })}
          </div>
        </section>
      )}
    </article>
  )
}
