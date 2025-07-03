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
    <html lang="fr">
      <head>
        {/* SEO Meta Tags */}
        <meta name="application-name" content="TuniKado" />
        <meta
          name="description"
          content="TuniKado - Boutique en ligne d’accessoires et vêtements tendance en Tunisie. Découvrez les dernières tendances en vêtements et accessoires de mode chez TuniKado."
        />
        <meta
          name="keywords"
          content="TuniKado, boutique, vêtements, accessoires, mode, Tunisie, fashion, tendance, cadeaux, shopping en ligne"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://tuni-kado.vercel.app/" />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="TuniKado" />
        <meta property="og:url" content="https://tuni-kado.vercel.app/" />
        <meta
          property="og:title"
          content="TuniKado - Mode & Accessoires en ligne"
        />
        <meta
          property="og:description"
          content="Découvrez les dernières tendances en vêtements et accessoires de mode chez TuniKado."
        />
        <meta property="og:image" content={"/metadata/og-image.png"} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="TuniKado - Boutique en ligne" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tunikado" />
        <meta
          name="twitter:title"
          content="TuniKado - Mode & Accessoires en ligne"
        />
        <meta
          name="twitter:description"
          content="Boutique en ligne tunisienne spécialisée dans la vente de vêtements et accessoires fashion."
        />
        <meta name="twitter:image" content="/metadata/og-image.png" />
        {/* PWA & Icons */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TuniKado" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/icon-152x152.png"
        />
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
        <ClientLayout>{children}</ClientLayout> <Analytics />
      </body>
    </html>
  );
}
