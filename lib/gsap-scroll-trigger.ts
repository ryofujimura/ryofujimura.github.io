import { ScrollTrigger } from "gsap/ScrollTrigger"

let refreshScheduled = false

/** Coalesce ScrollTrigger.refresh after layout shifts (images, mobile chrome). */
export function scheduleScrollTriggerRefresh() {
  if (typeof window === "undefined") return
  if (refreshScheduled) return
  refreshScheduled = true
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      try {
        ScrollTrigger.refresh()
      } finally {
        refreshScheduled = false
      }
    })
  })
}
