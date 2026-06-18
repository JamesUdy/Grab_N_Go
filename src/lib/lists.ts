import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore'
import type { Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import type { ListDoc } from './types'

function makeShareCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

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

export async function generateShareCode(listId: string): Promise<string> {
  const code = makeShareCode()
  await updateDoc(doc(db, 'lists', listId), { shareCode: code, updatedAt: serverTimestamp() })
  return code
}

export async function joinByShareCode(
  code: string,
  uid: string,
  displayName: string | null,
  photoURL: string | null,
): Promise<string> {
  const snap = await getDocs(query(listsRef, where('shareCode', '==', code.toUpperCase().trim())))
  if (snap.empty) throw new Error('Invalid share code.')
  const docSnap = snap.docs[0]
  const data = docSnap.data() as ListDoc
  if (data.memberUids.includes(uid)) return docSnap.id
  await updateDoc(docSnap.ref, {
    memberUids: arrayUnion(uid),
    [`members.${uid}`]: { role: 'editor', displayName, photoURL },
    updatedAt: serverTimestamp(),
  })
  return docSnap.id
}

export async function removeCollaborator(listId: string, uid: string): Promise<void> {
  const ref = doc(db, 'lists', listId)
  await updateDoc(ref, {
    memberUids: arrayRemove(uid),
    [`members.${uid}`]: null,
    updatedAt: serverTimestamp(),
  })
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
