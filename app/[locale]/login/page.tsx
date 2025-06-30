"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function LoginPage({ params }: { params: { locale: string } }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useClientDictionary(params.locale);
  const isRTL = params.locale === "ar";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check admin credentials
    if (
      formData.email === "admin@admin.com" &&
      formData.password === "admin123"
    ) {
      toast({
        title: t("login_page.toast.success_title"),
        description: t("login_page.toast.success_description"),
        duration: 3000,
      });
      router.push(`/${params.locale}/admin`);
    } else {
      toast({
        title: t("login_page.toast.error_title"),
        description: t("login_page.toast.error_description"),
        duration: 3000,
      });
    }

    setIsLoading(false);
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
            {t("login_page.title")}
          </CardTitle>
          <p className="text-gray-600">{t("login_page.subtitle")}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                {t("login_page.email_label")}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@admin.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
              >
                {t("login_page.password_label")}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="admin123"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

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

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium">
              {t("login_page.demo_title")}:
            </p>
            <p className="text-sm text-blue-600">
              {t("login_page.demo_email")}: admin@admin.com
            </p>
            <p className="text-sm text-blue-600">
              {t("login_page.demo_password")}: admin123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
