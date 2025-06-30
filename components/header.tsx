"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ShoppingBag, Menu } from "lucide-react";
import { CartSidebar } from "./cart-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface HeaderProps {
  dict: any;
  locale: string;
}

export function Header({ dict, locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isRTL = locale === "ar";

  // Fallback navigation items
  const navigation = {
    home: locale === "ar" ? "الرئيسية" : locale === "fr" ? "Accueil" : "Home",
    products:
      locale === "ar" ? "المنتجات" : locale === "fr" ? "Produits" : "Products",
    about: locale === "ar" ? "حول" : locale === "fr" ? "À propos" : "About",
    contact:
      locale === "ar" ? "اتصل بنا" : locale === "fr" ? "Contact" : "Contact",
  };

  const navItems = [
    { href: `/${locale}`, label: navigation.home },
    { href: `/${locale}/products`, label: navigation.products },
    {
      href: `/${locale}/categories`,
      label: locale === "ar" ? "الفئات" : "Categories",
    },
    { href: `/${locale}/about`, label: navigation.about },
    { href: `/${locale}/contact`, label: navigation.contact },
  ];

  return (
    <header
      className={`border-b bg-white sticky top-0 z-50 shadow-sm ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TuniKado</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <CartSidebar locale={locale} />
            <div className="hidden md:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden bg-transparent"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side={isRTL ? "left" : "right"}
                className="w-80 p-0"
              >
                <SheetHeader className="p-6 border-b">
                  <SheetTitle className="flex items-center gap-2 text-right">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">Store</span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col h-full">
                  {/* Mobile Navigation */}
                  <nav className="flex-1 p-6">
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block text-lg font-medium py-3 px-4 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </nav>

                  {/* Language Switcher for Mobile */}
                  <div className="p-6 border-t">
                    <div className="mb-2">
                      <LanguageSwitcher currentLocale={locale} />
                    </div>

                    {/* Login/Register Buttons */}
                    <div className="space-y-3 mb-2">
                      <Link
                        href={`/${locale}/login`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <Button className="w-full">
                          {locale === "ar"
                            ? "تسجيل الدخول"
                            : locale === "fr"
                            ? "Connexion"
                            : "Login"}
                        </Button>
                      </Link>
                      <Link
                        href={`/${locale}/register`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block w-full"
                      >
                        <Button
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          {locale === "ar"
                            ? "إنشاء حساب"
                            : locale === "fr"
                            ? "S'inscrire"
                            : "Register"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
