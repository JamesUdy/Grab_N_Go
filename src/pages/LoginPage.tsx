import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { ThemeToggle } from '../components/ThemeToggle'
import shoppy from '../assets/shoppy.webp'

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  // redirect authenticated users away from login
  useEffect(() => {
    if (!loading && user) navigate('/', { replace: true })
  }, [user, loading, navigate])

  async function handleSignIn() {
    try {
      await signInWithGoogle()
    } catch {
      // popup closed or auth error — do nothing, user stays on page
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-bg] px-4 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      {/* #region hero */}
      <img
        src={shoppy}
        alt="GrabNGo mascot"
        className="w-40 sm:w-52 mb-6 drop-shadow-lg select-none"
      />

      <h1 className="text-4xl sm:text-5xl font-black text-[--color-ink] mb-2 tracking-tight">
        Grab&nbsp;N&nbsp;Go
      </h1>
      <p className="text-[--color-ink]/60 text-base mb-10 text-center max-w-xs">
        Your collaborative grocery list — fast, synced, and always in your pocket.
      </p>
      {/* #endregion */}

      {/* #region sign-in */}
      <button
        onClick={handleSignIn}
        disabled={loading}
        className="
          flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-base
          bg-[--color-surface] text-[--color-ink] border-2 border-[--color-ink]/20
          shadow-md hover:shadow-lg active:scale-95
          transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed
        "
      >
        <GoogleIcon />
        Sign in with Google
      </button>
      {/* #endregion */}
    </div>
  )
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.09-6.09C34.46 3.09 29.5 1 24 1 14.72 1 6.9 6.67 3.52 14.72l7.09 5.51C12.29 14.1 17.66 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.57-.14-3.08-.4-4.55H24v8.61h12.7c-.55 2.94-2.2 5.43-4.7 7.1l7.27 5.65C43.28 37.5 46.5 31.48 46.5 24.5z" />
      <path fill="#FBBC05" d="M10.61 28.77A14.53 14.53 0 0 1 9.5 24c0-1.66.28-3.27.79-4.77L3.2 13.72A23.93 23.93 0 0 0 1 24c0 3.87.92 7.53 2.52 10.78l7.09-5.51-.0-.5z" />
      <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.5-4.95l-7.27-5.65c-1.81 1.22-4.12 1.93-6.23 1.93-6.34 0-11.71-4.6-13.39-10.73l-7.09 5.51C6.9 41.33 14.72 47 24 47z" />
    </svg>
  )
}
