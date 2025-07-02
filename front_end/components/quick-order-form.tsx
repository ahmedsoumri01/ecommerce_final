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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
  Phone,
  MapPin,
  User,
  Package,
  CreditCard,
  Truck,
  CheckCircle,
  AlertCircle,
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

const quickOrderSchema = z.object({
  customerName: z
    .string()
    .min(2, "الاسم يجب أن يكون على الأقل حرفين")
    .max(50, "الاسم طويل جداً"),
  phoneNumber: z
    .string()
    .regex(/^[2-9]\d{7}$/, "رقم الهاتف يجب أن يكون 8 أرقام ويبدأ بـ 2-9")
    .length(8, "رقم الهاتف يجب أن يكون 8 أرقام بالضبط"),
  address: z
    .string()
    .min(5, "العنوان يجب أن يكون مفصلاً أكثر (10 أحرف على الأقل)")
    .max(200, "العنوان طويل جداً"),
  city: z.string().min(1, "المدينة مطلوبة"),
  state: z.string().min(1, "الولاية مطلوبة"),
  comment: z.string().max(500, "الملاحظات طويلة جداً").optional(),
  quantity: z
    .number()
    .min(1, "الكمية يجب أن تكون على الأقل 1")
    .max(10, "الكمية القصوى هي 10 قطع"),
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

  const form = useForm<QuickOrderFormType>({
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

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = form;

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
        email: "",
        phoneNumberOne: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        comment: data.comment,
        orderRef: generateOrderRef(),
        total: calculateTotal(),
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
          title: "✅ تم إرسال الطلب بنجاح!",
          description: "سيتم التواصل معك خلال 15 دقيقة لتأكيد الطلب",
          duration: 5000,
        });
        reset();
        setSelectedState("");
      } else {
        toast({
          title: "⚠️ تم حظرك مؤقتاً",
          description: "لقد قمت بعدد كبير من الطلبات. أنت محظور لمدة 24 ساعة.",

          duration: 7000,
        });
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في الطلب",
        description: "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      });
    }
  };

  const adjustQuantity = (delta: number) => {
    const currentQuantity = quantityWatch;
    const newQuantity = Math.max(1, Math.min(10, currentQuantity + delta));
    setValue("quantity", newQuantity);
  };

  const calculateSubtotal = () => product.price * quantityWatch;

  const calculateTotal = () => calculateSubtotal();

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    // Limit to 8 digits
    return digits.slice(0, 8);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white p-4">
        <CardTitle className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="text-lg font-bold">طلب سريع</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm font-normal opacity-90 bg-white/10 rounded-full px-3 py-1">
            <Phone className="h-4 w-4" />
            <span>أو اتصل: 52573273</span>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Product Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">
                {getProductName()}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant={product.inStock ? "default" : "destructive"}
                  className="text-xs"
                >
                  {product.inStock ? "متوفر" : "غير متوفر"}
                </Badge>
                <span className="text-lg font-bold text-green-600">
                  {product.price.toFixed(2)} DT
                </span>
              </div>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Customer Name */}
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <User className="h-4 w-4 text-gray-600" />
                    الاسم الكامل *
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="أدخل اسمك الكامل"
                      className="text-right h-11 border-gray-300 focus:border-green-500 focus:ring-green-500"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Phone Number */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <Phone className="h-4 w-4 text-gray-600" />
                    رقم الهاتف * (8 أرقام)
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type="tel"
                        placeholder="مثال: 20123456"
                        className="text-right h-11 border-gray-300 focus:border-green-500 focus:ring-green-500 pl-12"
                        dir="rtl"
                        maxLength={8}
                        onChange={(e) => {
                          const formatted = formatPhoneNumber(e.target.value);
                          field.onChange(formatted);
                        }}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-mono">
                        +216
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                  <div className="text-xs text-gray-500 mt-1">
                    <CheckCircle className="h-3 w-3 inline mr-1" />
                    يجب أن يبدأ بـ 2، 3، 4، 5، 7، 9
                  </div>
                </FormItem>
              )}
            />

            {/* State & City */}
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      الولاية *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedState(value);
                          setValue("city", "");
                        }}
                      >
                        <SelectTrigger className="text-right h-11 border-gray-300">
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
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      المدينة *
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={!selectedState}
                      >
                        <SelectTrigger className="text-right h-11 border-gray-300">
                          <SelectValue placeholder="اختر المدينة" />
                        </SelectTrigger>
                        <SelectContent>
                          {(tunisiaCities[selectedState] || []).map((city) => (
                            <SelectItem key={city.value} value={city.value}>
                              {city.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Address */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    العنوان التفصيلي *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="مثال: شارع الحبيب بورقيبة، عمارة رقم 15، الطابق الثالث"
                      className="text-right min-h-[80px] border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">الكمية</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantity(-1)}
                        disabled={quantityWatch <= 1}
                        className="h-10 w-10 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <Input
                        {...field}
                        type="number"
                        min={1}
                        max={10}
                        className="text-center h-10 w-20 border-gray-300"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => adjustQuantity(1)}
                        disabled={quantityWatch >= 10}
                        className="h-10 w-10 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-500">
                        (الحد الأقصى: 10)
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Comment */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    ملاحظات إضافية
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={2}
                      placeholder="أي ملاحظات أو تعليمات خاصة للتوصيل (اختياري)"
                      className="text-right border-gray-300 focus:border-green-500 focus:ring-green-500 resize-none"
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                ملخص الطلب
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    المجموع الفرعي ({quantityWatch} قطعة)
                  </span>
                  <span className="font-medium">
                    {calculateSubtotal().toFixed(2)} DT
                  </span>
                </div>
                {/*      <div className="flex justify-between items-center">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Truck className="h-3 w-3" />
                    التوصيل
                  </span>
                 { <span className="font-medium text-green-600">7.00 DT</span>}
                </div> */}
                <Separator />
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>المجموع الإجمالي</span>
                  <span className="text-green-600">
                    {calculateTotal().toFixed(2)} DT
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 h-12 text-base shadow-lg"
              disabled={isSubmitting || !product.inStock}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  اشتري الآن - {calculateTotal().toFixed(2)} DT
                </>
              )}
            </Button>

            {!product.inStock && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>عذراً، هذا المنتج غير متوفر حالياً</span>
              </div>
            )}
          </form>
        </Form>

        {/* Payment & Delivery Info */}
        {/*  <div className="space-y-3">
          <div className="text-center text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center gap-2 text-blue-700 font-medium">
              <CreditCard className="h-4 w-4" />
              💳 الدفع عند الاستلام متاح
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 bg-green-50 p-2 rounded border border-green-200">
            <div className="flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3 text-green-600" />
              <span>✅ توصيل مجاني للطلبات فوق 100 DT</span>
            </div>
          </div>
        </div> */}
      </CardContent>
    </Card>
  );
}
