"use client";
import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { products, getProductsByCategory } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import { SearchBar } from "@/components/search-bar";
import { useSearchParams } from "next/navigation";
import { Filter, X, SlidersHorizontal } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function ProductsPage({
  params,
}: {
  params: { locale: string };
}) {
  const isRTL = params.locale === "ar";
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category");
  const { t } = useClientDictionary(params.locale);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    selectedCategory ? [selectedCategory] : []
  );
  const [sortBy, setSortBy] = useState("featured");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Get unique brands
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

  useEffect(() => {
    let result = products;

    // Filter by category
    if (selectedCategories.length > 0) {
      result = result.filter((product) =>
        selectedCategories.some(
          (cat) => product.category.toLowerCase() === cat.toLowerCase()
        )
      );
    }

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.nameAr.includes(searchQuery) ||
          product.nameFr.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
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
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => b.id - a.id);
        break;
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFilteredProducts(result);
  }, [selectedCategories, searchQuery, priceRange, selectedBrands, sortBy]);

  const getCategoryName = (categoryName: string) => {
    const category = categories.find(
      (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    if (!category) return categoryName;
    switch (params.locale) {
      case "ar":
        return category.nameAr;
      case "fr":
        return category.nameFr;
      default:
        return category.name;
    }
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    if (checked) {
      setSelectedBrands([...selectedBrands, brand]);
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSelectedBrands([]);
    setSelectedCategories(selectedCategory ? [selectedCategory] : []);
    setSortBy("featured");
  };

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
            <span> {priceRange[0]}</span> DT
            <span> {priceRange[1]}</span> DT
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <Label className="text-base font-semibold mb-4 block">
          {t("all_products_page.categories")}
        </Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
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
                htmlFor={`category-${category.id}`}
                className="text-sm cursor-pointer"
              >
                {category.nameAr} ({getProductsByCategory(category.name).length}
                )
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
              ? `${t("all_products_page.discover")} ${getCategoryName(
                  selectedCategories[0]
                )}`
              : t("all_products_page.header_subtitle")}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchBar
              onSearch={setSearchQuery}
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
                عرض {filteredProducts.length} من أصل {products.length} منتج
              </p>
            </div>

            {/* Products */}
            {filteredProducts.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
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
