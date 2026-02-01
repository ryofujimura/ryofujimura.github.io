import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics } from "firebase/analytics"
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query,
  where,
  getDocs,
  orderBy,
  limit,
  type Firestore,
  type DocumentReference 
} from "firebase/firestore"
import type { VisitorData, ParsedContactInfo } from "./visitor-data"

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
  CONTACTS: "contacts",           // Parsed contact information
} as const

// Message data structure
export interface ContactMessage {
  message: string
  visitorId: string              // Reference to visitor document
  visitorUUID: string            // Persistent visitor UUID for matching
  contactId?: string             // Reference to parsed contact doc
  sentAt: ReturnType<typeof serverTimestamp>
  status: "new" | "read" | "replied"
}

// Contact data structure (parsed from message)
export interface ContactDocument {
  // Extracted info
  name?: string
  email?: string
  phone?: string
  social?: { platform: string; handle: string }[]
  topics?: string[]
  
  // Links
  visitorUUIDs: string[]         // All visitor UUIDs linked to this contact
  messageIds: string[]           // All message IDs from this contact
  
  // Timestamps
  firstContact: ReturnType<typeof serverTimestamp>
  lastContact: ReturnType<typeof serverTimestamp>
  
  // Status
  messageCount: number
  isVerified: boolean            // Manual verification flag
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
  visitorId: string,
  visitorUUID: string,
  contactId?: string
): Promise<DocumentReference | null> {
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    // Build message doc, only include contactId if it exists
    const messageDoc: Record<string, unknown> = {
      message,
      visitorId,
      visitorUUID,
      sentAt: serverTimestamp(),
      status: "new",
    }
    
    // Only add contactId if it's defined (Firestore doesn't accept undefined)
    if (contactId) {
      messageDoc.contactId = contactId
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.CONTACT_MESSAGES), messageDoc)
    return docRef
  } catch (error) {
    console.error("Error storing contact message:", error)
    return null
  }
}

// Store or update parsed contact information
export async function storeOrUpdateContact(
  parsedContact: ParsedContactInfo,
  visitorUUID: string,
  messageId: string
): Promise<DocumentReference | null> {
  const db = getFirebaseFirestore()
  if (!db) return null

  try {
    // Try to find existing contact by email (most reliable identifier)
    let existingContact: DocumentReference | null = null
    
    if (parsedContact.email) {
      const q = query(
        collection(db, COLLECTIONS.CONTACTS),
        where("email", "==", parsedContact.email),
        limit(1)
      )
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        existingContact = snapshot.docs[0].ref
      }
    }
    
    // If no email match, try visitorUUID
    if (!existingContact) {
      const q = query(
        collection(db, COLLECTIONS.CONTACTS),
        where("visitorUUIDs", "array-contains", visitorUUID),
        limit(1)
      )
      const snapshot = await getDocs(q)
      if (!snapshot.empty) {
        existingContact = snapshot.docs[0].ref
      }
    }
    
    if (existingContact) {
      // Update existing contact - would need updateDoc
      // For now, just return the existing reference
      // In production, you'd update messageIds, lastContact, etc.
      return existingContact
    }
    
    // Create new contact document
    const contactDoc = {
      name: parsedContact.name,
      email: parsedContact.email,
      phone: parsedContact.phone,
      social: parsedContact.social,
      topics: parsedContact.topics,
      visitorUUIDs: [visitorUUID],
      messageIds: [messageId],
      firstContact: serverTimestamp(),
      lastContact: serverTimestamp(),
      messageCount: 1,
      isVerified: false,
    }
    
    const docRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), contactDoc)
    return docRef
  } catch (error) {
    console.error("Error storing contact:", error)
    return null
  }
}

// Find previous visits from same visitor
export async function findPreviousVisits(
  visitorUUID: string,
  maxResults = 10
): Promise<{ visitCount: number; lastVisit?: string; fingerprints: string[] }> {
  const db = getFirebaseFirestore()
  if (!db) return { visitCount: 0, fingerprints: [] }

  try {
    const q = query(
      collection(db, COLLECTIONS.VISITORS),
      where("identity.visitorUUID", "==", visitorUUID),
      orderBy("createdAt", "desc"),
      limit(maxResults)
    )
    
    const snapshot = await getDocs(q)
    const fingerprints = snapshot.docs.map(doc => doc.data().fingerprint as string)
    const lastVisit = snapshot.docs[0]?.data().visitTimestamp as string | undefined
    
    return {
      visitCount: snapshot.size,
      lastVisit,
      fingerprints: [...new Set(fingerprints)], // Unique fingerprints
    }
  } catch (error) {
    console.error("Error finding previous visits:", error)
    return { visitCount: 0, fingerprints: [] }
  }
}

// Combined function to store visitor and message together
export async function submitContactForm(
  message: string,
  visitorData: VisitorData,
  parsedContact?: ParsedContactInfo
): Promise<{ 
  success: boolean
  visitorId?: string
  messageId?: string
  contactId?: string
  isReturningVisitor?: boolean
}> {
  try {
    const visitorUUID = visitorData.identity.visitorUUID
    
    // First store visitor data
    const visitorRef = await storeVisitorData(visitorData)
    if (!visitorRef) {
      return { success: false }
    }

    // Store the message with reference to visitor
    const messageRef = await storeContactMessage(
      message, 
      visitorRef.id, 
      visitorUUID
    )
    if (!messageRef) {
      return { success: false }
    }
    
    // Store parsed contact info if available
    let contactId: string | undefined
    if (parsedContact && (parsedContact.email || parsedContact.name || parsedContact.phone)) {
      const contactRef = await storeOrUpdateContact(
        parsedContact,
        visitorUUID,
        messageRef.id
      )
      contactId = contactRef?.id
    }

    return {
      success: true,
      visitorId: visitorRef.id,
      messageId: messageRef.id,
      contactId,
      isReturningVisitor: visitorData.identity.isReturning,
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)
    return { success: false }
  }
}
