import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { useAuth } from '../auth/useAuth'
import { useTheme } from '../theme/useTheme'
import type { Theme } from '../theme/ThemeContext'

const THEMES: { value: Theme; label: string; icon: string; desc: string }[] = [
  { value: 'noir', label: 'Noir', icon: '◐', desc: 'Black & white comic-ink' },
  { value: 'color-light', label: 'Color Light', icon: '☀', desc: 'Vibrant Spider-Verse day' },
  { value: 'color-dark', label: 'Color Dark', icon: '✦', desc: 'Neon Spider-Verse night' },
]

export default function SettingsPage() {
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[--color-bg]">
      <TopBar title="Settings" />

      <main className="max-w-lg mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        {/* Account section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[--color-ink]/40">
            Account
          </h2>
          <div className="flex items-center gap-4 p-4 rounded-2xl border border-[--color-border] bg-[--color-surface]">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName ?? 'Avatar'}
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border-2 border-[--color-border] shrink-0"
              />
            ) : (
              <span className="w-12 h-12 rounded-full border-2 border-[--color-border] bg-[--color-accent]/20 flex items-center justify-center text-xl shrink-0">
                {user?.displayName?.[0] ?? '?'}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[--color-ink] truncate">{user?.displayName ?? '—'}</p>
              <p className="text-sm text-[--color-ink]/50 truncate">{user?.email ?? '—'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full py-3 rounded-xl text-sm font-bold border-2 border-[--color-danger]/40 text-[--color-danger] hover:bg-[--color-danger]/10 hover:border-[--color-danger] active:scale-[0.98] transition-all"
          >
            Sign out
          </button>
        </section>

        {/* Theme section */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-[--color-ink]/40">
            Theme
          </h2>
          <div className="flex flex-col gap-2">
            {THEMES.map((t) => {
              const active = theme === t.value
              return (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value)}
                  className={`
                    flex items-center gap-4 w-full px-4 py-3.5 rounded-xl border-2 text-left
                    active:scale-[0.98] transition-all duration-150
                    ${active
                      ? 'border-[--color-accent] bg-[--color-accent]/10'
                      : 'border-[--color-border] bg-[--color-surface] hover:border-[--color-accent]/50'}
                  `}
                >
                  <span className="text-2xl leading-none shrink-0" aria-hidden="true">
                    {t.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold text-sm ${active ? 'text-[--color-accent]' : 'text-[--color-ink]'}`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-[--color-ink]/50">{t.desc}</p>
                  </div>
                  {active && (
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[--color-accent] flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* App version */}
        <section>
          <h2 className="text-xs font-black uppercase tracking-widest text-[--color-ink]/40 mb-2">
            App
          </h2>
          <p className="text-xs text-[--color-ink]/30">GrabNGo · Phase 6</p>
        </section>

      </main>
    </div>
  )
}
