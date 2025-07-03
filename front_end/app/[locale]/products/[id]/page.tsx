"use client";

import { useEffect, useState } from "react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductDetails } from "@/components/product-details";
import { useProductStore, type Product } from "@/stores/product-store";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickOrderForm } from "@/components/quick-order-form";

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const isRTL = params.locale === "ar";
  const { getProductById, selectedProduct, isLoading, error, clearError } =
    useProductStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const fetchProduct = async () => {
    try {
      setFetchError(null);
      const fetchedProduct = await getProductById(params.id);

      if (!fetchedProduct) {
        setFetchError("Product not found");
        return;
      }

      setProduct(fetchedProduct);
    } catch (err) {
      console.error("Error fetching product:", err);
      setFetchError("Failed to load product");
    }
  };
  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }

    // Cleanup function
    return () => {
      clearError();
    };
  }, [params.id]);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span>جاري تحميل المنتج...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (error || fetchError) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <Card className="max-w-md w-full mx-4">
          <CardContent className="flex flex-col items-center gap-4 p-6">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                خطأ في تحميل المنتج
              </h2>
              <p className="text-gray-600 mb-4">{error || fetchError}</p>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                إعادة المحاولة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Product not found - ONLY check this after loading is complete
  if (!isLoading && !product && fetchError === "Product not found") {
    /*  notFound(); */
  }

  // If still loading or no product yet, show loading
  if (!product) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isRTL ? "rtl" : "ltr"
        }`}
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span>جاري تحميل المنتج...</span>
        </div>
      </div>
    );
  }

  // Use product images or fallback to placeholder
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ["/placeholder.svg"];

  // Get product name based on locale
  const getProductName = () => {
    switch (params.locale) {
      case "ar":
        return product.nameAr || product.name;
      case "fr":
        return product.nameFr || product.name;
      default:
        return product.name;
    }
  };

  // Get product price
  const getProductPrice = () => product.price;

  // Get product description
  const getProductDescription = () => {
    switch (params.locale) {
      case "ar":
        return product.descriptionAr || product.description;
      case "fr":
        return product.descriptionFr || product.description;
      default:
        return product.description;
    }
  };

  // Fake stock counter for urgency
  const fakeStockLeft = 3 + Math.floor(Math.random() * 3); // 3-5 left

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Mobile layout */}
        <div className="flex flex-col gap-4 lg:hidden">
          {/* Product Gallery */}
          <div className="w-full">
            <ProductGallery
              product={product}
              images={productImages}
              locale={params.locale}
              productName={getProductName()}
            />
          </div>
          {/* Product Name */}
          <h1 className="text-2xl font-bold leading-tight mt-2">
            {getProductName()}
          </h1>
          {/* Price */}
          <div className="text-xl font-semibold text-primary flex gap-2 items-center">
            <span>{getProductPrice()}</span>
            <span>DT</span>
          </div>
          {/* Description */}
          <div className="text-gray-600 leading-relaxed">
            {getProductDescription()}
          </div>
          {/* Quick Order Form */}
          <div>
            <QuickOrderForm
              product={product}
              locale={params.locale}
              isRTL={isRTL}
            />
          </div>
        </div>
        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-12">
          {/* Product Gallery */}
          <div className="w-full lg:w-[500px]">
            <ProductGallery
              product={product}
              images={productImages}
              locale={params.locale}
              productName={getProductName()}
            />
          </div>
          {/* Product Details - manual order */}
          <div className="flex flex-col gap-4">
            {/* Product Name */}
            <h1 className="text-3xl font-bold leading-tight mt-2 lg:hidden">
              {getProductName()}
            </h1>
            {/* Price */}
            <div className="text-2xl font-semibold text-primary flex gap-2 items-center lg:hidden">
              <span>{getProductPrice()}</span>
              <span>DT</span>
            </div>
            {/* Description */}
            <div className="text-gray-700 leading-relaxed lg:hidden">
              {getProductDescription()}
            </div>
            {/* Quick Order Form */}

            <div>
              <QuickOrderForm
                product={product}
                locale={params.locale}
                isRTL={isRTL}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
