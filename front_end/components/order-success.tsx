"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Phone, MapPin } from "lucide-react";
import Link from "next/link";

interface OrderSuccessProps {
  locale: string;
  orderRef?: string;
  onContinueShopping: () => void;
}

export function OrderSuccess({
  locale,
  orderRef,
  onContinueShopping,
}: OrderSuccessProps) {
  const isRTL = locale === "ar";

  return (
    <div
      className={`min-h-screen bg-gray-50 flex items-center justify-center ${
        isRTL ? "rtl" : "ltr"
      }`}
    >
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              تم تأكيد طلبك بنجاح!
            </CardTitle>
            <p className="text-gray-600 mt-2">
              شكراً لك على ثقتك بنا. سنتواصل معك قريباً لتأكيد التفاصيل.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {orderRef && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">رقم الطلب</p>
                <p className="text-lg font-bold text-gray-900">{orderRef}</p>
                <p className="text-xs text-gray-500 mt-1">
                  احتفظ بهذا الرقم للمتابعة
                </p>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <Package className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold text-sm">تحضير الطلب</h3>
                <p className="text-xs text-gray-600">1-2 أيام عمل</p>
              </div>
              <div className="p-4">
                <Phone className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold text-sm">تأكيد الطلب</h3>
                <p className="text-xs text-gray-600">سنتصل بك للتأكيد</p>
              </div>
              <div className="p-4">
                <MapPin className="h-8 w-8 mx-auto text-blue-600 mb-2" />
                <h3 className="font-semibold text-sm">التوصيل</h3>
                <p className="text-xs text-gray-600">2-5 أيام عمل</p>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">
                معلومات مهمة:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 text-right">
                <li>• سنتصل بك خلال 24 ساعة لتأكيد الطلب</li>
                <li>• الدفع عند الاستلام متاح</li>
                <li>• يمكنك تتبع طلبك باستخدام رقم الطلب</li>
                <li>• خدمة العملاء متاحة للمساعدة</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onContinueShopping}
                variant="outline"
                className="flex-1 sm:flex-none bg-transparent"
              >
                متابعة التسوق
              </Button>
              <Link
                href={`/${locale}/orders/track`}
                className="flex-1 sm:flex-none"
              >
                <Button className="w-full">تتبع الطلب</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
