import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  databaseURL: 'https://grabngo-339fa-default-rtdb.asia-southeast1.firebasedatabase.app/',
}

const app = initializeApp(firebaseConfig)
export const db = getDatabase(app)
