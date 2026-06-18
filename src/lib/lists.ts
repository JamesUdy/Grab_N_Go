import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import type { ListDoc } from './types'

const listsRef = collection(db, 'lists')

export async function createList(ownerUid: string, name: string): Promise<string> {
  const ref = await addDoc(listsRef, {
    name: name.trim(),
    ownerUid,
    memberUids: [ownerUid],
    members: {
      [ownerUid]: { role: 'owner', displayName: null, photoURL: null },
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function renameList(listId: string, name: string): Promise<void> {
  await updateDoc(doc(db, 'lists', listId), { name: name.trim(), updatedAt: serverTimestamp() })
}

export async function deleteList(listId: string): Promise<void> {
  await deleteDoc(doc(db, 'lists', listId))
}

export function subscribeToUserLists(
  uid: string,
  onChange: (lists: ListDoc[]) => void,
  onError: (err: Error) => void,
): Unsubscribe {
  const q = query(listsRef, where('memberUids', 'array-contains', uid))
  return onSnapshot(
    q,
    (snap) => {
      const lists = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ListDoc)
      lists.sort((a, b) => {
        const ta = a.createdAt?.toMillis?.() ?? 0
        const tb = b.createdAt?.toMillis?.() ?? 0
        return ta - tb
      })
      onChange(lists)
    },
    onError,
  )
}
