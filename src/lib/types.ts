import type { Timestamp } from 'firebase/firestore'

export const CATEGORIES = [
  'Produce',
  'Dairy',
  'Bakery',
  'Meat & Seafood',
  'Frozen',
  'Pantry',
  'Beverages',
  'Snacks',
  'Household',
  'Personal Care',
  'Other',
] as const

export type Category = (typeof CATEGORIES)[number]

export interface UserDoc {
  displayName: string | null
  email: string | null
  photoURL: string | null
  createdAt: Timestamp
  defaultListId?: string
}

export interface ListDoc {
  id: string
  name: string
  ownerUid: string
  memberUids: string[]
  members: Record<string, { role: 'owner' | 'editor'; displayName: string | null; photoURL: string | null }>
  color?: string
  icon?: string
  shareCode?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ItemDoc {
  id: string
  name: string
  quantity: number
  unit?: string
  checked: boolean
  category: Category
  price?: number
  createdBy: string
  createdAt: Timestamp
  checkedAt?: Timestamp
  order?: number
}

export interface HistoryEvent {
  id: string
  itemName: string
  category: Category
  quantity: number
  price?: number
  checkedAt: Timestamp
  checkedBy: string
}
