"use client";

import { InstallPrompt } from "@/components/install-prompt";
import { useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <InstallPrompt dict={require("@/lib/dictionaries/ar.json")} />
      {children}
    </>
  );
}
