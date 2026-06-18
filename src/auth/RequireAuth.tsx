import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from './useAuth'

interface Props {
  children: ReactNode
}

export function RequireAuth({ children }: Props) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[--color-bg]">
        <span className="text-[--color-ink] text-lg animate-pulse">Loading…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  return <>{children}</>
}
