import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  subscribeToItems,
  addItem as libAddItem,
  toggleChecked as libToggleChecked,
  setQuantity as libSetQuantity,
  setCategory as libSetCategory,
  deleteItem as libDeleteItem,
} from '../lib/items'
import type { Category, ItemDoc } from '../lib/types'

export function useItems(listId: string) {
  const { user } = useAuth()
  const [items, setItems] = useState<ItemDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!listId) return
    const unsub = subscribeToItems(
      listId,
      (data) => {
        setItems(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )
    return unsub
  }, [listId])

  const addItem = useCallback(
    async (name: string, quantity: number, category: Category) => {
      if (!user) return
      await libAddItem(listId, user.uid, name, quantity, category)
    },
    [listId, user],
  )

  const toggleChecked = useCallback(
    async (item: ItemDoc) => {
      if (!user) return
      await libToggleChecked(listId, item, user.uid)
    },
    [listId, user],
  )

  const setQuantity = useCallback(
    async (itemId: string, quantity: number) => {
      await libSetQuantity(listId, itemId, quantity)
    },
    [listId],
  )

  const setCategory = useCallback(
    async (itemId: string, category: Category) => {
      await libSetCategory(listId, itemId, category)
    },
    [listId],
  )

  const removeItem = useCallback(
    async (itemId: string) => {
      await libDeleteItem(listId, itemId)
    },
    [listId],
  )

  return { items, loading, error, addItem, toggleChecked, setQuantity, setCategory, removeItem }
}
