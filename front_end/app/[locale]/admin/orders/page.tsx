"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useOrderStore } from "@/stores/order-store";
import { OrderDetailsModal } from "@/components/modals/order-details-modal";
import { EditOrderModal } from "@/components/modals/edit-order-modal";
import { DeleteOrderDialog } from "@/components/dialogs/delete-order-dialog";
import { ChangeOrderStatusModal } from "@/components/modals/change-order-status-modal";
import { ExportOrdersModal } from "@/components/modals/export-orders-modal";
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  XCircle,
  Plus,
  Loader2,
  Download,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import Link from "next/link";

type SortField = "total" | "items" | "date";
type SortDirection = "asc" | "desc";

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

export default function OrdersManagement({
  params,
}: {
  params: { locale: string };
}) {
  const {
    orders,
    loading,
    searchTerm,
    statusFilter,
    fetchOrders,
    setSearchTerm,
    setStatusFilter,
    filteredOrders,
    getOrderStats,
    cancelOrder,
    confirmOrders,
    confirmingOrders,
  } = useOrderStore();

  // Selection state
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Sorting state
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Modal states
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );

  const stats = getOrderStats();
  const displayedOrders = getSortedOrders();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Reset selection when filters change
  useEffect(() => {
    setSelectedOrders([]);
    setSelectAll(false);
  }, [statusFilter, searchTerm]);

  function getSortedOrders() {
    const filtered = filteredOrders();
    return [...filtered].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "total":
          aValue = a.total;
          bValue = b.total;
          break;
        case "items":
          aValue = a.items.length;
          bValue = b.items.length;
          break;
        case "date":
          aValue = new Date(a.orderDate).getTime();
          bValue = new Date(b.orderDate).getTime();
          break;
        default:
          return 0;
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(displayedOrders.map((order) => order._id));
      setSelectAll(true);
    } else {
      setSelectedOrders([]);
      setSelectAll(false);
    }
  };

  const handleViewDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDetailsModalOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  const handleDeleteOrder = (order: any) => {
    setSelectedOrder(order);
    setDeleteDialogOpen(true);
  };

  const handleChangeStatus = (order: any) => {
    setSelectedOrder(order);
    setStatusModalOpen(true);
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingOrderId(orderId);
    await cancelOrder(orderId);
    setCancellingOrderId(null);
  };

  const handleExportOrders = () => {
    if (selectedOrders.length === 0) {
      alert("Please select orders to export");
      return;
    }
    setExportModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const selectedOrdersData = displayedOrders.filter((order) =>
    selectedOrders.includes(order._id)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-gray-600">Track and manage customer orders</p>
        </div>
        <Link href={`/${params.locale}/admin/orders/create`}>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <p className="text-sm text-gray-600">Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {stats.confirmed}
            </div>
            <p className="text-sm text-gray-600">Confirmed</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {stats.shipped}
            </div>
            <p className="text-sm text-gray-600">Shipped</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {stats.delivered}
            </div>
            <p className="text-sm text-gray-600">Delivered</p>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Orders List</CardTitle>
            {selectedOrders.length > 0 && (
              <Button
                onClick={handleExportOrders}
                className="bg-green-600 hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export Orders ({selectedOrders.length})
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by customer name, email, or order reference..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                All
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                onClick={() => setStatusFilter("pending")}
              >
                Pending
              </Button>
              <Button
                variant={statusFilter === "confirmed" ? "default" : "outline"}
                onClick={() => setStatusFilter("confirmed")}
              >
                Confirmed
              </Button>
              <Button
                variant={statusFilter === "shipped" ? "default" : "outline"}
                onClick={() => setStatusFilter("shipped")}
              >
                Shipped
              </Button>
              <Button
                variant={statusFilter === "delivered" ? "default" : "outline"}
                onClick={() => setStatusFilter("delivered")}
              >
                Delivered
              </Button>
            </div>
          </div>

          {/* Selection Info */}
          {selectedOrders.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                {selectedOrders.length} order(s) selected
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setSelectedOrders([]);
                    setSelectAll(false);
                  }}
                  className="ml-2 text-blue-600 p-0 h-auto"
                >
                  Clear selection
                </Button>
              </p>
            </div>
          )}

          {/* Orders Table */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAll}
                        disabled={displayedOrders.length === 0}
                      />
                    </TableHead>
                    <TableHead>Order Ref</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("items")}
                        className="h-auto p-0 font-semibold"
                      >
                        Items {getSortIcon("items")}
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("total")}
                        className="h-auto p-0 font-semibold"
                      >
                        Total {getSortIcon("total")}
                      </Button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort("date")}
                        className="h-auto p-0 font-semibold"
                      >
                        Date {getSortIcon("date")}
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center py-8 text-gray-500"
                      >
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    displayedOrders.map((order) => (
                      <TableRow key={order._id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedOrders.includes(order._id)}
                            onCheckedChange={(checked) =>
                              handleSelectOrder(order._id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell className="font-mono font-medium">
                          {order.orderRef}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{order.items.length} items</TableCell>
                        <TableCell>{order.total.toFixed(2)} DT</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(order.orderDate)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => handleViewDetails(order._id)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleChangeStatus(order)}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Change Status
                              </DropdownMenuItem>
                              {order.status !== "delivered" &&
                                order.status !== "cancelled" && (
                                  <DropdownMenuItem
                                    onClick={() => handleCancelOrder(order._id)}
                                    disabled={cancellingOrderId === order._id}
                                  >
                                    {cancellingOrderId === order._id ? (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                      <XCircle className="mr-2 h-4 w-4" />
                                    )}
                                    Cancel Order
                                  </DropdownMenuItem>
                                )}
                              <DropdownMenuItem
                                onClick={() => handleDeleteOrder(order)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals and Dialogs */}
      <OrderDetailsModal
        orderId={selectedOrderId}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
      <EditOrderModal
        order={selectedOrder}
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
      />
      <DeleteOrderDialog
        orderId={selectedOrder?._id}
        orderRef={selectedOrder?.orderRef}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
      <ChangeOrderStatusModal
        orderId={selectedOrder?._id}
        currentStatus={selectedOrder?.status}
        open={statusModalOpen}
        onOpenChange={setStatusModalOpen}
      />
      <ExportOrdersModal
        orders={selectedOrdersData}
        open={exportModalOpen}
        onOpenChange={setExportModalOpen}
        onOrdersConfirmed={() => {
          setSelectedOrders([]);
          setSelectAll(false);
        }}
      />
    </div>
  );
}
