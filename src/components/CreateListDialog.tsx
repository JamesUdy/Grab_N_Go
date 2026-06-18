import { useRef, useState } from 'react'

interface Props {
  onCreate: (name: string) => Promise<void>
  onClose: () => void
}

export function CreateListDialog({ onCreate, onClose }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = inputRef.current?.value.trim() ?? ''
    if (!name) return
    setBusy(true)
    await onCreate(name)
    setBusy(false)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[--color-surface] border border-[--color-border] rounded-2xl p-6 shadow-2xl">
        <h2 className="text-lg font-black text-[--color-ink] mb-4">New list</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="List name"
            maxLength={60}
            autoFocus
            className="w-full px-4 py-2.5 rounded-xl border border-[--color-border] bg-[--color-bg] text-[--color-ink] placeholder-[--color-ink]/40 outline-none focus:border-[--color-accent] transition-colors"
          />
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
              {busy ? 'Creating…' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
