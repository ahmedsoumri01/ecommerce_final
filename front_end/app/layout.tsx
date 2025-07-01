import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TuniKado",
  description:
    "TuniKado - Boutique en ligne d’accessoires et vêtements tendance en Tunisie.",
  manifest: "/manifest.json",
  /*  themeColor: "#3b82f6", */
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "TuniKado",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "TuniKado",
    url: "https://www.tunikado.tn",
    title: "TuniKado - Mode & Accessoires en ligne",
    description:
      "Découvrez les dernières tendances en vêtements et accessoires de mode chez TuniKado.",
    images: [
      {
        url: "/metadata/og-image.png",
        width: 1200,
        height: 630,
        alt: "TuniKado - Boutique en ligne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@tunikado", // Replace with your Twitter handle if available
    title: "TuniKado - Mode & Accessoires en ligne",
    description:
      "Boutique en ligne tunisienne spécialisée dans la vente de vêtements et accessoires fashion.",
    images: ["/images/og-image.png"],
  },
  generator: "Next.js + TypeScript + i18n + PWA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta name="application-name" content="TuniKado" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TuniKado" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />

        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/icon-72x72.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/icon-72x72.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon-512x512.png" color="#3b82f6" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
