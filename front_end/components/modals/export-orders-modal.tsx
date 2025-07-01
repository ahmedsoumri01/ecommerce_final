"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Download, FileText, Loader2, CheckCircle } from "lucide-react";
import { useOrderStore, type Order } from "@/stores/order-store";
import { toast } from "sonner";

interface ExportOrdersModalProps {
  orders: Order[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOrdersConfirmed: () => void;
}

export function ExportOrdersModal({
  orders,
  open,
  onOpenChange,
  onOrdersConfirmed,
}: ExportOrdersModalProps) {
  const { confirmOrders, confirmingOrders } = useOrderStore();
  const [exportingFirst, setExportingFirst] = useState(false);
  const [exportingFakroun, setExportingFakroun] = useState(false);
  const [showConfirmButton, setShowConfirmButton] = useState(false);

  const generateFirstDeliveryCSV = () => {
    const headers =
      "destinataire_nom;adresse;ville;gouvernerat;telephone;telephone2;nombre_de_colis;prix;designation;commentaire";

    const rows = orders.map((order) => {
      const itemsDescription = order.items
        .map((item) => `${item.product.name} (x${item.quantity})`)
        .join(", ");

      return [
        order.customerName,
        order.address,
        order.city,
        order.state || "",
        order.phoneNumberOne,
        order.phoneNumbertwo || "",
        order.items.length.toString(),
        order.total.toString(),
        itemsDescription,
        order.comment || "",
      ].join(";");
    });

    return [headers, ...rows].join("\n");
  };

  const generateFakrounDeliveryCSV = () => {
    const headers =
      "ReceiverName,ReceiverMail,ReceiverNumber,receiver_number_2,ReceiverAddress,ReceiverCity,ReceiverState,Comment,Content,Price,Weight,Size,Paid";

    const rows = orders.map((order) => {
      const itemsDescription = order.items
        .map((item) => `${item.product.name} (x${item.quantity})`)
        .join(", ");

      // Calculate total weight (assuming 0.5kg per item as default)
      const totalWeight = order.items.reduce(
        (sum, item) => sum + item.quantity * 0.5,
        0
      );

      // Calculate package size (Small/Medium/Large based on items count)
      const packageSize =
        order.items.length <= 2
          ? "Small"
          : order.items.length <= 5
          ? "Medium"
          : "Large";

      return [
        `"${order.customerName}"`,
        `"${order.email}"`,
        `"${order.phoneNumberOne}"`,
        `"${order.phoneNumbertwo || ""}"`,
        `"${order.address}"`,
        `"${order.city}"`,
        `"${order.state || ""}"`,
        `"${order.comment || ""}"`,
        `"${itemsDescription}"`,
        `"${order.total}"`,
        `"${totalWeight}"`,
        `"${packageSize}"`,
        `"No"`, // Paid status - assuming cash on delivery
      ].join(",");
    });

    return [headers, ...rows].join("\n");
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFirstDeliveryExport = async () => {
    setExportingFirst(true);
    try {
      const csvContent = generateFirstDeliveryCSV();
      const filename = `first_delivery_orders_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      downloadCSV(csvContent, filename);
      toast.success("First Delivery CSV exported successfully!");
      setShowConfirmButton(true);
    } catch (error) {
      toast.error("Failed to export First Delivery CSV");
    } finally {
      setExportingFirst(false);
    }
  };

  const handleFakrounDeliveryExport = async () => {
    setExportingFakroun(true);
    try {
      const csvContent = generateFakrounDeliveryCSV();
      const filename = `fakroun_delivery_orders_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      downloadCSV(csvContent, filename);
      toast.success("Fakroun Delivery CSV exported successfully!");
      setShowConfirmButton(true);
    } catch (error) {
      toast.error("Failed to export Fakroun Delivery CSV");
    } finally {
      setExportingFakroun(false);
    }
  };

  const handleConfirmOrders = async () => {
    const orderIds = orders.map((order) => order._id);
    const success = await confirmOrders(orderIds);

    if (success) {
      onOrdersConfirmed();
      onOpenChange(false);
      setShowConfirmButton(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setShowConfirmButton(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Orders to Delivery Services
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Orders Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">
              Selected Orders ({orders.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="flex justify-between items-center text-sm bg-white border-2 rounded-sm px-2 py-1 border-green-300"
                >
                  <span className="font-mono">{order.orderRef}</span>
                  <div className="flex items-center gap-2">
                    <span>{order.customerName}</span>
                    <Badge variant="outline" className="bg-black text-white">
                      {order.total.toFixed(2)} DT
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="font-semibold">Choose Delivery Service:</h3>

            {/* First Delivery Export */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">First Delivery</span>
                </div>
                <Button
                  onClick={handleFirstDeliveryExport}
                  disabled={exportingFirst}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {exportingFirst ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export to First Delivery
                    </>
                  )}
                </Button>
              </div>
              {/*     <div className="text-sm text-gray-600 space-y-2">
                <p>Export format:</p>
                <div className="grid grid-cols-4 gap-x-4 gap-y-1 text-xs bg-gray-50 p-2 rounded-md border border-gray-200">
                  <span>destinataire_nom</span>
                  <span>adresse</span>
                  <span>ville</span>
                  <span>gouvernerat</span>
                  <span>telephone</span>
                  <span>telephone2</span>
                  <span>nombre_de_colis</span>
                  <span></span>  
                  <span>prix</span>
                  <span>designation</span>
                  <span>commentaire</span>
                  <span></span>
                </div>
              </div> */}
            </div>

            {/* Fakroun Delivery Export */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Fakroun Delivery</span>
                </div>
                <Button
                  onClick={handleFakrounDeliveryExport}
                  disabled={exportingFakroun}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {exportingFakroun ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export to Fakroun Delivery
                    </>
                  )}
                </Button>
              </div>
              {/*  <p className="text-sm text-gray-600">
                Export format:
                 ReceiverName,ReceiverMail,ReceiverNumber,receiver_number_2,ReceiverAddress,ReceiverCity,ReceiverState,Comment,Content,Price,Weight,Size,Paid
                {" "}
              </p> */}
            </div>
          </div>

          {/* Confirm Orders Section */}
          {showConfirmButton && (
            <>
              <Separator />
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-green-800">
                      Ready to Confirm Orders
                    </h4>
                    <p className="text-sm text-green-600">
                      CSV exported successfully. Click to confirm all selected
                      orders.
                    </p>
                  </div>
                  <Button
                    onClick={handleConfirmOrders}
                    disabled={confirmingOrders}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {confirmingOrders ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Confirm All Orders
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
