"use client"

import { useEffect, useRef, useState } from "react"
import type { ShowcaseProject } from "@/components/portfolio/showcase-data"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

const GALLERY_INTERVAL_MS = 4000
const FADE_MS = 900

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
  isActiveCategory: boolean
}

export function ShowcaseProjectMedia({ project, isActiveCategory }: ShowcaseProjectMediaProps) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)
  const [isInView, setIsInView] = useState(false)

  const posterUrl = posterForProject(project)
  const showVideo = Boolean(project.video) && !prefersReducedMotion
  const gallery =
    project.gallery && project.gallery.length >= 2 ? project.gallery : null
  const shouldAnimateGallery = Boolean(gallery) && isActiveCategory && isInView

  useEffect(() => {
    const container = mediaRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio >= 0.45)
      },
      { threshold: [0, 0.45, 0.65] }
    )

    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setVideoReady(false)
    const video = videoRef.current
    if (!video || !project.video) return
    video.load()
  }, [project.video, project.id])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !showVideo) return

    const pause = () => {
      video.pause()
    }

    if (!isActiveCategory || !isInView) {
      pause()
      return
    }

    void video.play().catch(() => {})
  }, [showVideo, isActiveCategory, isInView])

  useEffect(() => {
    if (!isActiveCategory) {
      videoRef.current?.pause()
    }
  }, [isActiveCategory])

  const handleVideoReady = () => {
    setVideoReady(true)
  }

  return (
    <div
      ref={mediaRef}
      className="relative aspect-[4/3] overflow-hidden"
    >
      {gallery && !showVideo && (
        <ShowcaseRotatingGallery images={gallery} animate={shouldAnimateGallery} />
      )}

      {!gallery && !showVideo && (
        <div className="absolute inset-0" style={projectThumbnailStyle(project.image)} />
      )}

      {showVideo && (
        <>
          {posterUrl ? (
            <div
              className={cn(
                "absolute inset-0 transition-opacity ease-out",
                videoReady ? "opacity-0" : "opacity-100"
              )}
              style={{
                ...projectThumbnailStyle(posterUrl),
                transitionDuration: `${FADE_MS}ms`,
              }}
              aria-hidden={videoReady}
            />
          ) : (
            <div
              className="absolute inset-0"
              style={projectThumbnailStyle(project.image)}
              aria-hidden={videoReady}
            />
          )}

          <video
            ref={videoRef}
            src={project.video}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity ease-out",
              videoReady ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
            muted
            loop
            playsInline
            preload="auto"
            aria-label={`${project.title} preview`}
            onCanPlayThrough={handleVideoReady}
          />
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
