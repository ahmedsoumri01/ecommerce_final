"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCartStore } from "@/lib/store/cart-store"
import { Star, Plus, Minus, Heart } from "lucide-react"
import type { Product } from "@/lib/data/products"
import { SocialShare } from "./social-share"

interface ProductDetailsProps {
  product: Product
  locale: string
  isRTL?: boolean
}

export function ProductDetails({ product, locale, isRTL = false }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCartStore()

  const getProductName = () => {
    switch (locale) {
      case "ar":
        return product.nameAr
      case "fr":
        return product.nameFr
      default:
        return product.name
    }
  }

  const getProductDescription = () => {
    switch (locale) {
      case "ar":
        return product.descriptionAr
      case "fr":
        return product.descriptionFr
      default:
        return product.description
    }
  }

  const getCategoryName = () => {
    switch (locale) {
      case "ar":
        return product.categoryAr
      case "fr":
        return product.categoryFr
      default:
        return product.category
    }
  }

  const handleAddToCart = () => {
    addItem(product, quantity)
  }

  const increaseQuantity = () => setQuantity((prev) => prev + 1)
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const currentUrl = typeof window !== "undefined" ? window.location.href : ""

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
        <h1 className="text-3xl font-bold leading-tight">{getProductName()}</h1>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold text-primary">${product.price}</span>
        {product.originalPrice && (
          <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
        )}
        {product.originalPrice && (
          <Badge className="bg-red-500 hover:bg-red-600">
            {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% خصم
          </Badge>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">({product.reviews} تقييم)</span>
      </div>

      {/* Description */}
      <div>
        <p className="text-gray-600 leading-relaxed">{getProductDescription()}</p>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">الكمية:</span>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={decreaseQuantity}
              disabled={quantity <= 1}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
            <Button variant="ghost" size="icon" onClick={increaseQuantity} className="h-10 w-10">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={!product.inStock}>
            {product.inStock ? "إضافة إلى السلة" : "نفد المخزون"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={isWishlisted ? "text-red-500 border-red-500" : ""}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3 pt-6 border-t">
        <div className="flex items-center gap-2">
          <span className="font-medium">التوفر:</span>
          <Badge variant={product.inStock ? "default" : "destructive"}>
            {product.inStock ? "متوفر" : "نفد المخزون"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">الفئة:</span>
          <Badge variant="outline">{getCategoryName()}</Badge>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="pt-6 border-t">
        <p className="font-medium mb-3">شارك المنتج:</p>
        <SocialShare url={currentUrl} title={getProductName()} description={getProductDescription()} />
      </div>

      {/* Security Badges */}
      <div className="pt-6 border-t">
        <div className="flex flex-wrap gap-4 opacity-60">
          <div className="text-xs text-center">
            <div className="w-16 h-8 bg-gray-200 rounded mb-1"></div>
            <span>آمن</span>
          </div>
          <div className="text-xs text-center">
            <div className="w-16 h-8 bg-gray-200 rounded mb-1"></div>
            <span>موثوق</span>
          </div>
          <div className="text-xs text-center">
            <div className="w-16 h-8 bg-gray-200 rounded mb-1"></div>
            <span>مضمون</span>
          </div>
        </div>
      </div>
    </div>
  )
}
