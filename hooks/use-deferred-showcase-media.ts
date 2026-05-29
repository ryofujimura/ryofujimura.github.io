"use client"

import { useEffect, useState } from "react"

const MOBILE_BREAKPOINT = 768
/** Minimum time before showcase posters/videos may fetch (lets hero GSAP start). */
const MIN_DEFER_MS = 900
/** Extra buffer after hero intro on mobile before decoding showcase media. */
const MOBILE_MEDIA_BUFFER_MS = 500
/** Hard cap so media still loads if the hero event never fires. */
const MAX_DEFER_MS_MOBILE = 3600
const MAX_DEFER_MS_DESKTOP = 2200

export const PORTFOLIO_HERO_INTRO_EVENT = "portfolio:hero-intro-complete"

declare global {
  interface Window {
    __portfolioHeroIntroComplete?: boolean
  }
}

/**
 * Delays showcase poster/video fetches until hero entrance animations have run.
 * Mobile uses a longer max wait because concurrent decodes stall the main thread.
 */
export function useDeferredShowcaseMedia() {
  const [mediaEnabled, setMediaEnabled] = useState(false)

  useEffect(() => {
    let cancelled = false
    let heroDone = window.__portfolioHeroIntroComplete === true
    let minDelayDone = false
    let opened = false
    let mobileOpenScheduled = false

    const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`).matches

    const enableMedia = () => {
      if (cancelled || opened) return
      opened = true
      setMediaEnabled(true)
    }

    const open = () => {
      if (cancelled || opened) return
      if (!heroDone || !minDelayDone) return

      if (isMobile) {
        if (mobileOpenScheduled) return
        mobileOpenScheduled = true
        window.setTimeout(() => {
          if ("requestIdleCallback" in window) {
            requestIdleCallback(enableMedia, { timeout: 700 })
          } else {
            enableMedia()
          }
        }, MOBILE_MEDIA_BUFFER_MS)
        return
      }

      enableMedia()
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
