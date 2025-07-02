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
  useCategoryStore,
  useFilteredCategories,
  type Category,
} from "@/stores/category-store";
import { EditCategoryModal } from "@/components/modals/edit-category-modal";
import { DeleteCategoryDialog } from "@/components/dialogs/delete-category-dialog";

export default function CategoriesManagement({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const {
    getAllCategories,
    isLoading,
    searchQuery,
    setSearchQuery,
    featuredFilter,
    setFeaturedFilter,
    categories,
  } = useCategoryStore();

  const filteredCategories = useFilteredCategories();

  // Modal/Dialog states
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  // Load categories on component mount
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  // Calculate stats
  const totalCategories = categories.length;
  const featuredCategories = categories.filter(
    (category) => category.featured
  ).length;
  const notFeaturedCategories = categories.filter(
    (category) => !category.featured
  ).length;
  const totalProducts = 0; // This would come from a products API call

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleEdit = (category: Category) => {
    setEditCategory(category);
  };

  const handleDelete = (category: Category) => {
    setDeleteCategory(category);
  };

  const handleViewProducts = (category: Category) => {
    const categorySlug = category.name.toLowerCase().replace(/\s+/g, "-");
    router.push(`/${params.locale}/admin/products?category=${categorySlug}`);
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
          <h1 className="text-2xl font-bold">Categories Management</h1>
          <p className="text-muted-foreground">
            Organize your products with categories
          </p>
        </div>
        <Link href={`/${params.locale}/admin/categories/create`}>
          <Button className="flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{totalCategories}</div>
            <p className="text-sm text-muted-foreground">Total Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {featuredCategories}
            </div>
            <p className="text-sm text-muted-foreground">Featured Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">
              {notFeaturedCategories}
            </div>
            <p className="text-sm text-muted-foreground">Regular Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {totalProducts}
            </div>
            <p className="text-sm text-muted-foreground">Total Products</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={featuredFilter === "all" ? "default" : "outline"}
                onClick={() => setFeaturedFilter("all")}
                className={featuredFilter !== "all" ? "bg-transparent" : ""}
              >
                All
              </Button>
              <Button
                variant={featuredFilter === "featured" ? "default" : "outline"}
                onClick={() => setFeaturedFilter("featured")}
                className={
                  featuredFilter !== "featured" ? "bg-transparent" : ""
                }
              >
                Featured
              </Button>
              <Button
                variant={
                  featuredFilter === "not-featured" ? "default" : "outline"
                }
                onClick={() => setFeaturedFilter("not-featured")}
                className={
                  featuredFilter !== "not-featured" ? "bg-transparent" : ""
                }
              >
                Regular
              </Button>
            </div>
          </div>

          {/* Categories Table */}
          <div className="rounded-md border overflow-x-auto">
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading categories...</span>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Translations</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No categories found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCategories.map((category) => (
                      <TableRow key={category._id}>
                        <TableCell>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                            {category.image ? (
                              <img
                                src={getImageUrl(category.image) || ""}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            {category.name}
                            {category.featured && (
                              <Star className="h-4 w-4 ml-2 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {category.nameAr && (
                              <div
                                className="text-sm text-muted-foreground"
                                dir="rtl"
                              >
                                AR: {category.nameAr}
                              </div>
                            )}
                            {category.nameFr && (
                              <div className="text-sm text-muted-foreground">
                                FR: {category.nameFr}
                              </div>
                            )}
                            {!category.nameAr && !category.nameFr && (
                              <span className="text-sm text-muted-foreground">
                                No translations
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {category.icon ? (
                            <Badge variant="secondary">{category.icon}</Badge>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No icon
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              category.featured ? "default" : "secondary"
                            }
                            className={
                              category.featured
                                ? "bg-yellow-100 text-yellow-800"
                                : ""
                            }
                          >
                            {category.featured ? "Featured" : "Regular"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(category.createdAt)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewProducts(category)}
                              className="bg-transparent"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(category)}
                              className="bg-transparent"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(category)}
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
      {editCategory && (
        <EditCategoryModal
          category={editCategory}
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
        />
      )}

      {deleteCategory && (
        <DeleteCategoryDialog
          category={deleteCategory}
          open={!!deleteCategory}
          onOpenChange={(open) => !open && setDeleteCategory(null)}
        />
      )}
    </div>
  );
}
