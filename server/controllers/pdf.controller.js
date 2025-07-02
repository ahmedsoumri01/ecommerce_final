const PDFDocument = require("pdfkit");
const Order = require("../models/order.model");

exports.generateOrderPDF = async (req, res) => {
  try {
    const { orderRef } = req.params;
    const order = await Order.findOne({ orderRef }).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=order_${orderRef}.pdf`
    );
    doc.pipe(res);

    // Header
    doc.fontSize(20).text("فاتورة الطلب (Order Invoice)", { align: "center" });
    doc.moveDown();
    doc.fontSize(12).text(`Order Ref: ${order.orderRef}`);
    doc.text(`Customer: ${order.customerName}`);
    doc.text(`Email: ${order.email || "-"}`);
    doc.text(`Phone: ${order.phoneNumberOne}`);
    doc.text(`Address: ${order.address}`);
    doc.text(`City: ${order.city}`);
    doc.text(`State: ${order.state}`);
    doc.text(`Status: ${order.status}`);
    doc.text(`Date: ${order.createdAt.toLocaleString()}`);
    doc.moveDown();

    // Table header
    doc.fontSize(14).text("Order Items", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    const tableTop = doc.y;
    const itemX = 50;
    const qtyX = 250;
    const priceX = 320;
    const totalX = 400;
    doc.text("#", itemX, tableTop, { width: 20, align: "left" });
    doc.text("Product", itemX + 20, tableTop, { width: 150, align: "left" });
    doc.text("Qty", qtyX, tableTop, { width: 40, align: "right" });
    doc.text("Price", priceX, tableTop, { width: 60, align: "right" });
    doc.text("Total", totalX, tableTop, { width: 60, align: "right" });
    doc.moveDown(0.5);
    let y = doc.y;
    order.items.forEach((item, idx) => {
      doc.text(idx + 1, itemX, y, { width: 20, align: "left" });
      doc.text(item.product.name, itemX + 20, y, { width: 150, align: "left" });
      doc.text(item.quantity, qtyX, y, { width: 40, align: "right" });
      doc.text(item.price.toFixed(2), priceX, y, { width: 60, align: "right" });
      doc.text((item.price * item.quantity).toFixed(2), totalX, y, { width: 60, align: "right" });
      y += 18;
    });
    doc.moveDown(2);
    // Total
    doc.fontSize(14).text(`Total: ${order.total.toFixed(2)} DT`, { align: "right" });
    doc.moveDown();
    // Footer
    doc.fontSize(10).text("Thank you for your order!", { align: "center" });
    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
