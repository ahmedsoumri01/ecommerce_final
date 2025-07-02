const express = require("express");
const router = express.Router();
const pdfController = require("../controllers/pdf.controller.js");

router.get("/order/:orderRef", pdfController.generateOrderPDF);

module.exports = router;
