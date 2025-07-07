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
import { ArrowLeft, User, Mail, Lock, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import {
  createUserSchema,
  type CreateUserFormData,
} from "@/lib/validations/user";
import { useState } from "react";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function CreateUserPage({
  params,
}: {
  params: { locale: string };
}) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { createUser, isLoading } = useUserStore();
  const { t } = useClientDictionary(params.locale);

  const form = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: "client",
    },
  });

  const onSubmit = async (data: CreateUserFormData) => {
    const success = await createUser(data);

    if (success) {
      router.push(`/${params.locale}/admin/users`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Link href={`/${params.locale}/admin/users`}>
          <Button variant="outline" size="sm" className="bg-transparent">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("adminDashboard.userManagement.createUser.back")}
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("adminDashboard.userManagement.createUser.title")}
          </h1>
          <p className="text-gray-600">
            {t("adminDashboard.userManagement.createUser.subtitle")}
          </p>
        </div>
      </div>

      {/* Create User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            {t("adminDashboard.userManagement.createUser.userInfo")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t(
                          "adminDashboard.userManagement.createUser.firstName"
                        )}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder={t(
                              "adminDashboard.userManagement.createUser.firstNamePlaceholder"
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

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("adminDashboard.userManagement.createUser.lastName")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t(
                            "adminDashboard.userManagement.createUser.lastNamePlaceholder"
                          )}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("adminDashboard.userManagement.createUser.email")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder={t(
                            "adminDashboard.userManagement.createUser.emailPlaceholder"
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("adminDashboard.userManagement.createUser.password")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={t(
                            "adminDashboard.userManagement.createUser.passwordPlaceholder"
                          )}
                          className="pl-10 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword
                            ? t("adminDashboard.userManagement.createUser.hide")
                            : t(
                                "adminDashboard.userManagement.createUser.show"
                              )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("adminDashboard.userManagement.createUser.role")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="pl-10">
                            <SelectValue
                              placeholder={t(
                                "adminDashboard.userManagement.createUser.rolePlaceholder"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="client">
                              {t(
                                "adminDashboard.userManagement.createUser.client"
                              )}
                            </SelectItem>
                            <SelectItem value="admin">
                              {t(
                                "adminDashboard.userManagement.createUser.admin"
                              )}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("adminDashboard.userManagement.createUser.creating")}
                    </>
                  ) : (
                    t("adminDashboard.userManagement.createUser.create")
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${params.locale}/admin/users`)}
                  disabled={isLoading}
                  className="bg-transparent"
                >
                  {t("adminDashboard.userManagement.createUser.cancel")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
