"use client";

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
import {
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
  Phone,
  MapPin,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOrderStore } from "@/stores/order-store";
import { tunisiaStates, tunisiaCities } from "@/lib/data/tunisia-locations";
import type { Product } from "@/stores/product-store";

interface QuickOrderFormProps {
  product: Product;
  locale: string;
  isRTL?: boolean;
}

interface QuickOrderData {
  customerName: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  comment: string;
  quantity: number;
}

export function QuickOrderForm({
  product,
  locale,
  isRTL = false,
}: QuickOrderFormProps) {
  const { toast } = useToast();
  const { createOrder } = useOrderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [formData, setFormData] = useState<QuickOrderData>({
    customerName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    comment: "",
    quantity: 1,
  });

  const getProductName = () => {
    switch (locale) {
      case "ar":
        return product.nameAr || product.name;
      case "fr":
        return product.nameFr || product.name;
      default:
        return product.name;
    }
  };

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

    if (name === "state") {
      setSelectedState(value);
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setFormData((prev) => ({ ...prev, quantity: newQuantity }));
  };

  const decreaseQuantity = () => {
    const newQuantity = Math.max(1, quantity - 1);
    setQuantity(newQuantity);
    setFormData((prev) => ({ ...prev, quantity: newQuantity }));
  };

  const generateOrderRef = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const handleQuickOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        email: "", // Optional for quick order
        phoneNumberOne: formData.phoneNumber,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        comment: formData.comment,
        orderRef: generateOrderRef(),
        total: product.price * quantity * 1.15, // Including tax
        status: "pending",
        items: [
          {
            product: product._id,
            quantity: quantity,
            price: product.price,
          },
        ],
      };

      const success = await createOrder(orderData);

      if (success) {
        toast({
          title: "تم إرسال الطلب بنجاح!",
          description: "سيتم التواصل معك قريباً لتأكيد الطلب",
          duration: 5000,
        });

        // Reset form
        setFormData({
          customerName: "",
          phoneNumber: "",
          address: "",
          city: "",
          state: "",
          comment: "",
          quantity: 1,
        });
        setQuantity(1);
        setSelectedState("");
      }
    } catch (error) {
      console.error("Error creating quick order:", error);
      toast({
        title: "خطأ في الطلب",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableCities = selectedState
    ? tunisiaCities[selectedState] || []
    : [];
  const subtotal = product.price * quantity;
  const total = subtotal + 7;

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
        <CardTitle className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingCart className="h-5 w-5" />
            طلب سريع
          </div>
          <div className="text-sm font-normal opacity-90">
            📞 أو اتصل بنا على: 52573273
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <form onSubmit={handleQuickOrder} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              الاسم *
            </label>
            <Input
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="أدخل اسمك"
              required
              className="text-right"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              رقم الهاتف *
            </label>
            <Input
              name="phoneNumber"
              type="number"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="أدخل رقم هاتفك"
              required
              className="text-right"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">الولاية</label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleSelectChange("state", value)}
            >
              <SelectTrigger className="text-right">
                <SelectValue placeholder="أختر مدينتك" />
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

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">المدينة</label>
            <Select
              value={formData.city}
              onValueChange={(value) => handleSelectChange("city", value)}
              disabled={!selectedState}
            >
              <SelectTrigger className="text-right">
                <SelectValue
                  placeholder={
                    selectedState ? "اختر المدينة" : "اختر الولاية أولاً"
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

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              عنوان
            </label>
            <Textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="أدخل عنوانك"
              rows={2}
              className="text-right"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-2">الكمية</label>
            <div className="flex items-center justify-center border rounded-lg w-32 mx-auto">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-8 w-8"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={increaseQuantity}
                className="h-8 w-8"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-sm">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span className="flex rtl:flex-row-reverse">
                <span> {subtotal.toFixed(2)}</span> <span> DT</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span>التوصيل</span>
              <span className="text-green-600 flex rtl:flex-row-reverse">
                <span> 7 </span> <span> DT</span>
              </span>
            </div>

            <div className="border-t pt-2 flex justify-between font-bold">
              <span>المجموع</span>
              <span className="flex rtl:flex-row-reverse">
                <span> {total.toFixed(2)} </span> <span>DT</span>
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
            disabled={isSubmitting || !product.inStock}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                جاري الإرسال...
              </>
            ) : (
              "اشتري الآن"
            )}
          </Button>
        </form>

        {/* Payment Method Info */}
        <div className="text-center text-xs text-gray-500 mt-4 p-2 bg-blue-50 rounded">
          💳 الدفع عند الاستلام متاح
        </div>
      </CardContent>
    </Card>
  );
}
