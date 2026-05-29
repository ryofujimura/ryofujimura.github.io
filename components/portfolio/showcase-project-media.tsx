"use client"

import { useEffect, useRef } from "react"
import type { ShowcaseProject } from "@/components/portfolio/showcase-data"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"

function projectThumbnailStyle(image: string): React.CSSProperties {
  if (image.startsWith("/") || image.startsWith("http://") || image.startsWith("https://")) {
    return {
      backgroundImage: `url(${image})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }
  }
  return { background: image }
}

type ShowcaseProjectMediaProps = {
  project: ShowcaseProject
  isActiveCategory: boolean
}

export function ShowcaseProjectMedia({ project, isActiveCategory }: ShowcaseProjectMediaProps) {
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    const container = mediaRef.current
    if (!video || !container || !project.video || prefersReducedMotion) return

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
  }, [project.video, isActiveCategory, prefersReducedMotion])

  useEffect(() => {
    if (!isActiveCategory) {
      videoRef.current?.pause()
    }
  }, [isActiveCategory])

  return (
    <div
      ref={mediaRef}
      className={cn(
        "relative aspect-[4/3] overflow-hidden transition-transform duration-500 ease-out",
        "group-hover:scale-[1.02]"
      )}
    >
      {project.video ? (
        <video
          ref={videoRef}
          src={project.video}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={`${project.title} preview`}
        />
      ) : (
        <div className="absolute inset-0" style={projectThumbnailStyle(project.image)} />
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
