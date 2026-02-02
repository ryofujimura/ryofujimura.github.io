import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics } from "firebase/analytics"
import { 
  getFirestore, 
  collection, 
  addDoc, 
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp, 
  increment,
  type Firestore,
  type DocumentReference,
  type Timestamp
} from "firebase/firestore"

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
  USERS: "users",               // Username-based user documents
  MESSAGES: "messages",         // Contact messages
} as const

// User document structure
export interface UserDocument {
  username: string
  messageCount: number
  firstMessageAt: ReturnType<typeof serverTimestamp>
  lastMessageAt: ReturnType<typeof serverTimestamp>
}

// Message document structure  
export interface MessageDocument {
  username: string
  message: string
  sentAt: ReturnType<typeof serverTimestamp>
  status: "new" | "read" | "replied"
}

/**
 * Get or create a user by username
 * Username is used as the document ID for easy lookup
 */
export async function getOrCreateUser(username: string): Promise<string | null> {
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const userRef = doc(db, COLLECTIONS.USERS, username)
    const userSnap = await getDoc(userRef)

    if (userSnap.exists()) {
      // User exists, update last message time
      await updateDoc(userRef, {
        lastMessageAt: serverTimestamp(),
        messageCount: increment(1),
      })
      return username
    } else {
      // Create new user
      await setDoc(userRef, {
        username,
        messageCount: 1,
        firstMessageAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
      })
      return username
    }
  } catch (error) {
    console.error("Error getting/creating user:", error)
    return null
  }
}

/**
 * Store a message linked to a username
 */
export async function storeMessage(
  username: string,
  message: string
): Promise<DocumentReference | null> {
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
      username,
      message,
      sentAt: serverTimestamp(),
      status: "new",
    })
    return docRef
  } catch (error) {
    console.error("Error storing message:", error)
    return null
  }
}

/**
 * Submit contact form with username and message
 */
export async function submitContactForm(
  username: string,
  message: string
): Promise<{ success: boolean; messageId?: string }> {
  try {
    // Get or create user
    const userId = await getOrCreateUser(username)
    if (!userId) {
      return { success: false }
    }

    // Store the message
    const messageRef = await storeMessage(username, message)
    if (!messageRef) {
      return { success: false }
    }

    return {
      success: true,
      messageId: messageRef.id,
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false }
  }
}

// Fetched message structure (with resolved timestamp)
export interface FetchedMessage {
  id: string
  username: string
  message: string
  sentAt: Date | null
  status: "new" | "read" | "replied"
}

/**
 * Fetch recent messages from Firestore
 * @param maxMessages - Maximum number of messages to fetch (default 20)
 */
export async function fetchRecentMessages(
  maxMessages: number = 20
): Promise<FetchedMessage[]> {
  const db = getFirebaseFirestore()
  if (!db) return []

  try {
    const messagesRef = collection(db, COLLECTIONS.MESSAGES)
    const q = query(
      messagesRef,
      orderBy("sentAt", "desc"),
      limit(maxMessages)
    )
    
    const snapshot = await getDocs(q)
    const messages: FetchedMessage[] = []
    
    snapshot.forEach((doc) => {
      const data = doc.data()
      messages.push({
        id: doc.id,
        username: data.username || "Anonymous",
        message: data.message || "",
        sentAt: data.sentAt ? (data.sentAt as Timestamp).toDate() : null,
        status: data.status || "new",
      })
    })
    
    return messages
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}
