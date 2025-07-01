"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store/cart-store";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Plus, Minus, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useClientDictionary } from "@/hooks/useClientDictionary";

interface CartSidebarProps {
  locale: string;
}

export function CartSidebar({ locale }: CartSidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { t } = useClientDictionary(locale);

  const {
    items,
    isOpen,
    setCartOpen,
    updateQuantity,
    removeItem,
    getTotalItems,
    getTotalPrice,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProductName = (item: any) => {
    switch (locale) {
      case "ar":
        return item.product.nameAr;
      case "fr":
        return item.product.nameFr;
      default:
        return item.product.name;
    }
  };

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="relative bg-transparent">
        <ShoppingCart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-transparent"
        >
          <ShoppingCart className="h-4 w-4" />
          {getTotalItems() > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            سلة التسوق ({getTotalItems()} عنصر)
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">{t("cart_sidebar.empty_cart")}</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item.product._id}
                    className="flex gap-4 p-4 border rounded-lg"
                  >
                    <Image
                      src={
                        process.env.NEXT_PUBLIC_ASSETS_URL +
                          item.product.images[0] || "/placeholder.svg"
                      }
                      alt={getProductName(item)}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm line-clamp-2">
                        {getProductName(item)}
                      </h4>
                      <p className="text-sm text-gray-500 mb-2">
                        {item.product.brand}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity - 1
                              )
                            }
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 bg-transparent"
                            onClick={() =>
                              updateQuantity(
                                item.product._id,
                                item.quantity + 1
                              )
                            }
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                          onClick={() => removeItem(item.product._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-semibold text-right mt-2">
                        {(item.product.price * item.quantity).toFixed(2)} DT
                      </p>
                    </div>
                  </div>
                ))}

                {items.length > 3 && (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500">
                      و {items.length - 3} منتجات أخرى
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-semibold">
                  <span>{t("cart_sidebar.total")}</span>
                  <span>{getTotalPrice().toFixed(2)} DT</span>
                </div>
                <div className="space-y-2 pb-4">
                  <Link
                    href={`/${locale}/cart`}
                    onClick={() => setCartOpen(false)}
                  >
                    <Button className="w-full" size="lg">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t("cart_sidebar.view_cart")}
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={clearCart}
                  >
                    {t("cart_sidebar.clear_cart")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
