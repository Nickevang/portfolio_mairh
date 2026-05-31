import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-4 py-20">
      <p className="mb-4 text-xs uppercase tracking-widest text-white/30">404</p>
      <h1 className="mb-6 text-3xl font-light tracking-tight text-white/90">Page not found.</h1>
      <Link
        href="/"
        className="text-sm text-white/50 underline-offset-4 hover:text-white/90 hover:underline"
      >
        Back to home
      </Link>
    </div>
  )
}
