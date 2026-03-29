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
  Timestamp,
} from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import {
  DANSHARI_COLLECTION,
  getFirebaseFirestore,
  getFirebaseStorage,
} from "@/lib/firebase"
import type { Product, Comment } from "./types"
import { normalizePromotionUsernames } from "./allowed-login"
import { processDataUrlForUpload } from "./image-process"
import { parseTagsFromDoc } from "./tags"

const STORAGE_PREFIX = "danshari"

/**
 * Firestore shape for `danshari/{productId}` (document id = product uid):
 * - title, description: string
 * - tags: string[] (legacy `tag` string is read once then removed on next publish)
 * - image_url, optional image_thumb_url; image_url_secondary, image_thumb_secondary
 * - related_item_uid: string | null
 * - claimants: string[]
 * - promotion_message: string, promotion_usernames: string[] (optional / legacy)
 * - created_at: Timestamp (preferred) or ISO string (legacy reads)
 *
 * Subcollection `comments`: username, text, price|null, created_at (Timestamp).
 */

function createdAtForFirestore(iso: string): Timestamp {
  const ms = Date.parse(iso)
  if (Number.isNaN(ms)) return Timestamp.now()
  return Timestamp.fromMillis(ms)
}

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
      image_thumb_url: null,
      image_thumb_320_url: null,
      image_thumb_160_url: null,
      image_url_secondary: null,
      image_thumb_secondary: null,
      image_thumb_secondary_320_url: null,
      image_thumb_secondary_160_url: null,
      image_placeholder_data_url: null,
      image_placeholder_secondary_data_url: null,
      related_item_uid: null,
      claimants: [],
      promotion_message: "",
      promotion_usernames: [],
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
    image_thumb_url:
      typeof x.image_thumb_url === "string" && x.image_thumb_url.length > 0
        ? x.image_thumb_url
        : null,
    image_thumb_320_url:
      typeof x.image_thumb_320_url === "string" && x.image_thumb_320_url.length > 0
        ? x.image_thumb_320_url
        : null,
    image_thumb_160_url:
      typeof x.image_thumb_160_url === "string" && x.image_thumb_160_url.length > 0
        ? x.image_thumb_160_url
        : null,
    image_url_secondary:
      typeof x.image_url_secondary === "string" && x.image_url_secondary.length > 0
        ? x.image_url_secondary
        : null,
    image_thumb_secondary:
      typeof x.image_thumb_secondary === "string" && x.image_thumb_secondary.length > 0
        ? x.image_thumb_secondary
        : null,
    image_thumb_secondary_320_url:
      typeof x.image_thumb_secondary_320_url === "string" &&
      x.image_thumb_secondary_320_url.length > 0
        ? x.image_thumb_secondary_320_url
        : null,
    image_thumb_secondary_160_url:
      typeof x.image_thumb_secondary_160_url === "string" &&
      x.image_thumb_secondary_160_url.length > 0
        ? x.image_thumb_secondary_160_url
        : null,
    image_placeholder_data_url:
      typeof x.image_placeholder_data_url === "string" &&
      x.image_placeholder_data_url.length > 0
        ? x.image_placeholder_data_url
        : null,
    image_placeholder_secondary_data_url:
      typeof x.image_placeholder_secondary_data_url === "string" &&
      x.image_placeholder_secondary_data_url.length > 0
        ? x.image_placeholder_secondary_data_url
        : null,
    related_item_uid:
      x.related_item_uid === null || typeof x.related_item_uid === "string"
        ? x.related_item_uid ?? null
        : null,
    claimants,
    promotion_message:
      typeof x.promotion_message === "string" ? x.promotion_message : "",
    promotion_usernames: normalizePromotionUsernames(x.promotion_usernames),
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

const UPLOAD_CONCURRENCY = 3

async function uploadImageSlotFromDataUrl(
  dataUrl: string,
  productUid: string,
  slot: "primary" | "secondary",
): Promise<{
  fullUrl: string
  thumb480Url: string
  thumb320Url: string
  thumb160Url: string
  placeholderDataUrl: string
}> {
  const storage = getFirebaseStorage()
  if (!storage) throw new Error("Firebase Storage is not available")

  const processed = await processDataUrlForUpload(dataUrl)
  const ts = Date.now()
  const base = `${STORAGE_PREFIX}/products/${productUid}/${slot}_${ts}`
  const fullRef = ref(storage, `${base}_full.${processed.fullExt}`)
  const t480Ref = ref(storage, `${base}_t480.${processed.thumb480Ext}`)
  const t320Ref = ref(storage, `${base}_t320.${processed.thumb320Ext}`)
  const t160Ref = ref(storage, `${base}_t160.${processed.thumb160Ext}`)
  const mime = (ext: string) =>
    ext === "webp" ? "image/webp" : "image/jpeg"

  await Promise.all([
    uploadBytes(fullRef, processed.full, { contentType: mime(processed.fullExt) }),
    uploadBytes(t480Ref, processed.thumb480, {
      contentType: mime(processed.thumb480Ext),
    }),
    uploadBytes(t320Ref, processed.thumb320, {
      contentType: mime(processed.thumb320Ext),
    }),
    uploadBytes(t160Ref, processed.thumb160, {
      contentType: mime(processed.thumb160Ext),
    }),
  ])
  const [fullUrl, thumb480Url, thumb320Url, thumb160Url] = await Promise.all([
    getDownloadURL(fullRef),
    getDownloadURL(t480Ref),
    getDownloadURL(t320Ref),
    getDownloadURL(t160Ref),
  ])
  return {
    fullUrl,
    thumb480Url,
    thumb320Url,
    thumb160Url,
    placeholderDataUrl: processed.placeholderDataUrl,
  }
}

async function processOneProductImages(p: Product): Promise<Product> {
  let image_url = p.image_url
  let image_url_secondary = p.image_url_secondary
  let image_thumb_url = p.image_thumb_url ?? null
  let image_thumb_320_url = p.image_thumb_320_url ?? null
  let image_thumb_160_url = p.image_thumb_160_url ?? null
  let image_thumb_secondary = p.image_thumb_secondary ?? null
  let image_thumb_secondary_320_url = p.image_thumb_secondary_320_url ?? null
  let image_thumb_secondary_160_url = p.image_thumb_secondary_160_url ?? null
  let image_placeholder_data_url = p.image_placeholder_data_url ?? null
  let image_placeholder_secondary_data_url =
    p.image_placeholder_secondary_data_url ?? null

  if (image_url.startsWith("data:")) {
    const r = await uploadImageSlotFromDataUrl(image_url, p.uid, "primary")
    image_url = r.fullUrl
    image_thumb_url = r.thumb480Url
    image_thumb_320_url = r.thumb320Url
    image_thumb_160_url = r.thumb160Url
    image_placeholder_data_url = r.placeholderDataUrl
  }
  if (image_url_secondary?.startsWith("data:")) {
    const r = await uploadImageSlotFromDataUrl(
      image_url_secondary,
      p.uid,
      "secondary",
    )
    image_url_secondary = r.fullUrl
    image_thumb_secondary = r.thumb480Url
    image_thumb_secondary_320_url = r.thumb320Url
    image_thumb_secondary_160_url = r.thumb160Url
    image_placeholder_secondary_data_url = r.placeholderDataUrl
  }

  return {
    ...p,
    image_url,
    image_url_secondary,
    image_thumb_url,
    image_thumb_320_url,
    image_thumb_160_url,
    image_thumb_secondary,
    image_thumb_secondary_320_url,
    image_thumb_secondary_160_url,
    image_placeholder_data_url,
    image_placeholder_secondary_data_url,
  }
}

/** Resize + WebP/JPEG encode data URLs, upload full + thumb per slot; bounded parallelism. */
export async function uploadDataUrlImagesForProducts(
  products: Product[],
): Promise<Product[]> {
  const n = products.length
  if (n === 0) return []

  const out = new Array<Product>(n)
  let cursor = 0

  async function worker(): Promise<void> {
    while (true) {
      const i = cursor++
      if (i >= n) return
      out[i] = await processOneProductImages(products[i])
    }
  }

  const pool = Math.min(UPLOAD_CONCURRENCY, n)
  await Promise.all(Array.from({ length: pool }, () => worker()))
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
        image_thumb_url: p.image_thumb_url ?? null,
        image_thumb_320_url: p.image_thumb_320_url ?? null,
        image_thumb_160_url: p.image_thumb_160_url ?? null,
        image_url_secondary: p.image_url_secondary ?? null,
        image_thumb_secondary: p.image_thumb_secondary ?? null,
        image_thumb_secondary_320_url: p.image_thumb_secondary_320_url ?? null,
        image_thumb_secondary_160_url: p.image_thumb_secondary_160_url ?? null,
        image_placeholder_data_url: p.image_placeholder_data_url ?? null,
        image_placeholder_secondary_data_url:
          p.image_placeholder_secondary_data_url ?? null,
        related_item_uid: p.related_item_uid ?? null,
        claimants: p.claimants,
        promotion_message: p.promotion_message ?? "",
        promotion_usernames: normalizePromotionUsernames(p.promotion_usernames),
        created_at: createdAtForFirestore(p.created_at),
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

