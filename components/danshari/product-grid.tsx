"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ensureProductsLoaded, subscribeProducts } from "@/lib/danshari/store"
import type { Product } from "@/lib/danshari/types"
import { danshariHref, danshariTagFilterHref } from "@/lib/danshari/paths"
import { DanshariProductCard } from "./product-card"
import { cn } from "@/lib/utils"

function DanshariProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-card rounded-2xl overflow-hidden animate-pulse"
        >
          <div className="aspect-square bg-muted" />
          <div className="p-3">
            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
            <div className="h-5 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

function DanshariProductGridInner() {
  const searchParams = useSearchParams()
  const activeTag = searchParams.get("tag")?.trim() || null

  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsub = subscribeProducts((list) => {
      setProducts(list)
      setIsLoading(false)
    })
    void ensureProductsLoaded().catch(() => {
      setProducts([])
      setIsLoading(false)
    })
    return unsub
  }, [])

  const allTags = useMemo(() => {
    const s = new Set<string>()
    for (const p of products) {
      for (const t of p.tags) {
        if (t.trim()) s.add(t)
      }
    }
    return [...s].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }))
  }, [products])

  const filtered = useMemo(() => {
    if (!activeTag) return products
    return products.filter((p) => p.tags.includes(activeTag))
  }, [products, activeTag])

  if (isLoading) {
    return <DanshariProductGridSkeleton />
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No products yet.</p>
      </div>
    )
  }

  return (
    <>
      {allTags.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Filter by tag
          </span>
          <Link
            href={danshariHref()}
            className={cn(
              "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              !activeTag
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-foreground",
            )}
            scroll={false}
          >
            All
          </Link>
          {allTags.map((t) => (
            <Link
              key={t}
              href={danshariTagFilterHref(t)}
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                activeTag === t
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-primary/15 hover:text-foreground",
              )}
              scroll={false}
            >
              {t}
            </Link>
          ))}
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground space-y-3">
          <p>No items with tag &quot;{activeTag}&quot;.</p>
          <Link
            href={danshariHref()}
            className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Show all items
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((product) => (
            <DanshariProductCard
              key={product.uid}
              product={product}
              activeTag={activeTag}
            />
          ))}
        </div>
      )}
    </>
  )
}

export function DanshariProductGrid() {
  return (
    <Suspense fallback={<DanshariProductGridSkeleton />}>
      <DanshariProductGridInner />
    </Suspense>
  )
}
