import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import type { Category, ItemDoc, HistoryEvent } from './types'

function itemsRef(listId: string) {
  return collection(db, 'lists', listId, 'items')
}

function historyRef(listId: string) {
  return collection(db, 'lists', listId, 'history')
}

export async function addItem(
  listId: string,
  createdBy: string,
  name: string,
  quantity: number,
  category: Category,
): Promise<void> {
  await addDoc(itemsRef(listId), {
    name: name.trim(),
    quantity,
    checked: false,
    category,
    createdBy,
    createdAt: serverTimestamp(),
  })
}

export async function toggleChecked(
  listId: string,
  item: ItemDoc,
  checkedBy: string,
): Promise<void> {
  const nowChecked = !item.checked
  await updateDoc(doc(db, 'lists', listId, 'items', item.id), {
    checked: nowChecked,
    checkedAt: nowChecked ? serverTimestamp() : null,
  })

  if (nowChecked) {
    const event: Omit<HistoryEvent, 'id'> = {
      itemName: item.name,
      category: item.category,
      quantity: item.quantity,
      checkedAt: serverTimestamp() as HistoryEvent['checkedAt'],
      checkedBy,
    }
    if (item.price !== undefined) (event as Record<string, unknown>).price = item.price
    await addDoc(historyRef(listId), event)
  }
}

export async function setQuantity(listId: string, itemId: string, quantity: number): Promise<void> {
  await updateDoc(doc(db, 'lists', listId, 'items', itemId), { quantity })
}

export async function setCategory(
  listId: string,
  itemId: string,
  category: Category,
): Promise<void> {
  await updateDoc(doc(db, 'lists', listId, 'items', itemId), { category })
}

export async function deleteItem(listId: string, itemId: string): Promise<void> {
  await deleteDoc(doc(db, 'lists', listId, 'items', itemId))
}

export function subscribeToItems(
  listId: string,
  onChange: (items: ItemDoc[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(itemsRef(listId), orderBy('createdAt', 'asc'))
  return onSnapshot(
    q,
    (snap) => {
      const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ItemDoc)
      onChange(items)
    },
    onError,
  )
}
