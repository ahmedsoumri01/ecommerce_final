// controllers/orders.controller.js
const Order = require("../models/order.model");

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
