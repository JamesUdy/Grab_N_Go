import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[--color-bg]">
      <span className="text-8xl font-black text-[--color-ink]">404</span>
      <p className="text-[--color-ink]/60 text-lg">Page not found.</p>
      <Link to="/" className="text-[--color-accent] underline underline-offset-4">
        Back to lists
      </Link>
    </div>
  )
}
