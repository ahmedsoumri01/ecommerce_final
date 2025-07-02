"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type Order, useOrderStore } from "@/stores/order-store";
import {
  Loader2,
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Hash,
  Download,
} from "lucide-react";

interface OrderDetailsModalProps {
  orderId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-blue-100 text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800";
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function OrderDetailsModal({
  orderId,
  open,
  onOpenChange,
}: OrderDetailsModalProps) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const { fetchOrderById } = useOrderStore();

  useEffect(() => {
    if (orderId && open) {
      setLoading(true);
      fetchOrderById(orderId).then((orderData) => {
        setOrder(orderData);
        setLoading(false);
      });
    }
  }, [orderId, open, fetchOrderById]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadInvoice = () => {
    if (!order) return;
    window.open(
      process.env.NEXT_PUBLIC_ASSETS_URL + `/api/pdf/order/${order.orderRef}`,
      "_blank"
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : order ? (
          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Hash className="h-4 w-4 text-gray-500" />
                    <span className="font-mono text-lg font-semibold">
                      {order.orderRef}
                    </span>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {order.total.toFixed(2)} DT
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(order.orderDate)}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {order.customerName}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      <span className="font-medium">Email:</span> {order.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      <span className="font-medium">Phone:</span>{" "}
                      {order.phoneNumberOne}
                    </div>
                    {order.phoneNumbertwo && (
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span className="font-medium">Phone 2:</span>{" "}
                        {order.phoneNumbertwo}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Shipping Address
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">Address:</span>{" "}
                      {order.address}
                    </div>
                    <div>
                      <span className="font-medium">City:</span> {order.city}
                    </div>
                    {order.state && (
                      <div>
                        <span className="font-medium">State:</span>{" "}
                        {order.state}
                      </div>
                    )}
                    {order.comment && (
                      <div>
                        <span className="font-medium">Comment:</span>{" "}
                        {order.comment}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div className="space-y-4">
                <h3 className="font-semibold">
                  Order Items ({order.items.length})
                </h3>
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.product.name}</div>
                        <div className="text-sm text-gray-500">
                          Quantity: {item.quantity} × {item.price.toFixed(2)} DT
                        </div>
                      </div>
                      <div className="font-semibold">
                        {(item.quantity * item.price).toFixed(2)} DT
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex justify-end pt-4 border-t">
                  <div className="text-right">
                    <div className="text-lg font-semibold">
                      Total: {order.total.toFixed(2)} DT
                    </div>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <Separator />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Created:</span>{" "}
                  {formatDate(order.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Updated:</span>{" "}
                  {formatDate(order.updatedAt)}
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  onClick={handleDownloadInvoice}
                  disabled={!order}
                >
                  <Download className="h-4 w-4" />
                  Download Invoice (PDF)
                </button>
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-8 text-gray-500">Order not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
