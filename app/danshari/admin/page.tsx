"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { danshariHref } from "@/lib/danshari/paths"
import { useDanshariUser } from "@/lib/danshari/user-context"
import { addProduct, getProducts } from "@/lib/danshari/store"
import type { Product } from "@/lib/danshari/types"
import { DanshariHeader } from "@/components/danshari/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ImagePlus, Check } from "lucide-react"

export default function DanshariAdminPage() {
  const router = useRouter()
  const { user, isLoading } = useDanshariUser()
  const [products, setProducts] = useState<Product[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [relatedUid, setRelatedUid] = useState("")

  useEffect(() => {
    if (isLoading) return
    if (!user || !user.is_admin) {
      router.push(danshariHref())
      return
    }
    setProducts(getProducts())
  }, [user, isLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !imageUrl.trim()) return

    setIsSubmitting(true)

    await new Promise((r) => setTimeout(r, 300))

    addProduct({
      title: title.trim(),
      description: description.trim(),
      tag: tag.trim() || "General",
      image_url: imageUrl.trim(),
      related_item_uid: relatedUid || null,
    })

    setSuccess(true)
    setTitle("")
    setDescription("")
    setTag("")
    setImageUrl("")
    setRelatedUid("")
    setProducts(getProducts())
    setIsSubmitting(false)

    setTimeout(() => setSuccess(false), 2000)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user?.is_admin) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DanshariHeader />
      <main className="max-w-2xl mx-auto px-4 py-4 pb-8">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="mb-4 -ml-2 rounded-xl text-muted-foreground"
        >
          <Link href={danshariHref()}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Link>
        </Button>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImagePlus className="w-5 h-5 text-primary" />
              Add New Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Title *
                </label>
                <Input
                  type="text"
                  placeholder="Product title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Description
                </label>
                <textarea
                  placeholder="Product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-24 p-3 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Tag
                </label>
                <Input
                  type="text"
                  placeholder="e.g. Furniture, Decor, Lighting"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="h-11 rounded-xl"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Image URL *
                </label>
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="h-11 rounded-xl"
                  required
                />
                {imageUrl && (
                  <div className="mt-2 relative w-full aspect-video rounded-xl overflow-hidden bg-muted">
                    <Image
                      src={imageUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                      sizes="100vw"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                  Related Item
                </label>
                <select
                  value={relatedUid}
                  onChange={(e) => setRelatedUid(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">None</option>
                  {products.map((p) => (
                    <option key={p.uid} value={p.uid}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting || !title.trim() || !imageUrl.trim()}
                className="h-12 rounded-xl text-base mt-2"
              >
                {success ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Added!
                  </>
                ) : isSubmitting ? (
                  <>
                    <div className="w-5 h-5 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Product"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
