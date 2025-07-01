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

export default function HomePage({ params }: { params: { locale: string } }) {
  const isRTL = params.locale === "ar";
  const { t } = useClientDictionary(params.locale);

  const featuredProducts = getFeaturedProducts().slice(0, 9);

  const heroSlides = [
    {
      id: 1,
      title: t("home_page.hero.title_1"),
      subtitle: t("home_page.hero.subtitle_1"),
      description: t("home_page.hero.description_1"),
      image: IphoneImage,
      cta: t("home_page.hero.cta"),
      ctaLink: `/${params.locale}/products`,
    },
    {
      id: 2,
      title: t("home_page.hero.title_2"),
      subtitle: t("home_page.hero.subtitle_2"),
      description: t("home_page.hero.description_2"),
      image: IphoneImage,
      cta: t("home_page.hero.cta"),
      ctaLink: `/${params.locale}/products`,
    },
  ];

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
              <Button variant="outline">
                {t("home_page.featured_products.view_all")}
              </Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={params.locale}
                isRTL={isRTL}
              />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href={`/${params.locale}/products`}>
              <Button size="lg" className="px-8">
                {t("home_page.featured_products.show_more")}
              </Button>
            </Link>
          </div>
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
