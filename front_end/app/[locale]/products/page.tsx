"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchBar } from "@/components/search-bar";
import { useSearchParams } from "next/navigation";
import { Filter, X, SlidersHorizontal, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useProductStore } from "@/stores/product-store";
import {
  useCategoryStore,
  useFilteredCategories,
} from "@/stores/category-store";

export default function ProductsPage({
  params,
}: {
  params: { locale: string };
}) {
  const isRTL = params.locale === "ar";
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  // Make selectedCategory case-insensitive by normalizing to lowercase
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategory ? [selectedCategory.toLowerCase()] : []
  );
  const { t } = useClientDictionary(params.locale);

  // Store hooks
  const {
    products,
    isLoading: productsLoading,
    error: productsError,
    getAllProducts,
    searchQuery,
    setSearchQuery,
  } = useProductStore();

  const {
    categories,
    isLoading: categoriesLoading,
    error: categoriesError,
    getAllCategories,
  } = useCategoryStore();

  const filteredCategories = useFilteredCategories();

  // Local state for filters
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch data on component mount - using useCallback to prevent infinite loops
  const fetchData = useCallback(() => {
    getAllProducts();
    getAllCategories();
  }, [getAllProducts, getAllCategories]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoize brands to prevent recalculation
  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  // Memoize filtered products to prevent infinite re-renders
  const localFilteredProducts = useMemo(() => {
    let result = [...products]; // Create a copy to avoid mutations

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some((catName) => {
          const category = filteredCategories.find(
            (cat) => cat.name.toLowerCase() === catName.toLowerCase()
          );
          return category ? product.category._id === category._id : false;
        })
      );
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (product.nameAr && product.nameAr.includes(searchQuery)) ||
          (product.nameFr &&
            product.nameFr.toLowerCase().includes(searchQuery.toLowerCase())) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.productRef.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    result = result.filter(
      (product) =>
        product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by brands
    if (selectedBrands.length > 0) {
      result = result.filter((product) =>
        selectedBrands.includes(product.brand)
      );
    }

    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [
    products,
    selectedCategories,
    searchQuery,
    priceRange,
    selectedBrands,
    sortBy,
    filteredCategories,
  ]);

  // Memoize category name function
  const getCategoryName = useCallback(
    (categoryName: string) => {
      const category = filteredCategories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (!category) return categoryName;

      switch (params.locale) {
        case "ar":
          return category.nameAr || category.name;
        case "fr":
          return category.nameFr || category.name;
        default:
          return category.name;
      }
    },
    [filteredCategories, params.locale]
  );

  // Memoize products by category function
  const getProductsByCategory = useCallback(
    (categoryName: string) => {
      const category = filteredCategories.find(
        (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      if (!category) return [];

      return products.filter(
        (product) => product.category._id === category._id
      );
    },
    [filteredCategories, products]
  );

  // Event handlers with useCallback to prevent re-renders
  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
    },
    [setSearchQuery]
  );

  const handleBrandChange = useCallback((brand: string, checked: boolean) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, brand] : prev.filter((b) => b !== brand)
    );
  }, []);

  const handleCategoryChange = useCallback(
    (category: string, checked: boolean) => {
      setSelectedCategories((prev) =>
        checked ? [...prev, category] : prev.filter((c) => c !== category)
      );
    },
    []
  );

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSelectedCategories(selectedCategory ? [selectedCategory] : []);
    setSortBy("featured");
  }, [setSearchQuery, selectedCategory]);

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>جاري تحميل المنتجات...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (productsError || categoriesError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">حدث خطأ في تحميل البيانات</p>
          <Button onClick={fetchData}>إعادة المحاولة</Button>
        </div>
      </div>
    );
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          {t("all_products_page.price_range")}
        </Label>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={5000}
            min={0}
            step={50}
            className="mb-4"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>{priceRange[0]} DT</span>
            <span>{priceRange[1]} DT</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          {t("all_products_page.categories")}
        </Label>
        <div className="space-y-3">
          {filteredCategories.map((category) => (
            <div key={category._id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category._id}`}
                checked={selectedCategories.includes(
                  category.name.toLowerCase()
                )}
                onCheckedChange={(checked) =>
                  handleCategoryChange(
                    category.name.toLowerCase(),
                    checked as boolean
                  )
                }
              />
              <Label
                htmlFor={`category-${category._id}`}
                className="text-sm cursor-pointer"
              >
                {getCategoryName(category.name)} (
                {getProductsByCategory(category.name).length})
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          {t("all_products_page.brands")}
        </Label>
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedBrands.includes(brand)}
                onCheckedChange={(checked) =>
                  handleBrandChange(brand, checked as boolean)
                }
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="text-sm cursor-pointer"
              >
                {brand} ({products.filter((p) => p.brand === brand).length})
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearFilters}
        className="w-full bg-transparent"
      >
        <X className="h-4 w-4 mr-2" />
        {t("all_products_page.clear_filters")}
      </Button>
    </div>
  );

  return (
    <div className={`${isRTL ? "rtl" : "ltr"}`}>
      {/* Header Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            {selectedCategories.length > 0
              ? `${t("all_products_page.discover")} ${getCategoryName(
                  selectedCategories[0]
                )}`
              : t("all_products_page.header_title")}
          </h1>
          <p className="text-xl text-muted-foreground">
            {selectedCategories.length > 0
              ? `اكتشف مجموعة ${getCategoryName(selectedCategories[0])}`
              : t("all_products_page.header_subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              onSearch={handleSearchChange}
              placeholder={t("all_products_page.search_placeholder")}
            />
          </div>
          <div className="block md:flex items-center gap-4">
            {/* Sort Dropdown */}
            <select
              title="sort_products_select"
              name="sort select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 ml-1 border rounded-lg bg-white"
            >
              <option value="featured">
                {t("all_products_page.sort.featured")}
              </option>
              <option value="price-low">
                {t("all_products_page.sort.price_low")}
              </option>
              <option value="price-high">
                {t("all_products_page.sort.price_high")}
              </option>
              <option value="rating">
                {t("all_products_page.sort.rating")}
              </option>
              <option value="newest">
                {t("all_products_page.sort.newest")}
              </option>
            </select>

            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden bg-transparent">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {t("all_products_page.filter_products")}
                </Button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"} className="w-80">
                <SheetHeader>
                  <SheetTitle>
                    {t("all_products_page.filter_products")}
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-80">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t("all_products_page.filter_products")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Active Filters */}
            {(selectedBrands.length > 0 ||
              selectedCategories.length > 0 ||
              searchQuery) && (
              <div className="mb-6">
                <div className="flex flex-wrap gap-2">
                  {selectedBrands.map((brand) => (
                    <Badge key={brand} variant="secondary" className="gap-1">
                      {brand}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleBrandChange(brand, false)}
                      />
                    </Badge>
                  ))}
                  {selectedCategories.map((category) => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {getCategoryName(category)}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleCategoryChange(category, false)}
                      />
                    </Badge>
                  ))}
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      "{searchQuery}"
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSearchQuery("")}
                      />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                عرض {localFilteredProducts.length} من أصل {products.length} منتج
              </p>
            </div>

            {/* Products */}
            {localFilteredProducts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {localFilteredProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                      locale={params.locale}
                      isRTL={isRTL}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    {t("all_products_page.load_more")}
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">
                  {searchQuery
                    ? t("all_products_page.no_results_search")
                    : t("all_products_page.no_results_filters")}
                </p>
                <Button onClick={clearFilters} className="mt-4">
                  {t("all_products_page.clear_filters")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
