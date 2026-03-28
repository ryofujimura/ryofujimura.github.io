"use client"

import Image from "next/image"
import { useCallback, useState } from "react"
import { useInViewOnce } from "@/hooks/use-in-view-once"
import { cn } from "@/lib/utils"

export type DanshariProductImageMode = "thumb" | "hero" | "contain" | "adminPreview"

export type DanshariProductImageProps = {
  mode: DanshariProductImageMode
  src: string
  alt: string
  className?: string
  sizes?: string
  srcSet?: string
  placeholderSrc?: string | null
  viewportGate?: boolean
  viewportRootMargin?: string
  deferDecode?: boolean
}

function isInlineSrc(src: string) {
  return src.startsWith("data:") || src.startsWith("blob:")
}

const naturalContainClass =
  "block w-full h-auto max-h-[min(85vh,1600px)] object-contain mx-auto"

function ThumbPlaceholder() {
  return (
    <div
      className="absolute inset-0 bg-muted motion-safe:animate-pulse"
      aria-hidden
    />
  )
}

export function DanshariProductImage({
  mode,
  src,
  alt,
  className,
  sizes = "(max-width: 640px) 50vw, 25vw",
  srcSet,
  placeholderSrc,
  viewportGate,
  viewportRootMargin = "100px",
  deferDecode = false,
}: DanshariProductImageProps) {
  const [loaded, setLoaded] = useState(false)
  const onLoad = useCallback(() => setLoaded(true), [])

  const useIo = mode === "thumb" && viewportGate !== false
  const { ref: ioRef, visible: ioVisible } = useInViewOnce(viewportRootMargin)

  const pastGate = !useIo || ioVisible
  const showPixels = pastGate && !deferDecode

  const fadeImg = cn(
    "transition-opacity duration-300",
    loaded ? "opacity-100" : "opacity-0",
  )

  if (!src.trim()) {
    return (
      <div
        className={cn(
          "bg-muted flex items-center justify-center text-muted-foreground text-xs",
          mode === "thumb" && "absolute inset-0 size-full",
          mode === "adminPreview" && "absolute inset-0 size-full",
          className,
        )}
      >
        {mode === "adminPreview" ? null : "No image"}
      </div>
    )
  }

  if (mode === "adminPreview") {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- admin local previews
      <img
        src={src}
        alt={alt}
        decoding="async"
        loading="eager"
        className={cn("absolute inset-0 size-full object-cover", className)}
      />
    )
  }

  if (mode === "hero" || mode === "contain") {
    const isHero = mode === "hero"
    if (isInlineSrc(src)) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={cn(naturalContainClass, className)}
        />
      )
    }
    return (
      <div className={cn("relative", !loaded && "min-h-[12rem]")}>
        {placeholderSrc && !loaded ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={placeholderSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full max-h-[min(85vh,1600px)] object-contain mx-auto blur-2xl scale-105 opacity-50 pointer-events-none"
          />
        ) : null}
        <Image
          src={src}
          alt={alt}
          width={2400}
          height={2400}
          className={cn(
            naturalContainClass,
            fadeImg,
            className,
          )}
          style={{ width: "100%", height: "auto" }}
          sizes={sizes}
          priority={isHero}
          fetchPriority={isHero ? "high" : undefined}
          decoding="async"
          onLoad={onLoad}
        />
      </div>
    )
  }

  // thumb
  const remoteThumb = !isInlineSrc(src) && showPixels
  const wrapClass = cn("relative size-full overflow-hidden", className)

  return (
    <div ref={useIo ? ioRef : undefined} className={wrapClass}>
      {!showPixels ? <ThumbPlaceholder /> : null}
      {showPixels && placeholderSrc && !loaded ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={placeholderSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 size-full object-cover blur-xl scale-110 opacity-60 pointer-events-none"
        />
      ) : null}
      {remoteThumb && srcSet ? (
        // eslint-disable-next-line @next/next/no-img-element -- srcSet + static export
        <img
          src={src}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
          className={cn("absolute inset-0 size-full object-cover", fadeImg)}
        />
      ) : null}
      {remoteThumb && !srcSet ? (
        <Image
          src={src}
          alt={alt}
          fill
          className={cn("object-cover", fadeImg)}
          sizes={sizes}
          loading="lazy"
          decoding="async"
          onLoad={onLoad}
        />
      ) : null}
      {showPixels && isInlineSrc(src) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          decoding="async"
          loading="lazy"
          onLoad={onLoad}
          className={cn("absolute inset-0 size-full object-cover", fadeImg)}
        />
      ) : null}
    </div>
  )
}
