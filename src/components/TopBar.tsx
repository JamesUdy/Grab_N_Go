import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ThemeToggle } from './ThemeToggle'

interface TopBarProps {
  title?: string
}

export function TopBar({ title }: TopBarProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-3 sm:px-6 h-14 border-b border-[--color-border] bg-[--color-surface]/90 backdrop-blur-sm">
      {/* brand + breadcrumb */}
      <Link
        to="/"
        className="flex items-center gap-1.5 font-black text-base sm:text-lg tracking-tight text-[--color-ink] hover:text-[--color-accent] transition-colors min-w-0"
      >
        <span className="shrink-0">GrabNGo</span>
        {title && (
          <span className="font-normal text-[--color-ink]/40 text-xs sm:text-sm truncate max-w-30 sm:max-w-none">
            / {title}
          </span>
        )}
      </Link>

      {/* actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <ThemeToggle />
        {user && (
          <>
            {/* analytics — text label on sm+, icon-only on mobile */}
            <Link
              to="/analytics"
              aria-label="Analytics"
              className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg text-sm font-medium border border-[--color-border] text-[--color-ink]/70 hover:text-[--color-accent] hover:border-[--color-accent] transition-colors duration-150"
            >
              <span aria-hidden="true">📊</span>
              <span className="hidden sm:inline">Analytics</span>
            </Link>

            <Link
              to="/settings"
              aria-label="Settings"
              className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-3 sm:py-1.5 rounded-lg text-sm font-medium border border-[--color-border] text-[--color-ink]/70 hover:text-[--color-accent] hover:border-[--color-accent] transition-colors duration-150"
            >
              ⚙
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
