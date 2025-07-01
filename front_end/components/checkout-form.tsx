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
import type { CartItem } from "@/lib/store/cart-store";
import { useClientDictionary } from "@/hooks/useClientDictionary";
import { useOrderStore } from "@/stores/order-store";
import { tunisiaStates, tunisiaCities } from "@/lib/data/tunisia-locations";

interface CheckoutFormProps {
  locale: string;
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onSuccess: () => void;
}

interface FormData {
  customerName: string;
  email: string;
  phoneNumberOne: string;
  phoneNumbertwo: string;
  address: string;
  city: string;
  state: string;
  comment: string;
}

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    email: "",
    phoneNumberOne: "",
    phoneNumbertwo: "",
    address: "",
    city: "",
    state: "",
    comment: "",
  });

  const isRTL = locale === "ar";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset city when state changes
    if (name === "state") {
      setSelectedState(value);
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const generateOrderRef = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare order data for API
      const orderData = {
        customerName: formData.customerName,
        email: formData.email,
        phoneNumberOne: formData.phoneNumberOne,
        phoneNumbertwo: formData.phoneNumbertwo || undefined,
        address: formData.address,
        city: formData.city,
        state: formData.state || undefined,
        comment: formData.comment || undefined,
        orderRef: generateOrderRef(),
        total: totalPrice * 1.15, // Including tax
        status: "pending",
        items: cartItems.map((item) => ({
          product: item.product._id, // Product ID
          quantity: item.quantity,
          price: item.product.price,
        })),
      };

      console.log("🛒 Order Data being sent:", orderData);

      const success = await createOrder(orderData);

      if (success) {
        toast({
          title: t("checkout_form.toast_title"),
          description: t("checkout_form.toast_description"),
          duration: 5000,
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "خطأ في الطلب",
        description: "حدث خطأ أثناء إنشاء الطلب. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
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

  // Get available cities based on selected state
  const availableCities = selectedState
    ? tunisiaCities[selectedState] || []
    : [];

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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="customerName"
                      className="block text-sm font-medium mb-2"
                    >
                      الاسم الكامل *
                    </label>
                    <Input
                      id="customerName"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      placeholder="أدخل الاسم الكامل"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-2"
                    >
                      البريد الإلكتروني *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="أدخل البريد الإلكتروني"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="phoneNumberOne"
                      className="block text-sm font-medium mb-2"
                    >
                      رقم الهاتف الأول *
                    </label>
                    <Input
                      id="phoneNumberOne"
                      name="phoneNumberOne"
                      type="tel"
                      value={formData.phoneNumberOne}
                      onChange={handleChange}
                      required
                      placeholder="أدخل رقم الهاتف"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumbertwo"
                      className="block text-sm font-medium mb-2"
                    >
                      رقم الهاتف الثاني
                    </label>
                    <Input
                      id="phoneNumbertwo"
                      name="phoneNumbertwo"
                      type="tel"
                      value={formData.phoneNumbertwo}
                      onChange={handleChange}
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
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="أدخل العنوان الكامل"
                  />
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
                      value={formData.state}
                      onValueChange={(value) =>
                        handleSelectChange("state", value)
                      }
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
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2"
                    >
                      المدينة *
                    </label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        handleSelectChange("city", value)
                      }
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
                        {availableCities.map((city) => (
                          <SelectItem key={city.value} value={city.value}>
                            {city.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
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
                  <span className="text-green-600">
                    {t("checkout_form.free")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout_form.tax")}</span>
                  <span>{(totalPrice * 0.15).toFixed(2)} DT</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("checkout_form.grand_total")}</span>
                    <span>{(totalPrice * 1.15).toFixed(2)} DT</span>
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
