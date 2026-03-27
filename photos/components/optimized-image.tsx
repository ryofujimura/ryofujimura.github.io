"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  onLoad?: () => void;
  caption?: string;
  showCaption?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  containerClassName,
  fill = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  quality = 85,
  onLoad,
  caption,
  showCaption = false,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [showPlaceholder, setShowPlaceholder] = useState(!priority);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "200px 0px", // Start loading before it enters viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    // Delay hiding placeholder for smooth transition
    setTimeout(() => setShowPlaceholder(false), 300);
    onLoad?.();
  }, [onLoad]);

  // Generate blur placeholder data URL
  const blurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width || 400} ${height || 300}">
      <filter id="b" colorInterpolationFilters="sRGB">
        <feGaussianBlur stdDeviation="20"/>
      </filter>
      <rect width="100%" height="100%" fill="#d4c4a8" filter="url(#b)"/>
    </svg>`
  ).toString("base64")}`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden",
        containerClassName
      )}
    >
      {/* Low-res placeholder */}
      {showPlaceholder && (
        <div
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            "transition-opacity duration-500",
            isLoaded ? "opacity-0" : "opacity-100"
          )}
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}

      {/* Main image */}
      {(isInView || priority) && (
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          sizes={sizes}
          quality={quality}
          priority={priority}
          className={cn(
            "transition-all duration-700 ease-out",
            isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            className
          )}
          onLoad={handleLoad}
          loading={priority ? "eager" : "lazy"}
        />
      )}

      {/* Caption overlay */}
      {showCaption && caption && (
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0",
            "bg-gradient-to-t from-ink/80 to-transparent",
            "px-4 py-6 text-parchment",
            "transform transition-all duration-500",
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          <p className="text-sm md:text-base font-medium leading-relaxed">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
