'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {clsx} from 'clsx'

const links = [
  {href: '/', label: 'Home'},
  {href: '/work', label: 'Work'},
  {href: '/about', label: 'About'},
  {href: '/contact', label: 'Contact'},
] as const

export function Navbar({siteName}: {siteName?: string | null}) {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-sm font-medium tracking-wide text-white/90">
          {siteName ?? 'Portfolio'}
        </Link>
        <div className="flex items-center gap-5">
          {links.map((l) => {
            const isActive = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={clsx(
                  'text-sm tracking-wide transition-colors',
                  isActive ? 'text-white' : 'text-white/60 hover:text-white/90',
                )}
              >
                {l.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </header>
  )
}

