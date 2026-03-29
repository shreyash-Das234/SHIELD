const express = require("express");
const { getTrafficLogs, getBlockedIps } = require("../controllers/traffic.controller");
const authMiddleware = require("../middleware/auth.middleware");
const apiKeyMiddleware = require("../middleware/apiKey.middleware");

const router = express.Router();

router.get("/", authMiddleware, getTrafficLogs);
router.get("/blocked", authMiddleware, getBlockedIps);
router.get("/ingest", apiKeyMiddleware, (req, res) => {
  res.json({ message: "Traffic ingestion accepted.", apiKeyId: req.apiKey.id });
});

module.exports = router;
