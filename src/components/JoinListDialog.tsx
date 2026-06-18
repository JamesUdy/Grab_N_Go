import { useRef, useState } from 'react'

interface Props {
  onJoin: (code: string) => Promise<void>
  onClose: () => void
}

export function JoinListDialog({ onJoin, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = inputRef.current?.value.trim() ?? ''
    if (!code) return
    setBusy(true)
    setError(null)
    try {
      await onJoin(code)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[--color-surface] border border-[--color-border] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-black text-[--color-ink] mb-1">Join a list</h2>
        <p className="text-sm text-[--color-ink]/50 mb-4">Paste the 8-character share code.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. ABC12345"
            maxLength={8}
            autoCapitalize="characters"
            autoFocus
            className="w-full px-4 py-2.5 rounded-xl border border-[--color-border] bg-[--color-bg] text-[--color-ink] placeholder-[--color-ink]/30 font-mono tracking-widest text-center uppercase outline-none focus:border-[--color-accent] transition-colors"
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase()
            }}
          />
          {error && <p className="text-xs text-[--color-danger] text-center">{error}</p>}
          <div className="flex gap-2 justify-end mt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-[--color-ink]/60 hover:text-[--color-ink] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="px-5 py-2 rounded-xl text-sm font-bold bg-[--color-accent] text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {busy ? 'Joining…' : 'Join'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
