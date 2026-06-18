import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ThemeToggle } from './ThemeToggle'

interface TopBarProps {
  title?: string
}

export function TopBar({ title }: TopBarProps) {
  const { user, signOut } = useAuth()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-14 border-b border-[--color-border] bg-[--color-surface]/90 backdrop-blur-sm">
      <Link to="/" className="flex items-center gap-2 font-black text-lg tracking-tight text-[--color-ink] hover:text-[--color-accent] transition-colors">
        GrabNGo
        {title && <span className="font-normal text-[--color-ink]/50 text-sm ml-1">/ {title}</span>}
      </Link>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user && (
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium bg-[--color-surface] border border-[--color-border] text-[--color-ink]/70 hover:text-[--color-accent] hover:border-[--color-accent] transition-colors duration-150"
          >
            Sign out
          </button>
        )}
      </div>
    </header>
  )
}
