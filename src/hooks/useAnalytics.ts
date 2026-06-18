import { useState, useEffect, useMemo } from 'react'
import { subscribeToHistory } from '../lib/items'
import { mostBought, categoryBreakdown, itemsOverTime } from '../lib/analytics'
import type { HistoryEvent } from '../lib/types'
import type { MostBoughtEntry, CategoryBreakdownEntry, TrendPoint } from '../lib/analytics'

export interface AnalyticsData {
  mostBought: MostBoughtEntry[]
  categoryBreakdown: CategoryBreakdownEntry[]
  trend: TrendPoint[]
  totalChecked: number
  loading: boolean
}

export function useAnalytics(listIds: string[]): AnalyticsData {
  const [eventsByList, setEventsByList] = useState<Record<string, HistoryEvent[]>>({})
  const [loadedLists, setLoadedLists] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (listIds.length === 0) {
      const t = setTimeout(() => {
        setEventsByList({})
        setLoadedLists(new Set())
      }, 0)
      return () => clearTimeout(t)
    }

    const unsubs = listIds.map((listId) =>
      subscribeToHistory(
        listId,
        (events) => {
          setEventsByList((prev) => ({ ...prev, [listId]: events }))
          setLoadedLists((prev) => new Set([...prev, listId]))
        },
        () => {
          setLoadedLists((prev) => new Set([...prev, listId]))
        },
      ),
    )

    return () => unsubs.forEach((u) => u())
  }, [listIds.join(',')])  // eslint-disable-line react-hooks/exhaustive-deps

  const allEvents = useMemo(
    () => Object.values(eventsByList).flat(),
    [eventsByList],
  )

  const loading = listIds.length > 0 && loadedLists.size < listIds.length

  return {
    mostBought: useMemo(() => mostBought(allEvents), [allEvents]),
    categoryBreakdown: useMemo(() => categoryBreakdown(allEvents), [allEvents]),
    trend: useMemo(() => itemsOverTime(allEvents, 30), [allEvents]),
    totalChecked: allEvents.length,
    loading,
  }
}
