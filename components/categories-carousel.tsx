"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Category } from "@/lib/data/categories"
import Link from "next/link"

interface CategoriesCarouselProps {
  categories: Category[]
  locale: string
  isRTL?: boolean
}

export function CategoriesCarousel({ categories, locale, isRTL = false }: CategoriesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 5
  const maxIndex = Math.max(0, categories.length - itemsPerView)

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }

  const getCategoryName = (category: Category) => {
    switch (locale) {
      case "ar":
        return category.nameAr
      case "fr":
        return category.nameFr
      default:
        return category.name
    }
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out gap-4"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/products?category=${category.name.toLowerCase()}`}
              className="flex-shrink-0 w-1/5"
            >
              <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                    {getCategoryName(category)}
                  </h3>
                  <p className="text-sm text-muted-foreground">{category.productCount} منتج</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl border rounded-full p-2 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}
      {currentIndex < maxIndex && (
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl border rounded-full p-2 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}
