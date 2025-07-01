"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useOrderStore } from "@/stores/order-store";
import { Loader2, RefreshCw } from "lucide-react";

interface ChangeOrderStatusModalProps {
  orderId: string | null;
  currentStatus: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusOptions = [
  { value: "pending", label: "Pending", color: "text-yellow-600" },
  { value: "confirmed", label: "Confirmed", color: "text-blue-600" },
  { value: "shipped", label: "Shipped", color: "text-purple-600" },
  { value: "delivered", label: "Delivered", color: "text-green-600" },
  { value: "cancelled", label: "Cancelled", color: "text-red-600" },
];

export function ChangeOrderStatusModal({
  orderId,
  currentStatus,
  open,
  onOpenChange,
}: ChangeOrderStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const { changeOrderStatus } = useOrderStore();

  const handleSubmit = async () => {
    if (!orderId || selectedStatus === currentStatus) return;

    setLoading(true);
    const success = await changeOrderStatus(orderId, selectedStatus);
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            Change Order Status
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="status">Select New Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <span className={status.color}>{status.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-500">
            Current status:{" "}
            <span className="font-medium capitalize">{currentStatus}</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || selectedStatus === currentStatus}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
