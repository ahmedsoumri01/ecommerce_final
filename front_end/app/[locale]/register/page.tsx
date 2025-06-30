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
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { useState } from "react";

export default function RegisterPage({
  params,
}: {
  params: { locale: string };
}) {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useClientDictionary(params.locale);
  const { register, isLoading, user, isAuthenticated, clearError } = useAuth();

  const isRTL = params.locale === "ar";

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const dashboardPath = user.role === "admin" ? "/admin" : "/dashboard";
      router.replace(`/${params.locale}${dashboardPath}`);
    }
  }, [isAuthenticated, user, router, params.locale]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    const success = await register(registerData);

    if (success) {
      toast({
        title: "Registration Successful",
        description: "Please login with your credentials.",
      });
      router.push(`/${params.locale}/login`);
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t("register_page.title")}
          </CardTitle>
          <p className="text-gray-600">{t("register_page.subtitle")}</p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t("register_page.first_name_label")}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            {...field}
                            placeholder={t(
                              "register_page.first_name_placeholder"
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
                        {t("register_page.last_name_label")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={t("register_page.last_name_placeholder")}
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
                    <FormLabel>{t("register_page.email_label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="email"
                          placeholder={t("register_page.email_placeholder")}
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("register_page.phone_label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="tel"
                          placeholder={t("register_page.phone_placeholder")}
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
                    <FormLabel>{t("register_page.password_label")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder={t("register_page.password_placeholder")}
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t("register_page.confirm_password_label")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          {...field}
                          type="password"
                          placeholder={t(
                            "register_page.confirm_password_placeholder"
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

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("register_page.submit_loading")}
                  </>
                ) : (
                  t("register_page.submit_button")
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t("register_page.already_account")}{" "}
              <Link
                href={`/${params.locale}/login`}
                className="text-blue-600 hover:underline"
              >
                {t("register_page.login_link")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
