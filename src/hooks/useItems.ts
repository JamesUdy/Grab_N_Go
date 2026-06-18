// stub — fully replaced in Phase 3 (Firestore data layer)
export interface GroceryItem {
  id: string
  name: string
  quantity: string
}

export function useItems() {
  return {
    items: [] as GroceryItem[],
    addItem: (_name: string, _quantity: string) => {},
    removeItem: (_id: string) => {},
  }
}
