import { useRegisterSW } from 'virtual:pwa-register/react'

export function UpdateToast() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW()

  if (!needRefresh) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl border-2 border-[--color-ink] bg-[--color-surface] text-[--color-ink] shadow-[4px_4px_0_var(--color-ink)] text-sm font-semibold"
      style={{ fontStyle: 'italic' }}
    >
      <span className="text-base">⚡</span>
      <span>New version ready!</span>
      <button
        onClick={() => updateServiceWorker(true)}
        className="px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wide bg-[--color-accent] text-white border border-[--color-ink] hover:opacity-90 active:scale-95 transition-all"
      >
        Update
      </button>
      <button
        onClick={() => setNeedRefresh(false)}
        aria-label="Dismiss"
        className="w-6 h-6 flex items-center justify-center rounded-full border border-[--color-border] text-[--color-ink]/50 hover:text-[--color-ink] transition-colors text-lg leading-none"
      >
        ×
      </button>
    </div>
  )
}
