"use client"

import { useState, useEffect, useCallback, RefObject } from 'react'

// Grid configuration (must match generation parameters)
const P_MIN = -15
const P_MAX = 15
const STEP = 3
const SIZE = 256

/**
 * Converts normalized coordinates [-1, 1] to grid coordinates
 */
function quantizeToGrid(val: number): number {
  const raw = P_MIN + (val + 1) * (P_MAX - P_MIN) / 2 // [-1,1] -> [-15,15]
  const snapped = Math.round(raw / STEP) * STEP
  return Math.max(P_MIN, Math.min(P_MAX, snapped))
}

/**
 * Converts grid coordinates to filename format
 * Files use format: gaze_px{x}p0_py{y}p0_256.webp where 'm' replaces '-' and 'p' replaces '.'
 */
function gridToFilename(px: number, py: number): string {
  const sanitize = (val: number) => val.toFixed(1).replace('-', 'm').replace('.', 'p')
  return `gaze_px${sanitize(px)}_py${sanitize(py)}_${SIZE}.webp`
}

interface UseGazeTrackingResult {
  currentImage: string | null
  isLoading: boolean
  error: Error | null
}

/**
 * Custom hook for gaze tracking
 * @param containerRef - Reference to the container element
 * @param basePath - Base path to face images (default: '/faces/')
 * @returns { currentImage, isLoading, error }
 */
type UseGazeTrackingOptions = {
  /** When false, only the center gaze frame is shown (no pointer tracking). */
  trackPointer?: boolean
}

export function useGazeTracking(
  containerRef: RefObject<HTMLDivElement | null>,
  basePath: string = '/faces/',
  options: UseGazeTrackingOptions = {}
): UseGazeTrackingResult {
  const { trackPointer = true } = options
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const updateGaze = useCallback((clientX: number, clientY: number) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    // Convert to normalized coordinates [-1, 1]
    const nx = (clientX - centerX) / (rect.width / 2)
    const ny = (clientY - centerY) / (rect.height / 2)
    
    // Clamp to [-1, 1] range
    const clampedX = Math.max(-1, Math.min(1, nx))
    // Invert Y: cursor above center = positive py (look up)
    const clampedY = Math.max(-1, Math.min(1, -ny))
    
    // Convert to grid coordinates
    const px = quantizeToGrid(clampedX)
    const py = quantizeToGrid(clampedY)
    
    // Generate filename
    const filename = gridToFilename(px, py)
    const imagePath = `${basePath}${filename}`
    
    setCurrentImage(imagePath)
  }, [basePath, containerRef])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    updateGaze(e.clientX, e.clientY)
  }, [updateGaze])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      updateGaze(touch.clientX, touch.clientY)
    }
  }, [updateGaze])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    updateGaze(centerX, centerY)

    if (!trackPointer) return

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("touchmove", handleTouchMove, { passive: true })

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [handleMouseMove, handleTouchMove, updateGaze, containerRef, trackPointer])

  return { currentImage, isLoading, error }
}

export default useGazeTracking
