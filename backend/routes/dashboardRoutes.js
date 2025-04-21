const express = require("express");
const { getDashboardData } = require("../controllers/dashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/data", authMiddleware, async (req, res) => { 
    // Now this route is protected
});
router.get("/", authMiddleware, getDashboardData); // Fetch user dashboard data

module.exports = router;
