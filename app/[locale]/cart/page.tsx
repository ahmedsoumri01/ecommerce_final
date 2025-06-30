"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { useClientDictionary } from "@/hooks/useClientDictionary";

export default function CartPage({ params }: { params: { locale: string } }) {
  const isRTL = params.locale === "ar";
  const [mounted, setMounted] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { t } = useClientDictionary(params.locale);

  const {
    items,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  const getProductName = (item: any) => {
    switch (params.locale) {
      case "ar":
        return item.product.nameAr;
      case "fr":
        return item.product.nameFr;
      default:
        return item.product.name;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showCheckout) {
    return (
      <div className={`${isRTL ? "rtl" : "ltr"}`}>
        <CheckoutForm
          locale={params.locale}
          cartItems={items}
          totalPrice={getTotalPrice()}
          onBack={() => setShowCheckout(false)}
          onSuccess={() => {
            setShowCheckout(false);
            clearCart();
          }}
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/${params.locale}`}>
            <Button variant="outline" size="icon" className="bg-transparent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-3xl font-bold">
            {t("cart_page.title")}
          </h1>
          {getTotalItems() > 0 && (
            <Badge variant="secondary">({getTotalItems()} عنصر)</Badge>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart */
          <Card className="text-center py-16">
            <CardContent>
              <ShoppingCart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold mb-4">
                {t("cart_page.empty_cart_title")}
              </h2>
              <p className="text-gray-600 mb-8">
                {t("cart_page.empty_cart_description")}
              </p>
              <Link href={`/${params.locale}/products`}>
                <Button size="lg">{t("cart_page.browse_products")}</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          /* Cart with Items */
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{t("cart_page.products")}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearCart}
                      className="text-red-600 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("cart_page.clear_cart")}
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 p-4 border rounded-lg bg-white"
                    >
                      <Link
                        href={`/${params.locale}/products/${item.product.id}`}
                      >
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={getProductName(item)}
                          width={120}
                          height={120}
                          className="rounded-md object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link
                          href={`/${params.locale}/products/${item.product.id}`}
                        >
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary cursor-pointer">
                            {getProductName(item)}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500 mb-2">
                          {item.product.brand}
                        </p>
                        <p className="text-lg font-bold text-primary mb-4">
                          {item.product.price} DT
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium">
                              {t("cart_page.quantity_label")}:
                            </span>
                            <div className="flex items-center border rounded-lg">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity - 1
                                  )
                                }
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-10 w-10"
                                onClick={() =>
                                  updateQuantity(
                                    item.product.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 mx-1 bg-transparent"
                            onClick={() => removeItem(item.product.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="hidden sm:block">
                              {t("cart_page.remove_item")}
                            </span>
                          </Button>
                        </div>

                        <div className="mt-3 pt-3 border-t">
                          <p className="text-right font-semibold text-lg">
                            {t("cart_page.total_item")}: $
                            {(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>{t("cart_page.order_summary")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>المنتجات ({getTotalItems()})</span>

                      <span>{getTotalPrice().toFixed(2)} DT</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("cart_page.shipping")}</span>
                      <span className="text-green-600">
                        {t("cart_page.free")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("cart_page.tax")}</span>
                      <span> {(getTotalPrice() * 0.15).toFixed(2)} DT</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>{t("cart_page.total")}</span>
                      <span> {(getTotalPrice() * 1.15).toFixed(2)} DT</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setShowCheckout(true)}
                  >
                    {t("cart_page.checkout_button")}
                  </Button>

                  <Link href={`/${params.locale}/products`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("cart_page.continue_shopping")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
