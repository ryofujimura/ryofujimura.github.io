import { useState, useEffect } from "react"

/**
 * Hook to detect user's reduced motion preference.
 * Returns true if user prefers reduced motion.
 */
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mq.matches)

    const handleChange = () => setPrefersReducedMotion(mq.matches)
    mq.addEventListener("change", handleChange)

    return () => mq.removeEventListener("change", handleChange)
  }, [])

  return prefersReducedMotion
}
