"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { danshariHref } from "@/lib/danshari/paths"
import { useDanshariUser } from "@/lib/danshari/user-context"
import { DanshariProductManager } from "@/components/danshari/danshari-product-manager"

export default function DanshariAdminPage() {
  const router = useRouter()
  const { user, isLoading } = useDanshariUser()

  useEffect(() => {
    if (isLoading) return
    if (!user || !user.is_admin) {
      router.replace(danshariHref())
    }
  }, [user, isLoading, router])

  if (isLoading || !user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <DanshariProductManager />
}
