import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { CreateListDialog } from '../components/CreateListDialog'
import { useLists } from '../hooks/useLists'
import type { ListDoc } from '../lib/types'

function ListCard({ list, onClick }: { list: ListDoc; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-start gap-2 w-full p-5 rounded-2xl border border-[--color-border] bg-[--color-surface] hover:border-[--color-accent]/60 hover:shadow-lg active:scale-[0.98] transition-all duration-150 text-left"
    >
      <span className="text-2xl" aria-hidden="true">
        {list.icon ?? '🛒'}
      </span>
      <span className="font-bold text-[--color-ink] text-base leading-snug line-clamp-2">
        {list.name}
      </span>
      <span className="text-xs text-[--color-ink]/40 mt-auto">
        {list.memberUids.length > 1 ? `${list.memberUids.length} members` : 'Just you'}
      </span>
    </button>
  )
}

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <span className="text-5xl" aria-hidden="true">🛍️</span>
      <p className="text-[--color-ink]/60 text-sm max-w-xs">
        No lists yet. Create your first one and start grabbing!
      </p>
      <button
        onClick={onNew}
        className="mt-2 px-6 py-2.5 rounded-xl font-bold text-sm bg-[--color-accent] text-white hover:opacity-90 active:scale-95 transition-all"
      >
        + New list
      </button>
    </div>
  )
}

export default function ListsOverviewPage() {
  const { lists, loading, createList } = useLists()
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[--color-bg]">
      <TopBar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-black text-[--color-ink] tracking-tight">Your lists</h1>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold bg-[--color-accent] text-white hover:opacity-90 active:scale-95 transition-all"
          >
            + New list
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <span className="w-8 h-8 rounded-full border-2 border-[--color-accent] border-t-transparent animate-spin" />
          </div>
        ) : lists.length === 0 ? (
          <EmptyState onNew={() => setShowCreate(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map((list) => (
              <ListCard
                key={list.id}
                list={list}
                onClick={() => navigate(`/list/${list.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <CreateListDialog
          onCreate={createList}
          onClose={() => setShowCreate(false)}
        />
      )}
    </div>
  )
}
