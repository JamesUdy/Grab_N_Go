import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../auth/useAuth'
import {
  subscribeToUserLists,
  createList as libCreateList,
  renameList as libRenameList,
  deleteList as libDeleteList,
} from '../lib/lists'
import type { ListDoc } from '../lib/types'

export function useLists() {
  const { user } = useAuth()
  const [lists, setLists] = useState<ListDoc[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!user) {
      // schedule state reset outside the effect body
      const t = setTimeout(() => {
        setLists([])
        setLoading(false)
      }, 0)
      return () => clearTimeout(t)
    }
    const unsub = subscribeToUserLists(
      user.uid,
      (data) => {
        setLists(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      },
    )
    return unsub
  }, [user])

  const createList = useCallback(
    async (name: string) => {
      if (!user) return
      await libCreateList(user.uid, name)
    },
    [user],
  )

  const renameList = useCallback(async (listId: string, name: string) => {
    await libRenameList(listId, name)
  }, [])

  const deleteList = useCallback(async (listId: string) => {
    await libDeleteList(listId)
  }, [])

  return { lists, loading, error, createList, renameList, deleteList }
}
