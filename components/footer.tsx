"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { useClientDictionary } from "@/hooks/useClientDictionary";

interface FooterProps {
  dict: any;
  locale: string;
  isRTL?: boolean;
}

export function Footer({ dict, locale, isRTL = false }: FooterProps) {
  return (
    <footer className={`bg-gray-900 text-white py-16 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">{dict.brand.title}</h3>
            <p className="text-gray-400">{dict.brand.description}</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{dict.categories.title}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href={`/${locale}/products?category=smartphones`}
                  className="hover:text-white transition-colors"
                >
                  {dict.categories.smartphones}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products?category=laptops`}
                  className="hover:text-white transition-colors"
                >
                  {dict.categories.laptops}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products?category=headphones`}
                  className="hover:text-white transition-colors"
                >
                  {dict.categories.headphones}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/products?category=cameras`}
                  className="hover:text-white transition-colors"
                >
                  {dict.categories.cameras}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{dict.information.title}</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="hover:text-white transition-colors"
                >
                  {dict.information.about_us}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="hover:text-white transition-colors"
                >
                  {dict.information.contact_us}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/shipping`}
                  className="hover:text-white transition-colors"
                >
                  {dict.information.shipping}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/returns`}
                  className="hover:text-white transition-colors"
                >
                  {dict.information.returns}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">{dict.contact.title}</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 {dict.contact.email}</p>
              <p>📞 {dict.contact.phone}</p>
              <p>📍 {dict.contact.address}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>{dict.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
