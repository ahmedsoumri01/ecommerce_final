// controllers/orders.controller.js
const Order = require("../models/order.model");
const mongoose = require("mongoose");

const rateLimitMap = new Map(); // { ip: { count, firstRequest, blockedUntil } }

const ORDER_LIMIT = 10; // max orders per minute
const BLOCK_DURATION = 24 * 60 * 60 * 1000; // 24 hours in ms

// Helper to get unique key for rate limit (user id if logged in, else IP)
function getRateLimitKey(req) {
  if (req.user && req.user._id && req.user.role !== "admin") {
    return `user:${req.user._id}`;
  }
  // fallback to IP for unauthenticated or non-admin
  return `ip:${req.headers["x-forwarded-for"] || req.connection.remoteAddress}`;
}

// Admin-only: unblock a user or IP
exports.unblockOrderRateLimit = (req, res) => {
  const { key } = req.body;
  if (!key) return res.status(400).json({ message: "Key required" });
  if (rateLimitMap.has(key)) {
    rateLimitMap.delete(key);
    return res.json({ message: `Unblocked ${key}` });
  }
  res.status(404).json({ message: "Key not found" });
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate(
      "items.product",
      "name price"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get order by reference
exports.getOrderByReference = async (req, res) => {
  const { orderRef } = req.params;

  try {
    const order = await Order.findOne({ orderRef }).populate(
      "items.product",
      "name price"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order by reference:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new order
exports.createOrder = async (req, res) => {
  // Rate limit only for non-admins
  if (!req.user || req.user.role !== "admin") {
    const key = getRateLimitKey(req);
    const now = Date.now();
    let entry = rateLimitMap.get(key) || {
      count: 0,
      firstRequest: now,
      blockedUntil: 0,
    };
    if (entry.blockedUntil > now) {
      return res.status(429).json({
        message:
          "You are blocked for 24h due to too many orders. Try again later.",
        blocked: true,
      });
    }
    if (now - entry.firstRequest > 60 * 1000) {
      entry = { count: 0, firstRequest: now, blockedUntil: 0 };
    }
    entry.count++;
    if (entry.count > ORDER_LIMIT) {
      entry.blockedUntil = now + BLOCK_DURATION;
      rateLimitMap.set(key, entry);
      return res.status(429).json({
        message:
          "You are blocked for 24h due to too many orders. Try again later.",
        blocked: true,
      });
    }
    rateLimitMap.set(key, entry);
  }
  const {
    customerName,
    email,
    phoneNumberOne,
    phoneNumbertwo,
    address,
    city,
    state,
    comment,
    orderRef,
    total,
    status,
    items,
  } = req.body;

  try {
    const newOrder = new Order({
      customerName,
      email,
      phoneNumberOne,
      phoneNumbertwo,
      address,
      city,
      state,
      comment,
      orderRef,
      total,
      status: status || "pending",
      items,
      deliveryFee:
        req.body.deliveryFee !== undefined ? Number(req.body.deliveryFee) : 0,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
// Confirm multiple orders
exports.confirmOrders = async (req, res) => {
  const { orderIds } = req.body;

  console.log({ orderIds, body: req.body });

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({ message: "No valid order IDs provided" });
  }

  // Validate all IDs before converting
  const invalidIds = orderIds.filter(
    (id) => !id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)
  );
  if (invalidIds.length > 0) {
    return res.status(400).json({
      message: `Invalid order ID(s): ${invalidIds.join(", ")}`,
      invalidIds,
    });
  }

  try {
    // Convert string IDs to ObjectId
    const objectIds = orderIds.map((id) => new mongoose.Types.ObjectId(id));

    const result = await Order.updateMany(
      {
        _id: { $in: objectIds },
        status: { $ne: "delivered" },
      },
      {
        $set: { status: "confirmed" },
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message:
          "No orders were updated. They may already be delivered or invalid.",
      });
    }

    res.json({
      message: `${result.modifiedCount} order(s) confirmed successfully`,
      updatedOrderCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error confirming orders:", error.message);
    res.status(500).json({
      message: "Failed to confirm orders.",
      error: error.message,
    });
  }
};
// Update an existing order
exports.updateOrder = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Change order status
exports.changeOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error changing order status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel an order
exports.cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "delivered") {
      return res.status(400).json({ message: "Cannot cancel delivered order" });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error) {
    console.error("Error cancelling order:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel multiple orders
exports.cancelMultipleOrders = async (req, res) => {
  const { orderIds } = req.body;
  console.log({ orderIds, body: req.body });
  // Use the same validation as confirmOrders
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({ message: "No valid order IDs provided" });
  }
  // Validate all IDs before converting
  const invalidIds = orderIds.filter(
    (id) => !id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)
  );
  if (invalidIds.length > 0) {
    return res.status(400).json({
      message: `Invalid order ID(s): ${invalidIds.join(", ")}`,
      invalidIds,
    });
  }
  try {
    // Convert string IDs to ObjectId
    const objectIds = orderIds.map((id) => new mongoose.Types.ObjectId(id));
    const result = await Order.updateMany(
      {
        _id: { $in: objectIds },
        status: { $nin: ["delivered", "cancelled"] },
      },
      { $set: { status: "cancelled" } }
    );
    res.json({
      message: `${result.modifiedCount} order(s) cancelled successfully`,
      updatedOrderCount: result.modifiedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to cancel orders.", error: error.message });
  }
};

// Change status for multiple orders
exports.changeStatusMultipleOrders = async (req, res) => {
  const { orderIds, status } = req.body;

  // Use the same validation as confirmOrders
  if (!Array.isArray(orderIds) || orderIds.length === 0 || !status) {
    return res
      .status(400)
      .json({ message: "Order IDs and status are required" });
  }
  // Validate all IDs before converting
  const invalidIds = orderIds.filter(
    (id) => !id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)
  );
  if (invalidIds.length > 0) {
    return res.status(400).json({
      message: `Invalid order ID(s): ${invalidIds.join(", ")}`,
      invalidIds,
    });
  }
  try {
    // Convert string IDs to ObjectId
    const objectIds = orderIds.map((id) => new mongoose.Types.ObjectId(id));
    const result = await Order.updateMany(
      { _id: { $in: objectIds } },
      { $set: { status } }
    );
    res.json({
      message: `${result.modifiedCount} order(s) updated to status '${status}'`,
      updatedOrderCount: result.modifiedCount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update order statuses.",
      error: error.message,
    });
  }
};

// Delete multiple orders
exports.deleteMultipleOrders = async (req, res) => {
  const { orderIds } = req.body;

  // Use the same validation as confirmOrders
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return res.status(400).json({ message: "No valid order IDs provided" });
  }
  // Validate all IDs before converting
  const invalidIds = orderIds.filter(
    (id) => !id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)
  );
  if (invalidIds.length > 0) {
    return res.status(400).json({
      message: `Invalid order ID(s): ${invalidIds.join(", ")}`,
      invalidIds,
    });
  }
  try {
    // Convert string IDs to ObjectId
    const objectIds = orderIds.map((id) => new mongoose.Types.ObjectId(id));
    const result = await Order.deleteMany({ _id: { $in: objectIds } });
    res.json({
      message: `${result.deletedCount} order(s) deleted successfully`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete orders.", error: error.message });
  }
};

// Admin: Clear all rate limits (unblock all users)
exports.clearOrderBlocks = (req, res) => {
  rateLimitMap.clear();
  res.json({ message: "All order blocks have been cleared." });
};
