"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Star,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductStore, type Product } from "@/stores/product-store";
import { EditProductModal } from "@/components/modals/edit-product-modal";
import { DeleteProductDialog } from "@/components/dialogs/delete-product-dialog";

export default function ProductDetailsPage({
  params,
}: {
  params: { locale: string; id: string };
}) {
  const router = useRouter();
  const { getProductById, selectedProduct, isLoading } = useProductStore();
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);

  useEffect(() => {
    getProductById(params.id);
  }, [params.id, getProductById]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith("http")) return imagePath;
    return `${
      process.env.NEXT_PUBLIC_ASSETS_URL || "http://localhost:5000"
    }${imagePath}`;
  };

  const handleEdit = () => {
    setEditProduct(selectedProduct);
  };

  const handleDelete = () => {
    setDeleteProduct(selectedProduct);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading product...</span>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Package className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Product not found
        </h2>
        <p className="text-gray-600 mb-4">
          The product you're looking for doesn't exist.
        </p>
        <Link href={`/${params.locale}/admin/products`}>
          <Button variant="outline" className="bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/${params.locale}/admin/products`}>
            <Button variant="outline" size="sm" className="bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              {selectedProduct.name}
              {selectedProduct.featured && (
                <Star className="h-6 w-6 ml-2 text-yellow-500 fill-current" />
              )}
            </h1>
            <p className="text-gray-600">
              Product Reference: {selectedProduct.productRef}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleEdit} className="flex items-center">
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedProduct.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedProduct.images.map((image, index) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden bg-gray-100"
                    >
                      <img
                        src={getImageUrl(image) || "/placeholder.svg"}
                        alt={`${selectedProduct.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>No images available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 p-2">
                  <h4 className="font-medium mb-2">English</h4>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: selectedProduct.description,
                    }}
                  />
                </div>

                {selectedProduct.descriptionAr && (
                  <div className="border-2 p-2">
                    <h4 className="font-medium mb-2">Arabic</h4>
                    <div
                      className="prose prose-sm max-w-none"
                      dir="rtl"
                      dangerouslySetInnerHTML={{
                        __html: selectedProduct.descriptionAr,
                      }}
                    />
                  </div>
                )}

                {selectedProduct.descriptionFr && (
                  <div className="border-2 p-2">
                    <h4 className="font-medium mb-2">French</h4>
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: selectedProduct.descriptionFr,
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Brand
                </label>
                <p className="text-lg">{selectedProduct.brand}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Category
                </label>
                <p className="text-lg">
                  <Badge variant="secondary">
                    {selectedProduct.category.name}
                  </Badge>
                </p>
              </div>

              {selectedProduct.nameAr && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Arabic Name
                  </label>
                  <p className="text-lg" dir="rtl">
                    {selectedProduct.nameAr}
                  </p>
                </div>
              )}

              {selectedProduct.nameFr && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    French Name
                  </label>
                  <p className="text-lg">{selectedProduct.nameFr}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Current Price
                </label>
                <p className="text-2xl font-bold text-green-600 flex rtl:flex-row-reverse">
                  <span> {selectedProduct.price} </span>
                  <span>DT</span>
                </p>
              </div>
              {selectedProduct.deliveryFee &&
                selectedProduct.deliveryFee > 0 && (
                  <span className="text-sm text-green-500 ml-2">
                    + {selectedProduct.deliveryFee} DT delivery fee
                  </span>
                )}
              {selectedProduct.originalPrice &&
                selectedProduct.originalPrice > selectedProduct.price && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Original Price
                    </label>
                    <p className="text-lg text-gray-500 line-through flex rtl:flex-row-reverse">
                      <span>{selectedProduct.originalPrice} </span>
                      <span>DT</span>
                    </p>
                    <p className="text-sm text-green-600 flex rtl:flex-row-reverse">
                      Save{" "}
                      <span>
                        {" "}
                        {selectedProduct.originalPrice - selectedProduct.price}
                      </span>
                      <span>DT</span>
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Stock Status</span>
                <Badge
                  variant={selectedProduct.inStock ? "default" : "destructive"}
                  className={
                    selectedProduct.inStock ? "bg-green-100 text-green-800" : ""
                  }
                >
                  {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Featured</span>
                <Badge
                  variant={selectedProduct.featured ? "default" : "secondary"}
                  className={
                    selectedProduct.featured
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                  }
                >
                  {selectedProduct.featured ? "Featured" : "Regular"}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Audience</span>
                <Badge
                  variant={
                    selectedProduct.audience === "public"
                      ? "default"
                      : "secondary"
                  }
                  className={
                    selectedProduct.audience === "public"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }
                >
                  <Users className="h-3 w-3 mr-1" />
                  {selectedProduct.audience}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Timestamps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created
                </label>
                <p className="text-sm">
                  {formatDate(selectedProduct.createdAt)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Last Updated
                </label>
                <p className="text-sm">
                  {formatDate(selectedProduct.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals and Dialogs */}
      <EditProductModal
        product={editProduct}
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
      />

      <DeleteProductDialog
        product={deleteProduct}
        open={!!deleteProduct}
        onOpenChange={(open) => !open && setDeleteProduct(null)}
      />
    </div>
  );
}
