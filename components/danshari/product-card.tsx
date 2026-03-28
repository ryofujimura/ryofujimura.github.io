"use client"

import Link from "next/link"
import Image from "next/image"
import { danshariProductHref } from "@/lib/danshari/paths"
import type { Product } from "@/lib/danshari/types"
import { Hand } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function DanshariProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={danshariProductHref(product.uid)}
      className="group block bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {product.claimant && (
          <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Hand className="w-3 h-3" />
            Claimed
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-foreground line-clamp-1 text-sm sm:text-base">
          {product.title}
        </h3>
        <span className="inline-block mt-1 text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
          {product.tag}
        </span>
      </div>
    </Link>
  )
}
