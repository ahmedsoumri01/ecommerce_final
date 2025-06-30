import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react"

interface FooterProps {
  dict: any
  locale: string
  isRTL?: boolean
}

export function Footer({ dict, locale, isRTL = false }: FooterProps) {
  return (
    <footer className={`bg-gray-900 text-white py-16 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">متجرنا</h3>
            <p className="text-gray-400">متجر إلكتروني متخصص في بيع أحدث الأجهزة الإلكترونية والتقنية بأفضل الأسعار</p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">الفئات</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href={`/${locale}/products?category=smartphones`} className="hover:text-white transition-colors">
                  هواتف ذكية
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=laptops`} className="hover:text-white transition-colors">
                  أجهزة لابتوب
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=headphones`} className="hover:text-white transition-colors">
                  سماعات
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/products?category=cameras`} className="hover:text-white transition-colors">
                  كاميرات
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">معلومات</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href={`/${locale}/about`} className="hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-white transition-colors">
                  اتصل بنا
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping`} className="hover:text-white transition-colors">
                  الشحن والتوصيل
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/returns`} className="hover:text-white transition-colors">
                  سياسة الإرجاع
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">تواصل معنا</h4>
            <div className="space-y-2 text-gray-400">
              <p>📧 info@store.com</p>
              <p>📞 +966 50 123 4567</p>
              <p>📍 الرياض، المملكة العربية السعودية</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 متجرنا. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
