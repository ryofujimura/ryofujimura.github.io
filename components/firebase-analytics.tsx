"use client"

import { useEffect } from "react"
import { getFirebaseAnalytics } from "@/lib/firebase"

export function FirebaseAnalytics() {
  useEffect(() => {
    getFirebaseAnalytics()
  }, [])
  return null
}
