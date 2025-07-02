const express = require("express");
const router = express.Router();
const settingsController = require("../controllers/settings.controller.js");

router.post("/backup-database", settingsController.backupDatabase);

module.exports = router;
