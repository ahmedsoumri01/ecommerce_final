"use client";

import { useEffect, useState } from "react";
import { useProductStore, type Product } from "@/stores/product-store";
import { Loader2, AlertCircle, Plus, Heart, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { QuickOrderForm } from "@/components/quick-order-form";
import { ProductGallery } from "@/components/product-details/product-gallery-new";
import { Badge } from "@/components/ui/badge";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useCartStore } from "@/lib/store/cart-store";
import { SocialShare } from "@/components/social-share";
import { HtmlContent } from "@/components/ui/html-content";
import { useKpi } from "@/stores/kpi-store";

export default function ProductDetailPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const isRTL = params.locale === "ar";
  const { t } = useClientDictionary(params.locale);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const { getProductById, selectedProduct, isLoading, error, clearError } =
    useProductStore();
  const { addItem } = useCartStore();
  const { visits, incrementProductVisit } = useKpi();

  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

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
  useEffect(() => {
    if (product?._id) {
      incrementProductVisit(product._id);
    }
  }, [product?._id]);
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
  const getCategoryName = () => {
    // Since category is now an object with _id and name
    return product.category.name;
  };
  const description = getProductDescription();
  // Check if description contains HTML tags
  const isHtmlDescription = (description: string) => {
    return /<[^>]*>/g.test(description);
  };
  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8 lg:px-14">
        {/* Mobile layout */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div>
            {" "}
            <ProductGallery
              product={product}
              images={productImages}
              locale={params.locale}
              productName={getProductName()}
            />
          </div>
          {/* Product Name */}
          <div className="lg:block">
            <p className="text-sm text-gray-500 mt-1">
              رقم المنتج: {product.productRef}
            </p>
            <h1 className="text-3xl font-bold leading-tight">
              {getProductName()}
            </h1>
          </div>
          {/* stars Name */}
          <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            </div>
            (543)
          </div>
          {/* Product price */}
          <div className="flex items-center gap-4">
            <span className="text-4xl flex rtl:flex-row-reverse font-bold text-primary">
              <span> {product.price}</span> <span>DT</span>
            </span>
            <div>
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
          </div>
          <div className="w-full">
            <QuickOrderForm
              product={product}
              locale={params.locale}
              isRTL={isRTL}
            />
          </div>{" "}
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
        </div>
        {/* Desktop layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-2">
          <div>
            <div>
              {" "}
              <ProductGallery
                product={product}
                images={productImages}
                locale={params.locale}
                productName={getProductName()}
              />
            </div>
            {/* Product Name */}
            <div className="hidden lg:block">
              <p className="text-sm text-gray-500 mt-1">
                رقم المنتج: {product.productRef}
              </p>
              <h1 className="text-3xl font-bold leading-tight">
                {getProductName()}
              </h1>
            </div>
            {/* stars Name */}
            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              </div>
              (543)
            </div>
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
              {visits !== null && (
                <div className="mt-2 text-xs text-gray-500">
                  Visits: {visits}
                </div>
              )}
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
            </div>
          </div>
          <div className="w-full">
            <QuickOrderForm
              product={product}
              locale={params.locale}
              isRTL={isRTL}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
