"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Tag, Globe, Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCategoryStore } from "@/stores/category-store";
import {
  createCategorySchema,
  type CreateCategoryFormData,
} from "@/lib/validations/category";
import { ImageUpload } from "@/components/ui/image-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function CreateCategoryPage({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const { createCategory, isLoading } = useCategoryStore();
  const { t } = useClientDictionary(params.locale);

  const form = useForm<CreateCategoryFormData>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      nameAr: "",
      nameFr: "",
      icon: "",
      featured: false,
      image: undefined,
    },
  });

  const onSubmit = async (data: CreateCategoryFormData) => {
    const success = await createCategory({
      name: data.name,
      nameAr: data.nameAr || undefined,
      nameFr: data.nameFr || undefined,
      icon: data.icon || undefined,
      featured: data.featured,
      image: data.image,
    });

    if (success) {
      router.push(`/${params.locale}/admin/categories`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/${params.locale}/admin/categories`}>
          <Button variant="outline" size="sm" className="bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("adminDashboard.categoriesManagement.createCategory.back")}
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("adminDashboard.categoriesManagement.createCategory.title")}
          </h1>
          <p className="text-gray-600">
            {t("adminDashboard.categoriesManagement.createCategory.subtitle")}
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Tag className="h-5 w-5 mr-2" />
                    {t(
                      "adminDashboard.categoriesManagement.createCategory.categoryInfo"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t(
                            "adminDashboard.categoriesManagement.createCategory.categoryName"
                          )}
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              {...field}
                              placeholder={t(
                                "adminDashboard.categoriesManagement.createCategory.categoryNamePlaceholder"
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
                              "adminDashboard.categoriesManagement.createCategory.arabicName"
                            )}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder={t(
                                  "adminDashboard.categoriesManagement.createCategory.arabicNamePlaceholder"
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
                              "adminDashboard.categoriesManagement.createCategory.frenchName"
                            )}
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                {...field}
                                placeholder={t(
                                  "adminDashboard.categoriesManagement.createCategory.frenchNamePlaceholder"
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

                  <FormField
                    control={form.control}
                    name="featured"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="flex items-center">
                            <Star className="h-4 w-4 mr-2" />
                            {t(
                              "adminDashboard.categoriesManagement.createCategory.featured"
                            )}
                          </FormLabel>
                          <p className="text-sm text-gray-600">
                            {t(
                              "adminDashboard.categoriesManagement.createCategory.featuredDesc"
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
                </CardContent>
              </Card>
            </div>

            {/* Image Upload */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {t(
                      "adminDashboard.categoriesManagement.createCategory.categoryImage"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            disabled={isLoading}
                          />
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
                    "adminDashboard.categoriesManagement.createCategory.creating"
                  )}
                </>
              ) : (
                t("adminDashboard.categoriesManagement.createCategory.create")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/${params.locale}/admin/categories`)}
              disabled={isLoading}
              className="bg-transparent"
            >
              {t("adminDashboard.categoriesManagement.createCategory.cancel")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
