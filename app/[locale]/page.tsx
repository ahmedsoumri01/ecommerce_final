"use client"

import { HeroCarousel } from "@/components/hero-carousel"
import { CategoriesCarousel } from "@/components/categories-carousel"
import { ProductCard } from "@/components/product-card"
import { BrandsSection } from "@/components/brands-section"
import { NewsletterSection } from "@/components/newsletter-section"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/data/products"
import { getFeaturedCategories } from "@/lib/data/categories"
import Link from "next/link"

export default function HomePage({
  params,
}: {
  params: { locale: string }
}) {
  const isRTL = params.locale === "ar"
  const featuredProducts = getFeaturedProducts().slice(0, 9)
  const featuredCategories = getFeaturedCategories()

  const heroSlides = [
    {
      id: 1,
      title: isRTL ? "كن واحداً مع موسيقاك" : "Be At One With Your Music",
      subtitle: isRTL ? "سماعات لاسلكية بإلغاء الضوضاء WH-1000XM4" : "WH-1000XM4 Wireless Noise Cancelling",
      description: isRTL
        ? "اكتشف تجربة صوتية لا مثيل لها مع أحدث تقنيات إلغاء الضوضاء"
        : "Experience unparalleled audio with the latest noise cancelling technology",
      image: "/placeholder.svg?height=400&width=600",
      cta: isRTL ? "تسوق الآن" : "Shop Now",
      ctaLink: `/${params.locale}/products`,
    },
    {
      id: 2,
      title: isRTL ? "قوة الأداء في متناول يدك" : "Power Performance in Your Hands",
      subtitle: isRTL ? "ماك بوك برو الجديد مع شريحة M2" : "New MacBook Pro with M2 Chip",
      description: isRTL
        ? "أداء استثنائي للمحترفين والمبدعين"
        : "Exceptional performance for professionals and creators",
      image: "/placeholder.svg?height=400&width=600",
      cta: isRTL ? "اكتشف المزيد" : "Discover More",
      ctaLink: `/${params.locale}/products`,
    },
  ]

  return (
    <div className={isRTL ? "rtl" : "ltr"}>
      {/* Hero Carousel */}
      <HeroCarousel slides={heroSlides} isRTL={isRTL} />

      {/* Categories Carousel */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">الفئات المميزة</h2>
            <Link href={`/${params.locale}/categories`}>
              <Button variant="outline">عرض جميع الفئات</Button>
            </Link>
          </div>
          <CategoriesCarousel categories={featuredCategories} locale={params.locale} isRTL={isRTL} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">المنتجات المميزة</h2>
            <Link href={`/${params.locale}/products`}>
              <Button variant="outline">عرض جميع المنتجات</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={params.locale} isRTL={isRTL} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href={`/${params.locale}/products`}>
              <Button size="lg" className="px-8">
                عرض المزيد من المنتجات
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <BrandsSection />

      {/* Newsletter Section */}
      <NewsletterSection dict={{}} isRTL={isRTL} />

      {/* Footer */}
      <Footer dict={{}} locale={params.locale} isRTL={isRTL} />
    </div>
  )
}
