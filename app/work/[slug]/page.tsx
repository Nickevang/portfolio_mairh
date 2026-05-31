import {notFound} from 'next/navigation'
import Image from 'next/image'
import {PortableText} from 'next-sanity'
import type {Metadata} from 'next'

import {sanityFetch} from '@/lib/sanity.client'
import {urlForImage} from '@/lib/sanity.image'
import {projectBySlugQuery, projectSlugsQuery, type ProjectDetail} from '@/lib/sanity.queries'
import {MuxPlayer} from '@/components/MuxPlayer'

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
      {project.mediaType === 'video' && project.muxPlaybackId ? (
        <div className="mb-10 overflow-hidden rounded-2xl border border-white/10">
          <MuxPlayer playbackId={project.muxPlaybackId} />
        </div>
      ) : (
        <div className="mb-10">
          {/* Cover image when no gallery */}
          {(!project.gallery || project.gallery.length === 0) && project.coverImage && (
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

          {/* Gallery grid */}
          {project.gallery && project.gallery.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.gallery.map((img, i) => (
                <div
                  key={img._key ?? i}
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={urlForImage(img).width(900).height(1125).fit('crop').url()}
                    alt={`${project.title} — ${i + 1}`}
                    fill
                    className="object-cover"
                    placeholder={img.lqip ? 'blur' : 'empty'}
                    blurDataURL={img.lqip ?? undefined}
                    sizes="(min-width: 640px) 50vw, 100vw"
                    priority={i < 2}
                  />
                </div>
              ))}
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
    </article>
  )
}
