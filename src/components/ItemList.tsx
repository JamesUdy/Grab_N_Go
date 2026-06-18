import { GroceryItem } from '../hooks/useItems'
import ItemCard from './ItemCard'

interface Props {
  items: GroceryItem[]
  onRemove: (id: string) => void
}

export default function ItemList({ items, onRemove }: Props) {
  if (items.length === 0) {
    return (
      <ul className="list-none flex flex-wrap gap-[0.64rem] mr-[2.4rem]">
        <li className="text-white text-base">No items here... yet</li>
      </ul>
    )
  }

  return (
    <ul className="list-none flex flex-wrap gap-[0.64rem] mr-[2.4rem]">
      {items.map((item, i) => (
        <ItemCard key={item.id} item={item} index={i} onRemove={onRemove} />
      ))}
    </ul>
  )
}
