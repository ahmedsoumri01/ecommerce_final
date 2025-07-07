"use client";

import { useEffect } from "react";
import {
  useCategoryStore,
  useFilteredCategories,
} from "@/stores/category-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { AlertCircle } from "lucide-react";
import Image from "next/image";

export default function CategoriesPage({
  params,
}: {
  params: { locale: string };
}) {
  const isRTL = params.locale === "ar";
  const { t } = useClientDictionary(params.locale);

  // Get store state and actions
  const { getAllCategories, isLoading, error } = useCategoryStore();
  const filteredCategories = useFilteredCategories();

  // Fetch categories on component mount
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  const getCategoryName = (category: any) => {
    switch (params.locale) {
      case "ar":
        return category.nameAr || category.name;
      case "fr":
        return category.nameFr || category.name;
      default:
        return category.name;
    }
  };

  // Loading skeleton component
  const CategorySkeleton = () => (
    <Card className="border-2">
      <CardHeader className="text-center pb-4">
        <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
        <Skeleton className="h-6 w-32 mx-auto" />
      </CardHeader>
      <CardContent className="text-center">
        <Skeleton className="h-8 w-20 mx-auto mb-3" />
        <Skeleton className="h-4 w-40 mx-auto" />
      </CardContent>
    </Card>
  );

  // Error state
  if (error && !isLoading) {
    return (
      <div className={`${isRTL ? "rtl" : "ltr"}`}>
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              {t("all_categories_page.header_title")}
            </h1>
            <p className="text-xl max-w-2xl mx-auto">
              {t("all_categories_page.header_subtitle")}
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <Alert variant="destructive" className="max-w-md mx-auto">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {/* Header Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t("all_categories_page.header_title")}
          </h1>
          <p className="text-xl max-w-2xl mx-auto">
            {t("all_categories_page.header_subtitle")}
          </p>
        </div>
      </section>
      {filteredCategories.length === 0 && (
        <div className="w-full flex justify-center items-center py-8">
          <div className="text-muted-foreground">لا توجد فئات متاحة</div>
        </div>
      )}
      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 8 }).map((_, index) => (
                <CategorySkeleton key={index} />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/${
                    params.locale
                  }/products?category=${category.name.toLowerCase()}`}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500">
                    <CardHeader className="text-center pb-4">
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                        {category?.image ? (
                          <Image
                            alt="categorie image"
                            src={
                              process.env.NEXT_PUBLIC_ASSETS_URL +
                                category?.image || "/placeholder.svg"
                            }
                            width={500}
                            height={500}
                          />
                        ) : (
                          category.icon || "📦"
                        )}
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {getCategoryName(category)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Badge variant="secondary" className="text-lg px-4 py-2">
                        {t("all_categories_page.product_label")} ({" "}
                        {category.publicProductCount} )
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-3">
                        {t("all_categories_page.explore_label")}{" "}
                        {getCategoryName(category)}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
