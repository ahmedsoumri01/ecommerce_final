"use client"

import type React from "react"
import { Header } from "@/components/header"
import { InstallPrompt } from "@/components/install-prompt"
import { OfflineIndicator } from "@/components/offline-indicator"
import { Toaster } from "@/components/toaster"

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const isRTL = params.locale === "ar"

  return (
    <div className={`min-h-screen ${isRTL ? "rtl" : "ltr"}`} dir={isRTL ? "rtl" : "ltr"}>
      <Header dict={{ header: { home: "", products: "", about: "", contact: "" } }} locale={params.locale} />
      <main>{children}</main>
      <InstallPrompt dict={{}} />
      <OfflineIndicator />
      <Toaster />
    </div>
  )
}
