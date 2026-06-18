import { useRef, useState } from 'react'
import { CATEGORIES } from '../lib/types'
import type { Category } from '../lib/types'

interface Props {
  onAdd: (name: string, quantity: number, category: Category) => Promise<void>
}

export default function AddItemForm({ onAdd }: Props) {
  const nameRef = useRef<HTMLInputElement>(null)
  const [quantity, setQuantity] = useState(1)
  const [category, setCategory] = useState<Category>('Other')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = nameRef.current?.value.trim() ?? ''
    if (!name) return
    setBusy(true)
    await onAdd(name, quantity, category)
    setBusy(false)
    if (nameRef.current) nameRef.current.value = ''
    setQuantity(1)
    setCategory('Other')
    nameRef.current?.focus()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end w-full"
    >
      <input
        ref={nameRef}
        type="text"
        placeholder="Item name"
        maxLength={80}
        required
        className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border border-[--color-border] bg-[--color-surface] text-[--color-ink] placeholder-[--color-ink]/40 outline-none focus:border-[--color-accent] transition-colors"
      />

      {/* quantity stepper */}
      <div className="flex items-center gap-1 rounded-xl border border-[--color-border] bg-[--color-surface] overflow-hidden">
        <button
          type="button"
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-2.5 text-[--color-ink]/60 hover:text-[--color-accent] hover:bg-[--color-accent]/10 transition-colors font-bold text-lg leading-none"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-semibold text-[--color-ink] select-none">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-2.5 text-[--color-ink]/60 hover:text-[--color-accent] hover:bg-[--color-accent]/10 transition-colors font-bold text-lg leading-none"
        >
          +
        </button>
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as Category)}
        className="px-3 py-2.5 rounded-xl border border-[--color-border] bg-[--color-surface] text-[--color-ink] outline-none focus:border-[--color-accent] transition-colors text-sm"
      >
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={busy}
        className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[--color-accent] text-white hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
      >
        {busy ? 'Adding…' : 'Add item'}
      </button>
    </form>
  )
}
