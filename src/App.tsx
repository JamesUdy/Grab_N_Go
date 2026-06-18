import { useItems } from './hooks/useItems'
import AddItemForm from './components/AddItemForm'
import ItemList from './components/ItemList'
import shoppy from './assets/shoppy.webp'

export default function App() {
  const { items, addItem, removeItem } = useItems()

  return (
    <div className="min-h-screen bg-[#d8e2dc] select-none">
      <h1 className="text-center mb-0 font-black text-[#ffb4a2] [WebkitTextStroke:0.096rem_#ff0a54] pt-4 text-4xl">
        Grab &nbsp; N &nbsp; Go
      </h1>

      <div className="flex flex-col items-center max-w-[104rem] mx-auto">
        <img
          src={shoppy}
          alt="Shopping bag mascot"
          className="block mx-auto mt-[0.8rem] w-auto max-w-[24rem]"
        />

        <AddItemForm onAdd={addItem} />

        <ItemList items={items} onRemove={removeItem} />
      </div>
    </div>
  )
}
