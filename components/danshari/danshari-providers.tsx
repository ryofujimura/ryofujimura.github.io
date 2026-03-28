"use client"

import type { ReactNode } from "react"
import { DanshariUserProvider } from "@/lib/danshari/user-context"

export function DanshariProviders({ children }: { children: ReactNode }) {
  return <DanshariUserProvider>{children}</DanshariUserProvider>
}
