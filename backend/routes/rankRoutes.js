const express = require("express");
const { requestRankUpgrade } = require("../controllers/rankController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/request-upgrade", authMiddleware, requestRankUpgrade);

module.exports = router;

