"use client"

import { useDanshariUser } from "@/lib/danshari/user-context"
import { DanshariLoginForm } from "@/components/danshari/login-form"
import { DanshariHeader } from "@/components/danshari/header"
import { DanshariProductGrid } from "@/components/danshari/product-grid"

export default function DanshariHomePage() {
  const { user, isLoading } = useDanshariUser()

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

  return (
    <div className="min-h-screen bg-background">
      <DanshariHeader />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
          Available Items
        </h1>
        <DanshariProductGrid />
      </main>
    </div>
  )
}
