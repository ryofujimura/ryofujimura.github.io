"use client"

import { DanshariGalleryPreloadFullscreen } from "@/components/danshari/danshari-gallery-preload-ui"
import { DanshariHeader } from "@/components/danshari/header"
import { DanshariLoginForm } from "@/components/danshari/login-form"
import { DanshariProductGrid } from "@/components/danshari/product-grid"
import { useDanshariImagePreload } from "@/lib/danshari/image-preload-context"
import { useDanshariUser } from "@/lib/danshari/user-context"

export default function DanshariHomePage() {
  const { user, isLoading } = useDanshariUser()
  const { imagesReady } = useDanshariImagePreload()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <DanshariLoginForm />
  }

  if (!imagesReady) {
    return <DanshariGalleryPreloadFullscreen />
  }

  return (
    <div className="min-h-screen bg-background">
      <DanshariHeader />
      <main className="max-w-6xl mx-auto px-3 sm:px-4 pt-2 pb-6 sm:pt-4 sm:pb-6">
        <DanshariProductGrid />
      </main>
    </div>
  )
}
