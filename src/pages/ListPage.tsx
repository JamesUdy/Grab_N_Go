import { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import AddItemForm from '../components/AddItemForm'
import ItemList from '../components/ItemList'
import { CollaboratorAvatars } from '../components/CollaboratorAvatars'
import { ShareListDialog } from '../components/ShareListDialog'
import { SearchSortBar } from '../components/SearchSortBar'
import type { SortKey } from '../components/SearchSortBar'
import { useItems } from '../hooks/useItems'
import { useLists } from '../hooks/useLists'
import { useAuth } from '../auth/useAuth'
import type { Category, ItemDoc } from '../lib/types'

export default function ListPage() {
  const { listId } = useParams<{ listId: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { lists, generateShareCode, removeCollaborator, deleteList } = useLists()
  const { items, loading, addItem, toggleChecked, setQuantity, removeItem } = useItems(listId ?? '')
  const [showShare, setShowShare] = useState(false)
  const [leaveBusy, setLeaveBusy] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<Category | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('newest')

  const list = lists.find((l) => l.id === listId)
  const isOwner = list?.ownerUid === user?.uid

  const filteredItems = useMemo(() => {
    let result: ItemDoc[] = items

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((i) => i.name.toLowerCase().includes(q))
    }

    if (filterCategory !== 'All') {
      result = result.filter((i) => i.category === filterCategory)
    }

    result = [...result].sort((a, b) => {
      switch (sortKey) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'category':
          return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
        case 'quantity':
          return b.quantity - a.quantity
        case 'newest':
        default:
          return (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0)
      }
    })

    return result
  }, [items, searchQuery, filterCategory, sortKey])

  if (!listId) {
    navigate('/', { replace: true })
    return null
  }

  async function handleLeave() {
    if (!user || !listId || !list) return
    setLeaveBusy(true)
    try {
      await removeCollaborator(listId, user.uid)
      navigate('/', { replace: true })
    } finally {
      setLeaveBusy(false)
    }
  }

  async function handleDeleteList() {
    if (!listId) return
    await deleteList(listId)
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-[--color-bg]">
      <TopBar title={list?.name} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* List meta bar */}
        {list && (
          <div className="flex items-center justify-between gap-3">
            <CollaboratorAvatars list={list} max={5} size="md" />
            <div className="flex items-center gap-2 ml-auto">
              {isOwner ? (
                <>
                  <button
                    onClick={() => setShowShare(true)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[--color-border] text-[--color-ink]/70 hover:border-[--color-accent] hover:text-[--color-accent] transition-colors"
                  >
                    Share
                  </button>
                  <button
                    onClick={handleDeleteList}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[--color-danger]/30 text-[--color-danger]/70 hover:border-[--color-danger] hover:text-[--color-danger] transition-colors"
                  >
                    Delete list
                  </button>
                </>
              ) : (
                <button
                  onClick={handleLeave}
                  disabled={leaveBusy}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[--color-border] text-[--color-ink]/50 hover:border-[--color-danger]/50 hover:text-[--color-danger] transition-colors disabled:opacity-40"
                >
                  {leaveBusy ? 'Leaving…' : 'Leave list'}
                </button>
              )}
            </div>
          </div>
        )}

        <AddItemForm onAdd={addItem} />

        <SearchSortBar
          query={searchQuery}
          onQueryChange={setSearchQuery}
          category={filterCategory}
          onCategoryChange={setFilterCategory}
          sort={sortKey}
          onSortChange={setSortKey}
        />

        {loading ? (
          <div className="flex justify-center py-16">
            <span className="w-8 h-8 rounded-full border-2 border-[--color-accent] border-t-transparent animate-spin" />
          </div>
        ) : (
          <ItemList
            items={filteredItems}
            onToggle={toggleChecked}
            onSetQuantity={setQuantity}
            onRemove={removeItem}
          />
        )}
      </main>

      {showShare && list && (
        <ShareListDialog
          list={list}
          ownerUid={list.ownerUid}
          onGenerateCode={() => generateShareCode(listId)}
          onRemoveCollaborator={(uid) => removeCollaborator(listId, uid)}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
