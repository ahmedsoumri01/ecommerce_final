"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Category } from "@/lib/data/categories";
import Link from "next/link";

interface CategoriesCarouselProps {
  categories: Category[];
  locale: string;
  isRTL?: boolean;
}

export function CategoriesCarousel({
  categories,
  locale,
  isRTL = false,
}: CategoriesCarouselProps) {
  const getCategoryName = (category: Category) => {
    switch (locale) {
      case "ar":
        return category.nameAr;
      case "fr":
        return category.nameFr;
      default:
        return category.name;
    }
  };

  return (
    <div className="w-full">
      <Carousel
        opts={{
          align: "start",
          loop: false,
          direction: isRTL ? "rtl" : "ltr",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <Link
                href={`/${locale}/products?category=${category.name.toLowerCase()}`}
                className="block h-full"
              >
                <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500 h-full">
                  <CardContent className="p-4 md:p-6 text-center space-y-3 md:space-y-4 flex flex-col items-center justify-center h-full min-h-[140px] md:min-h-[160px]">
                    <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-sm md:text-lg group-hover:text-blue-600 transition-colors line-clamp-2">
                      {getCategoryName(category)}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {category.productCount} منتج
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation arrows - hidden on mobile, visible on larger screens */}
        <div className="hidden sm:block">
          <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2" />
        </div>
      </Carousel>

      {/* Mobile indicators/dots */}
      <div className="flex justify-center mt-4 sm:hidden">
        <div className="flex space-x-2">
          {Array.from({ length: Math.ceil(categories.length / 1) }).map(
            (_, index) => (
              <div
                key={index}
                className="w-2 h-2 rounded-full bg-muted-foreground/30"
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
