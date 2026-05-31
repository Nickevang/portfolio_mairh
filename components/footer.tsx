import Link from 'next/link'
import {ExternalLink} from 'lucide-react'

import {sanityFetch} from '@/lib/sanity.client'
import {siteSettingsQuery, type SiteSettings} from '@/lib/sanity.queries'

export async function Footer() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery)

  const socialLinks = [
    {href: settings?.instagram, label: 'Instagram'},
    {href: settings?.vimeo, label: 'Vimeo'},
    {href: settings?.youtube, label: 'YouTube'},
    {href: settings?.linkedin, label: 'LinkedIn'},
  ].filter((s): s is {href: string; label: string} => Boolean(s.href))

  return (
    <footer className="border-t border-white/10 mt-auto">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 sm:flex-row sm:items-center">
        <p className="text-xs text-white/30">
          &copy; {new Date().getFullYear()}{' '}
          {settings?.siteName ?? 'Portfolio'}
        </p>

        {socialLinks.length > 0 && (
          <div className="flex items-center gap-4">
            {socialLinks.map(({href, label}) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-white/40 transition-colors hover:text-white/80"
              >
                {label}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </footer>
  )
}
