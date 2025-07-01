"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "./language-switcher";
import { ShoppingBag, Menu, User, LogIn } from "lucide-react";
import { CartSidebar } from "./cart-sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useAuthStore } from "@/stores/auth-store";

interface HeaderProps {
  locale: string;
}

export function Header({ locale }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useClientDictionary(locale);
  const { user, isAuthenticated } = useAuthStore();

  const isRTL = locale === "ar";

  const navItems = [
    { href: `/${locale}`, label: t("header.home") },
    { href: `/${locale}/products`, label: t("header.products") },
    {
      href: `/${locale}/categories`,
      label: t("header.Categories"),
    },
    { href: `/${locale}/about`, label: t("header.about") },
    { href: `/${locale}/contact`, label: t("header.contact") },
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
          <nav className="hidden lg:flex items-center gap-6">
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
            <div className="hidden lg:block">
              <LanguageSwitcher currentLocale={locale} />
            </div>
            {!user && !isAuthenticated && (
              <div className="border-2 rounded-sm transition duration-300 hover:bg-blue-500">
                <Link
                  href="/login"
                  className="flex items-center justify-center p-1 text-black transition duration-300 group hover:text-white"
                >
                  <LogIn className="transition duration-300 group-hover:text-white" />
                </Link>
              </div>
            )}

            <div>
              {user && isAuthenticated && (
                <div>
                  <Link
                    href={user?.role === "admin" ? "/admin" : "/dashboard"}
                    className="hover:text-blue-400"
                  >
                    <User />
                  </Link>
                </div>
              )}
            </div>
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="lg:hidden bg-transparent"
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
                    <span className="text-xl font-bold">TuniKado</span>
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
                    <div className="space-y-5 mb-16">
                      {user && isAuthenticated ? (
                        <div>
                          <Link
                            href={
                              user?.role === "admin" ? "/admin" : "/dashboard"
                            }
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block w-full"
                          >
                            <Button className="w-full">
                              {" "}
                              <User /> My Dashboard
                            </Button>
                          </Link>
                        </div>
                      ) : (
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
                      )}
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
