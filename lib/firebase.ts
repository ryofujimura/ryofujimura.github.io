import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics } from "firebase/analytics"
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  type Firestore,
  type DocumentReference 
} from "firebase/firestore"
import type { VisitorData } from "./visitor-data"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

let analytics: Analytics | null = null
let firestore: Firestore | null = null

export function getFirebaseApp(): FirebaseApp | null {
  if (typeof window === "undefined") return null
  if (getApps().length === 0) initializeApp(firebaseConfig)
  return getApps()[0] as FirebaseApp
}

export function getFirebaseAnalytics(): Analytics | null {
  if (typeof window === "undefined") return null
  if (analytics) return analytics
  const app = getFirebaseApp()
  if (!app) return null
  analytics = getAnalytics(app)
  return analytics
}

export function getFirebaseFirestore(): Firestore | null {
  if (typeof window === "undefined") return null
  if (firestore) return firestore
  const app = getFirebaseApp()
  if (!app) return null
  firestore = getFirestore(app)
  return firestore
}

// Collection names
export const COLLECTIONS = {
  VISITORS: "visitors",           // User device/browser information
  CONTACT_MESSAGES: "messages",   // Contact form messages
} as const

// Message data structure
export interface ContactMessage {
  message: string
  visitorId: string              // Reference to visitor document
  sentAt: ReturnType<typeof serverTimestamp>
  status: "new" | "read" | "replied"
}

// Store visitor data and return the document ID
export async function storeVisitorData(
  visitorData: VisitorData
): Promise<DocumentReference | null> {
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.VISITORS), {
      ...visitorData,
      createdAt: serverTimestamp(),
    })
    return docRef
  } catch (error) {
    console.error("Error storing visitor data:", error)
    return null
  }
}

// Store contact message with reference to visitor
export async function storeContactMessage(
  message: string,
  visitorId: string
): Promise<DocumentReference | null> {
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), {
      message,
      visitorId,
      sentAt: serverTimestamp(),
      status: "new",
    })
    return docRef
  } catch (error) {
    console.error("Error storing contact message:", error)
    return null
  }
}

// Combined function to store visitor and message together
export async function submitContactForm(
  message: string,
  visitorData: VisitorData
): Promise<{ success: boolean; visitorId?: string; messageId?: string }> {
  try {
    // First store visitor data
    const visitorRef = await storeVisitorData(visitorData)
    if (!visitorRef) {
      return { success: false }
    }

    // Then store the message with reference to visitor
    const messageRef = await storeContactMessage(message, visitorRef.id)
    if (!messageRef) {
      return { success: false }
    }

    return {
      success: true,
      visitorId: visitorRef.id,
      messageId: messageRef.id,
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false }
  }
}
