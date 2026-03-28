"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

type DanshariMediaProps = {
  src: string
  alt: string
  className?: string
  /** When true, fills parent (parent must be `relative` with size). */
  fill?: boolean
  /**
   * Full image at natural aspect ratio (object-contain). Ignores `fill`.
   * Use on product detail so tall/wide photos are not cropped to a box.
   */
  preserveAspect?: boolean
  sizes?: string
  priority?: boolean
}

function isInlineSrc(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:")
}

/** Renders Next/Image for remote/path URLs, native img for data/blob (IndexedDB-backed uploads). */
const naturalImgClass =
  "block w-full h-auto max-h-[min(85vh,1600px)] object-contain mx-auto"

export function DanshariMedia({
  src,
  alt,
  className,
  fill,
  preserveAspect,
  sizes,
  priority,
}: DanshariMediaProps) {
  if (!src) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground text-xs",
          fill && !preserveAspect && "absolute inset-0 size-full",
          preserveAspect && "min-h-32 w-full rounded-2xl",
          className
        )}
      >
        No image
      </div>
    )
  }

  if (preserveAspect) {
    if (isInlineSrc(src)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- data URLs for admin uploads
        <img
          src={src}
          alt={alt}
          className={cn(naturalImgClass, className)}
        />
      )
    }
    return (
      <Image
        src={src}
        alt={alt}
        width={2400}
        height={2400}
        className={cn(naturalImgClass, className)}
        style={{ width: "100%", height: "auto" }}
        sizes={sizes ?? "(max-width: 768px) 100vw, 672px"}
        priority={priority}
      />
    )
  }

  if (isInlineSrc(src)) {
    if (fill) {
      return (
        // eslint-disable-next-line @next/next/no-img-element -- data URLs for admin uploads
        <img
          src={src}
          alt={alt}
          decoding="async"
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
      loading={priority ? undefined : "lazy"}
    />
  )
}
