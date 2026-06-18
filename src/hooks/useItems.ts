import { useEffect, useState } from 'react'
import { ref, push, remove, onValue } from 'firebase/database'
import { db } from '../lib/firebase'

export interface GroceryItem {
  id: string
  name: string
  quantity: string
}

const itemsRef = ref(db, 'itemsList')

export function useItems() {
  const [items, setItems] = useState<GroceryItem[]>([])

  useEffect(() => {
    const unsubscribe = onValue(itemsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, [string, string]>
        setItems(
          Object.entries(data).map(([id, val]) => ({
            id,
            name: val[0],
            quantity: val[1],
          }))
        )
      } else {
        setItems([])
      }
    })
    return unsubscribe
  }, [])

  function addItem(name: string, quantity: string) {
    push(itemsRef, [name, quantity])
  }

  function removeItem(id: string) {
    remove(ref(db, `itemsList/${id}`))
  }

  return { items, addItem, removeItem }
}
