"use client";

import type React from "react";
import NoImage from "@/public/placeholder.jpg";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart-store";
import type { Product } from "@/stores/product-store";

interface ProductCardProps {
  product: Product;
  locale: string;
  isRTL?: boolean;
}

export function ProductCard({
  product,
  locale,
  isRTL = false,
}: ProductCardProps) {
  const { addItem } = useCartStore();

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

  const addToCartText = {
    ar: "إضافة إلى السلة",
    en: "Add to Cart",
    fr: "Ajouter au panier",
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, 1);
  };

  return (
    <Link href={`/${locale}/products/${product._id}`}>
      <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer">
        <div className="relative overflow-hidden">
          {product?.images.length > 0 ? (
            <>
              {" "}
              <Image
                src={process.env.NEXT_PUBLIC_ASSETS_URL + product?.images?.[0]}
                alt={getProductName()}
                width={300}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </>
          ) : (
            <>
              <Image
                src={NoImage}
                alt={getProductName()}
                width={300}
                height={300}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </>
          )}

          {product.originalPrice && product.originalPrice > product.price && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              {Math.round(
                ((product.originalPrice - product.price) /
                  product.originalPrice) *
                  100
              )}
              % خصم
            </Badge>
          )}
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="destructive" className="text-lg px-4 py-2">
                نفد المخزون
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">
                {product.brand}
              </p>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {getProductName()}
              </h3>
            </div>
            <div className={`text-right ${isRTL ? "text-left" : ""}`}>
              <p className="text-2xl flex rtl:flex-row-reverse font-bold text-primary">
                <span> {product.price} </span> <span> DT</span>
              </p>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <p className="text-sm text-red-400 flex rtl:flex-row-reverse text-muted-foreground line-through">
                    <span> {product.originalPrice} </span> <span> DT</span>
                  </p>
                )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {getProductDescription()}
          </p>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < 4 // Default rating of 4 since it's not in your API
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              (4.0) {/* Default rating display */}
            </span>
          </div>

          <Button
            className="w-full"
            disabled={!product.inStock}
            size="lg"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addToCartText[locale as keyof typeof addToCartText]}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
