"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Package,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
} from "lucide-react";
import { getOrderStats } from "@/lib/data/admin";
import { products } from "@/lib/data/products";
import Link from "next/link";

export default function AdminDashboard({
  params,
}: {
  params: { locale: string };
}) {
  const isRTL = params.locale === "ar";
  const orderStats = getOrderStats();

  const kpis = [
    {
      title: "إجمالي الطلبات",
      value: orderStats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "إجمالي الإيرادات",
      value: `${orderStats.totalRevenue.toFixed(2)} DT`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "إجمالي المنتجات",
      value: products.length,
      icon: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "العملاء النشطون",
      value: "156",
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const orderStatusCards = [
    {
      title: "طلبات معلقة",
      value: orderStats.pendingOrders,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "طلبات مؤكدة",
      value: orderStats.confirmedOrders,
      icon: CheckCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "طلبات مشحونة",
      value: orderStats.shippedOrders,
      icon: Truck,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "طلبات ملغية",
      value: orderStats.cancelledOrders,
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم</h1>
            <p className="text-gray-600">مرحباً بك في لوحة إدارة المتجر</p>
          </div>
          <div className="flex gap-4">
            <Link href={`/${params.locale}/admin/products`}>
              <Button>إدارة المنتجات</Button>
            </Link>
            <Link href={`/${params.locale}/admin/orders`}>
              <Button variant="outline" className="bg-transparent">
                إدارة الطلبات
              </Button>
            </Link>
          </div>
        </div>

        {/* Main KPIs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {kpi.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {kpi.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.bgColor}`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Status Overview */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {orderStatusCards.map((card, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>الطلبات الأخيرة</span>
                <Link href={`/${params.locale}/admin/orders`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    عرض الكل
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    id: "1001",
                    customer: "أحمد محمد",
                    total: "1,499.98 DT",
                    status: "confirmed",
                  },
                  {
                    id: "1002",
                    customer: "فاطمة علي",
                    total: " 2,499.99  DT",
                    status: "shipped",
                  },
                  {
                    id: "1004",
                    customer: "نورا أحمد",
                    total: " 499.99  DT",
                    status: "pending",
                  },
                ].map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">#{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{order.total}</p>
                      <Badge
                        variant={
                          order.status === "confirmed"
                            ? "default"
                            : order.status === "shipped"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {order.status === "confirmed"
                          ? "مؤكد"
                          : order.status === "shipped"
                          ? "مشحون"
                          : "معلق"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>المنتجات الأكثر مبيعاً</span>
                <Link href={`/${params.locale}/admin/products`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                  >
                    إدارة المنتجات
                  </Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-md"></div>
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">
                        {product.nameAr}
                      </p>
                      <p className="text-sm text-gray-600">{product.brand}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${product.price}</p>
                      <p className="text-sm text-gray-600">
                        {product.reviews} مبيعة
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
