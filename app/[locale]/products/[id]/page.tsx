"use client"

import { products } from "@/lib/data/products"
import { ProductGallery } from "@/components/product-gallery"
import { ProductDetails } from "@/components/product-details"
import { notFound } from "next/navigation"

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; id: string }
}) {
  const isRTL = params.locale === "ar"

  const product = products.find((p) => p.id === Number.parseInt(params.id))

  if (!product) {
    notFound()
  }

  // Generate multiple images for gallery (in real app, these would come from the product data)
  const productImages = [
    product.image,
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
    "/placeholder.svg?height=500&width=500",
  ]

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div>
            <ProductGallery images={productImages} productName={isRTL ? product.nameAr : product.name} />
          </div>

          {/* Product Details */}
          <div>
            <ProductDetails product={product} locale={params.locale} isRTL={isRTL} />
          </div>
        </div>
      </div>
    </div>
  )
}
