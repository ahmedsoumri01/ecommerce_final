import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { Analytics } from "@vercel/analytics/next";
const inter = Inter({ subsets: ["latin"] });
import OGImage from "@/public/metadata/og-image.png";
export const metadata: Metadata = {
  metadataBase: new URL("https://tuni-kado.vercel.app/"), // Change to your actual domain
  title: "shop elbaraka",
  description:
    "shop elbaraka - Boutique en ligne d’accessoires et vêtements tendance en Tunisie.",
  manifest: "/manifest.json",
  /*  themeColor: "#3b82f6", */
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "shop elbaraka",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "shop elbaraka",
    url: "https://www.shop-elbaraka.tn",
    title: "shop elbaraka - Mode & Accessoires en ligne",
    description:
      "Découvrez les dernières tendances en vêtements et accessoires de mode chez shop elbaraka.",
    images: [
      {
        url: "/metadata/og-image.png",
        width: 1200,
        height: 630,
        alt: "shop elbaraka - Boutique en ligne",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@shop elbaraka", // Replace with your Twitter handle if available
    title: "shop elbaraka - Mode & Accessoires en ligne",
    description:
      "Boutique en ligne tunisienne spécialisée dans la vente de vêtements et accessoires fashion.",
    images: ["/images/og-image.png"],
  },
  generator: "Next.js + TypeScript + i18n + PWA",
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang="fr">
      <head>
        {/* SEO Meta Tags */}
        <meta name="application-name" content="shop elbaraka" />
        <meta
          name="description"
          content="shop elbaraka - Boutique en ligne d’accessoires et vêtements tendance en Tunisie. Découvrez les dernières tendances en vêtements et accessoires de mode chez shop elbaraka."
        />
        <meta
          name="keywords"
          content="shop elbaraka, boutique, vêtements, accessoires, mode, Tunisie, fashion, tendance, cadeaux, shopping en ligne"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tuni-kado.vercel.app/" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="shop elbaraka" />
        <meta property="og:url" content="https://tuni-kado.vercel.app/" />
        <meta
          property="og:title"
          content="shop elbaraka - Mode & Accessoires en ligne"
        />
        <meta
          property="og:description"
          content="Découvrez les dernières tendances en vêtements et accessoires de mode chez shop elbaraka."
        />
        <meta property="og:image" content={"/metadata/og-image.png"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="shop elbaraka - Boutique en ligne"
        />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@shop elbaraka" />
        <meta
          name="twitter:title"
          content="shop elbaraka - Mode & Accessoires en ligne"
        />
        <meta
          name="twitter:description"
          content="Boutique en ligne tunisienne spécialisée dans la vente de vêtements et accessoires fashion."
        />
        <meta name="twitter:image" content="/metadata/og-image.png" />
        {/* PWA & Icons */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="shop elbaraka" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />

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
        {/* Alternate language links for SEO (add more as needed) */}
        <link
          rel="alternate"
          href="https://tuni-kado.vercel.app/"
          hrefLang="fr"
        />
        <link
          rel="alternate"
          href="https://tuni-kado.vercel.app/en"
          hrefLang="en"
        />
        <link
          rel="alternate"
          href="https://tuni-kado.vercel.app/ar"
          hrefLang="ar"
        />
      </head>
      <body className={inter.className}>
        <ClientLayout locale={params.locale}>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  );
}
