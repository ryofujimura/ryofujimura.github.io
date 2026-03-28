"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type DanshariMediaProps = {
  src: string
  alt: string
  className?: string
  /** When true, fills parent (parent must be `relative` with size). */
  fill?: boolean
  sizes?: string
  priority?: boolean
}

function isInlineSrc(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:")
}

/** Renders Next/Image for remote/path URLs, native img for data/blob (IndexedDB-backed uploads). */
export function DanshariMedia({
  src,
  alt,
  className,
  fill,
  sizes,
  priority,
}: DanshariMediaProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground text-xs",
          fill && "absolute inset-0 size-full",
          className
        )}
      >
        No image
      </div>
    )
  }

  if (isInlineSrc(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- data URLs for admin uploads
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 size-full object-cover", className)}
        />
      )
    }
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      className={cn(fill && "object-cover", className)}
      sizes={sizes}
      priority={priority}
    />
  )
}
