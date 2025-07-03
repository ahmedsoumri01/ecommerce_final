"use client";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import type React from "react";
import { Header } from "@/components/header";
import { OfflineIndicator } from "@/components/offline-indicator";
import { Toaster } from "@/components/toaster";

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const isRTL = params.locale === "ar";
  const { t } = useClientDictionary(params.locale);

  return (
    <div
      className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <Header locale={params.locale} />
      <main>{children}</main>
      <OfflineIndicator />
      <Toaster />
    </div>
  );
}
