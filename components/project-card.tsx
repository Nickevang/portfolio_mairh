import Image from 'next/image'
import Link from 'next/link'
import {Film, Image as ImageIcon} from 'lucide-react'

export interface ProjectCardData {
  _id: string
  title: string
  slug: string
  mediaType: 'photo' | 'video'
  coverImageUrl: string
  lqip?: string
}

export function ProjectCard({project}: {project: ProjectCardData}) {
  const Icon = project.mediaType === 'video' ? Film : ImageIcon

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/0"
    >
      <div className="relative aspect-[4/5] w-full">
        <Image
          src={project.coverImageUrl}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          placeholder={project.lqip ? 'blur' : 'empty'}
          blurDataURL={project.lqip ?? undefined}
          priority={false}
        />
      </div>
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm text-white/90">{project.title}</div>
        </div>
        <Icon className="h-4 w-4 shrink-0 text-white/50" aria-hidden="true" />
      </div>
    </Link>
  )
}
