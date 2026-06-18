import { useState } from 'react'
import type { ListDoc } from '../lib/types'

interface Props {
  list: ListDoc
  onGenerateCode: () => Promise<string>
  onRemoveCollaborator: (uid: string) => Promise<void>
  ownerUid: string
  onClose: () => void
}

export function ShareListDialog({
  list,
  onGenerateCode,
  onRemoveCollaborator,
  ownerUid,
  onClose,
}: Props) {
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [removingUid, setRemovingUid] = useState<string | null>(null)

  async function handleGenerate() {
    setBusy(true)
    await onGenerateCode()
    setBusy(false)
  }

  async function handleCopy() {
    if (!list.shareCode) return
    await navigator.clipboard.writeText(list.shareCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleRemove(uid: string) {
    setRemovingUid(uid)
    await onRemoveCollaborator(uid)
    setRemovingUid(null)
  }

  const collaborators = Object.entries(list.members).filter(([uid]) => uid !== ownerUid)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm px-4 pb-6 sm:pb-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-[--color-surface] border border-[--color-border] rounded-2xl p-6 shadow-2xl flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-[--color-ink]">Share list</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-[--color-ink]/50 hover:text-[--color-ink] hover:bg-[--color-ink]/8 transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Share code */}
        <div className="flex flex-col gap-2">
          <p className="text-xs text-[--color-ink]/50 font-medium uppercase tracking-wide">Share code</p>
          {list.shareCode ? (
            <div className="flex items-center gap-2">
              <span className="flex-1 px-4 py-2.5 rounded-xl border border-[--color-border] bg-[--color-bg] font-mono font-bold text-[--color-ink] text-sm tracking-widest text-center select-all">
                {list.shareCode}
              </span>
              <button
                onClick={handleCopy}
                className="px-3 py-2.5 rounded-xl text-sm font-medium border border-[--color-border] text-[--color-ink]/70 hover:border-[--color-accent] hover:text-[--color-accent] transition-colors min-w-[64px]"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          ) : (
            <p className="text-sm text-[--color-ink]/40">No share code yet.</p>
          )}
          <button
            onClick={handleGenerate}
            disabled={busy}
            className="self-start text-xs text-[--color-accent] hover:underline disabled:opacity-50 transition-opacity"
          >
            {busy ? 'Generating…' : list.shareCode ? 'Regenerate code' : 'Generate code'}
          </button>
        </div>

        {/* Collaborators */}
        {collaborators.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-[--color-ink]/50 font-medium uppercase tracking-wide">Collaborators</p>
            <ul className="flex flex-col gap-1">
              {collaborators.map(([uid, info]) => (
                <li key={uid} className="flex items-center gap-3 py-1.5 px-3 rounded-xl hover:bg-[--color-ink]/5">
                  {info.photoURL ? (
                    <img
                      src={info.photoURL}
                      alt={info.displayName ?? 'Member'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-[--color-accent]/20 text-[--color-accent] font-bold text-xs flex items-center justify-center">
                      {(info.displayName ?? '?')[0].toUpperCase()}
                    </span>
                  )}
                  <span className="flex-1 text-sm text-[--color-ink] truncate">
                    {info.displayName ?? 'Anonymous'}
                  </span>
                  <button
                    onClick={() => handleRemove(uid)}
                    disabled={removingUid === uid}
                    className="text-xs text-[--color-danger] hover:underline disabled:opacity-40 transition-opacity"
                  >
                    {removingUid === uid ? '…' : 'Remove'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
