"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { getProducts, setProducts } from "@/lib/danshari/store"
import type { Product } from "@/lib/danshari/types"
import { danshariHref } from "@/lib/danshari/paths"
import { fileToDataUrl, newProductUid, stemFromFileName } from "@/lib/danshari/image-upload"
import { DanshariHeader } from "@/components/danshari/header"
import { DanshariMedia } from "@/components/danshari/danshari-media"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Download,
  ImageIcon,
  Loader2,
  Trash2,
  Upload,
} from "lucide-react"

function pickImages(files: FileList | File[]): File[] {
  return [...files].filter((f) => f.type.startsWith("image/"))
}

export function DanshariProductManager() {
  const [items, setItems] = useState<Product[]>([])
  const [lastSaved, setLastSaved] = useState<Product[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [dropActive, setDropActive] = useState(false)
  const [busyDrop, setBusyDrop] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [publishedOk, setPublishedOk] = useState(false)

  useEffect(() => {
    const list = getProducts()
    setItems(list)
    setLastSaved(list)
    setHydrated(true)
  }, [])

  const dirty = useMemo(
    () => JSON.stringify(items) !== JSON.stringify(lastSaved),
    [items, lastSaved]
  )

  const updateProduct = useCallback((uid: string, patch: Partial<Product>) => {
    setItems((prev) =>
      prev.map((p) => (p.uid === uid ? { ...p, ...patch } : p))
    )
    setError(null)
    setPublishedOk(false)
  }, [])

  const removeProduct = useCallback((uid: string) => {
    setItems((prev) => prev.filter((p) => p.uid !== uid))
    setError(null)
    setPublishedOk(false)
  }, [])

  const addProductsFromFiles = useCallback(async (files: File[]) => {
    const imgs = pickImages(files)
    if (imgs.length === 0) return
    setBusyDrop(true)
    setError(null)
    try {
      const created: Product[] = []
      for (const file of imgs) {
        const dataUrl = await fileToDataUrl(file)
        created.push({
          uid: newProductUid(),
          title: stemFromFileName(file.name),
          description: "",
          tag: "General",
          image_url: dataUrl,
          image_url_secondary: null,
          related_item_uid: null,
          claimant: null,
          created_at: new Date().toISOString(),
        })
      }
      setItems((prev) => [...created, ...prev])
      setPublishedOk(false)
    } finally {
      setBusyDrop(false)
    }
  }, [])

  const onDropMain = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setDropActive(false)
      void addProductsFromFiles([...e.dataTransfer.files])
    },
    [addProductsFromFiles]
  )

  const handlePublish = () => {
    setError(null)
    for (const p of items) {
      if (!p.title.trim()) {
        setError("Each product needs a title.")
        return
      }
      if (!p.image_url.trim()) {
        setError("Each product needs a primary image.")
        return
      }
    }
    const uids = new Set(items.map((p) => p.uid))
    const cleaned = items.map((p) => ({
      ...p,
      title: p.title.trim(),
      description: p.description.trim(),
      tag: p.tag.trim() || "General",
      related_item_uid:
        p.related_item_uid && uids.has(p.related_item_uid)
          ? p.related_item_uid
          : null,
      image_url_secondary: p.image_url_secondary?.trim() || null,
    }))
    setProducts(cleaned)
    setLastSaved(cleaned)
    setItems(cleaned)
    setPublishedOk(true)
    setTimeout(() => setPublishedOk(false), 3200)
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <DanshariHeader />
      <main className="max-w-4xl mx-auto px-4 py-4 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="rounded-xl text-muted-foreground -ml-2"
          >
            <Link href={danshariHref()}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-foreground">Manage products</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Drag images onto the zone below to create one product per image. Edit titles
            and descriptions in the list. Up to two photos per product.{" "}
            <span className="text-foreground/90">
              Save &amp; publish writes the catalog to this browser (localStorage). This
              site is static—uploads are not written to disk on the server. To put files in{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[0.65rem]">
                public/danshari/products/
              </code>
              , use <strong>Download</strong> on a photo and commit the file, then set the
              image path to{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-[0.65rem]">
                /danshari/products/yourname.jpg
              </code>
              .
            </span>
          </p>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDropActive(true)
          }}
          onDragLeave={() => setDropActive(false)}
          onDrop={onDropMain}
          className={[
            "rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            dropActive
              ? "border-primary bg-primary/5"
              : "border-border bg-card/40",
          ].join(" ")}
        >
          <ImageIcon className="mx-auto size-10 text-muted-foreground mb-3" />
          <p className="font-medium text-foreground">Drop images here</p>
          <p className="text-sm text-muted-foreground mt-1">
            Each file becomes a new product at the top of the list.
          </p>
          <label className="mt-4 inline-flex cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files
                if (f?.length) void addProductsFromFiles([...f])
                e.target.value = ""
              }}
            />
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:opacity-90">
              {busyDrop ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Choose images
            </span>
          </label>
        </div>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
        {publishedOk ? (
          <p className="text-sm font-medium text-[oklch(0.45_0.12_145)]" role="status">
            Saved and published for visitors using this browser.
          </p>
        ) : null}

        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12 text-sm">
              No products yet. Drop images above to add some.
            </p>
          ) : (
            items.map((p) => (
              <ProductEditorRow
                key={p.uid}
                product={p}
                others={items.filter((x) => x.uid !== p.uid)}
                onChange={(patch) => updateProduct(p.uid, patch)}
                onRemove={() => removeProduct(p.uid)}
              />
            ))
          )}
        </div>
      </main>

      <div className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur-md px-4 py-3">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">
            {dirty ? "You have unsaved changes." : "All changes saved."}
          </p>
          <Button
            size="lg"
            className="rounded-xl min-w-[180px]"
            onClick={handlePublish}
            disabled={!dirty}
          >
            Save &amp; publish
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProductEditorRow({
  product: p,
  others,
  onChange,
  onRemove,
}: {
  product: Product
  others: Product[]
  onChange: (patch: Partial<Product>) => void
  onRemove: () => void
}) {
  const primaryRef = useRef<HTMLInputElement>(null)
  const secondaryRef = useRef<HTMLInputElement>(null)

  const setPrimaryFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return
    const url = await fileToDataUrl(file)
    onChange({ image_url: url })
  }

  const setSecondaryFile = async (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return
    const url = await fileToDataUrl(file)
    onChange({ image_url_secondary: url })
  }

  const onSecondaryDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    void setSecondaryFile(file)
  }

  const downloadName = (slot: 1 | 2) => {
    const stem = p.title.trim().replace(/[^\w\-]+/g, "-").slice(0, 40) || "product"
    return `${stem}-${slot}.jpg`
  }

  return (
    <Card className="rounded-2xl border-border shadow-sm overflow-hidden">
      <CardContent className="p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row gap-5">
          <div className="flex gap-3 shrink-0">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Photo 1
              </span>
              <div className="relative w-[7.5rem] h-[7.5rem] rounded-xl overflow-hidden border border-border bg-muted">
                <DanshariMedia src={p.image_url} alt="" fill sizes="120px" />
              </div>
              <input
                ref={primaryRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void setPrimaryFile(e.target.files?.[0])
                  e.target.value = ""
                }}
              />
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-xs rounded-lg"
                  onClick={() => primaryRef.current?.click()}
                >
                  Replace
                </Button>
                {p.image_url.startsWith("data:") ? (
                  <Button variant="outline" size="sm" className="h-8 px-2 rounded-lg" asChild>
                    <a href={p.image_url} download={downloadName(1)}>
                      <Download className="size-3.5" />
                    </a>
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                Photo 2
              </span>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onSecondaryDrop}
                className="relative w-[7.5rem] h-[7.5rem] rounded-xl overflow-hidden border border-dashed border-border bg-muted/50 flex items-center justify-center"
              >
                {p.image_url_secondary ? (
                  <DanshariMedia src={p.image_url_secondary} alt="" fill sizes="120px" />
                ) : (
                  <span className="text-[10px] text-muted-foreground px-2 text-center">
                    Drop or add
                  </span>
                )}
              </div>
              <input
                ref={secondaryRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  void setSecondaryFile(e.target.files?.[0])
                  e.target.value = ""
                }}
              />
              <div className="flex flex-wrap gap-1">
                {p.image_url_secondary ? (
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      className="h-8 text-xs rounded-lg"
                      onClick={() => secondaryRef.current?.click()}
                    >
                      Replace
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs rounded-lg text-destructive"
                      onClick={() => onChange({ image_url_secondary: null })}
                    >
                      Remove
                    </Button>
                    {p.image_url_secondary.startsWith("data:") ? (
                      <Button variant="outline" size="sm" className="h-8 px-2 rounded-lg" asChild>
                        <a href={p.image_url_secondary} download={downloadName(2)}>
                          <Download className="size-3.5" />
                        </a>
                      </Button>
                    ) : null}
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="h-8 text-xs rounded-lg"
                    onClick={() => secondaryRef.current?.click()}
                  >
                    Add 2nd photo
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input
                    value={p.title}
                    onChange={(e) => onChange({ title: e.target.value })}
                    className="mt-1 h-10 rounded-xl"
                    placeholder="Title"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">
                    Description
                  </label>
                  <textarea
                    value={p.description}
                    onChange={(e) => onChange({ description: e.target.value })}
                    className="mt-1 w-full min-h-[5.5rem] p-3 rounded-xl border border-input bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Description"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Tag</label>
                    <Input
                      value={p.tag}
                      onChange={(e) => onChange({ tag: e.target.value })}
                      className="mt-1 h-10 rounded-xl"
                      placeholder="Tag"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">
                      Related item
                    </label>
                    <select
                      value={p.related_item_uid ?? ""}
                      onChange={(e) =>
                        onChange({
                          related_item_uid: e.target.value || null,
                        })
                      }
                      className="mt-1 w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">None</option>
                      {others.map((o) => (
                        <option key={o.uid} value={o.uid}>
                          {o.title || o.uid}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive rounded-xl"
                onClick={onRemove}
                aria-label="Delete product"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
