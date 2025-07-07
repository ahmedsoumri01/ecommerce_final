"use client";

import { useEffect } from "react";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { Footer } from "@/components/footer";

export default function ClientLayout({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  const { t } = useClientDictionary(locale);
  const isRTL = locale === "ar";

  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => console.warn("SW registration failed:", err));
      });
    }
  }, []);

  return (
    <>
      {/* Show PWA install prompt */}
      {children}
      <Footer dict={t("footer")} locale={locale} isRTL={isRTL} />
    </>
  );
}
