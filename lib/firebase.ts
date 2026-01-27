import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getAnalytics, type Analytics } from "firebase/analytics"

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
