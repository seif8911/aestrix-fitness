// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'
import { firebaseConfig } from './firebase-env'

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const storage = getStorage(app)
const auth = getAuth(app)

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  console.error("Offline persistence error:", err)
})

export { app, db, storage, auth }