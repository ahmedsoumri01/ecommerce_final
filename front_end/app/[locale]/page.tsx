"use client";
import IphoneImage from "@/public/images/iphone.jpg";
import { HeroCarousel } from "@/components/hero-carousel";
import { CategoriesCarousel } from "@/components/categories-carousel";
import { ProductCard } from "@/components/product-card";
import { BrandsSection } from "@/components/brands-section";
import { NewsletterSection } from "@/components/newsletter-section";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts } from "@/lib/data/products";
import Link from "next/link";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { Product, useProductStore } from "@/stores/product-store";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage({ params }: { params: { locale: string } }) {
  const isRTL = params.locale === "ar";
  const { t } = useClientDictionary(params.locale);

  // Product store
  const { products, getAllProducts, isLoading } = useProductStore();

  // Local state for featured products
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  // Fetch products on component mount
  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);
  // Update featured products when products change
  useEffect(() => {
    if (products.length > 0) {
      // Get random 8 products (you can change this number)
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const randomProducts = shuffled.slice(0, 8);
      setFeaturedProducts(randomProducts);
    }
  }, [products]);
  const heroSlides = [
    {
      id: 1,
      title: t("home_page.hero.title_1"),
      subtitle: t("home_page.hero.subtitle_1"),
      description: t("home_page.hero.description_1"),
      image: IphoneImage.src,
      cta: t("home_page.hero.cta"),
      ctaLink: `/${params.locale}/products`,
    },
    {
      id: 2,
      title: t("home_page.hero.title_2"),
      subtitle: t("home_page.hero.subtitle_2"),
      description: t("home_page.hero.description_2"),
      image: IphoneImage.src,
      cta: t("home_page.hero.cta"),
      ctaLink: `/${params.locale}/products`,
    },
  ];
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
  return (
    <div className={isRTL ? "rtl" : "ltr"}>
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} isRTL={isRTL} />

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
                  لا توجد منتجات متاحة حالياً
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
