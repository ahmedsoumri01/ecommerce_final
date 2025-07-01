"use client";
import { useEffect } from "react";
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
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useState } from "react";
import { useAuthStore } from "@/stores/auth-store";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useClientDictionary(params.locale);
  const { login, isLoading, user, isAuthenticated, clearError, isHydrated } =
    useAuth();

  const isRTL = params.locale === "ar";
  const error = searchParams.get("error");

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Show error message from URL params
  useEffect(() => {
    if (error === "account-blocked") {
      toast({
        title: "Account Blocked",
        description: "Your account has been blocked. Please contact support.",
      });
    }
  }, [error, toast]);

  // Redirect if already authenticated (only after hydration)
  useEffect(() => {
    if (isHydrated && isAuthenticated && user) {
      const dashboardPath = user.role === "admin" ? "/admin" : "/dashboard";
      router.replace(`/${params.locale}${dashboardPath}`);
    }
  }, [isAuthenticated, user, router, params.locale, isHydrated]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: LoginFormData) => {
    const success = await login(data.email, data.password);

    if (success) {
      // Get the updated user from the store using the hook
      const authStore = useAuthStore.getState();
      if (authStore.user) {
        const dashboardPath =
          authStore.user.role === "admin" ? "/admin" : "/dashboard";
        router.push(`/${params.locale}${dashboardPath}`);
      }
    }
  };

  // Show loading while hydrating
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t("login_page.title")}
          </CardTitle>
          <p className="text-gray-600">{t("login_page.subtitle")}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("login_page.email_label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="admin@admin.com"
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
                    <FormLabel>{t("login_page.password_label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="admin123"
                          className="pl-10 pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("login_page.submit_loading")}
                  </>
                ) : (
                  t("login_page.submit_button")
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("login_page.no_account")}{" "}
              <Link
                href={`/${params.locale}/register`}
                className="text-blue-600 hover:underline"
              >
                {t("login_page.create_account")}
              </Link>
            </p>
          </div>

          {/*  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              {t("login_page.demo_title")}:
            </p>
            <p className="text-sm text-blue-600">
              {t("login_page.demo_email")}: admin@admin.com
            </p>
            <p className="text-sm text-blue-600">
              {t("login_page.demo_password")}: admin123
            </p>
          </div> */}
        </CardContent>
      </Card>
    </div>
  );
}
