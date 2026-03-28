"use client"

import type { ReactNode } from "react"
import { DanshariImagePreloadProvider } from "@/lib/danshari/image-preload-context"
import { DanshariUserProvider } from "@/lib/danshari/user-context"

export function DanshariProviders({ children }: { children: ReactNode }) {
  return (
    <DanshariUserProvider>
      <DanshariImagePreloadProvider>{children}</DanshariImagePreloadProvider>
    </DanshariUserProvider>
  )
}
