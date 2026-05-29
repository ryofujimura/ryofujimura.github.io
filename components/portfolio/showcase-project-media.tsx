"use client"

import { useEffect, useRef, useState } from "react"
import type { ShowcaseProject } from "@/components/portfolio/showcase-data"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

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

type ShowcaseProjectMediaProps = {
  project: ShowcaseProject
  isActiveCategory: boolean
}

export function ShowcaseProjectMedia({ project, isActiveCategory }: ShowcaseProjectMediaProps) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [videoReady, setVideoReady] = useState(false)

  const posterUrl = posterForProject(project)
  const showVideo = Boolean(project.video) && !prefersReducedMotion

  useEffect(() => {
    setVideoReady(false)
    const video = videoRef.current
    if (!video || !project.video) return
    video.load()
  }, [project.video, project.id])

  useEffect(() => {
    const video = videoRef.current
    const container = mediaRef.current
    if (!video || !container || !showVideo) return

    const pause = () => {
      video.pause()
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!isActiveCategory) {
          pause()
          return
        }
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          void video.play().catch(() => {})
        } else {
          pause()
        }
      },
      { threshold: [0, 0.45, 0.65] }
    )

    observer.observe(container)
    return () => {
      observer.disconnect()
      pause()
    }
  }, [showVideo, isActiveCategory])

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
      className={cn(
        "relative aspect-[4/3] overflow-hidden transition-transform duration-500 ease-out",
        "group-hover:scale-[1.02]"
      )}
    >
      {!showVideo && (
        <div className="absolute inset-0" style={projectThumbnailStyle(project.image)} />
      )}

      {showVideo && (
        <>
          {posterUrl ? (
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-out",
                videoReady ? "opacity-0" : "opacity-100"
              )}
              style={projectThumbnailStyle(posterUrl)}
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
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out",
              videoReady ? "opacity-100" : "opacity-0"
            )}
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
