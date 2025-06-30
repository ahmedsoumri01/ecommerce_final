"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/lib/store/cart-store";
import { Star, Plus, Minus, Heart, BookCheck, BadgeCheck } from "lucide-react";
import type { Product } from "@/lib/data/products";
import { SocialShare } from "./social-share";
import { Shield } from "lucide-react";
import { useClientDictionary } from "@/hooks/useClientDictionary";

interface ProductDetailsProps {
  product: Product;
  locale: string;
  isRTL?: boolean;
}

export function ProductDetails({
  product,
  locale,
  isRTL = false,
}: ProductDetailsProps) {
  const { t } = useClientDictionary(locale); // assuming params passed via page
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const getProductName = () => {
    switch (locale) {
      case "ar":
        return product.nameAr;
      case "fr":
        return product.nameFr;
      default:
        return product.name;
    }
  };

  const getProductDescription = () => {
    switch (locale) {
      case "ar":
        return product.descriptionAr;
      case "fr":
        return product.descriptionFr;
      default:
        return product.description;
    }
  };

  const getCategoryName = () => {
    switch (locale) {
      case "ar":
        return product.categoryAr;
      case "fr":
        return product.categoryFr;
      default:
        return product.category;
    }
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1));

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
        <h1 className="text-3xl font-bold leading-tight">{getProductName()}</h1>
      </div>

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-4xl font-bold text-primary">
          {product.price} DT
        </span>
        {product.originalPrice && (
          <span className="text-xl text-muted-foreground line-through">
            {product.originalPrice} DT
          </span>
        )}
        {product.originalPrice && (
          <Badge className="bg-red-500 hover:bg-red-600">
            {Math.round(
              ((product.originalPrice - product.price) /
                product.originalPrice) *
                100
            )}
            % {t("product_detail_page.discount")}
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
                i < Math.floor(product.rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          ({product.reviews} {t("product_detail_page.reviews_label")})
        </span>
      </div>

      {/* Description */}
      <div>
        <p className="text-gray-600 leading-relaxed">
          {getProductDescription()}
        </p>
      </div>

      {/* Quantity and Add to Cart */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="font-medium">
            {t("product_detail_page.quantity_label")}:
          </span>
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
            <span className="px-4 py-2 min-w-[3rem] text-center">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={increaseQuantity}
              className="h-10 w-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            size="lg"
            className="flex-1"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            {product.inStock
              ? t("product_detail_page.add_to_cart")
              : t("product_detail_page.out_of_stock")}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={isWishlisted ? "text-red-500 border-red-500" : ""}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3 pt-6 border-t">
        <div className="flex items-center gap-2">
          <span className="font-medium">
            {t("product_detail_page.availability")}:
          </span>
          <Badge variant={product.inStock ? "default" : "destructive"}>
            {product.inStock
              ? t("product_detail_page.in_stock")
              : t("product_detail_page.out_of_stock_badge")}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-medium">
            {t("product_detail_page.category")}:
          </span>
          <Badge variant="outline">{getCategoryName()}</Badge>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="pt-6 border-t">
        <p className="font-medium mb-3">
          {t("product_detail_page.share_product")}:
        </p>
        <SocialShare
          url={currentUrl}
          title={getProductName()}
          description={getProductDescription()}
        />
      </div>

      {/* Security Badges */}
      <div className="pt-6 border-t">
        <div className="flex flex-wrap gap-6 opacity-60">
          <div className="text-xs text-center hover:text-blue-500">
            <Shield size={30} />
            <span>{t("product_detail_page.secure")}</span>
          </div>
          <div className="text-xs text-center hover:text-purple-500">
            <BookCheck size={30} />
            <span>{t("product_detail_page.trusted")}</span>
          </div>
          <div className="text-xs text-center hover:text-green-500">
            <BadgeCheck size={30} />
            <span>{t("product_detail_page.guaranteed")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
