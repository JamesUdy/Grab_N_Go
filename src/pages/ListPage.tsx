import { useParams, useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import AddItemForm from '../components/AddItemForm'
import ItemList from '../components/ItemList'
import { useItems } from '../hooks/useItems'
import { useLists } from '../hooks/useLists'

export default function ListPage() {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const { lists } = useLists()
  const { items, loading, addItem, toggleChecked, setQuantity, removeItem } = useItems(listId ?? '')

  const list = lists.find((l) => l.id === listId)

  if (!listId) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div className="min-h-screen bg-[--color-bg]">
      <TopBar title={list?.name} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <AddItemForm onAdd={addItem} />

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 rounded-full border-2 border-[--color-accent] border-t-transparent animate-spin" />
          </div>
        ) : (
          <ItemList
            items={items}
            onToggle={toggleChecked}
            onSetQuantity={setQuantity}
            onRemove={removeItem}
          />
        )}
      </main>
    </div>
  )
}
