"use client"

import { useEffect, useState } from "react"
import { ensureProductsLoaded, subscribeProducts } from "@/lib/danshari/store"
import type { Product } from "@/lib/danshari/types"
import { DanshariProductCard } from "./product-card"

export function DanshariProductGrid() {
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

  if (isLoading) {
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

  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No products yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {products.map((product) => (
        <DanshariProductCard key={product.uid} product={product} />
      ))}
    </div>
  )
}
