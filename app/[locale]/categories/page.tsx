"use client"

import { categories } from "@/lib/data/categories"
import { getProductsByCategory } from "@/lib/data/products"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function CategoriesPage({
  params,
}: {
  params: { locale: string }
}) {
  const isRTL = params.locale === "ar"

  const getCategoryName = (category: any) => {
    switch (params.locale) {
      case "ar":
        return category.nameAr
      case "fr":
        return category.nameFr
      default:
        return category.name
    }
  }

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">جميع الفئات</h1>
          <p className="text-xl max-w-2xl mx-auto">اكتشف مجموعتنا الواسعة من الفئات والمنتجات المتنوعة</p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {categories.map((category) => {
              const productCount = getProductsByCategory(category.name).length
              return (
                <Link key={category.id} href={`/${params.locale}/products?category=${category.name.toLowerCase()}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
                    <CardHeader className="text-center pb-4">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {getCategoryName(category)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {productCount} منتج
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-3">
                        اكتشف أفضل منتجات {getCategoryName(category)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">الفئات الأكثر شعبية</h2>
            <p className="text-xl text-gray-600">الفئات الأكثر طلباً من عملائنا</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => {
              const productCount = getProductsByCategory(category.name).length
              return (
                <Card key={category.id} className="group hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                      {getCategoryName(category)}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      مجموعة متنوعة من منتجات {getCategoryName(category)} عالية الجودة
                    </p>
                    <Badge variant="outline" className="text-lg px-6 py-2">
                      {productCount} منتج متاح
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
