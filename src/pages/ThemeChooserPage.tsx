import { useNavigate } from 'react-router-dom'
import { useTheme } from '../theme/useTheme'
import type { Theme } from '../theme/ThemeContext'

const THEMES: { value: Theme; label: string; icon: string; desc: string; bg: string; ink: string; accent: string }[] = [
  {
    value: 'noir',
    label: 'Noir',
    icon: '◐',
    desc: 'Ash & Fog — cinematic monochrome',
    bg: '#0f0f0f',
    ink: '#d4d4d4',
    accent: '#a0a0a0',
  },
  {
    value: 'color-light',
    label: 'Light',
    icon: '☀',
    desc: 'Soft violet — clean and bright',
    bg: '#f8f7ff',
    ink: '#0f0a1e',
    accent: '#7c3aed',
  },
  {
    value: 'color-dark',
    label: 'Dark',
    icon: '✦',
    desc: 'Deep indigo — rich and immersive',
    bg: '#050816',
    ink: '#ffffff',
    accent: '#915eff',
  },
]

export default function ThemeChooserPage() {
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()

  function pick(t: Theme) {
    setTheme(t)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--color-bg] px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-black text-[--color-ink] mb-2 tracking-tight">
        Pick your theme
      </h1>
      <p className="text-[--color-ink]/50 text-sm mb-10">You can change it any time from the top bar.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        {THEMES.map((t) => {
          const active = theme === t.value
          return (
            <button
              key={t.value}
              onClick={() => pick(t.value)}
              className={`
                relative flex flex-col items-start p-5 rounded-2xl border-2 text-left
                transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]
                ${active ? 'border-[--color-accent] shadow-lg' : 'border-[--color-border] hover:border-[--color-accent]/50'}
              `}
              style={{ background: t.bg }}
            >
              {active && (
                <span className="absolute top-3 right-3 text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: t.accent, color: t.bg }}>
                  active
                </span>
              )}
              <span className="text-2xl mb-3" aria-hidden="true">{t.icon}</span>
              <span className="text-base font-bold mb-1" style={{ color: t.ink }}>{t.label}</span>
              <span className="text-xs" style={{ color: t.ink, opacity: 0.6 }}>{t.desc}</span>

              {/* colour chip row */}
              <div className="flex gap-1.5 mt-4">
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: t.accent }} />
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: t.ink }} />
                <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: t.bg }} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
