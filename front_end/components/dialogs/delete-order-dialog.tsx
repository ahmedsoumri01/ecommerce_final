"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useOrderStore } from "@/stores/order-store";
import { Loader2 } from "lucide-react";

interface DeleteOrderDialogProps {
  orderId: string | null;
  orderRef: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteOrderDialog({
  orderId,
  orderRef,
  open,
  onOpenChange,
}: DeleteOrderDialogProps) {
  const [loading, setLoading] = useState(false);
  const { deleteOrder } = useOrderStore();

  const handleDelete = async () => {
    if (!orderId) return;

    setLoading(true);
    const success = await deleteOrder(orderId);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete order <strong>{orderRef}</strong>?
            This action cannot be undone and will permanently remove the order
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Order
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
