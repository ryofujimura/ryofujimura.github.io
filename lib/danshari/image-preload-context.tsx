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

/** Sorted join of all catalog image URLs after a successful warm; survives reloads. */
const PRELOAD_SIG_STORAGE_KEY = "danshari_catalog_image_sig_v1"

function readStoredImageSig(): string | null {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(PRELOAD_SIG_STORAGE_KEY)
  } catch {
    return null
  }
}

function writeStoredImageSig(sig: string): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(PRELOAD_SIG_STORAGE_KEY, sig)
  } catch {
    /* quota / private mode */
  }
}

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
  /** Skip duplicate work when URL set unchanged and nothing left to preload. */
  const lastIdleUrlSigRef = useRef<string>("")
  const hasHandledSnapshotRef = useRef(false)

  const [catalogReady, setCatalogReady] = useState(false)
  const [phase, setPhase] = useState<PreloadPhase>("idle")
  const [loaded, setLoaded] = useState(0)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const unsub = subscribeProducts((products) => {
      chainRef.current = chainRef.current.then(async () => {
        setCatalogReady(true)
        const needed = collectCatalogImageUrls(products)
        const urlSig = [...needed].sort().join("\0")

        // After a full reload the in-memory set is empty; if this tab already
        // warmed this exact URL set, trust disk cache + skip the loading gate.
        if (
          loadedUrlsRef.current.size === 0 &&
          readStoredImageSig() === urlSig
        ) {
          needed.forEach((u) => loadedUrlsRef.current.add(u))
        }

        const pending = needed.filter((u) => !loadedUrlsRef.current.has(u))
        const already = needed.length - pending.length

        if (pending.length === 0) {
          const seen = hasHandledSnapshotRef.current
          hasHandledSnapshotRef.current = true
          if (seen && urlSig === lastIdleUrlSigRef.current) return
          lastIdleUrlSigRef.current = urlSig
          setTotal(needed.length)
          setLoaded(needed.length)
          setPhase("ready")
          writeStoredImageSig(urlSig)
          return
        }

        lastIdleUrlSigRef.current = ""
        setTotal(needed.length)
        setLoaded(already)
        setPhase("preloading")
        await preloadPool(pending, PRELOAD_CONCURRENCY, (c) => {
          setLoaded(already + c)
        })
        pending.forEach((u) => loadedUrlsRef.current.add(u))
        lastIdleUrlSigRef.current = urlSig
        setLoaded(needed.length)
        setPhase("ready")
        writeStoredImageSig(urlSig)
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
