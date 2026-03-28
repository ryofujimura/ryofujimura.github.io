"use client"

import { useEffect, useRef, useState, type RefObject } from "react"

/**
 * Fires once when the element intersects the viewport (or root), then stays
 * true. Use to defer image decode until a card/slide is near the screen.
 */
export function useInViewOnce(rootMargin = "120px"): {
  ref: RefObject<HTMLDivElement | null>
  visible: boolean
} {
  const ref = useRef<HTMLDivElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || visible) return

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting)
        if (hit) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { root: null, rootMargin, threshold: 0.01 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [visible, rootMargin])

  return { ref, visible }
}
