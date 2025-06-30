"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, MapPin, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { CartItem } from "@/lib/store/cart-store";
import { useClientDictionary } from "@/hooks/useClientDictionary";

interface CheckoutFormProps {
  locale: string;
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
  onSuccess: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  notes: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Prepare order data
    const orderData = {
      customer: formData,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      })),
      summary: {
        subtotal: totalPrice,
        tax: totalPrice * 0.15,
        shipping: 0,
        total: totalPrice * 1.15,
      },
      orderDate: new Date().toISOString(),
      status: "confirmed",
    };

    // Log to console
    console.log("🛒 Order Data:", orderData);

    // Show success toast
    toast({
      title: t("checkout_form.toast_title"),
      description: t("checkout_form.toast_description"),
      duration: 5000,
    });

    setIsSubmitting(false);
    onSuccess();
  };

  const getProductName = (item: CartItem) => {
    switch (locale) {
      case "ar":
        return item.product.nameAr;
      case "fr":
        return item.product.nameFr;
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
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("checkout_form.first_name_label")} *
                    </label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      placeholder={t("checkout_form.first_name_placeholder")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("checkout_form.last_name_label")} *
                    </label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      placeholder={t("checkout_form.last_name_placeholder")}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("checkout_form.phone_label")} *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder={t("checkout_form.phone_placeholder")}
                  />
                </div>
                {/* Address Information */}
                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("checkout_form.address_label")} *
                  </label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder={t("checkout_form.address_placeholder")}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("checkout_form.city_label")} *
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      placeholder={t("checkout_form.city_placeholder")}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="block text-sm font-medium mb-2"
                    >
                      {t("checkout_form.postal_code_label")}
                    </label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder={t("checkout_form.postal_code_placeholder")}
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium mb-2"
                  >
                    {t("checkout_form.notes_label")}
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    placeholder={t("checkout_form.notes_placeholder")}
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("checkout_form.processing")}
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t("checkout_form.confirm_order")}
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
                    key={item.product.id}
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
                  <span> {(totalPrice * 0.15).toFixed(2)} DT</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>{t("checkout_form.grand_total")}</span>
                    <span> {(totalPrice * 1.15).toFixed(2)} DT</span>
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
