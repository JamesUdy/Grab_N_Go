import type { Category } from '../lib/types'
import { CATEGORIES } from '../lib/types'

export type SortKey = 'name' | 'category' | 'quantity' | 'newest'

interface Props {
  query: string
  onQueryChange: (q: string) => void
  category: Category | 'All'
  onCategoryChange: (c: Category | 'All') => void
  sort: SortKey
  onSortChange: (s: SortKey) => void
}

export function SearchSortBar({ query, onQueryChange, category, onCategoryChange, sort, onSortChange }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search items…"
        className="flex-1 min-w-0 px-4 py-2 rounded-xl border border-[--color-border] bg-[--color-surface] text-[--color-ink] placeholder-[--color-ink]/40 outline-none focus:border-[--color-accent] transition-colors text-sm"
      />

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as Category | 'All')}
        className="px-3 py-2 rounded-xl border border-[--color-border] bg-[--color-surface] text-[--color-ink] outline-none focus:border-[--color-accent] transition-colors text-sm"
      >
        <option value="All">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        className="px-3 py-2 rounded-xl border border-[--color-border] bg-[--color-surface] text-[--color-ink] outline-none focus:border-[--color-accent] transition-colors text-sm"
      >
        <option value="newest">Newest first</option>
        <option value="name">Name A–Z</option>
        <option value="category">Category</option>
        <option value="quantity">Quantity</option>
      </select>
    </div>
  )
}
