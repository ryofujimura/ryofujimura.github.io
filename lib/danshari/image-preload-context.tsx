"use client"

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { collectCatalogImageUrls } from "./catalog-image-urls"
import { ensureProductsLoaded, subscribeProducts } from "./store"

type PreloadPhase = "idle" | "preloading" | "ready"

export interface DanshariImagePreloadContextValue {
  /** First Firestore catalog snapshot received (may be empty). */
  catalogReady: boolean
  phase: PreloadPhase
  loaded: number
  total: number
  /** True when catalog is known and all known remote images have been requested into HTTP cache. */
  imagesReady: boolean
}

const DanshariImagePreloadContext =
  createContext<DanshariImagePreloadContextValue | null>(null)

const PRELOAD_CONCURRENCY = 8

function preloadOne(url: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
}

function preloadPool(
  urls: string[],
  concurrency: number,
  onProgress: (completedInBatch: number) => void,
): Promise<void> {
  if (urls.length === 0) return Promise.resolve()

  return new Promise((resolve) => {
    let next = 0
    let completed = 0

    const bump = () => {
      completed++
      onProgress(completed)
      if (completed >= urls.length) resolve()
    }

    const runNext = (): void => {
      if (next >= urls.length) return
      const url = urls[next++]
      void preloadOne(url).then(() => {
        bump()
        runNext()
      })
    }

    const starters = Math.min(concurrency, urls.length)
    for (let i = 0; i < starters; i++) runNext()
  })
}

export function DanshariImagePreloadProvider({
  children,
}: {
  children: ReactNode
}) {
  const loadedUrlsRef = useRef(new Set<string>())
  const chainRef = useRef(Promise.resolve())

  const [catalogReady, setCatalogReady] = useState(false)
  const [phase, setPhase] = useState<PreloadPhase>("idle")
  const [loaded, setLoaded] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const unsub = subscribeProducts((products) => {
      chainRef.current = chainRef.current.then(async () => {
        setCatalogReady(true)
        const needed = collectCatalogImageUrls(products)
        const pending = needed.filter((u) => !loadedUrlsRef.current.has(u))
        const already = needed.length - pending.length
        setTotal(needed.length)
        setLoaded(already)

        if (pending.length === 0) {
          setPhase("ready")
          return
        }

        setPhase("preloading")
        await preloadPool(pending, PRELOAD_CONCURRENCY, (c) => {
          setLoaded(already + c)
        })
        pending.forEach((u) => loadedUrlsRef.current.add(u))
        setLoaded(needed.length)
        setPhase("ready")
      })
    })

    void ensureProductsLoaded()
    return unsub
  }, [])

  const value = useMemo<DanshariImagePreloadContextValue>(
    () => ({
      catalogReady,
      phase,
      loaded,
      total,
      imagesReady: catalogReady && phase === "ready",
    }),
    [catalogReady, phase, loaded, total],
  )

  return (
    <DanshariImagePreloadContext.Provider value={value}>
      {children}
    </DanshariImagePreloadContext.Provider>
  )
}

export function useDanshariImagePreload(): DanshariImagePreloadContextValue {
  const ctx = useContext(DanshariImagePreloadContext)
  if (!ctx) {
    throw new Error(
      "useDanshariImagePreload must be used within DanshariImagePreloadProvider",
    )
  }
  return ctx
}
