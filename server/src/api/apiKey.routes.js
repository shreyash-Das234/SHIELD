const express = require("express");
const {
  getApiKeys,
  generateApiKey,
  deleteApiKey
} = require("../controllers/apiKey.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getApiKeys);
router.post("/generate", generateApiKey);
router.delete("/:id", deleteApiKey);

module.exports = router;
