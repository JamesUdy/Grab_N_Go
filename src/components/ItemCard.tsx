import type { ItemDoc } from '../lib/types'

interface Props {
  item: ItemDoc
  onToggle: (item: ItemDoc) => void
  onSetQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export default function ItemCard({ item, onToggle, onSetQuantity, onRemove }: Props) {
  return (
    <li
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xl border
        transition-all duration-150
        ${item.checked
          ? 'border-[--color-border] bg-[--color-surface]/40 opacity-60'
          : 'border-[--color-border] bg-[--color-surface] hover:border-[--color-accent]/40'}
      `}
    >
      {/* check toggle */}
      <button
        onClick={() => onToggle(item)}
        aria-label={item.checked ? 'Uncheck item' : 'Check item'}
        className={`
          shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-colors duration-150
          ${item.checked
            ? 'border-[--color-accent] bg-[--color-accent]'
            : 'border-[--color-ink]/30 hover:border-[--color-accent]'}
        `}
      >
        {item.checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* name + category */}
      <div className="flex-1 min-w-0">
        <span
          className={`block text-sm font-semibold text-[--color-ink] truncate ${item.checked ? 'line-through opacity-60' : ''}`}
        >
          {item.name}
        </span>
        <span className="text-xs text-[--color-ink]/40">{item.category}</span>
      </div>

      {/* quantity stepper */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onSetQuantity(item.id, Math.max(1, item.quantity - 1))}
          disabled={item.checked}
          className="w-6 h-6 rounded flex items-center justify-center text-[--color-ink]/50 hover:text-[--color-accent] hover:bg-[--color-accent]/10 transition-colors disabled:pointer-events-none text-sm font-bold"
        >
          −
        </button>
        <span className="w-6 text-center text-xs font-semibold text-[--color-ink] select-none">
          {item.quantity}
        </span>
        <button
          onClick={() => onSetQuantity(item.id, item.quantity + 1)}
          disabled={item.checked}
          className="w-6 h-6 rounded flex items-center justify-center text-[--color-ink]/50 hover:text-[--color-accent] hover:bg-[--color-accent]/10 transition-colors disabled:pointer-events-none text-sm font-bold"
        >
          +
        </button>
      </div>

      {/* delete */}
      <button
        onClick={() => onRemove(item.id)}
        aria-label="Delete item"
        className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[--color-ink]/30 hover:text-[--color-danger,#e53e3e] hover:bg-red-500/10 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  )
}
