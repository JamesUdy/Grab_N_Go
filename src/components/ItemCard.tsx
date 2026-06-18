import { GroceryItem } from '../hooks/useItems'

interface Props {
  item: GroceryItem
  index: number
  onRemove: (id: string) => void
}

export default function ItemCard({ item, index, onRemove }: Props) {
  const isOdd = index % 2 === 0

  return (
    <li
      onDoubleClick={() => onRemove(item.id)}
      className={`
        flex-grow w-fit px-3 py-[0.8rem] rounded-[0.96rem] text-center text-white text-base
        shadow-[0px_1px_4px_rgb(0,0,0)] cursor-pointer select-none
        transition-transform duration-300 ease-in-out
        hover:-translate-y-1
        ${isOdd ? 'bg-[#3fa7d6] hover:bg-[#d904278c]' : 'bg-[#59cd90] hover:bg-[#d904278c]'}
      `}
    >
      {item.name} — Quantity: {item.quantity}
    </li>
  )
}
