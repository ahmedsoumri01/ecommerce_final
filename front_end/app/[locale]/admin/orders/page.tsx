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
import { useOrderStore } from "@/stores/order-store";
import { OrderDetailsModal } from "@/components/modals/order-details-modal";
import { EditOrderModal } from "@/components/modals/edit-order-modal";
import { DeleteOrderDialog } from "@/components/dialogs/delete-order-dialog";
import { ChangeOrderStatusModal } from "@/components/modals/change-order-status-modal";
import { ExportOrdersModal } from "@/components/modals/export-orders-modal";
import {
  Search,
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
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

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
    cancelMultipleOrders,
    changeStatusMultipleOrders,
    deleteMultipleOrders,
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
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string>("");

  // Search type state
  const [searchType, setSearchType] = useState<string>("all");

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

  // Enhanced search: support search type
  function enhancedFilteredOrders() {
    const term = String(searchTerm).trim().toLowerCase();
    if (!term) return filteredOrders();
    return filteredOrders().filter((order: any) => {
      const phone1 = order.phoneNumberOne
        ? String(order.phoneNumberOne).trim().toLowerCase()
        : "";
      const phone2 = order.phoneNumbertwo
        ? String(order.phoneNumbertwo).trim().toLowerCase()
        : "";
      // For phone search, normalize to digits only
      const digitsTerm = term.replace(/\D/g, "");
      const digitsPhone1 = phone1.replace(/\D/g, "");
      const digitsPhone2 = phone2.replace(/\D/g, "");
      switch (searchType) {
        case "name":
          return order.customerName?.toLowerCase().includes(term);
        case "email":
          return order.email?.toLowerCase().includes(term);
        case "orderRef":
          return order.orderRef?.toLowerCase().includes(term);
        case "phone":
          return (
            digitsPhone1.includes(digitsTerm) ||
            digitsPhone2.includes(digitsTerm)
          );
        case "all":
        default:
          return (
            order.customerName?.toLowerCase().includes(term) ||
            order.email?.toLowerCase().includes(term) ||
            order.orderRef?.toLowerCase().includes(term) ||
            digitsPhone1.includes(digitsTerm) ||
            digitsPhone2.includes(digitsTerm)
          );
      }
    });
  }

  function getSortedOrders() {
    const filtered = enhancedFilteredOrders();
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

  // Multi-select logic: only allow selection when a status filter (not 'all') is active
  const canMultiSelect = statusFilter !== "all";

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (!canMultiSelect) return; // Prevent selection if not allowed
    const order = displayedOrders.find((o) => o._id === orderId);
    if (!order || order.status !== statusFilter) return;
    if (checked) {
      setSelectedOrders((prev) => [...prev, orderId]);
    } else {
      setSelectedOrders((prev) => prev.filter((id) => id !== orderId));
      setSelectAll(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!canMultiSelect) return;
    if (checked) {
      setSelectedOrders(
        displayedOrders
          .filter((order) => order.status === statusFilter)
          .map((order) => order._id)
      );
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

  // Bulk actions
  const handleBulkCancel = async () => {
    setBulkActionLoading(true);
    await cancelMultipleOrders(selectedOrders);
    setBulkActionLoading(false);
    setSelectedOrders([]);
    setSelectAll(false);
  };
  const handleBulkDelete = async () => {
    setBulkActionLoading(true);
    await deleteMultipleOrders(selectedOrders);
    setBulkActionLoading(false);
    setSelectedOrders([]);
    setSelectAll(false);
  };
  const handleBulkStatusChange = async () => {
    if (!bulkStatus) return;
    setBulkActionLoading(true);
    await changeStatusMultipleOrders(selectedOrders, bulkStatus);
    setBulkActionLoading(false);
    setSelectedOrders([]);
    setSelectAll(false);
    setBulkStatus("");
  };
  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Orders Management</h1>
            <p className="text-muted-foreground">
              Track and manage customer orders
            </p>
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
              <p className="text-sm text-muted-foreground">Total Orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {stats.pending}
              </div>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">
                {stats.confirmed}
              </div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {stats.shipped}
              </div>
              <p className="text-sm text-muted-foreground">Shipped</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {stats.delivered}
              </div>
              <p className="text-sm text-muted-foreground">Delivered</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Orders List</CardTitle>
              {selectedOrders.length > 0 && (
                <div className="flex gap-2 items-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={handleExportOrders}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={bulkActionLoading}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Export Orders ({selectedOrders.length})
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Export selected orders</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleBulkCancel}
                        disabled={bulkActionLoading}
                        className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancel selected orders</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={handleBulkDelete}
                        disabled={bulkActionLoading}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete selected orders</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-blue-200 hover:bg-blue-50"
                        disabled={bulkActionLoading || !bulkStatus}
                        onClick={handleBulkStatusChange}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Change Status
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      Change status for selected orders
                    </TooltipContent>
                  </Tooltip>
                  <select
                    title="Bulk Status Change"
                    className="ml-2 border rounded px-2 py-1 text-sm"
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                  >
                    <option value="">Status…</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1 flex gap-2">
                <select
                  className="border rounded px-2 py-1 text-sm h-10 min-w-[120px]"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                  title="Search type"
                >
                  <option value="all">All</option>
                  <option value="name">Name</option>
                  <option value="email">Email</option>
                  <option value="orderRef">Order Ref</option>
                  <option value="phone">Phone Number</option>
                </select>
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={`Search by ${
                      searchType === "all"
                        ? "customer name, email, order reference, or phone number"
                        : searchType
                    }`}
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter !== "all" ? "bg-transparent" : ""}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  onClick={() => setStatusFilter("pending")}
                  className={statusFilter !== "pending" ? "bg-transparent" : ""}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "confirmed" ? "default" : "outline"}
                  onClick={() => setStatusFilter("confirmed")}
                  className={
                    statusFilter !== "confirmed" ? "bg-transparent" : ""
                  }
                >
                  Confirmed
                </Button>
                <Button
                  variant={statusFilter === "shipped" ? "default" : "outline"}
                  onClick={() => setStatusFilter("shipped")}
                  className={statusFilter !== "shipped" ? "bg-transparent" : ""}
                >
                  Shipped
                </Button>
                <Button
                  variant={statusFilter === "delivered" ? "default" : "outline"}
                  onClick={() => setStatusFilter("delivered")}
                  className={
                    statusFilter !== "delivered" ? "bg-transparent" : ""
                  }
                >
                  Delivered
                </Button>
                <Button
                  variant={statusFilter === "cancelled" ? "default" : "outline"}
                  onClick={() => setStatusFilter("cancelled")}
                  className={
                    statusFilter !== "cancelled" ? "bg-transparent" : ""
                  }
                >
                  Cancelled
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
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectAll}
                          onCheckedChange={handleSelectAll}
                          disabled={
                            displayedOrders.length === 0 || !canMultiSelect
                          }
                        />
                      </TableHead>
                      <TableHead>Order Ref</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSort("items")}
                              className="h-auto p-0 font-semibold"
                            >
                              Items {getSortIcon("items")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Sort by items count</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSort("total")}
                              className="h-auto p-0 font-semibold"
                            >
                              Total {getSortIcon("total")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Sort by total</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSort("date")}
                              className="h-auto p-0 font-semibold"
                            >
                              Date {getSortIcon("date")}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Sort by date</TooltipContent>
                        </Tooltip>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayedOrders.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-muted-foreground"
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
                              disabled={
                                order.status !== statusFilter || !canMultiSelect
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
                              <div className="text-sm text-muted-foreground">
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
                            <div className="flex gap-1 justify-end">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDetails(order._id)}
                                    className="bg-transparent"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View details</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditOrder(order)}
                                    className="bg-transparent"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit order</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleChangeStatus(order)}
                                    className="bg-transparent"
                                  >
                                    <RefreshCw className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Change status</TooltipContent>
                              </Tooltip>
                              {order.status !== "delivered" &&
                                order.status !== "cancelled" && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleCancelOrder(order._id)
                                        }
                                        disabled={
                                          cancellingOrderId === order._id
                                        }
                                        className="bg-transparent text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                      >
                                        {cancellingOrderId === order._id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                          <XCircle className="h-4 w-4" />
                                        )}
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      Cancel order
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteOrder(order)}
                                    className="bg-transparent text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete order</TooltipContent>
                              </Tooltip>
                            </div>
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

        {/* Modals and Dialogs - Rendered outside of table to prevent conflicts */}
        {detailsModalOpen && (
          <OrderDetailsModal
            orderId={selectedOrderId}
            open={detailsModalOpen}
            onOpenChange={setDetailsModalOpen}
          />
        )}

        {editModalOpen && selectedOrder && (
          <EditOrderModal
            order={selectedOrder}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
          />
        )}

        {deleteDialogOpen && selectedOrder && (
          <DeleteOrderDialog
            orderId={selectedOrder._id}
            orderRef={selectedOrder.orderRef}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
          />
        )}

        {statusModalOpen && selectedOrder && (
          <ChangeOrderStatusModal
            orderId={selectedOrder._id}
            currentStatus={selectedOrder.status}
            open={statusModalOpen}
            onOpenChange={setStatusModalOpen}
          />
        )}

        {exportModalOpen && (
          <ExportOrdersModal
            orders={selectedOrdersData}
            open={exportModalOpen}
            onOpenChange={setExportModalOpen}
            onOrdersConfirmed={() => {
              setSelectedOrders([]);
              setSelectAll(false);
            }}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
