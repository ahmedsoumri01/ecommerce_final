"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Loader2,
  Star,
  ImageIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useProductStore,
  useFilteredProducts,
  type Product,
} from "@/stores/product-store";
import { useCategoryStore } from "@/stores/category-store";
import { EditProductModal } from "@/components/modals/edit-product-modal";
import { DeleteProductDialog } from "@/components/dialogs/delete-product-dialog";

export default function ProductsManagement({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const {
    getAllProducts,
    isLoading,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    stockFilter,
    setStockFilter,
    featuredFilter,
    setFeaturedFilter,
    audienceFilter,
    setAudienceFilter,
    products,
  } = useProductStore();

  const { getAllCategories, categories } = useCategoryStore();
  const filteredProducts = useFilteredProducts();

  // Modal/Dialog states
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  // Load data on component mount
  useEffect(() => {
    getAllProducts();
    getAllCategories();
  }, [getAllProducts, getAllCategories]);

  // Calculate stats
  const totalProducts = products.length;
  const inStockProducts = products.filter((product) => product.inStock).length;
  const outOfStockProducts = products.filter(
    (product) => !product.inStock
  ).length;
  const featuredProducts = products.filter(
    (product) => product.featured
  ).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
  };

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/${params.locale}/admin/products/${product._id}`);
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http")) return imagePath;
    return `${
      process.env.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000"
    }${imagePath}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">
            Manage your product inventory and details
          </p>
        </div>
        <Link href={`/${params.locale}/admin/products/create`}>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {inStockProducts}
            </div>
            <p className="text-sm text-muted-foreground">In Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">
              {outOfStockProducts}
            </div>
            <p className="text-sm text-muted-foreground">Out of Stock</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {featuredProducts}
            </div>
            <p className="text-sm text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Products List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products by name, brand, or reference..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={stockFilter === "all" ? "default" : "outline"}
                onClick={() => setStockFilter("all")}
                className={stockFilter !== "all" ? "bg-transparent" : ""}
              >
                All Stock
              </Button>
              <Button
                variant={stockFilter === "in-stock" ? "default" : "outline"}
                onClick={() => setStockFilter("in-stock")}
                className={stockFilter !== "in-stock" ? "bg-transparent" : ""}
              >
                In Stock
              </Button>
              <Button
                variant={stockFilter === "out-of-stock" ? "default" : "outline"}
                onClick={() => setStockFilter("out-of-stock")}
                className={
                  stockFilter !== "out-of-stock" ? "bg-transparent" : ""
                }
              >
                Out of Stock
              </Button>
              <Button
                variant={featuredFilter === "featured" ? "default" : "outline"}
                onClick={() =>
                  setFeaturedFilter(
                    featuredFilter === "featured" ? "all" : "featured"
                  )
                }
                className={
                  featuredFilter !== "featured" ? "bg-transparent" : ""
                }
              >
                Featured
              </Button>
              <Button
                variant={audienceFilter === "private" ? "default" : "outline"}
                onClick={() =>
                  setAudienceFilter(
                    audienceFilter === "private" ? "all" : "private"
                  )
                }
                className={audienceFilter !== "private" ? "bg-transparent" : ""}
              >
                Private
              </Button>
            </div>
          </div>

          {/* Products Table */}
          <div className="rounded-md border overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading products...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={9}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product._id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {product.images.length > 0 ? (
                              <img
                                src={getImageUrl(product.images[0]) || ""}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div>
                              <div className="font-medium">{product.name}</div>
                              <div className="text-sm text-muted-foreground">
                                Ref: {product.productRef}
                              </div>
                            </div>
                            {product.featured && (
                              <Star className="h-4 w-4 ml-2 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {product.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium flex rtl:flex-row-reverse">
                              <span>{product.price}</span>
                              <span>DT</span>
                            </div>
                            {product.originalPrice &&
                              product.originalPrice > product.price &&
                              product.originalPrice > 0 && (
                                <div className="text-sm text-red-400 text-muted-foreground line-through flex rtl:flex-row-reverse">
                                  <span> {product.originalPrice} </span>
                                  <span>DT</span>
                                </div>
                              )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              product.inStock ? "default" : "destructive"
                            }
                            className={
                              product.inStock
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={
                                product.featured ? "default" : "secondary"
                              }
                              className={
                                product.featured
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                            >
                              {product.featured ? "Featured" : "Regular"}
                            </Badge>
                            <Badge
                              variant={
                                product.audience === "public"
                                  ? "default"
                                  : "secondary"
                              }
                              className={
                                product.audience === "public"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {product.audience}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(product.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex flex-wrap gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(product)}
                              className="bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="bg-transparent"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals - Rendered outside of table to prevent conflicts */}
      {editProduct && (
        <EditProductModal
          product={editProduct}
          open={!!editProduct}
          onOpenChange={(open) => !open && setEditProduct(null)}
        />
      )}

      {deleteProduct && (
        <DeleteProductDialog
          product={deleteProduct}
          open={!!deleteProduct}
          onOpenChange={(open) => !open && setDeleteProduct(null)}
        />
      )}
    </div>
  );
}
