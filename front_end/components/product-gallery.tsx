"use client";

import { useState } from "react";
import Image from "next/image";
import {
  BadgeCheck,
  BookCheck,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Shield,
} from "lucide-react";
import { Button } from "./ui/button";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useCartStore } from "@/lib/store/cart-store";
import { Product } from "@/stores/product-store";
import { SocialShare } from "./social-share";
import { Badge } from "./ui/badge";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  product: Product;

  locale: string;
}

export function ProductGallery({
  images,
  locale,
  product,
  productName,
}: ProductGalleryProps) {
  const [quantity, setQuantity] = useState(1);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const { t } = useClientDictionary(locale);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Ensure we have at least one image
  const galleryImages =
    images && images.length > 0 ? images : ["/placeholder.svg"];
  const getProductName = () => {
    switch (locale) {
      case "ar":
        return product.nameAr || product.name;
      case "fr":
        return product.nameFr || product.name;
      default:
        return product.name;
    }
  };
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % galleryImages.length);
  };
  const { addItem } = useCartStore();

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + galleryImages.length) % galleryImages.length
    );
  };
  const getProductDescription = () => {
    switch (locale) {
      case "ar":
        return product.descriptionAr || product.description;
      case "fr":
        return product.descriptionFr || product.description;
      default:
        return product.description;
    }
  };
  const getCategoryName = () => {
    // Since category is now an object with _id and name
    return product.category.name;
  };
  const handleAddToCart = () => {
    addItem(product, quantity);
  };
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => Math.max(1, prev - 1)); // Calculate discount percentage
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;
  return (
    <>
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
          <div
            className="relative w-full h-full cursor-zoom-in flex"
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <Image
              src={
                process.env.NEXT_PUBLIC_ASSETS_URL +
                  galleryImages[selectedImage] || "/placeholder.svg"
              }
              alt={productName}
              fill
              className={`object-cover transition-transform duration-300 max-w-[400px] ${
                isZoomed ? "scale-150" : "scale-100"
              }`}
            />
          </div>

          {/* Navigation Arrows */}
          {galleryImages.length > 1 && (
            <>
              <button
                title="Previous image"
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                title="Next image"
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}

          {/* Image Counter */}
          {galleryImages.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {selectedImage + 1} / {galleryImages.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {galleryImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {galleryImages.map((image, index) => (
              <button
                title={`View image ${index + 1}`}
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md border-2 overflow-hidden transition-colors ${
                  index === selectedImage
                    ? "border-blue-500"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <Image
                  src={
                    process.env.NEXT_PUBLIC_ASSETS_URL + image ||
                    "/placeholder.svg"
                  }
                  alt={`${productName} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
      {/* Product Name */}
      <div className="hidden lg:block">
        <h1 className="text-3xl font-bold leading-tight">{getProductName()}</h1>
        <p className="text-sm text-gray-500 mt-1">
          رقم المنتج: {product.productRef}
        </p>
      </div>

      {/* Price */}
      <div className="hidden  items-center gap-4 lg:flex">
        <span className="text-4xl flex rtl:flex-row-reverse font-bold text-primary">
          <span> {product.price}</span> <span>DT</span>
        </span>
        {hasDiscount ? (
          <>
            <span className="text-xl text-red-500 text-muted-foreground flex rtl:flex-row-reverse line-through">
              <span> {product.originalPrice}</span> <span> DT</span>
            </span>
            <Badge className="bg-red-500 hover:bg-red-600">
              {discountPercentage}% {t("product_detail_page.discount")}
            </Badge>
          </>
        ) : (
          <span></span>
        )}
      </div>
      {/* Quantity and Add to Cart */}
      <div className="space-y-4 mt- hidden lg:block">
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
      <div className="hidden space-y-3 pt-6 py-3 border-t lg:block">
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
      <div className="pt-6 border-t hidden lg:block">
        <p className="font-medium mb-3">
          {t("product_detail_page.share_product")}:
        </p>
        <SocialShare
          url={currentUrl}
          title={getProductName()}
          description={getProductDescription()}
        />
      </div>
    </>
  );
}
