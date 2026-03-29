const express = require("express");
const { getDashboard } = require("../controllers/dashboard.controller");
const { getMitigationOverview } = require("../controllers/mitigation.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getDashboard);
router.get("/mitigation", getMitigationOverview);

module.exports = router;
