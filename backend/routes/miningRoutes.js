// routes/miningRoutes.js
const express = require("express");
const router = express.Router();
const {
    startMining,
    getMiningProgress,
    stopMining
} = require("../controllers/miningController");
const authMiddleware = require("../middleware/authMiddleware");

// Start mining session
router.post("/start", authMiddleware, startMining);

// Get current mining progress
router.get("/progress", authMiddleware, getMiningProgress);

// Stop mining session manually
router.post("/stop", authMiddleware, stopMining);

module.exports = router;
