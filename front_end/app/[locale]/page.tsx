"use client";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoriesCarousel } from "@/components/categories-carousel";
import { ProductCard } from "@/components/product-card";
import { BrandsSection } from "@/components/brands-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { type Product, useProductStore } from "@/stores/product-store";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage({ params }: { params: { locale: string } }) {
  const isRTL = params.locale === "ar";
  const { t } = useClientDictionary(params.locale);

  // Product store
  const { products, getAllProducts, isLoading } = useProductStore();

  // Local state for featured products
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);

  // Fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  // Update featured products and hero products when products change
  useEffect(() => {
    if (products.length > 0) {
      // Only use products that are in stock
      const inStockProducts = products.filter((p) => p.inStock);
      // Get random products for hero carousel (4 products)
      const shuffledForHero = [...inStockProducts].sort(
        () => 0.5 - Math.random()
      );
      const randomHeroProducts = shuffledForHero.slice(0, 4);
      setHeroProducts(randomHeroProducts);

      // Get random 4 products for featured section (excluding hero products)
      const remainingProducts = inStockProducts.filter(
        (p) => !randomHeroProducts.some((hp) => hp._id === p._id)
      );
      const shuffledForFeatured = [...remainingProducts].sort(
        () => 0.5 - Math.random()
      );
      const randomFeaturedProducts = shuffledForFeatured.slice(0, 4);
      setFeaturedProducts(randomFeaturedProducts);
    }
  }, [products]);

  // Loading skeleton component for products
  const ProductSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );

  // Hero carousel skeleton
  const HeroSkeleton = () => (
    <div className="relative h-[700px] md:h-[600px] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <Skeleton className="h-8 w-32 bg-white/20" />
            <Skeleton className="h-16 w-full bg-white/20" />
            <Skeleton className="h-12 w-48 bg-white/20" />
            <Skeleton className="h-20 w-full bg-white/20" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-32 bg-white/20" />
              <Skeleton className="h-12 w-32 bg-white/20" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full bg-white/20 rounded-lg" />
        </div>
      </div>
    </div>
  );

  return (
    <div className={isRTL ? "rtl" : "ltr"}>
      {/* Hero Carousel with Products */}
      {isLoading ? (
        <HeroSkeleton />
      ) : (
        <HeroCarousel
          products={heroProducts}
          locale={params.locale}
          isRTL={isRTL}
          productsToShow={4} // You can change this to 2 if you want fewer products
        />
      )}

      {/* Categories Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {t("home_page.featured_categories.title")}
            </h2>
            <Link href={`/${params.locale}/categories`}>
              <Button variant="outline">
                {t("home_page.featured_categories.view_all")}
              </Button>
            </Link>
          </div>
          <CategoriesCarousel locale={params.locale} isRTL={isRTL} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">
              {t("home_page.featured_products.title")}
            </h2>
            <Link href={`/${params.locale}/products`}>
              <Button variant="outline" className="bg-transparent">
                {t("home_page.featured_products.view_all")}
              </Button>
            </Link>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? (
              // Show loading skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <ProductSkeleton key={index} />
              ))
            ) : featuredProducts.length > 0 ? (
              // Show actual products
              featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  locale={params.locale}
                  isRTL={isRTL}
                />
              ))
            ) : (
              // Show empty state
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">
                  {isRTL
                    ? "لا توجد منتجات متاحة حالياً"
                    : "No products available"}
                </p>
              </div>
            )}
          </div>

          {/* Show More Button */}
          {featuredProducts.length > 0 && (
            <div className="text-center mt-12">
              <Link href={`/${params.locale}/products`}>
                <Button size="lg" className="px-8">
                  {t("home_page.featured_products.show_more")}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Brands Section */}
      <BrandsSection />

      {/* Newsletter Section */}
      <NewsletterSection dict={t("home_page")} isRTL={isRTL} />

      {/* Footer */}
      <Footer dict={t("footer")} locale={params.locale} isRTL={isRTL} />
    </div>
  );
}
