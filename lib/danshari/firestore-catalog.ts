"use client"

import {
  addDoc,
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  writeBatch,
  type DocumentSnapshot,
  type Timestamp,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import {
  DANSHARI_COLLECTION,
  getFirebaseFirestore,
  getFirebaseStorage,
} from "@/lib/firebase"
import type { Product, Comment } from "./types"
import { parseTagsFromDoc } from "./tags"

const STORAGE_PREFIX = "danshari"

function tsToIso(v: unknown): string {
  if (v && typeof v === "object" && "toDate" in v && typeof (v as Timestamp).toDate === "function") {
    return (v as Timestamp).toDate().toISOString()
  }
  if (typeof v === "string") return v
  return new Date().toISOString()
}

export function docToProduct(d: DocumentSnapshot): Product {
  const x = d.data()
  if (!x) {
    return {
      uid: d.id,
      title: "",
      description: "",
      tags: ["General"],
      image_url: "",
      image_url_secondary: null,
      related_item_uid: null,
      claimants: [],
      created_at: new Date().toISOString(),
    }
  }
  const claimants = Array.isArray(x.claimants)
    ? x.claimants.filter((n: unknown): n is string => typeof n === "string")
    : []
  return {
    uid: d.id,
    title: typeof x.title === "string" ? x.title : "",
    description: typeof x.description === "string" ? x.description : "",
    tags: parseTagsFromDoc(x as Record<string, unknown>),
    image_url: typeof x.image_url === "string" ? x.image_url : "",
    image_url_secondary:
      typeof x.image_url_secondary === "string" && x.image_url_secondary.length > 0
        ? x.image_url_secondary
        : null,
    related_item_uid:
      x.related_item_uid === null || typeof x.related_item_uid === "string"
        ? x.related_item_uid ?? null
        : null,
    claimants,
    created_at: tsToIso(x.created_at),
  }
}

function commentFromDoc(d: DocumentSnapshot, productUid: string): Comment {
  const x = d.data()
  return {
    id: d.id,
    product_uid: productUid,
    username: typeof x.username === "string" ? x.username : "",
    text: typeof x.text === "string" ? x.text : "",
    price: typeof x.price === "number" ? x.price : null,
    created_at: tsToIso(x.created_at),
  }
}

/** Upload a data URL to Storage; return download URL. Pass-through if not data URL. */
export async function uploadDataUrlIfNeeded(
  dataUrl: string,
  productUid: string,
  slot: "primary" | "secondary"
): Promise<string> {
  if (!dataUrl.startsWith("data:")) return dataUrl
  const storage = getFirebaseStorage()
  if (!storage) throw new Error("Firebase Storage is not available")

  const blob = await (await fetch(dataUrl)).blob()
  const ext = blob.type.includes("png")
    ? "png"
    : blob.type.includes("webp")
      ? "webp"
      : "jpg"
  const objectPath = `${STORAGE_PREFIX}/products/${productUid}/${slot}_${Date.now()}.${ext}`
  const sRef = ref(storage, objectPath)
  await uploadBytes(sRef, blob, {
    contentType: blob.type || "image/jpeg",
  })
  return getDownloadURL(sRef)
}

export async function uploadDataUrlImagesForProducts(
  products: Product[]
): Promise<Product[]> {
  const out: Product[] = []
  for (const p of products) {
    let image_url = p.image_url
    let image_url_secondary = p.image_url_secondary
    if (image_url.startsWith("data:")) {
      image_url = await uploadDataUrlIfNeeded(image_url, p.uid, "primary")
    }
    if (image_url_secondary?.startsWith("data:")) {
      image_url_secondary = await uploadDataUrlIfNeeded(
        image_url_secondary,
        p.uid,
        "secondary"
      )
    }
    out.push({ ...p, image_url, image_url_secondary })
  }
  return out
}

const BATCH_SIZE = 400

export async function setProductsRemote(products: Product[]): Promise<void> {
  const db = getFirebaseFirestore()
  if (!db) throw new Error("Firestore is not available")

  const colRef = collection(db, DANSHARI_COLLECTION)
  const existing = await getDocs(colRef)
  const existingIds = new Set(existing.docs.map((d) => d.id))
  const nextIds = new Set(products.map((p) => p.uid))

  type Op =
    | { kind: "delete"; ref: ReturnType<typeof doc> }
    | { kind: "set"; ref: ReturnType<typeof doc>; data: Record<string, unknown> }

  const ops: Op[] = []
  for (const id of existingIds) {
    if (!nextIds.has(id)) {
      ops.push({ kind: "delete", ref: doc(db, DANSHARI_COLLECTION, id) })
    }
  }
  for (const p of products) {
    ops.push({
      kind: "set",
      ref: doc(db, DANSHARI_COLLECTION, p.uid),
      data: {
        title: p.title,
        description: p.description,
        tags: p.tags,
        tag: deleteField(),
        image_url: p.image_url,
        image_url_secondary: p.image_url_secondary ?? null,
        related_item_uid: p.related_item_uid ?? null,
        claimants: p.claimants,
        created_at: p.created_at,
      },
    })
  }

  for (let i = 0; i < ops.length; i += BATCH_SIZE) {
    const batch = writeBatch(db)
    for (const op of ops.slice(i, i + BATCH_SIZE)) {
      if (op.kind === "delete") batch.delete(op.ref)
      else batch.set(op.ref, op.data, { merge: true })
    }
    await batch.commit()
  }
}

export async function toggleProductClaimRemote(
  uid: string,
  username: string
): Promise<Product | null> {
  const db = getFirebaseFirestore()
  if (!db) throw new Error("Firestore is not available")

  const ref = doc(db, DANSHARI_COLLECTION, uid)
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(ref)
    if (!snap.exists()) throw new Error("Product not found")
    const data = snap.data()!
    const cur: string[] = Array.isArray(data.claimants)
      ? data.claimants.filter((n: unknown): n is string => typeof n === "string")
      : []
    const at = cur.indexOf(username)
    const next =
      at >= 0 ? cur.filter((_, i) => i !== at) : [...cur, username]
    tx.update(ref, { claimants: next })
  })

  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return docToProduct(snap)
}

export async function addCommentRemote(
  product_uid: string,
  payload: Pick<Comment, "username" | "text" | "price">
): Promise<void> {
  const db = getFirebaseFirestore()
  if (!db) throw new Error("Firestore is not available")

  await addDoc(collection(db, DANSHARI_COLLECTION, product_uid, "comments"), {
    username: payload.username,
    text: payload.text,
    price: payload.price,
    created_at: serverTimestamp(),
  })
}

export function subscribeProductComments(
  productUid: string,
  cb: (comments: Comment[]) => void
): () => void {
  const db = getFirebaseFirestore()
  if (!db) {
    cb([])
    return () => {}
  }
  const q = query(
    collection(db, DANSHARI_COLLECTION, productUid, "comments"),
    orderBy("created_at", "asc")
  )
  return onSnapshot(
    q,
    (snap) => {
      cb(snap.docs.map((d) => commentFromDoc(d, productUid)))
    },
    (err) => {
      console.error("[danshari] comments snapshot", err)
      cb([])
    }
  )
}

// —— Real-time product catalog (single shared listener) ——

let productCache: Product[] | null = null
let unsubscribeCatalog: (() => void) | null = null
let catalogLoadPromise: Promise<Product[]> | null = null
let catalogListenerReady = false
const catalogListeners = new Set<(products: Product[]) => void>()

function notifyCatalogListeners() {
  const list = [...(productCache ?? [])]
  catalogListeners.forEach((cb) => cb(list))
}

export function getCachedProducts(): Product[] {
  return productCache ?? []
}

export function subscribeCatalog(cb: (products: Product[]) => void): () => void {
  catalogListeners.add(cb)
  if (catalogListenerReady) cb([...getCachedProducts()])
  return () => catalogListeners.delete(cb)
}

export function ensureCatalogLoaded(): Promise<Product[]> {
  if (typeof window === "undefined") return Promise.resolve([])
  if (catalogListenerReady) return Promise.resolve(getCachedProducts())

  catalogLoadPromise ??= new Promise<Product[]>((resolve, reject) => {
    const db = getFirebaseFirestore()
    if (!db) {
      productCache = []
      catalogListenerReady = true
      resolve([])
      return
    }

    const q = query(
      collection(db, DANSHARI_COLLECTION),
      orderBy("created_at", "desc")
    )

    let settled = false
    try {
      unsubscribeCatalog = onSnapshot(
        q,
        (snap) => {
          productCache = snap.docs.map((d) => docToProduct(d))
          notifyCatalogListeners()
          if (!settled) {
            settled = true
            catalogListenerReady = true
            resolve(productCache!)
          }
        },
        (err) => {
          console.error("[danshari] catalog snapshot", err)
          productCache = []
          notifyCatalogListeners()
          catalogLoadPromise = null
          if (!settled) {
            settled = true
            reject(err)
          }
        }
      )
    } catch (e) {
      catalogLoadPromise = null
      reject(e)
    }
  })

  return catalogLoadPromise
}

