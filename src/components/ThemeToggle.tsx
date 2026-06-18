import { useTheme } from '../theme/useTheme'
import type { Theme } from '../theme/ThemeContext'

const THEMES: { value: Theme; label: string; icon: string }[] = [
  { value: 'noir', label: 'Noir', icon: '◐' },
  { value: 'color-light', label: 'Light', icon: '☀' },
  { value: 'color-dark', label: 'Dark', icon: '✦' },
]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const idx = THEMES.findIndex((t) => t.value === theme)
    setTheme(THEMES[(idx + 1) % THEMES.length].value)
  }

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0]

  return (
    <button
      onClick={cycle}
      title={`Theme: ${current.label} — click to cycle`}
      aria-label="Cycle colour theme"
      className="
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
        bg-[--color-surface] border border-[--color-border]
        text-[--color-ink] hover:border-[--color-accent]
        transition-colors duration-150 select-none
      "
    >
      <span aria-hidden="true">{current.icon}</span>
      {current.label}
    </button>
  )
}
