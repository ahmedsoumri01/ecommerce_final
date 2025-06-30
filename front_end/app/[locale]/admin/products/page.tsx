"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";
import { products } from "@/lib/data/products";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/admin/product-form";

export default function AdminProductsPage({
  params,
}: {
  params: { locale: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const { toast } = useToast();
  const isRTL = params.locale === "ar";

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.nameAr.includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (productId: number) => {
    toast({
      title: "تم حذف المنتج بنجاح! ✅",
      description: "تم حذف المنتج من قاعدة البيانات",
      duration: 3000,
    });
  };

  const handleSave = (productData: any) => {
    toast({
      title: selectedProduct
        ? "تم تحديث المنتج بنجاح! ✅"
        : "تم إضافة المنتج بنجاح! ✅",
      description: selectedProduct
        ? "تم تحديث بيانات المنتج"
        : "تم إضافة المنتج الجديد",
      duration: 3000,
    });
    setIsCreateOpen(false);
    setIsEditOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/${params.locale}/admin`}>
            <Button variant="outline" size="icon" className="bg-transparent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">إدارة المنتجات</h1>
            <p className="text-gray-600">إضافة وتعديل وحذف المنتجات</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                إضافة منتج جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
              </DialogHeader>
              <ProductForm onSave={handleSave} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن المنتجات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="bg-transparent">
                تصفية
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>المنتجات ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المنتج</TableHead>
                  <TableHead>الفئة</TableHead>
                  <TableHead>السعر</TableHead>
                  <TableHead>المخزون</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                        <div>
                          <p className="font-medium">{product.nameAr}</p>
                          <p className="text-sm text-gray-600">
                            {product.brand}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.categoryAr}</TableCell>
                    <TableCell> {product.price} DT</TableCell>
                    <TableCell>
                      <Badge
                        variant={product.inStock ? "default" : "destructive"}
                      >
                        {product.inStock ? "متوفر" : "نفد المخزون"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.featured ? "default" : "secondary"}
                      >
                        {product.featured ? "مميز" : "عادي"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={
                            isViewOpen && selectedProduct?.id === product.id
                          }
                          onOpenChange={setIsViewOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-transparent"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>تفاصيل المنتج</DialogTitle>
                            </DialogHeader>
                            {selectedProduct && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">
                                      اسم المنتج (عربي)
                                    </label>
                                    <p className="text-gray-600">
                                      {selectedProduct.nameAr}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      اسم المنتج (إنجليزي)
                                    </label>
                                    <p className="text-gray-600">
                                      {selectedProduct.name}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      العلامة التجارية
                                    </label>
                                    <p className="text-gray-600">
                                      {selectedProduct.brand}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">
                                      السعر
                                    </label>
                                    <p className="text-gray-600">
                                      {selectedProduct.price} DT
                                    </p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">
                                    الوصف
                                  </label>
                                  <p className="text-gray-600">
                                    {selectedProduct.descriptionAr}
                                  </p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={
                            isEditOpen && selectedProduct?.id === product.id
                          }
                          onOpenChange={setIsEditOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-transparent"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>تعديل المنتج</DialogTitle>
                            </DialogHeader>
                            <ProductForm
                              product={selectedProduct}
                              onSave={handleSave}
                            />
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
