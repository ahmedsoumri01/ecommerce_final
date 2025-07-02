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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

const quickOrderSchema = z.object({
  customerName: z.string().min(1, "الاسم مطلوب"),
  phoneNumber: z.string().regex(/^\d{8}$/, "رقم الهاتف يجب أن يكون 8 أرقام"),
  address: z.string().min(1, "العنوان مطلوب"),
  city: z.string().min(1, "المدينة مطلوبة"),
  state: z.string().min(1, "الولاية مطلوبة"),
  comment: z.string().optional(),
  quantity: z.number().min(1, "الكمية مطلوبة"),
});
type QuickOrderFormType = z.infer<typeof quickOrderSchema>;

export function QuickOrderForm({
  product,
  locale,
  isRTL = false,
}: QuickOrderFormProps) {
  const { toast } = useToast();
  const { createOrder } = useOrderStore();
  const [selectedState, setSelectedState] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<QuickOrderFormType>({
    resolver: zodResolver(quickOrderSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      comment: "",
      quantity: 1,
    },
  });
  const stateWatch = watch("state");
  const quantityWatch = watch("quantity");

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

  const generateOrderRef = () => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  };

  const onSubmit = async (data: QuickOrderFormType) => {
    try {
      const orderData = {
        customerName: data.customerName,
        email: "", // Optional for quick order
        phoneNumberOne: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        comment: data.comment,
        orderRef: generateOrderRef(),
        total: product.price * data.quantity * 1.15, // Including tax
        status: "pending",
        items: [
          {
            product: product._id,
            quantity: data.quantity,
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
        reset();
        setSelectedState("");
      } else {
        toast({
          title: "تم حظرك مؤقتاً",
          description: "لقد قمت بعدد كبير من الطلبات. أنت محظور لمدة 24 ساعة.",
          duration: 7000,
        });
      }
    } catch (error) {
      toast({
        title: "خطأ في الطلب",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const availableCities = selectedState
    ? tunisiaCities[selectedState] || []
    : [];
  const subtotal = product.price * quantityWatch;
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Customer Name */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <User className="h-4 w-4" />
              الاسم *
            </label>
            <Input
              {...register("customerName")}
              placeholder="أدخل اسمك"
              required
              className="text-right"
            />
            {errors.customerName && (
              <div className="text-red-500 text-xs mt-1">
                {errors.customerName.message}
              </div>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              رقم الهاتف *
            </label>
            <Input
              {...register("phoneNumber")}
              type="text"
              placeholder="أدخل رقم هاتفك"
              required
              className="text-right"
              maxLength={8}
            />
            {errors.phoneNumber && (
              <div className="text-red-500 text-xs mt-1">
                {errors.phoneNumber.message}
              </div>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-medium mb-1">الولاية</label>
            <Select
              value={watch("state")}
              onValueChange={(value) => {
                setValue("state", value);
                setSelectedState(value);
                setValue("city", "");
              }}
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
            {errors.state && (
              <div className="text-red-500 text-xs mt-1">
                {errors.state.message}
              </div>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">المدينة</label>
            <Select
              value={watch("city")}
              onValueChange={(value) => setValue("city", value)}
              disabled={!selectedState}
            >
              <SelectTrigger className="text-right">
                <SelectValue placeholder="أختر المدينة" />
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

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              العنوان *
            </label>
            <Input
              {...register("address")}
              placeholder="أدخل عنوانك"
              required
              className="text-right"
            />
            {errors.address && (
              <div className="text-red-500 text-xs mt-1">
                {errors.address.message}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium mb-1">الكمية</label>
            <Input
              {...register("quantity", { valueAsNumber: true })}
              type="number"
              min={1}
              value={quantityWatch}
              onChange={(e) => setValue("quantity", Number(e.target.value))}
              className="text-right"
            />
            {errors.quantity && (
              <div className="text-red-500 text-xs mt-1">
                {errors.quantity.message}
              </div>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-medium mb-1">
              ملاحظات إضافية
            </label>
            <Textarea
              {...register("comment")}
              rows={2}
              placeholder="أي ملاحظات أو تعليمات خاصة للتوصيل"
            />
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
