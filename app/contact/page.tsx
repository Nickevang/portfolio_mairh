import Link from 'next/link'
import type {Metadata} from 'next'

import {sanityFetch} from '@/lib/sanity.client'
import {siteSettingsQuery, type SiteSettings} from '@/lib/sanity.queries'
import {ContactForm} from '@/components/contact-form'

export const metadata: Metadata = {
  title: 'Contact',
}

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings>(siteSettingsQuery)
  const endpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT ?? ''

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.5fr]">
        {/* Left — copy */}
        <div>
          <h1 className="mb-4 text-3xl font-light tracking-tight text-white/90">
            {settings?.contactHeading ?? 'Get in touch.'}
          </h1>

          {settings?.contactNote && (
            <p className="mb-6 text-sm leading-7 text-white/50">{settings.contactNote}</p>
          )}

          {settings?.contactEmail && (
            <Link
              href={`mailto:${settings.contactEmail}`}
              className="text-sm text-white/40 underline-offset-4 hover:text-white/80 hover:underline"
            >
              {settings.contactEmail}
            </Link>
          )}
        </div>

        {/* Right — form */}
        <div>
          {endpoint ? (
            <ContactForm endpoint={endpoint} />
          ) : (
            <div className="rounded-2xl border border-white/10 p-6 text-sm text-white/40">
              Add <span className="text-white/70">NEXT_PUBLIC_FORMSPREE_ENDPOINT</span> to{' '}
              <code>.env.local</code> to enable the contact form.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
