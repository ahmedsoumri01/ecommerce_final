"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function NotFound({ params }: { params: { locale: string } }) {
  const { t } = useClientDictionary(params.locale);
  const isRTL = params.locale === "ar";

  return (
    <div
      className={`min-h-screen flex items-center justify-center bg-gray-50 ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="text-center space-y-8 max-w-md mx-auto px-4">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-9xl font-bold text-gray-200 select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Search className="h-16 w-16 text-gray-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("not_found.title")}
          </h1>
          <p className="text-gray-600 text-lg">{t("not_found.description")}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={`/${params.locale}`}>
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              {t("not_found.home_button")}
            </Button>
          </Link>
          <Link href={`/${params.locale}/products`}>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-transparent"
            >
              <Search className="mr-2 h-4 w-4" />
              {t("not_found.browse_products")}
            </Button>
          </Link>
        </div>

        {/* Help Text */}
        <div className="pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            {t("not_found.help_text")}{" "}
            <Link
              href={`/${params.locale}/contact`}
              className="text-blue-600 hover:underline"
            >
              {t("not_found.contact_us")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
