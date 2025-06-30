"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Edit, Trash2, Eye, ArrowLeft } from "lucide-react";
import { adminOrders } from "@/lib/data/admin";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrdersPage({
  params,
}: {
  params: { locale: string };
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const { toast } = useToast();
  const isRTL = params.locale === "ar";

  const filteredOrders = adminOrders.filter(
    (order) =>
      order.customerName.includes(searchQuery) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toString().includes(searchQuery)
  );

  const handleStatusUpdate = (orderId: number, newStatus: string) => {
    toast({
      title: "تم تحديث حالة الطلب بنجاح! ✅",
      description: `تم تغيير حالة الطلب إلى ${newStatus}`,
      duration: 3000,
    });
  };

  const handleDelete = (orderId: number) => {
    toast({
      title: "تم حذف الطلب بنجاح! ✅",
      description: "تم حذف الطلب من قاعدة البيانات",
      duration: 3000,
    });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "معلق", variant: "outline" as const },
      confirmed: { label: "مؤكد", variant: "default" as const },
      shipped: { label: "مشحون", variant: "secondary" as const },
      delivered: { label: "تم التسليم", variant: "default" as const },
      cancelled: { label: "ملغي", variant: "destructive" as const },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isRTL ? "rtl" : "ltr"}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={`/${params.locale}/admin`}>
            <Button variant="outline" size="icon" className="bg-transparent">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
            <p className="text-gray-600">عرض وإدارة جميع الطلبات</p>
          </div>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="البحث عن الطلبات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="bg-transparent">
                تصفية
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>الطلبات ({filteredOrders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>رقم الطلب</TableHead>
                  <TableHead>العميل</TableHead>
                  <TableHead>المجموع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-600">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell> {order.total.toFixed(2)} DT</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      {new Date(order.orderDate).toLocaleDateString("ar-SA")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog
                          open={isViewOpen && selectedOrder?.id === order.id}
                          onOpenChange={setIsViewOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="bg-transparent"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>
                                تفاصيل الطلب #{selectedOrder?.id}
                              </DialogTitle>
                            </DialogHeader>
                            {selectedOrder && (
                              <div className="space-y-6">
                                {/* Customer Info */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      معلومات العميل
                                    </h3>
                                    <p>
                                      <strong>الاسم:</strong>{" "}
                                      {selectedOrder.customerName}
                                    </p>
                                    <p>
                                      <strong>البريد:</strong>{" "}
                                      {selectedOrder.email}
                                    </p>
                                    <p>
                                      <strong>الهاتف:</strong>{" "}
                                      {selectedOrder.phone}
                                    </p>
                                  </div>
                                  <div>
                                    <h3 className="font-semibold mb-2">
                                      عنوان التوصيل
                                    </h3>
                                    <p>{selectedOrder.address}</p>
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div>
                                  <h3 className="font-semibold mb-2">
                                    المنتجات
                                  </h3>
                                  <div className="space-y-2">
                                    {selectedOrder.items.map(
                                      (item: any, index: number) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center p-3 border rounded"
                                        >
                                          <div>
                                            <p className="font-medium">
                                              {item.productName}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              الكمية: {item.quantity}
                                            </p>
                                          </div>
                                          <p className="font-semibold">
                                            {" "}
                                            {(
                                              item.price * item.quantity
                                            ).toFixed(2)}{" "}
                                            DT
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t pt-4">
                                  <div className="flex justify-between text-lg font-bold">
                                    <span>المجموع الكلي:</span>
                                    <span>
                                      {selectedOrder.total.toFixed(2)} DT
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-transparent"
                          onClick={() =>
                            handleStatusUpdate(order.id, "shipped")
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-600 hover:text-red-700 bg-transparent"
                          onClick={() => handleDelete(order.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
