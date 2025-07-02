"use client";

import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import type { Product } from "@/stores/product-store";
import { useEffect } from "react";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { QuickOrderForm } from "./quick-order-form";
import { useKpi } from "@/stores/kpi-store";
import { HtmlContent } from "@/components/ui/html-content";

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
  const { t } = useClientDictionary(locale);
  const { visits, incrementProductVisit } = useKpi();

  useEffect(() => {
    if (product._id) {
      incrementProductVisit(product._id);
    }
  }, [product._id]);

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

  // Check if description contains HTML tags
  const isHtmlDescription = (description: string) => {
    return /<[^>]*>/g.test(description);
  };

  // Calculate discount percentage
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const description = getProductDescription();

  return (
    <div className="space-y-6">
      {/* Product Name */}
      <div className="hidden lg:block">
        <p className="text-sm text-muted-foreground mb-2 rtl:text-end">
          {product.brand}
        </p>
        <h1 className="text-3xl font-bold leading-tight">{getProductName()}</h1>
        <p className="text-sm text-gray-500 mt-1">
          رقم المنتج: {product.productRef}
        </p>
      </div>

      {/* Price */}
      <div className="hidden items-center gap-4 lg:flex">
        <span className="text-4xl flex rtl:flex-row-reverse font-bold text-primary">
          <span> {product.price}</span> <span>DT</span>
        </span>
        {hasDiscount && (
          <>
            <span className="text-xl text-red-500 text-muted-foreground flex rtl:flex-row-reverse line-through">
              <span> {product.originalPrice}</span> <span> DT</span>
            </span>
            <Badge className="bg-red-500 hover:bg-red-600">
              {discountPercentage}% {t("product_detail_page.discount")}
            </Badge>
          </>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-5 w-5 ${
                i < 5 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          (250 {t("product_detail_page.reviews_label")})
        </span>
      </div>

      {/* Description */}
      <div>
        {description && isHtmlDescription(description) ? (
          <HtmlContent
            content={description}
            className={isRTL ? "rtl:text-right" : ""}
          />
        ) : (
          <p className="text-gray-600 leading-relaxed">{description}</p>
        )}

        {visits !== null && (
          <div className="mt-2 text-xs text-gray-500">Visits: {visits}</div>
        )}
      </div>

      <div className="block lg:hidden">
        <QuickOrderForm product={product} locale={locale} isRTL={isRTL} />
      </div>

      <div className="hidden lg:block">
        <QuickOrderForm product={product} locale={locale} isRTL={isRTL} />
      </div>
    </div>
  );
}
