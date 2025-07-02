"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import api from "@/app/api/axios";

export default function TrackOrderPage() {
  const [orderRef, setOrderRef] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setOrder(null);
    try {
      const res = await api.get(`/orders/track/${orderRef}`);
      setOrder(res.data);
    } catch (err: any) {
      toast({ title: "Order not found", description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Track Your Order</h1>
      <form onSubmit={handleTrack} className="flex gap-2 mb-6">
        <Input
          placeholder="Enter your order reference"
          value={orderRef}
          onChange={(e) => setOrderRef(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading || !orderRef}>
          Track
        </Button>
      </form>
      {order && (
        <Card className="p-4">
          <div className="mb-2">
            <b>Order Reference:</b> {order.orderRef}
          </div>
          <div className="mb-2">
            <b>Status:</b> {order.status}
          </div>
          <div className="mb-2">
            <b>Name:</b> {order.customerName}
          </div>
          <div className="mb-2">
            <b>Email:</b> {order.email}
          </div>
          <div className="mb-2">
            <b>Phone:</b> {order.phoneNumberOne}
          </div>
          <div className="mb-2">
            <b>Address:</b> {order.address}, {order.city} {order.state}
          </div>
          <div className="mb-2">
            <b>Total:</b> {order.total} DZD
          </div>
          <div className="mb-2">
            <b>Items:</b>
            <ul className="list-disc ml-6">
              {order.items.map((item: any, idx: number) => (
                <li key={idx}>
                  {item.product?.name} x {item.quantity} ({item.price} DZD)
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2">
            <b>Placed:</b> {new Date(order.createdAt).toLocaleString()}
          </div>
          <div className="mb-2">
            <b>Last Updated:</b> {new Date(order.updatedAt).toLocaleString()}
          </div>
        </Card>
      )}
    </div>
  );
}
