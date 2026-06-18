import type { Category, ItemDoc } from '../lib/types'
import ItemCard from './ItemCard'

interface Props {
  items: ItemDoc[]
  onToggle: (item: ItemDoc) => void
  onSetQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

export default function ItemList({ items, onToggle, onSetQuantity, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center">
        <span className="text-4xl" aria-hidden="true">🛒</span>
        <p className="text-sm text-[--color-ink]/50">No items yet — add something above.</p>
      </div>
    )
  }

  const active = items.filter((i) => !i.checked)
  const done = items.filter((i) => i.checked)

  // group active items by category
  const grouped = active.reduce<Partial<Record<Category, ItemDoc[]>>>((acc, item) => {
    const cat = item.category
    if (!acc[cat]) acc[cat] = []
    acc[cat]!.push(item)
    return acc
  }, {})

  const categories = Object.keys(grouped) as Category[]

  return (
    <div className="flex flex-col gap-6">
      {/* active items grouped by category */}
      {categories.map((cat) => (
        <section key={cat}>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[--color-ink]/40 mb-2 px-1">
            {cat}
          </h3>
          <ul className="flex flex-col gap-2">
            {grouped[cat]!.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={onToggle}
                onSetQuantity={onSetQuantity}
                onRemove={onRemove}
              />
            ))}
          </ul>
        </section>
      ))}

      {/* done section */}
      {done.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[--color-ink]/30 mb-2 px-1">
            Done ({done.length})
          </h3>
          <ul className="flex flex-col gap-2">
            {done.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onToggle={onToggle}
                onSetQuantity={onSetQuantity}
                onRemove={onRemove}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
