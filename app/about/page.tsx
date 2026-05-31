import Image from 'next/image'
import Link from 'next/link'
import {PortableText} from 'next-sanity'
import type {Metadata} from 'next'

import {sanityFetch} from '@/lib/sanity.client'
import {urlForImage} from '@/lib/sanity.image'
import {siteSettingsQuery, type SiteSettings} from '@/lib/sanity.queries'

export const metadata: Metadata = {
  title: 'About',
}

export default async function AboutPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery)

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2fr]">
        {/* Profile photo */}
        {settings?.profilePhoto && (
          <div className="relative aspect-[3/4] w-full max-w-xs overflow-hidden rounded-2xl border border-white/10 lg:max-w-none">
            <Image
              src={urlForImage(settings.profilePhoto).width(600).height(800).fit('crop').url()}
              alt={settings.siteName ?? 'Profile photo'}
              fill
              className="object-cover"
              placeholder={settings.profilePhotoLqip ? 'blur' : 'empty'}
              blurDataURL={settings.profilePhotoLqip ?? undefined}
              priority
            />
          </div>
        )}

        {/* Bio content */}
        <div className="flex flex-col justify-center">
          <h1 className="mb-6 text-3xl font-light tracking-tight text-white/90">
            {settings?.siteName ?? 'About'}
          </h1>

          {settings?.tagline && (
            <p className="mb-6 text-base text-white/50">{settings.tagline}</p>
          )}

          {settings?.bio && settings.bio.length > 0 ? (
            <div className="prose prose-invert prose-sm prose-p:text-white/70 prose-p:leading-7 prose-p:mb-4">
              <PortableText value={settings.bio as Parameters<typeof PortableText>[0]['value']} />
            </div>
          ) : (
            <p className="text-sm text-white/40">
              Add a biography in Site Settings via the Studio.
            </p>
          )}

          {settings?.disciplines && settings.disciplines.length > 0 && (
            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-widest text-white/30">Disciplines</p>
              <ul className="flex flex-wrap gap-2">
                {settings.disciplines.map((d) => (
                  <li
                    key={d}
                    className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60"
                  >
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-block rounded-full border border-white/20 px-5 py-2 text-sm text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
