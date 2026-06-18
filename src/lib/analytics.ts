import type { HistoryEvent, Category } from './types'

export interface MostBoughtEntry {
  name: string
  count: number
}

export interface CategoryBreakdownEntry {
  category: Category
  count: number
}

export interface TrendPoint {
  date: string
  count: number
}

export function mostBought(events: HistoryEvent[], topN = 8): MostBoughtEntry[] {
  const counts: Record<string, number> = {}
  for (const e of events) {
    counts[e.itemName] = (counts[e.itemName] ?? 0) + e.quantity
  }
  return Object.entries(counts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, topN)
}

export function categoryBreakdown(events: HistoryEvent[]): CategoryBreakdownEntry[] {
  const counts: Partial<Record<Category, number>> = {}
  for (const e of events) {
    counts[e.category] = (counts[e.category] ?? 0) + 1
  }
  return (Object.entries(counts) as [Category, number][])
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
}

export function itemsOverTime(events: HistoryEvent[], days = 30): TrendPoint[] {
  const now = Date.now()
  const msPerDay = 86_400_000
  const buckets: Record<string, number> = {}

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now - i * msPerDay)
    buckets[isoDate(d)] = 0
  }

  for (const e of events) {
    const ms = e.checkedAt?.toMillis?.()
    if (!ms) continue
    if (now - ms > days * msPerDay) continue
    const key = isoDate(new Date(ms))
    if (key in buckets) buckets[key] += 1
  }

  return Object.entries(buckets).map(([date, count]) => ({ date, count }))
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}
