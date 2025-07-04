"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/stores/product-store";

interface HeroCarouselProps {
  products: Product[];
  locale: string;
  isRTL?: boolean;
  productsToShow?: 2 | 4;
}

export function HeroCarousel({
  products,
  locale,
  isRTL = false,
  productsToShow = 4,
}: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get random products based on productsToShow prop
  const [displayProducts, setDisplayProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      const randomProducts = shuffled.slice(0, productsToShow);
      setDisplayProducts(randomProducts);
    }
  }, [products, productsToShow]);

  useEffect(() => {
    if (displayProducts.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % displayProducts.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [displayProducts.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % displayProducts.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + displayProducts.length) % displayProducts.length
    );
  };

  const getProductName = (product: Product) => {
    switch (locale) {
      case "ar":
        return product.nameAr || product.name;
      case "fr":
        return product.nameFr || product.name;
      default:
        return product.name;
    }
  };

  const getProductDescription = (product: Product) => {
    switch (locale) {
      case "ar":
        return product.descriptionAr || product.description;
      case "fr":
        return product.descriptionFr || product.description;
      default:
        return product.description;
    }
  };

  if (displayProducts.length === 0) {
    return (
      <div className="relative h-[700px] md:h-[600px] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-xl">Products Not Available</div>
      </div>
    );
  }

  return (
    <div className="relative h-[700px] md:h-[600px] overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
      {displayProducts.map((product, index) => (
        <div
          key={product._id}
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            index === currentSlide
              ? "translate-x-0"
              : index < currentSlide
              ? "-translate-x-full"
              : "translate-x-full"
          }`}
        >
          <div className="container mx-auto pt-12 px-16 h-full flex items-center">
            <div
              className={`grid md:grid-cols-2 gap-8 items-center w-full ${
                isRTL ? "text-right" : "text-left"
              }`}
            >
              <div className="text-white space-y-6">
                <div className="space-y-2">
                  <p className="text-lg opacity-80 uppercase tracking-wide">
                    {product.brand}
                  </p>
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                    {getProductName(product)}
                  </h1>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-3xl flex rtl:flex-row-reverse md:text-4xl font-bold">
                    <span> {product.price}</span> <span> DT</span>
                  </span>
                  {product?.originalPrice ? (
                    product?.originalPrice > product.price && (
                      <span className="text-xl flex rtl:flex-row-reverse opacity-60 line-through text-red-300">
                        <span> {product?.originalPrice}</span>
                        <span> DT</span>
                      </span>
                    )
                  ) : (
                    <span></span>
                  )}
                </div>

                <p className="text-lg opacity-80 max-w-lg line-clamp-3">
                  {getProductDescription(product)
                    .replace(/<[^>]*>/g, "")
                    .substring(0, 150)}
                  ...
                </p>

                <div className="flex items-center gap-2 mb-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      product.inStock
                        ? "bg-green-500/20 text-green-100"
                        : "bg-red-500/20 text-red-100"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  {product.featured && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-100">
                      Featured
                    </span>
                  )}
                </div>

                <div className="sm:flex gap-4">
                  <Link
                    className="m-1"
                    href={`/${locale}/products/${product._id}`}
                  >
                    <Button
                      size="lg"
                      className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      View Product
                    </Button>
                  </Link>
                  <Link className="m-1" href={`/${locale}/products`}>
                    <Button
                      size="lg"
                      variant="outline"
                      className="bg-blue-500 my-1 text-lg px-8 py-3"
                    >
                      Browse All
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
                  {product.images && product.images.length > 0 ? (
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_ASSETS_URL +
                          product?.images[0] || "/placeholder.svg"
                      }
                      alt={getProductName(product)}
                      fill
                      className="object-contain p-4"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src="/placeholder.svg"
                        alt={getProductName(product)}
                        width={300}
                        height={300}
                        className="object-contain opacity-50"
                      />
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                  <span className="text-white text-sm font-medium">
                    {product.category.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      {displayProducts.length > 1 && (
        <>
          <Button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
            {displayProducts.map((_, index) => (
              <Button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 mx-1 rounded-full transition-colors ${
                  index === currentSlide ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
