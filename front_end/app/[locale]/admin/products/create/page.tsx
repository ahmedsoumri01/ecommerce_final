"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowLeft,
  Tag,
  DollarSign,
  Package,
  Globe,
  Star,
  Users,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProductStore } from "@/stores/product-store";
import { useCategoryStore } from "@/stores/category-store";
import {
  createProductSchema,
  type CreateProductFormData,
} from "@/lib/validations/product";
import { MultipleImageUpload } from "@/components/ui/multiple-image-upload";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useEffect } from "react";
import { useClientDictionary } from "@/hooks/useClientDictionary";

// Generate unique product reference
const generateProductRef = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `PROD-${timestamp}-${random}`;
};

export default function CreateProductPage({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const { createProduct, isLoading } = useProductStore();
  const { categories, getAllCategories } = useCategoryStore();
  const { t } = useClientDictionary(params.locale);

  const form = useForm<CreateProductFormData>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: "",
      nameAr: "",
      nameFr: "",
      brand: "",
      price: 0,
      originalPrice: 0,
      category: "",
      description: "",
      descriptionAr: "",
      descriptionFr: "",
      inStock: true,
      featured: false,
      productRef: "",
      audience: "public",
      images: [],
    },
  });

  // Load categories
  useEffect(() => {
    getAllCategories();
  }, [getAllCategories]);

  // Auto-generate product reference when component mounts
  useEffect(() => {
    if (!form.getValues("productRef")) {
      form.setValue("productRef", generateProductRef());
    }
  }, [form]);

  const handleGenerateNewRef = () => {
    const newRef = generateProductRef();
    form.setValue("productRef", newRef);
  };

  const onSubmit = async (data: CreateProductFormData) => {
    const success = await createProduct(data);
    if (success) {
      router.push(`/${params.locale}/admin/products`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${params.locale}/admin/products`}>
          <Button variant="outline" size="sm" className="bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("adminDashboard.productsManagement.createProduct.back")}
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("adminDashboard.productsManagement.createProduct.title")}
          </h1>
          <p className="text-gray-600">
            {t("adminDashboard.productsManagement.createProduct.subtitle")}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    {t(
                      "adminDashboard.productsManagement.createProduct.basicInfo"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "adminDashboard.productsManagement.createProduct.productName"
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              placeholder={t(
                                "adminDashboard.productsManagement.createProduct.productNamePlaceholder"
                              )}
                              className="pl-10"
                              disabled={isLoading}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nameAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.arabicName"
                            )}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder={t(
                                  "adminDashboard.productsManagement.createProduct.arabicNamePlaceholder"
                                )}
                                className="pl-10"
                                disabled={isLoading}
                                dir="rtl"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nameFr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.frenchName"
                            )}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder={t(
                                  "adminDashboard.productsManagement.createProduct.frenchNamePlaceholder"
                                )}
                                className="pl-10"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.brand"
                            )}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t(
                                "adminDashboard.productsManagement.createProduct.brandPlaceholder"
                              )}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="productRef"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.productRef"
                            )}
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input
                                {...field}
                                placeholder={t(
                                  "adminDashboard.productsManagement.createProduct.productRefPlaceholder"
                                )}
                                disabled={isLoading}
                                className="font-mono text-sm bg-gray-50"
                                readOnly
                              />
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={handleGenerateNewRef}
                                disabled={isLoading}
                                title={t(
                                  "adminDashboard.productsManagement.createProduct.generateRef"
                                )}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    {t(
                      "adminDashboard.productsManagement.createProduct.pricing"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.price"
                            )}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder={t(
                                  "adminDashboard.productsManagement.createProduct.pricePlaceholder"
                                )}
                                className="pl-10"
                                disabled={isLoading}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.originalPrice"
                            )}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                type="number"
                                step="0.01"
                                min="0"
                                placeholder={t(
                                  "adminDashboard.productsManagement.createProduct.originalPricePlaceholder"
                                )}
                                className="pl-10"
                                disabled={isLoading}
                                onChange={(e) =>
                                  field.onChange(
                                    Number.parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="deliveryFee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "adminDashboard.productsManagement.createProduct.deliveryFee"
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder={t(
                                "adminDashboard.productsManagement.createProduct.deliveryFeePlaceholder"
                              )}
                              className="pl-10"
                              disabled={isLoading}
                              onChange={(e) =>
                                field.onChange(
                                  Number.parseFloat(e.target.value) || 0
                                )
                              }
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Category */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t(
                      "adminDashboard.productsManagement.createProduct.category"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "adminDashboard.productsManagement.createProduct.category"
                          )}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "adminDashboard.productsManagement.createProduct.categoryPlaceholder"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t(
                      "adminDashboard.productsManagement.createProduct.description"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "adminDashboard.productsManagement.createProduct.description"
                          )}
                        </FormLabel>
                        <FormControl>
                          <RichTextEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={t(
                              "adminDashboard.productsManagement.createProduct.descriptionPlaceholder"
                            )}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="descriptionAr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.arabicDescription"
                            )}
                          </FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={t(
                                "adminDashboard.productsManagement.createProduct.arabicDescriptionPlaceholder"
                              )}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="descriptionFr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {t(
                              "adminDashboard.productsManagement.createProduct.frenchDescription"
                            )}
                          </FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder={t(
                                "adminDashboard.productsManagement.createProduct.frenchDescriptionPlaceholder"
                              )}
                              disabled={isLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Images */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t(
                      "adminDashboard.productsManagement.createProduct.productImages"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <MultipleImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                            maxFiles={10}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t(
                      "adminDashboard.productsManagement.createProduct.settings"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="inStock"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            {t(
                              "adminDashboard.productsManagement.createProduct.inStock"
                            )}
                          </FormLabel>
                          <p className="text-sm text-gray-600">
                            {t(
                              "adminDashboard.productsManagement.createProduct.inStockDesc"
                            )}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center">
                            <Star className="h-4 w-4 mr-2" />
                            {t(
                              "adminDashboard.productsManagement.createProduct.featured"
                            )}
                          </FormLabel>
                          <p className="text-sm text-gray-600">
                            {t(
                              "adminDashboard.productsManagement.createProduct.featuredDesc"
                            )}
                          </p>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {t(
                            "adminDashboard.productsManagement.createProduct.audience"
                          )}
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                            disabled={isLoading}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t(
                                  "adminDashboard.productsManagement.createProduct.audiencePlaceholder"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">
                                {t(
                                  "adminDashboard.productsManagement.createProduct.public"
                                )}
                              </SelectItem>
                              <SelectItem value="private">
                                {t(
                                  "adminDashboard.productsManagement.createProduct.private"
                                )}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t(
                    "adminDashboard.productsManagement.createProduct.creating"
                  )}
                </>
              ) : (
                t("adminDashboard.productsManagement.createProduct.create")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${params.locale}/admin/products`)}
              disabled={isLoading}
              className="bg-transparent"
            >
              {t("adminDashboard.productsManagement.createProduct.cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
