"use client"

import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768
/** Minimum time before showcase posters/videos may fetch (lets hero GSAP start). */
const MIN_DEFER_MS = 900
/** Hard cap so media still loads if the hero event never fires. */
const MAX_DEFER_MS_MOBILE = 3200
const MAX_DEFER_MS_DESKTOP = 2200

export const PORTFOLIO_HERO_INTRO_EVENT = "portfolio:hero-intro-complete"

/**
 * Delays showcase poster/video fetches until hero entrance animations have run.
 * Mobile uses a longer max wait because concurrent decodes stall the main thread.
 */
export function useDeferredShowcaseMedia() {
  const [mediaEnabled, setMediaEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    let heroDone = false
    let minDelayDone = false
    let opened = false

    const open = () => {
      if (cancelled || opened) return
      if (!heroDone || !minDelayDone) return
      opened = true
      setMediaEnabled(true)
    }

    const onHeroIntroComplete = () => {
      heroDone = true
      open()
    }

    window.addEventListener(PORTFOLIO_HERO_INTRO_EVENT, onHeroIntroComplete, { once: true })

    const minTimer = window.setTimeout(() => {
      minDelayDone = true
      open()
    }, MIN_DEFER_MS)

    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches
    const maxTimer = window.setTimeout(() => {
      heroDone = true
      minDelayDone = true
      if (!cancelled && !opened) {
        opened = true
        setMediaEnabled(true)
      }
    }, isMobile ? MAX_DEFER_MS_MOBILE : MAX_DEFER_MS_DESKTOP)

    return () => {
      cancelled = true
      window.removeEventListener(PORTFOLIO_HERO_INTRO_EVENT, onHeroIntroComplete)
      window.clearTimeout(minTimer)
      window.clearTimeout(maxTimer)
    }
  }, [])

  return mediaEnabled
}
