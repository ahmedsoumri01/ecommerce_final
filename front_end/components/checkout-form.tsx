"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CreditCard, MapPin, User, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useCartStore, type CartItem } from "@/lib/store/cart-store";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useOrderStore } from "@/stores/order-store";
import { tunisiaStates, tunisiaCities } from "@/lib/data/tunisia-locations";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface CheckoutFormProps {
  locale: string;
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onSuccess: () => void;
}

const checkoutSchema = z.object({
  customerName: z.string().min(1, "الاسم مطلوب"),
  email: z.string(),
  phoneNumberOne: z.string().regex(/^\d{8}$/, "رقم الهاتف يجب أن يكون 8 أرقام"),
  phoneNumbertwo: z.string().optional(),
  address: z.string().min(1, "العنوان مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  state: z.string().min(1, "الولاية مطلوبة"),
  comment: z.string().optional(),
});

type CheckoutFormType = z.infer<typeof checkoutSchema>;

export function CheckoutForm({
  locale,
  cartItems,
  totalPrice,
  onBack,
  onSuccess,
}: CheckoutFormProps) {
  const { t } = useClientDictionary(locale);
  const { toast } = useToast();
  const { createOrder } = useOrderStore();
  const { getOrderDeliveryFee } = useCartStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<CheckoutFormType>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customerName: "",
      email: "",
      phoneNumberOne: "",
      phoneNumbertwo: "",
      address: "",
      city: "",
      state: "",
      comment: "",
    },
  });

  const selectedState = watch("state");

  const isRTL = locale === "ar";

  const generateOrderRef = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const onSubmit = async (data: CheckoutFormType) => {
    try {
      const orderData = {
        customerName: data.customerName,
        email: data.email,
        phoneNumberOne: data.phoneNumberOne,
        phoneNumbertwo: data.phoneNumbertwo || undefined,
        address: data.address,
        city: data.city,
        state: data.state || undefined,
        comment: data.comment || undefined,
        orderRef: generateOrderRef(),
        total: totalPrice + getOrderDeliveryFee(),
        status: "pending",
        items: cartItems.map((item) => ({
          product: item.product._id, // Product ID
          quantity: item.quantity,
          price: item.product.price,
        })),
        deliveryFee: getOrderDeliveryFee(),
      };
      const success = await createOrder(orderData);
      if (success) {
        toast({
          title: t("checkout_form.toast_title"),
          description: t("checkout_form.toast_description"),
          duration: 5000,
        });
        onSuccess();
        reset();
      } else {
        toast({
          title: t("checkout_form.blocked_title") || "تم حظرك مؤقتاً",
          description:
            t("checkout_form.blocked_description") ||
            "لقد قمت بعدد كبير من الطلبات. أنت محظور لمدة 24 ساعة.",
          duration: 7000,
        });
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "خطأ في الطلب",
        description: "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const getProductName = (item: CartItem) => {
    switch (locale) {
      case "ar":
        return item.product.nameAr || item.product.name;
      case "fr":
        return item.product.nameFr || item.product.name;
      default:
        return item.product.name;
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="bg-transparent"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">{t("checkout_form.title")}</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {t("checkout_form.delivery_info")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("name")} *
                    </label>
                    <Input
                      {...register("customerName")}
                      placeholder={t("name")}
                      required
                      className="text-right"
                    />
                    {errors.customerName && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.customerName.message}
                      </div>
                    )}
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("email")}
                    </label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder={t("email")}
                      className="text-right"
                    />
                    {errors.email && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium mb-1 flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t("checkout_form.phone_label")} *
                    </label>
                    <Input
                      {...register("phoneNumberOne")}
                      type="text"
                      placeholder={t("checkout_form.phone_placeholder")}
                      required
                      className="text-right"
                      maxLength={8}
                    />
                    {errors.phoneNumberOne && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.phoneNumberOne.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumbertwo"
                      className="block text-sm font-medium mb-2"
                    >
                      رقم الهاتف الثاني
                    </label>
                    <Input
                      {...register("phoneNumbertwo")}
                      type="tel"
                      placeholder="أدخل رقم الهاتف الثاني (اختياري)"
                    />
                  </div>
                </div>
                {/* Address Information */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-2"
                  >
                    العنوان *
                  </label>
                  <Textarea
                    {...register("address")}
                    required
                    rows={3}
                    placeholder="أدخل العنوان الكامل"
                  />
                  {errors.address && (
                    <div className="text-red-500 text-xs mt-1">
                      {errors.address.message}
                    </div>
                  )}
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium mb-2"
                    >
                      الولاية
                    </label>
                    <Select
                      value={watch("state")}
                      onValueChange={(value) => setValue("state", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="اختر الولاية" />
                      </SelectTrigger>
                      <SelectContent>
                        {tunisiaStates.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.state && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.state.message}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2"
                    >
                      المدينة *
                    </label>
                    <Select
                      value={watch("city")}
                      onValueChange={(value) => setValue("city", value)}
                      disabled={!selectedState}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            selectedState
                              ? "اختر المدينة"
                              : "اختر الولاية أولاً"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {(tunisiaCities[selectedState] || []).map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.city && (
                      <div className="text-red-500 text-xs mt-1">
                        {errors.city.message}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="comment"
                    className="block text-sm font-medium mb-2"
                  >
                    ملاحظات إضافية
                  </label>
                  <Textarea
                    {...register("comment")}
                    rows={3}
                    placeholder="أي ملاحظات أو تعليمات خاصة للتوصيل"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      جاري المعالجة...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      تأكيد الطلب
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <div className="space-y-6">
            {/* Items Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout_form.order_summary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product._id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {getProductName(item)}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {item.quantity} × {item.product.price} DT
                      </p>
                    </div>
                    <span className="font-semibold">
                      {(item.product.price * item.quantity).toFixed(2)} DT
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Price Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkout_form.payment_details")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>{t("checkout_form.items_total")}</span>
                  <span>{totalPrice.toFixed(2)} DT</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout_form.shipping")}</span>
                  {getOrderDeliveryFee() === 0 ? (
                    <span className="text-green-600">{t("checkout_form.free")}</span>
                  ) : (
                    <span className="text-orange-600 font-bold">+{getOrderDeliveryFee()} DT</span>
                  )}
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("checkout_form.grand_total")}</span>
                    <span>{(totalPrice + getOrderDeliveryFee()).toFixed(2)} DT</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {t("checkout_form.payment_method")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg bg-blue-50">
                  <p className="font-medium text-blue-800">
                    {t("checkout_form.cash_on_delivery")}
                  </p>
                  <p className="text-sm text-blue-600 mt-1">
                    {t("checkout_form.pay_on_delivery")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
