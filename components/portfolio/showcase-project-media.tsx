"use client"

import dynamic from "next/dynamic"
import { useCallback, useEffect, useRef, useState } from "react"
import type { ShowcaseProject } from "@/components/portfolio/showcase-data"
import {
  claimShowcaseVideo,
  releaseShowcaseVideo,
} from "@/components/portfolio/showcase-media-session"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const ShowcaseStlViewer = dynamic(
  () =>
    import("@/components/portfolio/showcase-stl-viewer").then((mod) => mod.ShowcaseStlViewer),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 flex items-center justify-center bg-background/30">
        <span className="font-mono text-[9px] tracking-[0.3em] text-muted-foreground/40 uppercase animate-pulse">
          loading.viewport
        </span>
      </div>
    ),
  }
)

const GALLERY_INTERVAL_MS = 4000
const FADE_MS = 900
const IN_VIEW_RATIO_DESKTOP = 0.55
const IN_VIEW_RATIO_MOBILE = 0.35
const IN_VIEW_DEBOUNCE_MS = 120

function isMediaUrl(value: string) {
  return value.startsWith("/") || value.startsWith("http://") || value.startsWith("https://")
}

function projectThumbnailStyle(image: string): React.CSSProperties {
  if (isMediaUrl(image)) {
    return {
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }
  return { background: image }
}

function posterForProject(project: ShowcaseProject): string | null {
  if (!project.video) return null
  if (project.poster && isMediaUrl(project.poster)) return project.poster
  if (isMediaUrl(project.image)) return project.image
  return null
}

function ShowcaseRotatingGallery({
  images,
  animate,
}: {
  images: string[]
  animate: boolean
}) {
  const [activeIndex, setActiveIndex] = useState(0)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  useEffect(() => {
    if (!animate || prefersReducedMotion || images.length < 2) return

    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length)
    }, GALLERY_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [animate, images, prefersReducedMotion])

  return (
    <div className="absolute inset-0">
      {images.map((src, index) => (
        <div
          key={src}
          className={cn(
            "absolute inset-0 transition-opacity ease-in-out",
            index === activeIndex ? "opacity-100" : "opacity-0"
          )}
          style={{
            ...projectThumbnailStyle(src),
            transitionDuration: `${FADE_MS}ms`,
          }}
          aria-hidden={index !== activeIndex}
        />
      ))}
    </div>
  )
}

type ShowcaseProjectMediaProps = {
  project: ShowcaseProject
  mediaKey: string
  /** When false, posters/videos/STL stay unloaded so hero GSAP can run first. */
  mediaEnabled?: boolean
}

export function ShowcaseProjectMedia({
  project,
  mediaKey,
  mediaEnabled = true,
}: ShowcaseProjectMediaProps) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [mayLoadVideo, setMayLoadVideo] = useState(false)

  const posterUrl = posterForProject(project) ?? (isMediaUrl(project.image) ? project.image : null)
  const hasVideo = Boolean(project.video) && !prefersReducedMotion
  const gallery =
    project.gallery && project.gallery.length >= 2 ? project.gallery : null
  const usesGradientFallback = !isMediaUrl(project.image)

  /** Only decode posters/videos/STL for cards that entered the viewport (avoids mobile jank). */
  const showVisualMedia = mediaEnabled && (isInView || hasBeenInView)

  const shouldLoadVideo = showVisualMedia && isInView && mayLoadVideo && hasVideo

  const shouldAnimateGallery = showVisualMedia && Boolean(gallery) && isInView
  const showStl = showVisualMedia && Boolean(project.stl) && isInView
  const showCheapFallback =
    mediaEnabled && !showVisualMedia && usesGradientFallback && !gallery && !project.stl

  const releaseVideo = useCallback(() => {
    releaseShowcaseVideo(mediaKey)
    setMayLoadVideo(false)
    setVideoReady(false)
    const video = videoRef.current
    if (video) {
      video.pause()
      video.removeAttribute("src")
      video.load()
    }
  }, [mediaKey])

  useEffect(() => {
    const container = mediaRef.current
    if (!container) return

    const inViewRatio =
      window.matchMedia("(max-width: 767px)").matches
        ? IN_VIEW_RATIO_MOBILE
        : IN_VIEW_RATIO_DESKTOP

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible =
          entry.isIntersecting && entry.intersectionRatio >= inViewRatio

        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
          setIsInView(visible)
          if (visible) setHasBeenInView(true)
        }, IN_VIEW_DEBOUNCE_MS)
      },
      { threshold: [0, inViewRatio, 0.75] }
    )

    observer.observe(container)
    return () => {
      observer.disconnect()
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  useEffect(() => {
    if (!mediaEnabled || !isInView || !hasVideo) {
      releaseVideo()
      return
    }

    if (claimShowcaseVideo(mediaKey)) {
      setMayLoadVideo(true)
    } else {
      setMayLoadVideo(false)
    }

    return () => {
      releaseVideo()
    }
  }, [mediaEnabled, isInView, hasVideo, mediaKey, releaseVideo])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoadVideo || !project.video) return

    const src = video.getAttribute("src")
    if (src !== project.video) {
      setVideoReady(false)
      video.src = project.video
      video.load()
    }

    void video.play().catch(() => {})
  }, [shouldLoadVideo, project.video])

  const handleVideoReady = useCallback(() => {
    setVideoReady(true)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoadVideo) return

    const syncReady = () => {
      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        handleVideoReady()
      }
    }

    syncReady()
    video.addEventListener("loadeddata", syncReady)
    video.addEventListener("canplay", syncReady)
    video.addEventListener("playing", syncReady)

    return () => {
      video.removeEventListener("loadeddata", syncReady)
      video.removeEventListener("canplay", syncReady)
      video.removeEventListener("playing", syncReady)
    }
  }, [shouldLoadVideo, handleVideoReady])

  const posterStyle = posterUrl
    ? projectThumbnailStyle(posterUrl)
    : projectThumbnailStyle(project.image)

  return (
    <div
      ref={mediaRef}
      className="relative block w-full aspect-[3/4] overflow-hidden leading-none select-none"
      onContextMenu={(event) => event.preventDefault()}
    >
      {(!mediaEnabled || (!showVisualMedia && !showCheapFallback)) && (
        <div className="absolute inset-0 bg-muted animate-pulse" aria-hidden />
      )}

      {showCheapFallback && (
        <div className="absolute inset-0" style={projectThumbnailStyle(project.image)} aria-hidden />
      )}

      {showVisualMedia && project.stl && !showStl && (
        <div className="absolute inset-0" style={projectThumbnailStyle(project.image)} />
      )}

      {showStl && project.stl && <ShowcaseStlViewer url={project.stl} />}

      {showVisualMedia && gallery && !hasVideo && !project.stl && (
        <ShowcaseRotatingGallery images={gallery} animate={shouldAnimateGallery} />
      )}

      {showVisualMedia && !gallery && !hasVideo && !project.stl && (
        <div className="absolute inset-0" style={projectThumbnailStyle(project.image)} />
      )}

      {showVisualMedia && hasVideo && (
        <>
          <div
            className={cn(
              "absolute inset-0 transition-opacity ease-out",
              shouldLoadVideo && videoReady ? "opacity-0" : "opacity-100"
            )}
            style={{ ...posterStyle, transitionDuration: `${FADE_MS}ms` }}
            aria-hidden={shouldLoadVideo && videoReady}
          />

          {shouldLoadVideo && project.video && (
            <video
              ref={videoRef}
              className={cn(
                "absolute inset-0 h-full w-full object-cover transition-opacity ease-out",
                videoReady ? "opacity-100" : "opacity-0"
              )}
              style={{ transitionDuration: `${FADE_MS}ms` }}
              muted
              loop
              playsInline
              preload="metadata"
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(event) => event.preventDefault()}
              aria-label={`${project.title} preview`}
              onLoadedData={handleVideoReady}
              onCanPlay={handleVideoReady}
              onPlaying={handleVideoReady}
            />
          )}
        </>
      )}

      <div
        className="absolute inset-0 bg-gradient-to-t from-background/70 via-background/20 to-transparent pointer-events-none"
        aria-hidden
      />

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 sm:p-8 text-center pointer-events-none">
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] mb-3 sm:mb-4 text-foreground opacity-70">
          {project.tag}
        </p>
        <h3 className="font-mono text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase text-foreground opacity-70 leading-[0.95] max-w-[90%]">
          {project.title}
        </h3>
      </div>
    </div>
  )
}
