// routes/subscriptionRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  updateSubscriptionStatus,
} = require("../controllers/subscriptionController");

// ✅ User submits a subscription request
router.post("/subscribe", auth, createSubscription);

// ✅ User gets their own subscription history
router.get("/history", auth, getUserSubscriptions);

// ✅ Admin: get all subscriptions
router.get("/all", getAllSubscriptions);

// ✅ Admin: approve or reject
router.put("/update/:id", updateSubscriptionStatus);

module.exports = router;
