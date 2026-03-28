"use client"

import type { Product } from "./types"

const DB_NAME = "danshari"
const DB_VERSION = 1
const STORE = "kv"
const CATALOG_KEY = "products_v1"

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"))
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE)
      }
    }
  })
}

/** `undefined` if catalog was never written (first visit). */
export async function idbGetProductCatalog(): Promise<Product[] | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly")
    const req = tx.objectStore(STORE).get(CATALOG_KEY)
    req.onsuccess = () => resolve(req.result as Product[] | undefined)
    req.onerror = () => reject(req.error ?? new Error("IndexedDB read failed"))
  })
}

export async function idbSetProductCatalog(products: Product[]): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite")
    tx.objectStore(STORE).put(products, CATALOG_KEY)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error ?? new Error("IndexedDB write failed"))
    tx.onabort = () => reject(tx.error ?? new Error("IndexedDB write aborted"))
  })
}
