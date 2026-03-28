"use client"

import * as React from "react"

/**
 * Subscribes to `window.matchMedia` with correct initial value on the client
 * (avoids a first paint where layout CSS says “wide” but JS still thinks “narrow”).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      const mq = window.matchMedia(query)
      mq.addEventListener("change", onStoreChange)
      return () => mq.removeEventListener("change", onStoreChange)
    },
    [query],
  )

  const getSnapshot = React.useCallback(
    () => window.matchMedia(query).matches,
    [query],
  )

  const getServerSnapshot = React.useCallback(() => false, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
