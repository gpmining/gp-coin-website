const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Admin Controllers
const { getUsers, updateUserRank, deleteUser } = require("../controllers/adminController");
const { getAllSubscriptions, updateSubscriptionStatus } = require("../controllers/subscriptionController");
const { getAllWithdrawals, updateWithdrawalStatus } = require("../controllers/withdrawalController");

// ✅ User Management
router.get("/users", authMiddleware, getUsers);
router.post("/update-rank", authMiddleware, updateUserRank);
router.delete("/delete-user", authMiddleware, deleteUser);

// ✅ Subscription Requests
router.get("/subscriptions", authMiddleware, getAllSubscriptions); // All subscription requests
router.put("/subscriptions/:id", authMiddleware, updateSubscriptionStatus); // Approve/Reject subscription

// ✅ Withdrawal Requests
router.get("/withdrawals", authMiddleware, getAllWithdrawals);
router.patch("/withdrawals/:id", authMiddleware, updateWithdrawalStatus);

module.exports = router;
